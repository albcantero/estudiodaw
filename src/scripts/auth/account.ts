/**
 * @file Pinta la cuenta de la barra superior (layout/AccountButton) según la sesión.
 *
 * En la barra va el nombre de la cuenta (o, si aún no tiene, el usuario del correo); en el menú,
 * el nombre y debajo el correo.
 *
 * Al cargar, la sesión guardada se lee sin Supabase (storedEmail) y se pinta al instante; si la
 * hay, se carga Supabase para confirmarla (watchSession): si ha caducado, llega un cambio de
 * sesión y la barra vuelve a "Iniciar sesión" sin recargar. La barra se pinta de nuevo en cada
 * página (no persiste): se repinta tras el cambio de página, antes de que se vea.
 *
 * La matrícula solo vale con la sesión iniciada: cada cambio de sesión la vuelve a aplicar. Si
 * la sesión cambia en otra pestaña, esta se entera por el evento storage.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { STORAGE_KEYS } from '../../data/storage';
import { applyEnrollment } from '../enrollment';
import { isAuthConfigured } from './client';
import {
  isMockAuth,
  SESSION_EVENT,
  type SessionDetail,
  signOut,
  storedEmail,
  storedName,
  watchSession,
} from './session';
import { usernameOf } from './user';

let email: string | null = storedEmail();

/**
 * ¿Sale el login? Con proyecto de Supabase o, en desarrollo, con el de mentira: así funciona al
 * clonar el repo sin .env
 */
const authAvailable = isAuthConfigured || isMockAuth;

/** Pinta todas las cuentas de la página con la sesión actual. */
function paint(): void {
  document.querySelectorAll<HTMLElement>('[data-account]').forEach((account) => {
    if (!authAvailable) {
      account.setAttribute('data-state', 'off');
      return;
    }
    account.setAttribute('data-state', email ? 'signed-in' : 'signed-out');
    // Sin nombre guardado todavía, el usuario del correo
    const name = email ? (storedName() ?? usernameOf(email)) : '';
    account
      .querySelectorAll('[data-account-username], [data-account-name]')
      .forEach((element) => element.replaceChildren(name));
    const label = account.querySelector('[data-account-email]');
    if (label) label.textContent = email ?? '';
  });
}

/**
 * Cambia la sesión que se ve: la barra y, si cambia de cuenta, la matrícula. Con la misma cuenta
 * también se repinta: puede haber cambiado su nombre.
 *
 * @param next Correo de la sesión, o null sin sesión.
 */
function setEmail(next: string | null): void {
  const changed = next !== email;
  email = next;
  paint();
  if (changed) applyEnrollment();
}

/**
 * Lleva el foco al control de la cuenta que se ve (el usuario o "Iniciar sesión"): al entrar o
 * salir, el que lo tenía desaparece y el foco se perdería.
 */
export function focusAccount(): void {
  const selector = email ? '[data-dropdown-trigger]' : '.account-sign-in';
  document.querySelector<HTMLElement>(`[data-account] ${selector}`)?.focus();
}

document.addEventListener(SESSION_EVENT, (event) => {
  setEmail((event as CustomEvent<SessionDetail>).detail.email);
});

// Sesión iniciada o cerrada en otra pestaña
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEYS.auth || event.key === null) setEmail(storedEmail());
});

// Cualquier opción del menú lo cierra ("Mi matrícula" la abre scripts/enrollment.ts)
document.addEventListener('click', async (event) => {
  const option = (event.target as HTMLElement).closest('[data-account] [popover] button');
  if (!option) return;
  option.closest<HTMLElement>('[popover]')?.hidePopover();
  if (!option.matches('[data-auth-sign-out]')) return;
  await signOut();
  focusAccount();
});

// Barra nueva: antes de pintarse (after-swap) y en la primera carga (page-load)
document.addEventListener('astro:after-swap', paint);
document.addEventListener('astro:page-load', paint);

paint();
if (isAuthConfigured && email) watchSession();
