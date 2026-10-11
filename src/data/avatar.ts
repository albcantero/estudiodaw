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
  { id: 'paw', label: 'Huella' },
  { id: 'pig', label: 'Cerdo' },
  { id: 'bug', label: 'Bicho' },
  { id: 'mushroom', label: 'Seta' },
  { id: 'flower', label: 'Flor' },
  { id: 'leaf', label: 'Hoja' },
  { id: 'sun', label: 'Sol' },
  { id: 'moon', label: 'Luna' },
  { id: 'star', label: 'Estrella' },
  { id: 'heart', label: 'Corazón' },
  { id: 'bolt', label: 'Rayo' },
  { id: 'flame', label: 'Llama' },
  { id: 'music', label: 'Música' },
  { id: 'coffee', label: 'Café' },
  { id: 'robot', label: 'Robot' },
] as const;

/**
 * Colores de fondo: el tono 500 de Tailwind, sobre el que el icono y la inicial en blanco se leen,
 * por su token (--avatar-*, tokens.css). Se pintan con la utilidad avatar-tone, que los aplana.
 */
export const AVATAR_COLORS = [
  { id: 'red', label: 'Rojo', variable: '--avatar-red' },
  { id: 'orange', label: 'Naranja', variable: '--avatar-orange' },
  { id: 'amber', label: 'Ámbar', variable: '--avatar-amber' },
  { id: 'green', label: 'Verde', variable: '--avatar-green' },
  { id: 'sky', label: 'Celeste', variable: '--avatar-sky' },
  { id: 'blue', label: 'Azul', variable: '--avatar-blue' },
  { id: 'violet', label: 'Violeta', variable: '--avatar-violet' },
  { id: 'pink', label: 'Rosa', variable: '--avatar-pink' },
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
