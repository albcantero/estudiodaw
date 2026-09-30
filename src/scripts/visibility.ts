// Qué queda a la vista en las listas cuando se combinan el buscador (atributo hidden) y
// "Mi matrícula" (data-unenrolled). Una sola función recalcula contadores, avisos de
// vacío y grupos, la llame quien la llame.

export const isShown = (el: Element) => !(el as HTMLElement).hidden && !el.hasAttribute('data-unenrolled');

export function refreshLists() {
  // Paneles: contador del título y aviso de vacío. Se cuenta un elemento por entrada
  // (data-count-item), aunque la colección se pinte dos veces (rejilla y lista).
  document.querySelectorAll<HTMLElement>('section').forEach((section) => {
    const items = [...section.querySelectorAll('[data-count-item]')];
    if (!items.length) return;
    const shown = items.filter(isShown).length;

    const counter = section.querySelector<HTMLElement>('.panel-count');
    if (counter) counter.textContent = `(${shown})`;

    const empty = section.querySelector<HTMLElement>('.collection-empty');
    if (empty) {
      const searching = !!section.querySelector<HTMLInputElement>('.collection-search')?.value.trim();
      empty.textContent = searching ? empty.dataset.emptySearch! : empty.dataset.emptyEnrollment!;
      empty.hidden = shown > 0;
    }
  });

  // Grupos (meses del calendario): fuera si no les queda nada
  const groups = [...document.querySelectorAll<HTMLElement>('[data-subject-group]')];
  groups.forEach((group) => {
    group.hidden = ![...group.querySelectorAll('[data-count-item]')].some(isShown);
  });
  document.querySelectorAll<HTMLElement>('[data-groups-empty]').forEach((empty) => {
    empty.hidden = groups.some((g) => !g.hidden);
  });
}
