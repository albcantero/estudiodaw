// Módulos de DAW por curso, en el orden del calendario oficial. Los que tienen página
// salen de la colección `subjects`; los demás solo existen aquí (calendario y matrícula).

export const courseModules: Record<1 | 2, string[]> = {
  1: ['lm', 'si', 'bd', 'prog', 'ed', 'ingles', 'cid1', 'ipe1'],
  2: ['diw', 'dwes', 'dwec', 'dpl', 'ipe', 'cid', 'sasp', 'dasp', 'tfg'],
};

// Módulos sin página en la web (ni apuntes)
export const otherModules: Record<string, { name: string; color: string }> = {
  si: { name: 'Sistemas Informáticos', color: '#94a3b8' },
  prog: { name: 'Programación', color: '#3b82f6' },
  ed: { name: 'Entornos de Desarrollo', color: '#e11d48' },
  ingles: { name: 'Inglés Profesional', color: '#818cf8' },
  cid1: { name: 'Ciudadanía e Identidad Digital I', color: '#c4b5fd' },
  ipe1: { name: 'Itinerario Personal para la Empleabilidad I', color: '#bef264' },
  eie: { name: 'Empresa e Iniciativa Emprendedora', color: '#a8a29e' },
};
