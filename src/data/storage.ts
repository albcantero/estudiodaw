/**
 * @file Claves de localStorage. Las preferencias son de cada navegador: no viajan a ningún sitio.
 *
 * Llevan el prefijo de la web, para no chocar con las de otras webs del mismo origen (en
 * desarrollo, todo es localhost), y el mismo nombre que su atributo de <html> cuando lo tienen
 * (data-view, data-group, data-hide).
 *
 * Solo las lee y escribe el script en línea scripts/inline/boot.js (window.prefs), que las
 * recibe como objeto JSON desde Base.astro; los módulos pasan por scripts/preferences.ts.
 *
 * @author Alberto Cantero
 * @license MIT
 */
export const STORAGE_KEYS = {
  /** Tema: 'light' | 'dark'; sin nada, oscuro */
  theme: 'estudiodaw:theme',
  /** Vista de las colecciones (ROOT_CHOICES.view) */
  view: 'estudiodaw:view',
  /** Agrupación de las colecciones (ROOT_CHOICES.group) */
  group: 'estudiodaw:group',
  /** Propiedades ocultas desde "Mostrar propiedades" (lista en JSON de BadgeField) */
  hiddenFields: 'estudiodaw:hide',
  /** Ids de las asignaturas marcadas en "Mi matrícula" (lista en JSON) */
  enrollment: 'estudiodaw:enrollment',
  /** Ids de las asignaturas fijadas en la Navegación, en el orden en que se fijaron (JSON) */
  pinned: 'estudiodaw:pinned',
  /** Reducir movimiento desde la web (además del ajuste del sistema): 'on' o nada */
  reduceMotion: 'estudiodaw:reduce-motion',
  /** Scroll suave con la rueda (Lenis): 'off' para apagarlo; por defecto, encendido */
  smoothScroll: 'estudiodaw:smooth-scroll',
  /** Curso elegido en el filtro del calendario: 'all' | '1' | '2' */
  examCourse: 'estudiodaw:exam-course',
  /** Sesión de Supabase Auth (la escribe supabase-js a través de window.prefs; JSON) */
  auth: 'estudiodaw:auth',
} as const;

/**
 * Claves de antes del prefijo (hasta oct. 2026), por clave nueva: boot.js pasa lo guardado a
 * la nueva la primera vez, así nadie pierde sus preferencias. Se puede borrar cuando ya no
 * quede nadie con las antiguas.
 */
export const LEGACY_STORAGE_KEYS: Record<string, string> = {
  [STORAGE_KEYS.theme]: 'site-theme',
  [STORAGE_KEYS.view]: 'collection-view',
  [STORAGE_KEYS.group]: 'collection-group',
  [STORAGE_KEYS.hiddenFields]: 'collection-hidden-fields',
  [STORAGE_KEYS.enrollment]: 'enrollment',
  [STORAGE_KEYS.pinned]: 'pinned-subjects',
  [STORAGE_KEYS.reduceMotion]: 'reduce-motion',
  [STORAGE_KEYS.smoothScroll]: 'smooth-scroll',
  [STORAGE_KEYS.examCourse]: 'exam-course',
};

/**
 * Valores posibles de las preferencias que van en atributos de <html> (data-view, data-group).
 * El primero de cada lista es el de serie. Los usan boot.js, al aplicarlas, y los conmutadores
 * de las colecciones, al cambiarlas.
 */
export const ROOT_CHOICES = {
  /** Vista de las colecciones */
  view: ['list', 'grid'],
  /** Agrupación de las colecciones */
  group: ['none', 'course'],
} as const;

export type RootChoice = keyof typeof ROOT_CHOICES;

/**
 * Propiedades ocultas de serie, sin nada guardado en "Mostrar propiedades": el próximo examen y
 * el cronómetro. Lo elegido se guarda siempre como lista (vacía si se enseña todo) y solo
 * "Restaurar valores por defecto" la borra para volver a esta.
 */
export const DEFAULT_HIDDEN_FIELDS: readonly string[] = ['exam', 'countdown'];
