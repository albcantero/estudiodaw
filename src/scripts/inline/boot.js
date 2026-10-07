/**
 * @file Preferencias del navegador aplicadas antes del primer pintado: tema, vista y agrupación de
 * las colecciones (html[data-view], html[data-group]), datos ocultos (html[data-hide]), filtro de
 * "Mi matrícula" y reducir movimiento (html[data-reduce-motion]).
 *
 * Script clásico, no módulo: Base.astro lo mete en línea en el <head> y llama a boot() con las
 * claves y los valores de data/storage.ts. Por eso no puede importar nada.
 *
 * Es también el único que toca localStorage: deja en window.prefs la lectura y la escritura
 * protegidas, que usan los módulos (scripts/preferences.ts) y el resto de scripts en línea. Si
 * el navegador no deja guardar (modo privado, cookies bloqueadas), lo elegido se queda en
 * memoria: vale para toda la visita, también al cambiar de página.
 *
 * Con ClientRouter, Astro no vuelve a ejecutar este script al navegar (el mismo texto se
 * ejecuta una vez), pero sí sustituye los atributos de <html>: por eso se vuelven a aplicar en
 * astro:after-swap.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * Aplica las preferencias guardadas a <html> y deja en window lo que usan los módulos y el resto de
 * scripts en línea.
 *
 * @param {typeof import('../../data/storage').STORAGE_KEYS} keys Claves de localStorage.
 * @param {typeof import('../../data/storage').ROOT_CHOICES} choices Valores de la vista y la
 *   agrupación; el primero de cada lista es el de serie.
 * @param {readonly string[]} defaultHidden Propiedades ocultas de serie (DEFAULT_HIDDEN_FIELDS).
 * @param {typeof import('../../data/storage').LEGACY_STORAGE_KEYS} legacy Claves antiguas, por
 *   clave nueva.
 */
function boot(keys, choices, defaultHidden, legacy) {
  const root = document.documentElement;

  // Lo guardado con las claves antiguas pasa a las nuevas, una vez
  try {
    Object.entries(legacy).forEach(([key, old]) => {
      const value = localStorage.getItem(old);
      if (value === null) return;
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value);
      localStorage.removeItem(old);
    });
  } catch {
    // Sin almacenamiento: no hay nada que pasar
  }

  /** Lo que no se ha podido guardar en localStorage, para lo que queda de visita */
  const memory = new Map();

  /** Ids de una lista guardada: letras, números, guion y guion bajo (van a selectores) */
  const VALID_ID = /^[\w-]+$/;

  window.prefs = {
    read(key) {
      if (memory.has(key)) return memory.get(key);
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    write(key, value) {
      try {
        localStorage.setItem(key, value);
        memory.delete(key);
      } catch {
        memory.set(key, value);
      }
    },

    remove(key) {
      memory.delete(key);
      try {
        localStorage.removeItem(key);
      } catch {
        // Sin almacenamiento: no había nada guardado que borrar
      }
    },

    readList(key) {
      try {
        const parsed = JSON.parse(this.read(key) ?? '[]');
        return Array.isArray(parsed) ? parsed.map(String).filter((id) => VALID_ID.test(id)) : [];
      } catch {
        // Un valor que no es JSON (editado a mano, versión antigua) cuenta como lista vacía
        return [];
      }
    },
  };

  const { prefs } = window;

  /**
   * Valor elegido de entre los posibles; el de serie (el primero) si no hay o no vale.
   *
   * @param {string} key Clave de localStorage.
   * @param {readonly string[]} values Valores posibles.
   * @returns {string} El valor elegido.
   */
  const readChoice = (key, values) => {
    const value = prefs.read(key);
    return value !== null && values.includes(value) ? value : values[0];
  };

  /**
   * "Mi matrícula": oculta todo lo que lleva data-subject de un módulo no marcado y los
   * grupos que se quedan sin nada (meses del calendario). Sin nada marcado no se filtra.
   *
   * La matrícula es solo con la sesión iniciada: sin una sesión guardada no se filtra y falta
   * html[data-signed-in], que esconde los botones de la matrícula (layout.css). Si la guardada
   * ha caducado, la cuenta (scripts/auth/account.ts) lo corrige al confirmarlo.
   */
  const applyEnrollmentStyle = () => {
    const signedIn = prefs.read(keys.auth) !== null;
    root.toggleAttribute('data-signed-in', signedIn);
    const ids = signedIn ? prefs.readList(keys.enrollment) : [];
    const existing = document.getElementById('enrollment-style');
    if (ids.length === 0) {
      existing?.remove();
      return;
    }
    const match = ids.map((id) => `[data-subject="${id}"]`).join(',');
    const style = existing ?? document.head.appendChild(document.createElement('style'));
    style.id = 'enrollment-style';
    style.textContent = [
      `[data-subject]:not(${match}){display:none!important}`,
      `[data-subject-group]:not(:has(${match})){display:none!important}`,
    ].join('');
  };

  /** Lo pide el sistema operativo */
  const systemReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /**
   * Reducir movimiento: una sola señal para toda la web, html[data-reduce-motion], que leen el
   * CSS, Motion y el scroll suave. Vale "system" si lo pide el sistema y "site" si lo pide el
   * interruptor de la web (los ajustes distinguen los dos casos).
   */
  const applyReduceMotion = () => {
    if (systemReduce.matches) root.dataset.reduceMotion = 'system';
    else if (prefs.read(keys.reduceMotion) === 'on') root.dataset.reduceMotion = 'site';
    else delete root.dataset.reduceMotion;
  };

  /**
   * "Mostrar propiedades" de las colecciones: las ocultas van en html[data-hide] ("exam
   * countdown") y el CSS (layout.css) oculta sus insignias. Sin nada guardado, las de serie.
   */
  const applyHiddenFields = () => {
    // De serie, agrupado por curso también el curso: ya lo dice la fila de cada curso
    const defaults = root.dataset.group === 'course' ? [...defaultHidden, 'course'] : defaultHidden;
    const fields =
      prefs.read(keys.hiddenFields) === null ? defaults : prefs.readList(keys.hiddenFields);
    if (fields.length > 0) root.dataset.hide = fields.join(' ');
    else delete root.dataset.hide;
  };

  /**
   * Aplica todas las preferencias al documento. El tema es oscuro salvo que se haya elegido el
   * claro: a propósito, no se sigue el del sistema.
   */
  const apply = () => {
    root.classList.toggle('dark', prefs.read(keys.theme) !== 'light');
    root.dataset.view = readChoice(keys.view, choices.view);
    root.dataset.group = readChoice(keys.group, choices.group);
    applyEnrollmentStyle();
    applyReduceMotion();
    applyHiddenFields();
  };

  window.applyEnrollmentStyle = applyEnrollmentStyle;
  window.applyReduceMotion = applyReduceMotion;
  window.applyHiddenFields = applyHiddenFields;
  apply();

  // Página nueva: sus atributos de <html> vienen sin preferencias y, si trae colecciones o un
  // panel lateral nuevo, sin colocar ni fijadas: sus scripts en línea no se repiten, pero sus
  // funciones siguen en window
  document.addEventListener('astro:after-swap', () => {
    apply();
    window.layoutCollections?.();
    window.applyPins?.();
  });
  systemReduce.addEventListener('change', applyReduceMotion);

  // Otra pestaña ha cambiado una preferencia: se aplica aquí también
  window.addEventListener('storage', apply);
}
