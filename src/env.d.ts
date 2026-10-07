/**
 * @file Funciones que dejan en window los scripts en línea de src/scripts/inline. Se ejecutan antes
 * del primer pintado y no pueden importarse: así los módulos pueden volver a llamarlas.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Control del lector paginado de un documento (inline/doc-pages.js) */
interface DocPager {
  /**
   * Muestra una página.
   *
   * @param index Página pedida (se ajusta al rango válido).
   * @returns Página mostrada.
   */
  show(index: number): number;
  /**
   * Página que contiene un elemento.
   *
   * @param id Id del elemento.
   * @returns Su página; -1 si no está en el documento.
   */
  indexOfId(id: string): number;
  /**
   * Ancla del <h2> con el que empieza una página.
   *
   * @param index Página.
   */
  hashOf(index: number): string;
  /** Página que se está viendo */
  current(): number;
  /** Número de páginas */
  count: number;
}

/** Acceso protegido a localStorage (inline/boot.js); los módulos usan scripts/preferences.ts */
interface Preferences {
  /** Lee una preferencia; null si no hay */
  read(key: string): string | null;
  /** Guarda una preferencia (en memoria si el navegador no deja) */
  write(key: string, value: string): void;
  /** Borra una preferencia */
  remove(key: string): void;
  /** Lee una lista de ids en JSON; vacía si no hay o no vale */
  readList(key: string): string[];
}

interface Window {
  /** Preferencias guardadas (inline/boot.js): está en todas las páginas antes que nada */
  prefs: Preferences;
  /** Vuelve a aplicar el filtro de "Mi matrícula" (inline/boot.js) */
  applyEnrollmentStyle?: () => void;
  /** Vuelve a calcular html[data-reduce-motion]: "system", "site" o nada (inline/boot.js) */
  applyReduceMotion?: () => void;
  /** Vuelve a calcular html[data-hide], las propiedades ocultas de las colecciones (inline/boot.js) */
  applyHiddenFields?: () => void;
  /** Recoloca las colecciones: orden por grupo y líneas del tablero (inline/collection-layout.js) */
  layoutCollections?: () => void;
  /** Ids de las asignaturas fijadas, en el orden en que se fijaron (inline/pins.js) */
  readPins?: () => string[];
  /** Vuelve a pintar las asignaturas fijadas (inline/pins.js) */
  applyPins?: () => void;
  /** Lector del documento abierto; no existe fuera de las páginas de documento */
  docPager?: DocPager;
}

/** Variables públicas de la web (.env en local, Vercel en producción) */
interface ImportMetaEnv {
  /** URL del proyecto de Supabase; sin ella no hay login */
  readonly PUBLIC_SUPABASE_URL?: string;
  /** Clave pública (anon) de Supabase */
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  /** 'real' para usar Supabase de verdad en desarrollo (por defecto, login de mentira) */
  readonly PUBLIC_AUTH_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
