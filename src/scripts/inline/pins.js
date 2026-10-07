/**
 * @file Asignaturas fijadas y contadores de la Navegación, pintados antes del primer pintado.
 *
 * Script clásico: el panel lateral lo mete en línea detrás de su marcado y llama a
 * setupPins() con la clave de localStorage. Deja en window la lectura (readPins) y la función
 * que pinta (applyPins): scripts/sidebar/pins.ts las usa al fijar o soltar y
 * scripts/enrollment.ts al cambiar la matrícula, sin repetirlas.
 *
 * El grupo "Fijado" trae todas las asignaturas ocultas: aquí se enseñan las fijadas y se
 * colocan en el DOM en el orden en que se fijaron (así lo recorren igual el tabulador y el
 * lector de pantalla), se marcan sus chinchetas (aria-pressed) en todos los grupos y se pone el
 * contador de cada grupo. Sin ninguna a la vista, Fijado enseña su mensaje.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * Deja en window la lectura de las fijadas (readPins) y la función que las pinta (applyPins), y las
 * pinta.
 *
 * @param {string} key Clave de localStorage (STORAGE_KEYS.pinned).
 */
function setupPins(key) {
  /**
   * Ids de las asignaturas fijadas, en el orden en que se fijaron (la lectura protegida de
   * inline/boot.js, que corre antes).
   *
   * @returns {string[]} Los ids de las fijadas.
   */
  window.readPins = () => window.prefs.readList(key);

  /**
   * ¿Se ve la fila? La ocultan Fijado (hidden) y la matrícula (display: none).
   *
   * @param {Element} row Fila de la Navegación.
   * @returns {boolean} Si se ve.
   */
  const isShown = (row) => getComputedStyle(row).display !== 'none';

  /** Pinta las fijadas, el estado de las chinchetas y los contadores. */
  window.applyPins = function applyPins() {
    const pins = window.readPins();

    document.querySelectorAll('[data-pin-item]').forEach((item) => {
      item.toggleAttribute('hidden', !pins.includes(item.getAttribute('data-pin-item') ?? ''));
    });
    // Al final de su lista y en el orden en que se fijaron (las ocultas se quedan arriba)
    document.querySelectorAll('[data-pin-list]').forEach((list) => {
      pins.forEach((id) => {
        const item = list.querySelector(`:scope > [data-pin-item="${id}"]`);
        if (item) list.append(item);
      });
    });

    document.querySelectorAll('[data-pin]').forEach((button) => {
      const isPinned = pins.includes(button.getAttribute('data-pin') ?? '');
      button.setAttribute('aria-pressed', String(isPinned));
    });

    // Cada grupo cuenta lo que se ve: sin las que oculta la matrícula, ni ids que ya no existen
    document.querySelectorAll('[data-nav-group]').forEach((group) => {
      const shown = [...group.querySelectorAll('[data-subject]')].filter(isShown).length;
      group.querySelector('[data-nav-count]')?.replaceChildren(String(shown));
      group.querySelector('[data-pins-empty]')?.toggleAttribute('hidden', shown > 0);
    });
  };

  window.applyPins();
}
