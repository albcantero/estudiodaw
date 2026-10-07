/**
 * @file Usuario y código del login: funciones puras, sin DOM ni Supabase (se prueban con node
 * --test).
 *
 * En el formulario solo se escribe el usuario (lo de antes de la @); el dominio lo pone la web.
 * Que el correo sea del centro lo garantiza el hook de Supabase, no esto: aquí solo se ayuda a
 * escribirlo bien.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Dominio de los correos que pueden entrar: el del alumnado de Castilla y León */
export const SCHOOL_DOMAIN = 'educa.jcyl.es';

/** Cifras del código que llega por correo */
export const CODE_LENGTH = 6;

/** Caracteres que admite el usuario */
const USER_PATTERN = /^[a-z0-9._-]+$/;

/**
 * Usuario tal como se envía: sin espacios, en minúsculas y, si pegan el correo entero, solo lo
 * de antes de la @.
 *
 * @param raw Lo escrito en el campo.
 * @returns El usuario normalizado.
 */
export const normalizeUser = (raw: string): string => raw.split('@')[0].trim().toLowerCase();

/**
 * ¿Es un usuario que se puede enviar?
 *
 * @param user Usuario ya normalizado.
 * @returns Si solo lleva letras, cifras, puntos, guiones y guiones bajos.
 */
export const isValidUser = (user: string): boolean => USER_PATTERN.test(user);

/**
 * Correo completo del centro.
 *
 * @param user Usuario ya normalizado.
 * @returns El correo completo.
 */
export const toSchoolEmail = (user: string): string => `${user}@${SCHOOL_DOMAIN}`;

/**
 * Código tal como se verifica: solo cifras (pegado con espacios o guiones) y como mucho 6.
 *
 * @param raw Lo escrito en el campo.
 * @returns El código normalizado.
 */
export const normalizeCode = (raw: string): string => raw.replace(/\D/g, '').slice(0, CODE_LENGTH);

/**
 * Nombre de usuario que se ve en la barra con la sesión iniciada: lo de antes de la @.
 *
 * @param email Correo de la cuenta.
 * @returns El usuario.
 */
export const usernameOf = (email: string): string => email.split('@')[0];

/** Largo máximo del nombre */
export const NAME_MAX_LENGTH = 50;

/**
 * Nombre que se propone al pedirlo, sacado del correo: la primera parte del usuario (hasta el
 * primer punto, guion o guion bajo), sin cifras y con mayúscula. "ejemplo.correo" → "Ejemplo".
 *
 * @param email Correo de la cuenta.
 * @returns El nombre, o vacío si no queda nada que lo parezca.
 */
export const nameFromEmail = (email: string): string => {
  const first = usernameOf(email).split(/[._-]/)[0].replace(/\d/g, '');
  return first ? first[0].toUpperCase() + first.slice(1) : '';
};

/**
 * Nombre tal como se guarda: sin espacios en los bordes, los de dentro de uno en uno y como mucho
 * NAME_MAX_LENGTH caracteres.
 *
 * @param raw Lo escrito en el campo.
 * @returns El nombre normalizado.
 */
export const normalizeName = (raw: string): string =>
  raw.trim().replace(/\s+/g, ' ').slice(0, NAME_MAX_LENGTH);
