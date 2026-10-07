/**
 * @file Mensajes del login: traduce los errores de Supabase Auth a frases para el alumno. Función
 * pura (se prueba con node --test).
 *
 * Supabase devuelve el mismo error (otp_expired) para un código mal escrito y para uno caducado:
 * no se pueden distinguir, así que van en un solo mensaje.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Lo que se mira de un error de Supabase (AuthError y sus subclases) */
export interface AuthErrorLike {
  name?: string;
  code?: string;
  status?: number;
}

/** Paso del login en el que falla: pedir el código o verificarlo */
export type AuthStep = 'request' | 'verify';

/** Mensajes, bajo el campo del paso en que falla */
export const AUTH_MESSAGES = {
  empty: '¡Todavía no has escrito nada!',
  invalidUser: 'Introduce un usuario de correo válido.',
  incompleteCode: 'Escribe las 6 cifras del código',
  emptyName: 'Escribe cómo quieres que te llamemos.',
  domain: 'Solo se puede entrar con un correo de educa.jcyl.es',
  code: 'El código no es correcto o ha caducado. Revísalo o pide otro.',
  rateLimit: 'Has pedido demasiados códigos. Espera un poco.',
  network: 'No se ha podido conectar. Inténtalo de nuevo.',
} as const;

/** Códigos de Supabase de demasiadas peticiones */
const RATE_LIMIT_CODES = new Set(['over_email_send_rate_limit', 'over_request_rate_limit']);

/**
 * Mensaje de un error de Supabase.
 *
 * @param error Error devuelto por supabase.auth.
 * @param step Paso en que ha fallado.
 * @returns El mensaje para el alumno.
 */
export function authMessage(error: AuthErrorLike, step: AuthStep): string {
  if (error.code === 'otp_expired') return AUTH_MESSAGES.code;
  if ((error.code && RATE_LIMIT_CODES.has(error.code)) || error.status === 429) {
    return AUTH_MESSAGES.rateLimit;
  }
  // El hook responde 403 al pedir el código; al verificar, un 403 es un código que no vale
  if (error.status === 403) return step === 'request' ? AUTH_MESSAGES.domain : AUTH_MESSAGES.code;
  return AUTH_MESSAGES.network;
}
