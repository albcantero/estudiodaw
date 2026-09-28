// Calendario oficial 2026-27 (presentación del CIFP Ponferrada, modalidad virtual).
// Horas en hora peninsular: diciembre y enero van en CET (+01:00).
export interface Exam {
  subject: string;
  label: string;
  start: string;
}

export const exams: Exam[] = [
  { subject: 'dwec', label: '1er parcial', start: '2026-12-01T15:00:00+01:00' },
  { subject: 'dpl', label: '1er parcial', start: '2026-12-01T17:30:00+01:00' },
  { subject: 'diw', label: '1er parcial', start: '2026-12-02T15:00:00+01:00' },
  { subject: 'sasp', label: '1er parcial', start: '2026-12-02T17:00:00+01:00' },
  { subject: 'dasp', label: '1er parcial', start: '2026-12-02T18:30:00+01:00' },
  { subject: 'ipe', label: '1er parcial', start: '2026-12-03T15:00:00+01:00' },
  { subject: 'dwes', label: '1er parcial', start: '2026-12-03T17:00:00+01:00' },
  { subject: 'lm', label: '1er parcial', start: '2027-01-20T15:00:00+01:00' },
  { subject: 'bd', label: '1er parcial', start: '2027-01-20T17:30:00+01:00' },
  { subject: 'ipe', label: '2º parcial', start: '2027-01-22T15:00:00+01:00' },
  { subject: 'sasp', label: '2º parcial', start: '2027-01-22T17:00:00+01:00' },
  { subject: 'diw', label: '2º parcial', start: '2027-01-26T15:00:00+01:00' },
  { subject: 'dwes', label: '2º parcial', start: '2027-01-26T17:00:00+01:00' },
  { subject: 'dwec', label: '2º parcial', start: '2027-01-27T15:00:00+01:00' },
  { subject: 'dasp', label: '2º parcial', start: '2027-01-27T17:30:00+01:00' },
  { subject: 'dpl', label: '2º parcial', start: '2027-01-28T15:00:00+01:00' },
  { subject: 'cid', label: 'Final', start: '2027-01-28T17:00:00+01:00' },
  { subject: 'lm', label: '2º parcial', start: '2027-04-14T15:00:00+02:00' },
  { subject: 'bd', label: '2º parcial', start: '2027-04-15T17:00:00+02:00' },
];
