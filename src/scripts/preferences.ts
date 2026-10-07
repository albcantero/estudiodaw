/**
 * @file Preferencias guardadas en el navegador (localStorage), para los módulos.
 *
 * Quien toca localStorage es el script en línea inline/boot.js (window.prefs), que corre antes
 * que nada en todas las páginas: aquí solo se le da tipo y nombre. Si el navegador no deja
 * guardar (modo privado, cookies bloqueadas, almacenamiento lleno), lo elegido se queda en
 * memoria durante la visita y la web sigue funcionando igual.
 *
 * Las claves están en data/storage.ts.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * Lee una preferencia.
 *
 * @param key Clave de localStorage (de STORAGE_KEYS).
 * @returns El valor guardado, o null si no hay.
 */
export const readPreference = (key: string): string | null => window.prefs.read(key);

/**
 * Lee una preferencia que es una lista de ids (en JSON).
 *
 * @param key Clave de localStorage (de STORAGE_KEYS).
 * @returns Los ids válidos; vacía si no hay o el valor no es una lista.
 */
export const readListPreference = (key: string): string[] => window.prefs.readList(key);

/**
 * Guarda una preferencia.
 *
 * @param key Clave de localStorage (de STORAGE_KEYS).
 * @param value Valor que se guarda.
 */
export const writePreference = (key: string, value: string): void => {
  window.prefs.write(key, value);
};

/**
 * Guarda una lista de ids; vacía, la borra (se vuelve a lo de serie).
 *
 * @param key Clave de localStorage (de STORAGE_KEYS).
 * @param ids Ids que se guardan.
 */
export function writeListPreference(key: string, ids: string[]): void {
  if (ids.length > 0) window.prefs.write(key, JSON.stringify(ids));
  else window.prefs.remove(key);
}

/**
 * Borra una preferencia.
 *
 * @param key Clave de localStorage (de STORAGE_KEYS).
 */
export const removePreference = (key: string): void => {
  window.prefs.remove(key);
};
