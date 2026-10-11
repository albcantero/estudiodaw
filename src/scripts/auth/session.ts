/**
 * @file Sesión del login: pedir el código, verificarlo, leer y guardar el nombre, cerrar sesión y
 * avisar de cada cambio.
 *
 * Cada cambio de sesión (entrar, salir, sesión caducada) se anuncia con el evento SESSION_EVENT
 * en document; la barra (account.ts) lo escucha. Las funciones de pedir y verificar devuelven
 * el mensaje de error para el alumno, o null si ha ido bien.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { type AvatarChoice, avatarColorOf, isAvatarIcon } from '../../data/avatar';
import { STORAGE_KEYS } from '../../data/storage';
import { readPreference, removePreference, writePreference } from '../preferences';
import { getClient } from './client';
import { AUTH_MESSAGES, authMessage } from './errors';

/**
 * Login de mentira en desarrollo: no llama a Supabase ni envía correos (cada envío gasta cupo de
 * Resend). Vale el código MOCK_CODE; cualquier otro da el error de código. Algunos usuarios dan
 * a propósito los demás errores, para maquetarlos (MOCK_ERRORS). Para probar el de verdad en
 * local: PUBLIC_AUTH_MODE=real en .env.
 */
const MOCK = import.meta.env.DEV && import.meta.env.PUBLIC_AUTH_MODE !== 'real';

/** ¿Es el login de mentira? Con él, el login sale aunque no haya proyecto de Supabase (.env) */
export const isMockAuth = MOCK;

/** Código que vale en el login de mentira */
export const MOCK_CODE = '123456';

/** Usuarios que, en el login de mentira, dan un error al pedir el código */
const MOCK_ERRORS: Record<string, string> = {
  fuera: AUTH_MESSAGES.domain,
  limite: AUTH_MESSAGES.rateLimit,
  red: AUTH_MESSAGES.network,
};

/**
 * Espera de mentira, como la de la red
 *
 * @returns Una promesa que se cumple al cabo de 600 ms.
 */
const mockDelay = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 600);
  });

/** Evento de cambio de sesión: detail.email es el correo, o null sin sesión */
export const SESSION_EVENT = 'estudiodaw:session';

/** Datos del evento de sesión */
export interface SessionDetail {
  email: string | null;
}

/**
 * Correo de la sesión guardada, sin cargar Supabase (para pintar la barra al instante). Puede
 * ser una sesión caducada: watchSession lo confirma después.
 *
 * @returns El correo, o null si no hay sesión guardada o no se puede leer.
 */
export function storedEmail(): string | null {
  const raw = readPreference(STORAGE_KEYS.auth);
  if (!raw) return null;
  try {
    const email: unknown = JSON.parse(raw)?.user?.email;
    return typeof email === 'string' ? email : null;
  } catch {
    return null;
  }
}

/**
 * Metadatos del usuario de la sesión guardada (nombre y avatar), sin cargar Supabase, para pintar
 * la barra al instante. Supabase guarda la sesión entera, con su usuario; el login de mentira, lo
 * mismo que guarda saveMetadata.
 *
 * @returns Los metadatos, o un objeto vacío si no hay sesión o no se puede leer.
 */
function storedMetadata(): Record<string, unknown> {
  const raw = readPreference(STORAGE_KEYS.auth);
  if (!raw) return {};
  try {
    const metadata: unknown = JSON.parse(raw)?.user?.user_metadata;
    return metadata && typeof metadata === 'object' ? (metadata as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Nombre de la sesión guardada (metadatos del usuario: display_name).
 *
 * @returns El nombre, o null si la cuenta no tiene.
 */
export function storedName(): string | null {
  const name = storedMetadata().display_name;
  return typeof name === 'string' && name !== '' ? name : null;
}

/**
 * Avatar de la sesión guardada (metadatos del usuario: avatar_icon y avatar_color). Lo que no
 * sea un icono o un color del selector cuenta como no elegido.
 *
 * @returns El icono y el color elegidos.
 */
export function storedAvatar(): AvatarChoice {
  const { avatar_icon: icon, avatar_color: color } = storedMetadata();
  return {
    icon: isAvatarIcon(icon) ? icon : null,
    color: typeof color === 'string' && avatarColorOf(color) ? color : null,
  };
}

/**
 * Anuncia un cambio de sesión.
 *
 * @param email Correo de la sesión, o null sin sesión.
 */
const announce = (email: string | null): void => {
  document.dispatchEvent(new CustomEvent<SessionDetail>(SESSION_EVENT, { detail: { email } }));
};

let watching = false;

/** Empieza a escuchar los cambios de sesión de Supabase (una sola vez). */
export function watchSession(): void {
  if (watching || MOCK) return;
  watching = true;
  getClient()
    .then((supabase) => {
      supabase.auth.onAuthStateChange((_event, session) => announce(session?.user.email ?? null));
    })
    .catch(() => {
      watching = false;
    });
}

/**
 * Pide un código para un correo (crea la cuenta si no existe; el hook rechaza otros dominios).
 *
 * @param email Correo completo.
 * @returns El mensaje de error, o null si se ha enviado.
 */
export async function requestCode(email: string): Promise<string | null> {
  if (MOCK) {
    await mockDelay();
    return MOCK_ERRORS[email.split('@')[0]] ?? null;
  }
  try {
    const supabase = await getClient();
    watchSession();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return error ? authMessage(error, 'request') : null;
  } catch {
    return AUTH_MESSAGES.network;
  }
}

/**
 * Verifica el código; si vale, la sesión queda iniciada (y se anuncia).
 *
 * @param email Correo al que se envió.
 * @param code Código de 6 cifras.
 * @returns El mensaje de error, o null si ha entrado.
 */
export async function verifyCode(email: string, code: string): Promise<string | null> {
  if (MOCK) {
    await mockDelay();
    if (code !== MOCK_CODE) return AUTH_MESSAGES.code;
    writePreference(STORAGE_KEYS.auth, JSON.stringify({ user: { email } }));
    announce(email);
    return null;
  }
  try {
    const supabase = await getClient();
    watchSession();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    return error ? authMessage(error, 'verify') : null;
  } catch {
    return AUTH_MESSAGES.network;
  }
}

/**
 * Nombre guardado en la cuenta (metadatos del usuario en Supabase: display_name, la columna
 * "Display name" del panel). En el login de mentira, en la sesión guardada.
 *
 * @returns El nombre, o null si no tiene o no se puede leer.
 */
export async function currentName(): Promise<string | null> {
  if (MOCK) return storedName();
  try {
    const supabase = await getClient();
    const { data } = await supabase.auth.getSession();
    const name: unknown = data.session?.user.user_metadata?.display_name;
    return typeof name === 'string' && name !== '' ? name : null;
  } catch {
    return null;
  }
}

/**
 * Guarda datos en los metadatos de la cuenta (en Supabase; RLS no entra: es la propia cuenta) y
 * lo anuncia como un cambio de sesión, para que la barra lo pinte. Se mezclan con los que ya hay:
 * guardar el nombre no borra el avatar, ni al revés.
 *
 * @param data Datos que se guardan.
 * @returns El mensaje de error, o null si se ha guardado.
 */
async function saveMetadata(data: Record<string, string>): Promise<string | null> {
  if (MOCK) {
    await mockDelay();
    try {
      const session = JSON.parse(readPreference(STORAGE_KEYS.auth) ?? '{}');
      session.user = {
        ...session.user,
        user_metadata: { ...session.user?.user_metadata, ...data },
      };
      writePreference(STORAGE_KEYS.auth, JSON.stringify(session));
      announce(session.user.email ?? null);
      return null;
    } catch {
      return AUTH_MESSAGES.network;
    }
  }
  try {
    const supabase = await getClient();
    const { data: result, error } = await supabase.auth.updateUser({ data });
    if (error) return AUTH_MESSAGES.network;
    announce(result.user?.email ?? null);
    return null;
  } catch {
    return AUTH_MESSAGES.network;
  }
}

/**
 * Guarda el nombre en la cuenta.
 *
 * @param name Nombre ya normalizado.
 * @returns El mensaje de error, o null si se ha guardado.
 */
export const saveName = (name: string): Promise<string | null> =>
  saveMetadata({ display_name: name });

/**
 * Guarda en la cuenta el icono o el color del avatar (lo que se pase; lo otro se queda).
 *
 * @param choice Icono, color o los dos, por su id.
 * @returns El mensaje de error, o null si se ha guardado.
 */
export const saveAvatar = (choice: { icon?: string; color?: string }): Promise<string | null> =>
  saveMetadata({
    ...(choice.icon ? { avatar_icon: choice.icon } : {}),
    ...(choice.color ? { avatar_color: choice.color } : {}),
  });

/**
 * Cierra la sesión de este navegador (scope local: las de otros dispositivos siguen). Supabase
 * la borra aunque no haya conexión; si ni siquiera se puede cargar, se borra a mano.
 */
export async function signOut(): Promise<void> {
  if (MOCK) {
    removePreference(STORAGE_KEYS.auth);
    announce(null);
    return;
  }
  try {
    const supabase = await getClient();
    watchSession();
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    removePreference(STORAGE_KEYS.auth);
    announce(null);
  }
}
