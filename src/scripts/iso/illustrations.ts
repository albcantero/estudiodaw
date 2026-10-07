/**
 * @file Entrada de las ilustraciones isométricas (IsoIllustration): cada
 * capa (los <g> de primer nivel) sube con un fundido, una detrás de otra; sus contornos
 * ([data-draw]) se dibujan y sus caras se rellenan por detrás; al acabar, algunas piezas siguen en
 * movimiento (flotan o parpadean).
 *
 * Cada ilustración tiene su ritmo (CONFIG, por data-iso). Algunas, además, tienen su escena: el
 * libro de Apuntes pasa sus páginas (flip-pages.ts) mientras se forma. Las de la portada se
 * animan una vez, cuando se ven por primera vez; la del estado vacío, cada vez que aparece.
 *
 * Fuera de la pantalla o con un diálogo abierto encima se pausan (no gastan nada) y siguen donde
 * iban al volver. Con reducir
 * movimiento (del sistema o de los ajustes) no se animan: se quedan quietas y enteras, también si
 * se activa con la página abierta; al quitarlo, se animan otra vez cuando se vean.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { MODAL_EVENT, isModalOpen } from '../modal';
import { onReducedMotionChange, prefersReducedMotion } from '../motion';
import { lowerLoad } from './crane-load';
import { FIRST_LINES_MS, flipPages, type FlipControl } from './flip-pages';

/** Curva de la entrada: arranca rápido y frena largo (expo-out) */
const EASE = 'cubic-bezier(.16, 1, .3, 1)';

/**
 * Curva del flotado: la del seno (easeInOutSine), un vaivén puro que frena y arranca poco a poco
 * en cada extremo. Va en cada tramo (cada fotograma clave), no en la animación entera: ahí se
 * aplica al ciclo completo y cada tramo iba en línea recta, con un frenazo arriba.
 */
const FLOAT_EASE = 'cubic-bezier(0.37, 0, 0.63, 1)';

/**
 * Cuándo empieza a flotar una pieza, en proporción de su entrada: al 30 %, mientras aún sube. La
 * entrada frena casi hasta pararse (expo-out) y el flotado arranca desde parado (seno): si el
 * flotado empieza tarde, las dos frenadas se juntan y la pieza se queda casi quieta medio
 * segundo (medido: 3-4 px/s durante 600 ms con 0,5). Al 30 % se solapan y no hay bache.
 */
const FLOAT_FROM = 0.3;

/**
 * Crea una animación de la entrada, con su curva. Sostiene el primer fotograma mientras espera
 * (fill: backwards) pero no el último: el último es el estado de serie del SVG (opacidad entera,
 * en su sitio, trazo y caras completos), así que al acabar la animación se suelta y no queda viva.
 */
type Animator = (
  element: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) => void;

/** Ritmo de una ilustración: tiempos en ms y desplazamientos en px */
interface IsoConfig {
  /** Entre una capa y la siguiente */
  layerStep: number;
  /** Lo que tarda una capa en subir y aparecer */
  riseMs: number;
  /** Lo que sube cada capa al entrar, según su nombre */
  rise: (layer: string) => number;
  /** Lo que tarda en dibujarse un contorno y la separación entre los de una capa */
  drawMs: number;
  drawStep: number;
  /** Cuándo se rellenan las caras (tras empezar su capa) y lo que tardan */
  fillDelay: number;
  fillMs: number;
  /**
   * Lo que sigue en movimiento al acabar la entrada; floatAt dice cuándo puede empezar cada pieza
   * (FLOAT_FROM de su entrada) y end, cuándo acaba la entrada entera
   */
  idle: (layers: Map<string, Element>, floatAt: (name: string) => number, end: number) => void;
  /** Se repite cada vez que aparece (si no, una sola vez) */
  replay: boolean;
  /** Capas que no entran con las demás: las saca su escena */
  held?: string[];
  /** Escena propia, para las capas apartadas (held), a la vez que la entrada. Devuelve su mando. */
  sequel?: (svg: SVGSVGElement, layers: Map<string, Element>, animate: Animator) => FlipControl;
}

/**
 * Vaivén vertical sin fin, para una pieza que flota. Se suma (composite: add) a su entrada: puede
 * empezar antes de que acabe de llegar sin pisarla.
 *
 * @param element Pieza.
 * @param lift Lo que sube, en px.
 * @param duration Lo que dura un vaivén.
 * @param delay Cuándo empieza.
 * @returns La animación del vaivén.
 */
const float = (element: Element, lift: number, duration: number, delay: number): Animation =>
  element.animate(
    [
      { transform: 'translateY(0)', easing: FLOAT_EASE },
      { transform: `translateY(-${lift}px)`, easing: FLOAT_EASE },
      { transform: 'translateY(0)' },
    ],
    { duration, delay, iterations: Infinity, composite: 'add' },
  );

/** Lo que sube una pieza suelta al flotar y lo que dura su vaivén */
const FLOAT_LIFT = 12;
const FLOAT_MS = 3200;

/** El ritmo de las de la portada, sin nada que siga en movimiento: cada una pone lo suyo */
const BASE: IsoConfig = {
  layerStep: 140,
  riseMs: 1000,
  rise: (layer) => (/guide|connector/.test(layer) ? 0 : 28),
  drawMs: 900,
  drawStep: 20,
  fillDelay: 250,
  fillMs: 500,
  idle: () => {},
  replay: false,
};

/** Calendario: flota la tarjeta del evento */
const CALENDAR: IsoConfig = {
  ...BASE,
  idle: (layers, floatAt) => {
    const card = layers.get('card');
    if (card) float(card, FLOAT_LIFT, FLOAT_MS, floatAt('card'));
  },
};

/** Capas del libro que esperan a que se pasen las páginas: el texto de las dos y el lápiz */
const BOOK_CONTENT = ['left-page', 'right-page', 'pencil'];

/** Cuándo empieza a pasar páginas: con el libro aún formándose, que ya casi ha llegado */
const FLIP_DELAY = 350;

/**
 * El texto de las páginas: cada línea sube un poco al aparecer, lo que tarda, la separación entre
 * líneas y entre las dos páginas
 */
const LINE_RISE_PX = 3;
const LINE_MS = 500;
const LINE_STEP = 45;
const PAGE_STEP = 120;

/** El lápiz: baja desde un poco más arriba, lo que tarda y cuánto espera (se posa el último) */
const PENCIL_DROP_PX = 16;
const PENCIL_MS = 700;
const PENCIL_DELAY = 650;

/**
 * Enseña el texto de las páginas, línea a línea, y posa el lápiz encima, el último.
 *
 * @param layers Capas del libro.
 * @param animate Animador de la entrada.
 * @param at Cuándo empieza, en ms.
 */
function revealBookContent(layers: Map<string, Element>, animate: Animator, at: number): void {
  BOOK_CONTENT.forEach((name, groupIndex) => {
    const layer = layers.get(name);
    if (!(layer instanceof SVGGElement)) return;
    layer.style.removeProperty('opacity');
    if (name === 'pencil') {
      animate(
        layer,
        [
          { opacity: 0, transform: `translateY(-${PENCIL_DROP_PX}px)` },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: PENCIL_MS, delay: at + PENCIL_DELAY },
      );
      return;
    }
    [...layer.children].forEach((element, index) =>
      animate(
        element,
        [
          { opacity: 0, transform: `translateY(${LINE_RISE_PX}px)` },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: LINE_MS, delay: at + groupIndex * PAGE_STEP + index * LINE_STEP },
      ),
    );
  });
}

/**
 * El libro de Apuntes: pasa sus páginas a la vez que se forma, no después, y el texto de las
 * páginas y el lápiz aparecen con las primeras líneas de las hojas. En serie, la animación entera
 * se hacía larga.
 */
const BOOK: IsoConfig = {
  ...BASE,
  held: ['pages', ...BOOK_CONTENT],
  sequel: (svg, layers, animate) => {
    revealBookContent(layers, animate, FLIP_DELAY + FIRST_LINES_MS);
    return flipPages(svg, FLIP_DELAY, () => {});
  },
};

/** La del estado vacío: la lupa flota y el cursor del buscador parpadea */
const EMPTY: IsoConfig = {
  layerStep: 110,
  riseMs: 900,
  rise: (layer) => ({ guide: 0, magnifier: 18 })[layer] ?? 10,
  drawMs: 800,
  drawStep: 20,
  fillDelay: 200,
  fillMs: 400,
  idle: (layers, floatAt, end) => {
    const magnifier = layers.get('magnifier');
    if (magnifier) float(magnifier, 5, 3000, floatAt('magnifier'));
    layers
      .get('caret')
      ?.animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }],
        { duration: 1060, delay: end, iterations: Infinity },
      );
  },
  replay: true,
};

/** Tarjetas grandes del dock de Código, de atrás adelante */
const DOCK_CARDS = ['browser', 'terminal', 'editor'];

/**
 * El dock de Código: flotan el popover y también las tres tarjetas grandes. Ellas, algo menos y
 * cada una con su ritmo y desfasada, para que no suban y bajen a la vez como un bloque.
 */
/** Las tarjetas grandes flotan menos que una pieza suelta y más despacio, cada una un poco más */
const DOCK_LIFT = 8;
const DOCK_MS = 3600;
const DOCK_STEP = 400;

const CODE: IsoConfig = {
  ...BASE,
  idle: (layers, floatAt) => {
    const popover = layers.get('popover');
    if (popover) float(popover, FLOAT_LIFT, FLOAT_MS, floatAt('popover'));
    DOCK_CARDS.forEach((name, index) => {
      const card = layers.get(name);
      if (card) float(card, DOCK_LIFT, DOCK_MS + index * DOCK_STEP, floatAt(name));
    });
  },
};

/**
 * La obra del aviso de desarrollo (layout/DevNotice): va quieta (data-iso-still), ya montada al
 * aparecer la tarjeta, y solo se mece la carga de la grúa.
 */
const CONSTRUCTION: IsoConfig = {
  ...BASE,
  sequel: (_svg, layers) => lowerLoad(layers, 0, false),
};

/** Ritmo de cada ilustración, por su nombre (data-iso); las demás, el de base */
const CONFIG: Record<string, IsoConfig> = {
  notes: BOOK,
  calendar: CALENDAR,
  code: CODE,
  'empty-search': EMPTY,
  construction: CONSTRUCTION,
};

/** El mando de la escena en marcha de cada ilustración */
const sequels = new WeakMap<Element, FlipControl>();

/** Las ilustraciones de la página */
const isos = new Set<HTMLElement>();

/**
 * Para una ilustración del todo y la deja entera y quieta, como sin animar.
 *
 * @param iso Envoltorio ([data-iso]).
 */
function stop(iso: HTMLElement): void {
  iso
    .querySelector('svg')
    ?.getAnimations({ subtree: true })
    .forEach((animation) => animation.cancel());
  sequels.get(iso)?.stop();
  sequels.delete(iso);
  iso
    .querySelectorAll<SVGGElement>('svg > g')
    .forEach((layer) => layer.style.removeProperty('opacity'));
  iso.removeAttribute('data-iso-played');
}

/**
 * Pausa o sigue una ilustración (al salir o volver a la pantalla).
 *
 * @param iso Envoltorio ([data-iso]).
 * @param running Seguir (true) o pausar (false).
 */
function setRunning(iso: HTMLElement, running: boolean): void {
  iso
    .querySelector('svg')
    ?.getAnimations({ subtree: true })
    .forEach((animation) => {
      // Solo las que van o iban: play() en una ya terminada la volvería a empezar
      if (running && animation.playState === 'paused') animation.play();
      else if (!running && animation.playState === 'running') animation.pause();
    });
  const sequel = sequels.get(iso);
  if (running) sequel?.resume();
  else sequel?.pause();
}

/**
 * Anima una ilustración desde el principio (lo que tuviera en marcha se cancela).
 *
 * @param iso Envoltorio ([data-iso]).
 * @param config Su ritmo.
 */
function play(iso: HTMLElement, config: IsoConfig): void {
  const svg = iso.querySelector('svg');
  if (!svg) return;
  stop(iso);

  const all = [...svg.children].filter((node): node is SVGGElement => node.tagName === 'g');
  const named = new Map(all.map((layer) => [layer.getAttribute('data-layer') ?? '', layer]));
  // Quieta (data-iso-still): ya montada, sin entrada; solo lo que sigue en movimiento
  const still = iso.hasAttribute('data-iso-still');
  const held = new Set(still ? [] : (config.held ?? []));
  // Las apartadas, escondidas antes de dejar ver la ilustración (data-iso-played)
  held.forEach((name) => named.get(name)?.style.setProperty('opacity', '0'));
  iso.setAttribute('data-iso-played', '');

  /**
   * Anima una pieza de la entrada con la curva común y sosteniendo su primer fotograma.
   *
   * @param element Pieza.
   * @param keyframes Fotogramas clave.
   * @param options Duración, retraso y lo demás.
   */
  const animate: Animator = (element, keyframes, options) => {
    element.animate(keyframes, { fill: 'backwards', easing: EASE, ...options });
  };
  const layers = all.filter((layer) => !held.has(layer.getAttribute('data-layer') ?? ''));
  // Los trazos no escalan (vector-effect): su largo se mide en px de pantalla
  const scale = svg.getScreenCTM()?.a ?? 1;

  (still ? [] : layers).forEach((layer, index) => {
    const start = index * config.layerStep;
    const lift = config.rise(layer.getAttribute('data-layer') ?? '');
    animate(
      layer,
      [
        { opacity: 0, transform: `translateY(${lift}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: config.riseMs, delay: start },
    );
    layer.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach((path, order) => {
      const length = path.getTotalLength() * scale + 2;
      const dash = `${length} ${length}`;
      animate(
        path,
        [
          { strokeDasharray: dash, strokeDashoffset: length },
          { strokeDasharray: dash, strokeDashoffset: 0 },
        ],
        { duration: config.drawMs, delay: start + order * config.drawStep },
      );
    });
    layer.querySelectorAll('.face, .side').forEach((face) => {
      animate(face, [{ fillOpacity: 0 }, { fillOpacity: 1 }], {
        duration: config.fillMs,
        delay: start + config.fillDelay,
      });
    });
  });

  const end = still ? 0 : layers.length * config.layerStep + config.riseMs;
  const entranceOrder = layers.map((layer) => layer.getAttribute('data-layer') ?? '');
  /**
   * Cuándo puede empezar a flotar una pieza: a una parte de su entrada (FLOAT_FROM).
   *
   * @param name Nombre de la capa.
   * @returns El momento, en ms desde el principio.
   */
  const floatAt = (name: string): number => {
    const index = entranceOrder.indexOf(name);
    if (still) return 0;
    return index < 0 ? end : index * config.layerStep + config.riseMs * FLOAT_FROM;
  };
  config.idle(named, floatAt, end);
  if (config.sequel) sequels.set(iso, config.sequel(svg, named, animate));
}

/**
 * Ritmo de una ilustración, por su nombre (data-iso).
 *
 * @param iso Envoltorio ([data-iso]).
 * @returns Su ritmo, o el de base.
 */
const configOf = (iso: HTMLElement): IsoConfig => CONFIG[iso.dataset.iso ?? ''] ?? BASE;

/** Anima cada ilustración cuando se ve: una vez, o cada vez si se repite */
const starter = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const iso = entry.target as HTMLElement;
      const config = configOf(iso);
      if (!config.replay) starter.unobserve(iso);
      play(iso, config);
    });
  },
  { threshold: 0.4 },
);

/** Pausa lo que sale de la pantalla y sigue lo que vuelve */
/** Ilustraciones que se ven en pantalla */
const visible = new Set<HTMLElement>();

/**
 * Pausa o sigue una ilustración ya animada: va solo si se ve y no hay un diálogo abierto encima.
 *
 * @param iso Envoltorio ([data-iso]).
 */
const syncRunning = (iso: HTMLElement): void => {
  if (iso.hasAttribute('data-iso-played')) setRunning(iso, visible.has(iso) && !isModalOpen());
};

const pauser = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const iso = entry.target as HTMLElement;
    if (entry.isIntersecting) visible.add(iso);
    else visible.delete(iso);
    syncRunning(iso);
  });
});

// Un diálogo abierto encima pausa las de la página; al cerrarlo siguen (scripts/modal.ts)
document.addEventListener(MODAL_EVENT, () => isos.forEach(syncRunning));

/**
 * Empieza a vigilar una ilustración para animarla al verse.
 *
 * @param iso Envoltorio ([data-iso]).
 */
const watch = (iso: HTMLElement): void => {
  if (prefersReducedMotion()) return;
  // Quieta: sin entrada que esperar, se pone en marcha ya (la pausa mientras no se ve, pauser)
  if (iso.hasAttribute('data-iso-still')) play(iso, configOf(iso));
  else starter.observe(iso);
};

document.addEventListener('astro:page-load', () => {
  // Las de la página anterior ya no están: se sueltan
  isos.forEach((iso) => {
    if (iso.isConnected) return;
    starter.unobserve(iso);
    pauser.unobserve(iso);
    visible.delete(iso);
    isos.delete(iso);
  });
  document.querySelectorAll<HTMLElement>('[data-iso]').forEach((iso) => {
    if (isos.has(iso)) return;
    isos.add(iso);
    pauser.observe(iso);
    watch(iso);
  });
});

// Reducir movimiento cambia con la página abierta (ajustes, sistema u otra pestaña): se paran
// todas, enteras; al quitarlo, se vuelven a animar cuando se vean
onReducedMotionChange(() => {
  isos.forEach((iso) => {
    if (prefersReducedMotion()) {
      starter.unobserve(iso);
      stop(iso);
    } else if (!iso.hasAttribute('data-iso-played')) {
      watch(iso);
    }
  });
});
