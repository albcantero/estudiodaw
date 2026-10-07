/**
 * @file Scrollbar propio en todos los scrolls de la web: la página, el panel lateral, "Mi
 * matrícula" y el código y las tablas de los apuntes.
 *
 * Por qué con JavaScript: el navegador no anima las partes de la barra nativa
 * (::-webkit-scrollbar), así que el thumb que se ensancha al acercarse tiene que ser un
 * elemento de verdad. El scroll sigue siendo el nativo (rueda, teclado, anclas, búsqueda):
 * aquí solo se pinta la barra.
 *
 * Por qué en una capa aparte: los thumbs no van dentro de cada zona con scroll, sino en una
 * capa fija sobre la página, colocados encima de su zona con getBoundingClientRect. Así sirve
 * para cualquier elemento sin cambiar su HTML (también el que sale del Markdown) y el thumb
 * no se desplaza con el contenido. Dentro de un <dialog> modal la capa quedaría tapada: ahí
 * la franja se cuelga del propio diálogo.
 *
 * Cada thumb (3 px) va en una franja de 8 px que recoge el ratón: al acercarse, el thumb se
 * ensancha a 6 px y se puede coger sin acertarle. La rueda sobre la franja se reenvía a la
 * zona y arrastrar el thumb la desplaza en proporción.
 *
 * Cada zona lleva barra en el eje en el que desborda de verdad. La de la página no va en el
 * borde de la pantalla sino en el del cuerpo de la web ([data-page-scrollbar]), y empieza
 * debajo de la barra fija de arriba ([data-scrollbar-header]). El pie ([data-scrollbar-footer])
 * no cuenta como contenido que recorrer: el thumb llega al final de su franja justo cuando el
 * pie empieza a asomar y, a partir de ahí, sube pegado justo encima de él, sin encoger (como el
 * panel lateral, que sube con el cuerpo al llegar al pie). La barra
 * nativa se oculta en CSS (styles/scroll.css), con el mismo selector, para que no asome antes
 * de este script.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { cssNumber } from './dom';

/** Zonas con scroll propio, además de la página. La misma lista está en styles/scroll.css. */
const SCROLLERS = '[data-scrollbar], .prose-notes :is(pre.astro-code, table)';
/** Elemento a cuyo borde derecho va la barra de la página (el cuerpo de la web) */
const PAGE_ANCHOR = '[data-page-scrollbar]';
/** Barras fijas de arriba: la de la página empieza debajo de la que se vea (escritorio o móvil) */
const PAGE_HEADERS = '[data-scrollbar-header]';
/** Pie de la web: la barra de la página no lo recorre ni lo pisa */
const PAGE_FOOTER = '[data-scrollbar-footer]';
/** Ancho de la franja que recoge el ratón, en px (--scrollbar-track, tokens.css) */
const TRACK = cssNumber(document.documentElement, '--scrollbar-track', 8);
/** Largo mínimo del thumb, para que siempre se pueda coger */
const MIN_THUMB = 20;
/** Hueco de la franja con el borde donde empieza la zona, en px */
const INSET_START = 2;
/** Hueco de la franja con el borde donde termina */
const INSET_END = 1;

type Axis = 'x' | 'y';

/** Franja y thumb de un eje */
interface Bar {
  track: HTMLElement;
  thumb: HTMLElement;
}

/** Barras de una zona y cuánto se saca su franja vertical hacia fuera (--scrollbar-offset) */
interface Scroller {
  bars: Record<Axis, Bar>;
  offset: number;
}

/** Rectángulo de pantalla, en px */
interface Box {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

/** Medidas de scroll de una zona */
interface Metrics {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
  scrollWidth: number;
  clientWidth: number;
  scrollLeft: number;
}

/** Lo que hay que pintar de una zona, medido antes de escribir nada */
interface Job {
  scroller: Scroller;
  container: HTMLElement;
  visible: Box;
  metrics: Metrics;
  overflowY: boolean;
  overflowX: boolean;
  /** Lo que tapa el pie del final de la franja vertical, en px (solo en la página) */
  footerCut: number;
}

const root = document.documentElement;

/**
 * Oculta una barra. La franja y el thumb dejan además de recoger el ratón: si no, seguirían
 * cazando clics, invisibles, encima del contenido.
 *
 * @param bar Barra.
 */
function hideBar({ track, thumb }: Bar): void {
  thumb.style.setProperty('opacity', '0');
  track.style.setProperty('pointer-events', 'none');
  thumb.style.setProperty('pointer-events', 'none');
}

/**
 * Arrastre del thumb: moverlo desplaza la zona en proporción a lo que el thumb puede recorrer.
 *
 * @param element Zona con scroll.
 * @param axis Eje.
 * @param bar Barra del thumb.
 * @param event Pulsación sobre el thumb.
 */
function startDrag(element: HTMLElement, axis: Axis, bar: Bar, event: PointerEvent): void {
  event.preventDefault();
  const { track, thumb } = bar;
  const horizontal = axis === 'x';
  const pointerStart = horizontal ? event.clientX : event.clientY;
  const scrollStart = horizontal ? element.scrollLeft : element.scrollTop;
  const maxScroll = horizontal
    ? element.scrollWidth - element.clientWidth
    : element.scrollHeight - element.clientHeight;
  const maxOffset = horizontal
    ? track.clientWidth - thumb.offsetWidth
    : track.clientHeight - thumb.offsetHeight;
  const scrollPerPixel = maxOffset > 0 ? maxScroll / maxOffset : 0;

  // El thumb se queda con el puntero (pointer capture): sigue recibiendo el movimiento aunque
  // salga de él, y se entera si se suelta o se cancela (cambio de ventana, lápiz)
  thumb.setPointerCapture(event.pointerId);
  const controller = new AbortController();
  const { signal } = controller;
  /**
   * Termina el arrastre: suelta el thumb, devuelve la selección de texto y deja de escuchar el
   * puntero.
   */
  const end = () => {
    thumb.removeAttribute('data-dragging');
    document.body.style.removeProperty('user-select');
    controller.abort();
  };

  thumb.addEventListener(
    'pointermove',
    (move) => {
      const distance = (horizontal ? move.clientX : move.clientY) - pointerStart;
      const target = scrollStart + distance * scrollPerPixel;
      element.scrollTo(horizontal ? { left: target } : { top: target });
    },
    { signal },
  );
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) =>
    thumb.addEventListener(type, end, { signal }),
  );

  thumb.setAttribute('data-dragging', '');
  // Mientras se arrastra no se selecciona texto por el camino
  document.body.style.setProperty('user-select', 'none');
}

/**
 * Crea la barra de un eje para una zona: franja con su thumb, la rueda reenviada y el
 * arrastre.
 *
 * @param element Zona con scroll.
 * @param axis Eje.
 * @returns La barra, con su franja y su thumb.
 */
function createBar(element: HTMLElement, axis: Axis): Bar {
  const track = document.createElement('div');
  track.className = axis === 'x' ? 'scrollbar scrollbar-x' : 'scrollbar';
  const thumb = document.createElement('div');
  thumb.className = 'scrollbar-thumb';
  track.append(thumb);
  const bar = { track, thumb };
  hideBar(bar);

  // La franja no es hija de la zona: la rueda encima de ella no la desplazaría, así que se
  // reenvía (y Lenis no la toca: data-lenis-prevent). Se cancela la de serie, que con la franja
  // en una capa sin scroll movería también la página. La de la página no se reenvía: la rueda
  // sobre cualquier elemento ya mueve la página, y reenviarla la movería dos veces.
  if (element !== root) {
    track.setAttribute('data-lenis-prevent', '');
    track.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        if (axis === 'x') element.scrollBy({ left: event.deltaX || event.deltaY });
        else element.scrollBy({ top: event.deltaY });
      },
      { passive: false },
    );
  }
  thumb.addEventListener('pointerdown', (event) => startDrag(element, axis, bar, event));
  return bar;
}

/**
 * Rectángulo de una zona en pantalla. La página va a lo alto desde debajo de la barra fija de
 * arriba hasta el final de la ventana; a lo ancho, ocupa el cuerpo de la web: su barra va
 * pegada a él y no al borde de la pantalla.
 *
 * @param element Zona con scroll.
 * @returns El rectángulo de la zona en pantalla.
 */
function boxOf(element: HTMLElement): Box {
  if (element !== root) return element.getBoundingClientRect();
  const anchor = document.querySelector(PAGE_ANCHOR)?.getBoundingClientRect();
  // La barra que se ve: la otra está oculta (display: none) y mide 0
  const header = [...document.querySelectorAll(PAGE_HEADERS)]
    .map((bar) => bar.getBoundingClientRect())
    .find((rect) => rect.height > 0);
  return {
    top: Math.max(0, header?.bottom ?? 0),
    left: anchor?.left ?? 0,
    bottom: window.innerHeight,
    right: anchor?.right ?? window.innerWidth,
  };
}

/**
 * Medidas de scroll de una zona. En la página no cuenta el pie: lo que se recorre acaba donde
 * él empieza, así el thumb llega abajo justo cuando asoma.
 *
 * @param element Zona con scroll.
 * @param footer Rectángulo del pie, si lo hay.
 * @returns Las medidas de scroll de la zona.
 */
function metricsOf(element: HTMLElement, footer: DOMRect | undefined): Metrics {
  const { scrollHeight, clientHeight, scrollTop, scrollWidth, clientWidth, scrollLeft } = element;
  if (element !== root || !footer) {
    return { scrollHeight, clientHeight, scrollTop, scrollWidth, clientWidth, scrollLeft };
  }
  const contentHeight = Math.max(clientHeight, scrollHeight - footer.height);
  return {
    scrollHeight: contentHeight,
    clientHeight,
    scrollTop: Math.min(scrollTop, contentHeight - clientHeight),
    scrollWidth,
    clientWidth,
    scrollLeft,
  };
}

/**
 * Coloca una barra sobre la parte visible de su zona, o la oculta si la zona no desborda.
 *
 * @param job Medidas de la zona.
 * @param axis Eje de la barra.
 * @param origin Esquina interior de lo que contiene la franja (la capa, en 0,0; un diálogo,
 *   donde empieza su contenido, ya sin el borde).
 */
function placeBar(job: Job, axis: Axis, origin: Box): void {
  const { scroller, container, visible, metrics } = job;
  const bar = scroller.bars[axis];
  const horizontal = axis === 'x';
  if (!(horizontal ? job.overflowX : job.overflowY)) {
    hideBar(bar);
    return;
  }
  if (bar.track.parentElement !== container) container.append(bar.track);

  // Con los dos ejes a la vez, cada franja deja libre la esquina de la otra
  const corner = (horizontal ? job.overflowY : job.overflowX) ? TRACK : 0;
  const span = horizontal ? visible.right - visible.left : visible.bottom - visible.top;
  const fullLength = Math.max(0, span - INSET_START - INSET_END - corner);
  const [client, total, scrolled] = horizontal
    ? [metrics.clientWidth, metrics.scrollWidth, metrics.scrollLeft]
    : [metrics.clientHeight, metrics.scrollHeight, metrics.scrollTop];
  const size = Math.max(MIN_THUMB, (client / total) * fullLength);
  const maxScroll = total - client;
  // Tamaño y recorrido, sobre la franja entera; luego el pie se come el final de la franja y el
  // thumb, que ya está abajo del todo, sube con él, justo encima
  const cut = horizontal ? 0 : job.footerCut;
  const length = fullLength - cut;
  const offset =
    (maxScroll > 0 ? (scrolled / maxScroll) * Math.max(0, fullLength - size) : 0) - cut;
  // Sin sitio para el thumb entero (el pie llena casi toda la ventana): mejor ninguno
  if (length < size) {
    hideBar(bar);
    return;
  }

  const top = horizontal ? visible.bottom - TRACK : visible.top + INSET_START;
  const left = horizontal ? visible.left + INSET_START : visible.right - TRACK + scroller.offset;
  const trackStyle = bar.track.style;
  trackStyle.setProperty('top', `${top - origin.top}px`);
  trackStyle.setProperty('left', `${left - origin.left}px`);
  trackStyle.setProperty(horizontal ? 'width' : 'height', `${length}px`);
  trackStyle.removeProperty('pointer-events');

  const thumbStyle = bar.thumb.style;
  thumbStyle.setProperty(horizontal ? 'width' : 'height', `${size}px`);
  thumbStyle.setProperty('transform', `translate${horizontal ? 'X' : 'Y'}(${offset}px)`);
  thumbStyle.setProperty('opacity', '1');
  thumbStyle.removeProperty('pointer-events');
}

/**
 * La capa con las barras de toda la web: lleva la cuenta de las zonas con scroll y las
 * vuelve a pintar cuando algo cambia, agrupado en un solo fotograma.
 */
class ScrollbarLayer {
  /** Capa fija con las franjas (las de los diálogos van en cada diálogo) */
  readonly #layer = document.createElement('div');

  readonly #scrollers = new Map<HTMLElement, Scroller>();

  /** Crecer o encoger el contenido no dispara ningún scroll: lo ve este observador */
  readonly #resizeObserver = new ResizeObserver(() => this.schedule());

  /** Lo que ya vigila el observador de tamaño (vigilarlo otra vez lo haría avisar de nuevo) */
  readonly #observed = new Set<Element>();

  #frame = 0;

  #rescanPending = false;

  constructor() {
    this.#layer.className = 'scrollbar-layer';
    this.#layer.setAttribute('aria-hidden', 'true');
  }

  /**
   * Pide pintar en el próximo fotograma; varias peticiones seguidas se juntan en una.
   *
   * @param rescan Buscar además zonas nuevas.
   */
  schedule(rescan = false): void {
    this.#rescanPending ||= rescan;
    if (this.#frame) return;
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      if (this.#rescanPending) {
        this.#rescanPending = false;
        this.#rescan();
      }
      this.#update();
    });
  }

  /** Empieza a vigilar las zonas, el scroll y el tamaño de la ventana. */
  start(): void {
    // Aparecen y desaparecen zonas al navegar, al abrir el diálogo o al plegar un grupo: se
    // busca de nuevo solo si entra o sale una zona (o algo que la contiene), o si se abre o se
    // cierra algo. El resto (contadores, tooltips, las propias franjas) no cuenta.
    /**
     * ¿Es una zona con scroll o contiene alguna?
     *
     * @param node Nodo que ha entrado o salido.
     * @returns Si es o contiene una zona con scroll.
     */
    const holdsZone = (node: Node): boolean =>
      node instanceof Element &&
      (node.matches(SCROLLERS) || node.querySelector(SCROLLERS) !== null);
    new MutationObserver((records) => {
      const relevant = records.some(
        (record) =>
          !this.#owns(record.target) &&
          (record.type === 'attributes' ||
            [...record.addedNodes, ...record.removedNodes].some(holdsZone)),
      );
      if (relevant) this.schedule(true);
    }).observe(root, { childList: true, subtree: true, attributeFilter: ['open'] });

    // El scroll no burbujea, pero se puede capturar en el documento: así se ven a la vez el
    // de cada zona y el de la página
    document.addEventListener('scroll', () => this.schedule(), { capture: true, passive: true });
    window.addEventListener('resize', () => this.schedule());
    document.addEventListener('astro:page-load', () => this.schedule(true));
  }

  /**
   * ¿Es un nodo de la propia capa o de una de sus franjas (también las de los diálogos)?
   *
   * @param node Nodo cambiado.
   * @returns Si el nodo es de la capa o de una franja.
   */
  #owns(node: Node): boolean {
    if (this.#layer.contains(node)) return true;
    return node instanceof Element && node.closest('.scrollbar') !== null;
  }

  /**
   * Dónde se cuelga la franja de una zona: su diálogo, si está dentro de uno; si no, la capa.
   *
   * @param element Zona con scroll.
   * @returns El contenedor de la franja.
   */
  #containerOf(element: HTMLElement): HTMLElement {
    return element.closest<HTMLElement>('dialog') ?? this.#layer;
  }

  /**
   * Prepara una zona nueva: sus dos barras y cuánto se saca la vertical (--scrollbar-offset,
   * registrada como longitud en styles/scroll.css, así que llega ya en px).
   *
   * @param element Zona con scroll.
   */
  #register(element: HTMLElement): void {
    const offset = cssNumber(element, '--scrollbar-offset');
    const bars = { x: createBar(element, 'x'), y: createBar(element, 'y') };
    this.#scrollers.set(element, { bars, offset });
  }

  /**
   * Lo que se vigila de una zona: ella y sus hijos directos. La zona sola no basta, porque su
   * caja no cambia cuando crece lo de dentro, solo su scrollHeight. De la página, el <body>.
   *
   * @param element Zona con scroll.
   * @returns Los elementos que se vigilan.
   */
  static #watchedOf(element: HTMLElement): Element[] {
    const observed = element === root ? document.body : element;
    return [observed, ...observed.children];
  }

  /**
   * Olvida una zona que ya no está en la página y quita sus barras.
   *
   * @param element Zona con scroll.
   */
  #unregister(element: HTMLElement): void {
    const scroller = this.#scrollers.get(element);
    scroller?.bars.x.track.remove();
    scroller?.bars.y.track.remove();
    this.#scrollers.delete(element);
    ScrollbarLayer.#watchedOf(element).forEach((target) => {
      this.#resizeObserver.unobserve(target);
      this.#observed.delete(target);
    });
  }

  /** Busca zonas nuevas y olvida las que se han ido (cambio de página, diálogo cerrado). */
  #rescan(): void {
    // Al cambiar de página se cambia el <body> entero, y con él se iría la capa
    if (!this.#layer.isConnected) document.body.append(this.#layer);

    [...this.#scrollers.keys()].forEach((element) => {
      const gone = !element.isConnected || !element.matches(SCROLLERS);
      if (element !== root && gone) this.#unregister(element);
    });
    [root, ...document.querySelectorAll<HTMLElement>(SCROLLERS)].forEach((element) => {
      if (!this.#scrollers.has(element)) this.#register(element);
    });

    // Solo lo que aún no se vigilaba (al cambiar de página, el <body> y sus hijos son nuevos)
    this.#scrollers.forEach((_, element) => {
      ScrollbarLayer.#watchedOf(element).forEach((target) => {
        if (this.#observed.has(target)) return;
        this.#observed.add(target);
        this.#resizeObserver.observe(target);
      });
    });
  }

  /**
   * Mide todas las zonas y luego coloca sus barras. Primero todas las lecturas y después
   * todas las escrituras: intercalarlas obligaría al navegador a recalcular la página en cada
   * zona.
   */
  #update(): void {
    const viewport = { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth };
    const boxes = new Map([...this.#scrollers.keys()].map((element) => [element, boxOf(element)]));
    const footer = document.querySelector(PAGE_FOOTER)?.getBoundingClientRect();

    const jobs = [...this.#scrollers].map(([element, scroller]): Job => {
      const box = boxes.get(element) ?? viewport;
      // Parte visible: la zona recortada por la ventana y por las zonas con scroll que la
      // contienen (una tabla ancha a medio desplazar no saca su barra fuera de la página)
      const visible = {
        top: Math.max(box.top, 0),
        left: Math.max(box.left, 0),
        bottom: Math.min(box.bottom, viewport.bottom),
        right: Math.min(box.right, viewport.right),
      };
      boxes.forEach((other, otherElement) => {
        if (otherElement === element || otherElement === root) return;
        if (!otherElement.contains(element)) return;
        visible.top = Math.max(visible.top, other.top);
        visible.left = Math.max(visible.left, other.left);
        visible.bottom = Math.min(visible.bottom, other.bottom);
        visible.right = Math.min(visible.right, other.right);
      });
      // Tamaño 0: oculta (el panel en móvil, un diálogo cerrado)
      const shown =
        box.bottom > box.top && visible.bottom > visible.top && visible.right > visible.left;
      const metrics = metricsOf(element, footer);
      const isPage = element === root;
      return {
        scroller,
        container: this.#containerOf(element),
        visible,
        metrics,
        overflowY: shown && metrics.scrollHeight > metrics.clientHeight + 1,
        overflowX: shown && metrics.scrollWidth > metrics.clientWidth + 1,
        footerCut: isPage && footer ? Math.max(0, viewport.bottom - footer.top) : 0,
      };
    });

    // Esquina interior de cada contenedor (sin su borde), medida aquí, con las demás lecturas
    const origins = new Map(
      jobs.map(({ container }): [HTMLElement, Box] => {
        if (container === this.#layer) return [container, viewport];
        const rect = container.getBoundingClientRect();
        const top = rect.top + container.clientTop;
        const left = rect.left + container.clientLeft;
        return [container, { top, left, bottom: rect.bottom, right: rect.right }];
      }),
    );
    jobs.forEach((job) => {
      const origin = origins.get(job.container) ?? viewport;
      placeBar(job, 'y', origin);
      placeBar(job, 'x', origin);
    });
  }
}

// En pantallas táctiles se queda la barra nativa: ya es fina, sale al hacer scroll y con el
// dedo no se arrastra. La misma condición oculta la nativa en styles/scroll.css.
if (window.matchMedia('(pointer: fine)').matches) new ScrollbarLayer().start();
