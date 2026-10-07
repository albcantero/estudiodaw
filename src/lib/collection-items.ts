/**
 * @file Elementos de las colecciones de la web: las asignaturas de la portada y los temas de cada
 * asignatura. Aquí se decide qué se cuenta de cada uno; las páginas solo lo pintan.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { COURSES, COURSE_YEARS } from '../data/courses';
import { DOC_LABELS } from '../data/doc-kinds';
import { exams } from '../data/exams';
import { PARCIAL_LABELS, PARCIAL_TOOLTIPS, syllabus, type Unit } from '../data/syllabus';
import type { CollectionItem, CollectionProperty } from './collection';
import { docsOfTema, temaNumber, type Doc, type Subject, type Tema } from './content';
import { progressBadge } from './progress';

/** Estado de un tema que ya se puede leer */
const PUBLISHED: CollectionProperty = {
  text: 'Publicado',
  icon: 'circle-check',
  place: 'footer',
  tooltip: 'Este tema ya tiene apuntes',
};

/** Estado de una UD del temario que aún no tiene tema */
const PENDING: CollectionProperty = {
  text: 'Próximamente',
  icon: 'circle-dashed',
  place: 'footer',
  tooltip: 'Este tema aún no tiene apuntes',
};

/**
 * Insignias del próximo examen de una asignatura: su fecha y lo que falta. Las escribe el
 * navegador (cambian con el día); sin exámenes en el calendario, ninguna.
 *
 * @param subjectId Id de la asignatura.
 * @returns Las insignias, o ninguna si la asignatura no tiene exámenes.
 */
function nextExamProperties(subjectId: string): CollectionProperty[] {
  const own = exams
    .filter((exam) => exam.subject === subjectId)
    .sort((a, b) => a.start.localeCompare(b.start))
    .map(({ start, end }) => ({ start, end }));
  if (own.length === 0) return [];
  const base = { text: '', place: 'footer' } as const;
  return [
    {
      ...base,
      field: 'exam',
      icon: 'bell',
      iconTone: 'attention',
      tooltip: 'Fecha del próximo examen de esta asignatura',
      nextExam: { show: 'date', exams: own },
    },
    {
      ...base,
      field: 'countdown',
      icon: 'hourglass-sand',
      tooltip: 'Días y horas que quedan para el próximo examen',
      nextExam: { show: 'countdown', exams: own },
    },
  ];
}

/**
 * Orden de los grupos de las asignaturas (`group` de subjectItems): los cursos, en orden
 *
 * @returns Los nombres de los cursos, de primero a segundo.
 */
export const subjectGroupOrder = (): string[] => COURSE_YEARS.map((year) => COURSES[year].name);

/**
 * Asignaturas de la portada, por orden alfabético: su curso arriba y su progreso abajo.
 *
 * @param subjects Asignaturas.
 * @param temaCounts Temas publicados de cada una (getTemaCounts).
 * @returns Los elementos de la colección.
 */
export function subjectItems(
  subjects: Subject[],
  temaCounts: Map<string, number>,
): CollectionItem[] {
  return [...subjects]
    .sort((a, b) => a.data.name.localeCompare(b.data.name, 'es'))
    .map((subject) => {
      const course = COURSES[subject.data.year];
      // Sin entrada en el temario: aún no se ha cargado (no es lo mismo que no tenerlo)
      const progress = progressBadge(temaCounts.get(subject.id) ?? 0, syllabus[subject.id]?.length);
      return {
        href: `/${subject.id}`,
        subject: subject.id,
        group: course.name,
        title: subject.data.name,
        description: subject.data.description,
        properties: [
          {
            text: course.name,
            dot: course.dot,
            place: 'header',
            field: 'course',
            tooltip: `Esta asignatura pertenece al ${course.title.toLowerCase()}`,
          },
          { ...progress, place: 'footer', field: 'notes' },
          ...nextExamProperties(subject.id),
        ],
      };
    });
}

/**
 * Parcial en el que entra una UD, como propiedad; ninguna si aún no se sabe.
 *
 * @param unit UD del temario.
 * @returns La insignia del parcial, o ninguna.
 */
const parcialProperties = (unit?: Unit): CollectionProperty[] =>
  unit?.parcial
    ? [
        {
          text: PARCIAL_LABELS[unit.parcial],
          icon: 'calendar-event',
          place: 'header',
          tooltip: PARCIAL_TOOLTIPS[unit.parcial],
        },
      ]
    : [];

/**
 * Temas de una asignatura: cada UD del temario oficial, en orden. Si una UD ya tiene tema
 * publicado (por su campo `unit`), enlaza a su primer documento; si no, sale como pendiente.
 * Los temas publicados que no casan con ninguna UD van al final.
 *
 * @param subject Asignatura.
 * @param temas Sus temas publicados.
 * @param docs Todos los documentos.
 * @returns Los elementos de la colección.
 */
export function temaItems(subject: Subject, temas: Tema[], docs: Doc[]): CollectionItem[] {
  const units = syllabus[subject.id] ?? [];
  /**
   * Nombre de una UD del temario por su posición: "UD1", "UD2"…
   *
   * @param index Posición de la UD, desde 0.
   * @returns El nombre de la UD.
   */
  const unitId = (index: number) => `UD${index + 1}`;
  const temaByUnit = new Map(temas.map((tema) => [tema.data.unit, tema]));

  /**
   * Elemento de un tema publicado.
   *
   * @param tema Tema.
   * @param number Su número.
   * @param unit La UD del temario que cubre, si la hay.
   * @returns El elemento del tema.
   */
  const publishedItem = (tema: Tema, number: number, unit?: Unit): CollectionItem => {
    const temaDocs = docsOfTema(docs, subject.id, tema.data.slug);
    // Directo al primer documento, sin pasar por la redirección de la URL del tema
    const firstKind = temaDocs[0]?.data.kind ?? 'teoria';
    return {
      href: `/${subject.id}/${tema.data.slug}/${firstKind}`,
      number: temaNumber(number),
      title: tema.data.title,
      description: tema.data.description,
      properties: [...parcialProperties(unit), PUBLISHED],
      note: temaDocs.map((doc) => DOC_LABELS[doc.data.kind]).join(' · '),
    };
  };

  const syllabusItems = units.map((unit, index) => {
    const tema = temaByUnit.get(unitId(index));
    if (tema) return publishedItem(tema, index + 1, unit);
    return {
      number: temaNumber(index + 1),
      title: unit.title,
      properties: [...parcialProperties(unit), PENDING],
    };
  });

  const unitIds = new Set(units.map((_, index) => unitId(index)));
  const extraItems = temas
    .filter((tema) => !tema.data.unit || !unitIds.has(tema.data.unit))
    .map((tema) => publishedItem(tema, tema.data.number));

  return [...syllabusItems, ...extraItems];
}
