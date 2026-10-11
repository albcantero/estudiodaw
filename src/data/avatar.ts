/**
 * @file Avatares de la cuenta: los iconos y los colores de fondo que se pueden elegir. Se guardan
 * en la cuenta (metadatos del usuario en Supabase: avatar_icon y avatar_color) por su id. Sin
 * elegir nada, el avatar es la inicial del nombre sobre gris.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Iconos de Tabler, en el orden del selector, con su nombre para el lector de pantalla */
export const AVATAR_ICONS = [
  { id: 'mood-smile', label: 'Cara sonriente' },
  { id: 'mood-wink', label: 'Cara que guiña un ojo' },
  { id: 'dog', label: 'Perro' },
  { id: 'cat', label: 'Gato' },
  { id: 'fish', label: 'Pez' },
  { id: 'butterfly', label: 'Mariposa' },
  { id: 'rocket', label: 'Cohete' },
  { id: 'planet', label: 'Planeta' },
  { id: 'alien', label: 'Extraterrestre' },
  { id: 'ghost', label: 'Fantasma' },
  { id: 'ball-football', label: 'Balón de fútbol' },
  { id: 'ball-basketball', label: 'Balón de baloncesto' },
  { id: 'crown', label: 'Corona' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'cactus', label: 'Cactus' },
] as const;

/**
 * Colores de fondo: el tono 500 de Tailwind, sobre el que el icono y la inicial en blanco se leen.
 * Las clases van escritas enteras para que Tailwind las genere.
 */
export const AVATAR_COLORS = [
  { id: 'red', label: 'Rojo', className: 'bg-red-500' },
  { id: 'orange', label: 'Naranja', className: 'bg-orange-500' },
  { id: 'amber', label: 'Ámbar', className: 'bg-amber-500' },
  { id: 'green', label: 'Verde', className: 'bg-green-500' },
  { id: 'sky', label: 'Celeste', className: 'bg-sky-500' },
  { id: 'blue', label: 'Azul', className: 'bg-blue-500' },
  { id: 'violet', label: 'Violeta', className: 'bg-violet-500' },
  { id: 'pink', label: 'Rosa', className: 'bg-pink-500' },
] as const;

/** Lo elegido para el avatar: el id del icono y el del color, o null si no se ha elegido */
export interface AvatarChoice {
  icon: string | null;
  color: string | null;
}

/**
 * ¿Es el id de un icono del selector?
 *
 * @param value Valor que se comprueba (p. ej. lo guardado en la cuenta).
 * @returns Si es uno de los iconos.
 */
export const isAvatarIcon = (value: unknown): value is string =>
  AVATAR_ICONS.some((icon) => icon.id === value);

/**
 * Color del selector por su id.
 *
 * @param id Id del color.
 * @returns El color, o undefined si no es uno de los del selector.
 */
export const avatarColorOf = (id: string | null) => AVATAR_COLORS.find((color) => color.id === id);
