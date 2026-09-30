// Calendario .ics (RFC 5545) con los exámenes, para importarlo en Google Calendar, Apple
// Calendar u Outlook. Las horas van en UTC (sufijo Z): cada calendario las pasa a su zona.

export interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  start: string;
  end: string;
}

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// Texto: se escapan \ ; , y los saltos de línea
const text = (value: string) => value.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

// Líneas de más de 75 octetos se parten con CRLF + espacio. Se corta por caracteres a 60
// para no pasarse con las tildes (dos octetos en UTF-8).
const fold = (line: string) => {
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 60) chunks.push(line.slice(i, i + 60));
  return chunks.join('\r\n ');
};

export function buildIcs(events: IcsEvent[], calendarName: string) {
  const stamp = utc(new Date().toISOString());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//estudiodaw.dev//Calendario de examenes//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${text(calendarName)}`,
    ...events.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.uid}@estudiodaw.dev`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${utc(e.start)}`,
      `DTEND:${utc(e.end)}`,
      `SUMMARY:${text(e.title)}`,
      `DESCRIPTION:${text(e.description)}`,
      'LOCATION:CIFP de Ponferrada',
      // Aviso la víspera
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${text(e.title)}`,
      'END:VALARM',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
