// Claves de localStorage. Las preferencias son de cada navegador: no viajan a ningún sitio.
// El script del <head> (Base.astro) las recibe con define:vars; los componentes las importan.
export const STORAGE_KEYS = {
  /** 'light' | 'dark' */
  theme: 'site-theme',
  /** Vista de las colecciones: 'grid' | 'list' */
  view: 'collection-view',
  /** Ids de los módulos marcados en "Mi matrícula" (JSON) */
  enrollment: 'enrollment',
  /** Curso elegido en el filtro del calendario */
  examCourse: 'exam-course',
} as const;
