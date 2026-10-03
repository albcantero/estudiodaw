// Temario oficial de cada asignatura: las unidades (UD) de la plataforma, en orden.
// La página de la asignatura las lista todas; las que ya tienen tema publicado enlazan a
// él (por `unit`), y el resto sale como pendiente. `parcial` solo donde el profesor ya
// ha publicado el reparto (oct. 2026).
export type Parcial = 1 | 2 | 'practicas' | 'teoria' | 'no-entra';

export interface Unit {
  title: string;
  parcial?: Parcial;
}

export const PARCIAL_LABELS: Record<Parcial, string> = {
  1: '1er parcial',
  2: '2º parcial',
  practicas: 'Se evalúa en prácticas',
  teoria: 'Solo teoría',
  'no-entra': 'No entra',
};

export const syllabus: Record<string, Unit[]> = {
  lm: [
    { title: 'XML: estructura y sintaxis', parcial: 1 },
    { title: 'HTML y CSS', parcial: 1 },
    { title: 'Sindicación de contenidos (RSS y Atom)' },
    { title: 'XSD y DTD', parcial: 1 },
    { title: 'XSLT', parcial: 2 },
    { title: 'XQuery', parcial: 2 },
    { title: 'Sistemas de gestión empresarial (ERP)' },
    { title: 'JavaScript y DOM', parcial: 'no-entra' },
  ],
  bd: [
    { title: 'Almacenamiento de la información', parcial: 1 },
    { title: 'Bases de datos relacionales', parcial: 1 },
    { title: 'Interpretación de diagramas entidad-relación', parcial: 1 },
    { title: 'Realización de consultas', parcial: 2 },
    { title: 'Tratamiento de datos', parcial: 2 },
    { title: 'Programación de bases de datos', parcial: 2 },
  ],
  dwec: [
    { title: 'Arquitecturas y lenguajes de programación en clientes web' },
    { title: 'Estructura del lenguaje JavaScript' },
    { title: 'Modelo de objetos predefinidos en JavaScript' },
    { title: 'Estructuras definidas por el usuario en JavaScript' },
    { title: 'Gestión de eventos y formularios en JavaScript' },
    { title: 'Modelo de objetos del documento (DOM)' },
    { title: 'Programación AJAX en JavaScript' },
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
    { title: 'Planificación de interfaces gráficas' },
    { title: 'Accesibilidad en la web' },
    { title: 'Usabilidad en la web' },
    { title: 'Hojas de estilos' },
    { title: 'Contenidos multimedia: imágenes' },
    { title: 'Contenidos multimedia: audio y vídeo' },
    { title: 'Contenidos multimedia: animaciones' },
    { title: 'Contenidos web interactivos' },
  ],
  cid: [
    { title: 'Alfabetización digital y niveles de competencia' },
    { title: 'Ciberseguridad: amenazas y virus informáticos' },
    { title: 'Ciudadanía digital en las redes sociales' },
  ],
  dasp: [
    { title: 'Digitalización y actividad en la empresa en entornos IT y OT' },
    { title: 'Tecnologías habilitadoras digitales en la empresa' },
    { title: 'Sistemas en la nube y su influencia en los sistemas digitales' },
    { title: 'Inteligencia artificial en la empresa' },
    { title: 'La protección en una economía digital globalizada' },
    { title: 'Proyecto de transformación digital de una empresa' },
  ],
  ipe: [
    { title: 'Estrategias en los procesos selectivos de empleo' },
    { title: 'Competencias personales, sociales y emocionales para la empleabilidad' },
    { title: 'Habilidades emprendedoras para la innovación y la sostenibilidad' },
    { title: 'Ideas de emprendimiento: identificación, definición y validación' },
    { title: 'Proyecto emprendedor de innovación social o tecnológica' },
  ],
  sasp: [
    { title: 'Aspectos ambientales, sociales y de gobernanza (ASG)' },
    { title: 'Retos ambientales y sociales de la sociedad' },
    { title: 'Productos y servicios responsables: economía circular' },
    { title: 'Productos y servicios responsables y actividades sostenibles' },
    { title: 'Plan de sostenibilidad de una empresa' },
  ],
  tfg: [],
};
