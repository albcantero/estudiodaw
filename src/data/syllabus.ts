/**
 * @file Temario oficial de cada asignatura: las unidades (UD) de la plataforma, en orden.
 *
 * La página de la asignatura las lista todas; las que ya tienen tema publicado enlazan a él
 * (por su campo `unit`) y el resto sale como pendiente (lib/collection-items.ts).
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** En qué parcial entra una UD, o cómo se evalúa si no es en uno */
export type Parcial = 1 | 2 | 'unico' | 'practicas' | 'teoria' | 'no-entra';

export interface Unit {
  title: string;
  /** Solo donde el profesor ya ha publicado el reparto (oct. 2026) */
  parcial?: Parcial;
}

/** Qué significa cada valor de parcial, para su tooltip */
export const PARCIAL_TOOLTIPS: Record<Parcial, string> = {
  1: 'Este tema entra en el primer parcial',
  2: 'Este tema entra en el segundo parcial',
  unico: 'Este tema entra en el examen único del módulo, sin parciales',
  practicas: 'Este tema se evalúa con las prácticas',
  teoria: 'De este tema solo entra la teoría',
  'no-entra': 'Este tema no entra en el examen',
};

/** Cómo se nombra cada valor de Parcial en la interfaz */
export const PARCIAL_LABELS: Record<Parcial, string> = {
  1: '1.er parcial',
  2: '2.º parcial',
  unico: 'Examen único',
  practicas: 'Se evalúa en prácticas',
  teoria: 'Solo teoría',
  'no-entra': 'No entra',
};

/**
 * UD de cada asignatura (por id). Vacío si no tiene temario oficial (TFG); sin entrada, su
 * temario aún no se ha cargado. La insignia de progreso distingue los dos casos (lib/progress.ts).
 */
export const syllabus: Record<string, Unit[]> = {
  lm: [
    { title: 'XML: estructura y sintaxis', parcial: 1 },
    { title: 'HTML, CSS y sindicación de contenidos', parcial: 1 },
    { title: 'JavaScript y DOM', parcial: 1 },
    { title: 'DTD y XSD', parcial: 1 },
    { title: 'XSLT', parcial: 2 },
    { title: 'XQuery', parcial: 2 },
    { title: 'Sistemas de gestión empresarial (ERP)', parcial: 2 },
  ],
  bd: [
    { title: 'Almacenamiento de la información', parcial: 1 },
    { title: 'Bases de datos relacionales', parcial: 1 },
    { title: 'Interpretación de diagramas entidad-relación', parcial: 1 },
    { title: 'Realización de consultas', parcial: 2 },
    { title: 'Tratamiento de datos', parcial: 2 },
    { title: 'Programación de bases de datos', parcial: 2 },
    { title: 'Uso de bases de datos no relacionales' },
  ],
  dwec: [
    { title: 'Arquitecturas y lenguajes de programación en clientes web', parcial: 'practicas' },
    { title: 'Estructura del lenguaje JavaScript', parcial: 'practicas' },
    { title: 'Modelo de objetos predefinidos en JavaScript', parcial: 1 },
    { title: 'Estructuras definidas por el usuario en JavaScript', parcial: 1 },
    { title: 'Gestión de eventos y formularios en JavaScript', parcial: 2 },
    { title: 'Modelo de objetos del documento (DOM)', parcial: 2 },
    { title: 'Programación AJAX en JavaScript', parcial: 2 },
  ],
  dwes: [
    { title: 'Plataformas de programación web en entorno servidor', parcial: 1 },
    { title: 'Características del lenguaje PHP', parcial: 1 },
    { title: 'Trabajar con bases de datos en PHP', parcial: 1 },
    { title: 'Desarrollo de aplicaciones web con PHP', parcial: 2 },
    { title: 'Programación orientada a objetos en PHP', parcial: 2 },
    { title: 'Servicios web', parcial: 2 },
    { title: 'Aplicaciones web dinámicas: PHP y JavaScript', parcial: 'teoria' },
    { title: 'Aplicaciones web híbridas', parcial: 'teoria' },
  ],
  dpl: [
    { title: 'Implantación de arquitecturas web', parcial: 1 },
    { title: 'Configuración y administración de servidores web', parcial: 1 },
    { title: 'Configuración y administración de servidores de aplicaciones', parcial: 1 },
    { title: 'Instalación y administración de servidores FTP', parcial: 'practicas' },
    { title: 'Servicios de red implicados en el despliegue de una aplicación web', parcial: 2 },
    { title: 'Documentación y control de versiones', parcial: 2 },
  ],
  diw: [
    { title: 'Planificación de interfaces gráficas', parcial: 1 },
    { title: 'Accesibilidad en la web', parcial: 1 },
    { title: 'Usabilidad en la web', parcial: 1 },
    { title: 'Hojas de estilos', parcial: 1 },
    { title: 'Contenidos multimedia: imágenes', parcial: 2 },
    { title: 'Contenidos multimedia: audio y vídeo', parcial: 2 },
    { title: 'Contenidos multimedia: animaciones', parcial: 2 },
    { title: 'Contenidos web interactivos', parcial: 'practicas' },
  ],
  cid: [
    { title: 'Alfabetización digital y niveles de competencia', parcial: 'unico' },
    { title: 'Ciberseguridad: amenazas y virus informáticos', parcial: 'unico' },
    { title: 'Ciudadanía digital en las redes sociales', parcial: 'unico' },
  ],
  dasp: [
    { title: 'Digitalización y actividad en la empresa en entornos IT y OT', parcial: 1 },
    { title: 'Tecnologías habilitadoras digitales en la empresa', parcial: 1 },
    { title: 'Sistemas en la nube y su influencia en los sistemas digitales', parcial: 1 },
    { title: 'Inteligencia artificial en la empresa', parcial: 2 },
    { title: 'La protección en una economía digital globalizada', parcial: 2 },
    { title: 'Proyecto de transformación digital de una empresa', parcial: 2 },
  ],
  ipe: [
    { title: 'Estrategias en los procesos selectivos de empleo', parcial: 1 },
    {
      title: 'Competencias personales, sociales y emocionales para la empleabilidad',
      parcial: 1,
    },
    { title: 'Habilidades emprendedoras para la innovación y la sostenibilidad', parcial: 1 },
    { title: 'Ideas de emprendimiento: identificación, definición y validación', parcial: 2 },
    { title: 'Proyecto emprendedor de innovación social o tecnológica', parcial: 2 },
  ],
  sasp: [
    { title: 'Aspectos ambientales, sociales y de gobernanza (ASG)', parcial: 1 },
    { title: 'Retos ambientales y sociales de la sociedad', parcial: 1 },
    { title: 'Productos y servicios responsables: economía circular', parcial: 1 },
    { title: 'Productos y servicios responsables y actividades sostenibles', parcial: 2 },
    { title: 'Plan de sostenibilidad de una empresa', parcial: 2 },
  ],
  tfg: [],
};
