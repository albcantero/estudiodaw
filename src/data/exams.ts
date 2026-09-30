// Calendario oficial 2026-27 (presentación del CIFP Ponferrada, modalidad virtual).
// Horas en hora peninsular: de noviembre a marzo CET (+01:00); abril a junio CEST (+02:00).
export type ExamKind = 'parcial' | 'final';

export interface Exam {
  subject: string;
  kind: ExamKind;
  label: string;
  start: string;
}

export const exams: Exam[] = [
  // 1er parcial de 2º
  { subject: 'dwec', kind: 'parcial', label: '1er parcial', start: '2026-12-01T15:00:00+01:00' },
  { subject: 'dpl', kind: 'parcial', label: '1er parcial', start: '2026-12-01T17:30:00+01:00' },
  { subject: 'diw', kind: 'parcial', label: '1er parcial', start: '2026-12-02T15:00:00+01:00' },
  { subject: 'sasp', kind: 'parcial', label: '1er parcial', start: '2026-12-02T17:00:00+01:00' },
  { subject: 'dasp', kind: 'parcial', label: '1er parcial', start: '2026-12-02T18:30:00+01:00' },
  { subject: 'ipe', kind: 'parcial', label: '1er parcial', start: '2026-12-03T15:00:00+01:00' },
  { subject: 'dwes', kind: 'parcial', label: '1er parcial', start: '2026-12-03T17:00:00+01:00' },
  // Pendientes de 1º, 1er parcial
  { subject: 'lm', kind: 'parcial', label: '1er parcial', start: '2027-01-20T15:00:00+01:00' },
  { subject: 'bd', kind: 'parcial', label: '1er parcial', start: '2027-01-20T17:30:00+01:00' },
  // 2º parcial de 2º
  { subject: 'ipe', kind: 'parcial', label: '2º parcial', start: '2027-01-22T15:00:00+01:00' },
  { subject: 'sasp', kind: 'parcial', label: '2º parcial', start: '2027-01-22T17:00:00+01:00' },
  { subject: 'diw', kind: 'parcial', label: '2º parcial', start: '2027-01-26T15:00:00+01:00' },
  { subject: 'dwes', kind: 'parcial', label: '2º parcial', start: '2027-01-26T17:00:00+01:00' },
  { subject: 'dwec', kind: 'parcial', label: '2º parcial', start: '2027-01-27T15:00:00+01:00' },
  { subject: 'dasp', kind: 'parcial', label: '2º parcial', start: '2027-01-27T17:30:00+01:00' },
  { subject: 'dpl', kind: 'parcial', label: '2º parcial', start: '2027-01-28T15:00:00+01:00' },
  { subject: 'cid', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-01-28T17:00:00+01:00' },
  // Pendientes de 1º, 2º parcial
  { subject: 'lm', kind: 'parcial', label: '2º parcial', start: '2027-04-14T15:00:00+02:00' },
  { subject: 'bd', kind: 'parcial', label: '2º parcial', start: '2027-04-15T17:00:00+02:00' },
  // Finales, 1ª convocatoria
  { subject: 'lm', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-05-28T16:00:00+02:00' },
  { subject: 'bd', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-02T16:00:00+02:00' },
  { subject: 'dwec', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-03T15:00:00+02:00' },
  { subject: 'dwes', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-03T17:30:00+02:00' },
  { subject: 'ipe', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-04T15:00:00+02:00' },
  { subject: 'dasp', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-04T17:00:00+02:00' },
  { subject: 'dpl', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-07T15:00:00+02:00' },
  { subject: 'diw', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-07T17:00:00+02:00' },
  { subject: 'sasp', kind: 'final', label: 'Final, 1ª convocatoria', start: '2027-06-07T19:00:00+02:00' },
  // Finales, 2ª convocatoria
  { subject: 'dwec', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-16T15:00:00+02:00' },
  { subject: 'bd', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-16T17:30:00+02:00' },
  { subject: 'dpl', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-17T15:00:00+02:00' },
  { subject: 'ipe', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-17T17:00:00+02:00' },
  { subject: 'dasp', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-17T19:00:00+02:00' },
  { subject: 'dwes', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-18T15:00:00+02:00' },
  { subject: 'lm', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-18T17:30:00+02:00' },
  { subject: 'diw', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-21T17:00:00+02:00' },
  { subject: 'sasp', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-21T19:00:00+02:00' },
  { subject: 'cid', kind: 'final', label: 'Final, 2ª convocatoria', start: '2027-06-22T19:30:00+02:00' },
];
