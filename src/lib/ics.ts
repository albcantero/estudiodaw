/**
 * @file Calendario .ics (RFC 5545) con los exámenes, para importarlo en Google Calendar, Apple
 * Calendar u Outlook. Las horas van en UTC (sufijo Z): cada calendario las pasa a su zona.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { CENTRE_NAME, SITE_NAME } from '../data/site';

export interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  /** Inicio, en ISO 8601 */
  start: string;
  /** Fin, en ISO 8601 */
  end: string;
}

/** Salto de línea del formato (CRLF, obligatorio) */
const CRLF = '\r\n';

/** Caracteres por trozo al partir líneas largas (ver foldLine) */
const FOLD_CHARS = 60;

/**
 * Fecha en el formato de iCalendar, en UTC: "2027-01-20T14:00:00.000Z" → "20270120T140000Z".
 *
 * @param iso Fecha en ISO 8601.
 * @returns La fecha en el formato de iCalendar.
 */
const toIcsDate = (iso: string): string =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

/**
 * Escapa un texto: barra invertida, punto y coma, coma y saltos de línea.
 *
 * @param value Texto libre.
 * @returns El texto escapado.
 */
const escapeText = (value: string): string =>
  value.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, '\\n');

/**
 * Parte una línea larga: el formato admite 75 octetos por línea y sigue en la siguiente con
 * CRLF + espacio. Se corta cada 60 caracteres para no pasarse con las tildes (dos octetos en
 * UTF-8).
 *
 * @param line Línea del fichero.
 * @returns La línea, partida si hace falta.
 */
const foldLine = (line: string): string =>
  Array.from({ length: Math.ceil(line.length / FOLD_CHARS) || 1 }, (_, i) =>
    line.slice(i * FOLD_CHARS, (i + 1) * FOLD_CHARS),
  ).join(`${CRLF} `);

/**
 * Líneas de un examen, con aviso la víspera.
 *
 * @param event Examen.
 * @param stamp Fecha de creación del fichero (DTSTAMP).
 * @returns Las líneas del evento.
 */
const eventLines = (event: IcsEvent, stamp: string): string[] => [
  'BEGIN:VEVENT',
  `UID:${event.uid}@${SITE_NAME}`,
  `DTSTAMP:${stamp}`,
  `DTSTART:${toIcsDate(event.start)}`,
  `DTEND:${toIcsDate(event.end)}`,
  `SUMMARY:${escapeText(event.title)}`,
  `DESCRIPTION:${escapeText(event.description)}`,
  `LOCATION:${escapeText(CENTRE_NAME)}`,
  'BEGIN:VALARM',
  'TRIGGER:-P1D',
  'ACTION:DISPLAY',
  `DESCRIPTION:${escapeText(event.title)}`,
  'END:VALARM',
  'END:VEVENT',
];

/**
 * Fichero .ics completo.
 *
 * @param events Exámenes que entran.
 * @param calendarName Nombre del calendario al importarlo.
 * @returns Contenido del fichero.
 */
export function buildIcs(events: IcsEvent[], calendarName: string): string {
  const stamp = toIcsDate(new Date().toISOString());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE_NAME}//Calendario de examenes//ES`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    ...events.flatMap((event) => eventLines(event, stamp)),
    'END:VCALENDAR',
  ];
  return `${lines.map(foldLine).join(CRLF)}${CRLF}`;
}
