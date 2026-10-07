/**
 * @file Giro de páginas del libro de Apuntes (assets/iso/notes.svg): cada hoja gira de verdad, en
 * 3D, alrededor del lomo. En cada fotograma se recalcula la proyección isométrica de la hoja (sin
 * transformaciones CSS) desde casi tumbada sobre la página derecha hasta su ángulo en el abanico;
 * al acabar, vuelve al trazado exacto del SVG, con sus arcos. Después, cada hoja se queda
 * meciéndose un pelín alrededor del lomo, a su compás: el equivalente del flotado de las otras
 * ilustraciones. Cada una empieza a mecerse en cuanto acaba su giro, sin esperar a las demás: si
 * esperaba a la última, la primera se quedaba quieta casi un segundo (el parón que se notaba).
 *
 * Los datos los trae el propio SVG: el grupo de las hojas ([data-layer="pages"]) dice dónde está
 * el lomo (data-hinge, x,y,z) y cuánto miden las hojas (data-h, data-w y el radio de sus esquinas,
 * data-r); cada hoja, su ángulo final (data-angle); su contorno lleva data-sheet y cada línea de
 * texto, dónde va en la hoja (data-line: a lo largo del lomo, y de dónde a dónde a lo ancho).
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Orden en que se pasan las hojas, por su ángulo: la primera es la que más recorre */
const ORDER = [146, 104, 62, 28];
/** Lo que tarda en girar cada hoja y la separación entre una y la siguiente, en ms */
const TURN_MS = 1100;
/** Desde qué parte del giro de una hoja aparecen sus líneas de texto (0 a 1) */
const LINES_FROM = 0.6;
/** Cuándo empiezan a verse las primeras líneas, desde que empieza a pasar páginas, en ms */
export const FIRST_LINES_MS = TURN_MS * LINES_FROM;
const TURN_GAP = 260;
/** Ángulo del que salen: casi tumbadas sobre la página derecha, en grados */
const FROM_DEG = 6;

/**
     El vaivén de después: cuánto se mece cada hoja (grados a cada lado), lo que dura un vaivén,
    el desfase entre una hoja y la siguiente (en vueltas) y lo que tarda en crecer al empezar (con
    salida rápida: la hoja sigue moviéndose desde el primer fotograma tras su giro)
 */
const SWAY_DEG = 3;
const SWAY_MS = 3600;
const SWAY_PHASE = 0.18;
const SWAY_EASE_IN_MS = 1200;

/** Proyección isométrica: x e y en el suelo y z hacia arriba */
const COS_30 = Math.cos(Math.PI / 6);
/**
 * Proyecta un punto del espacio en el plano de la ilustración, en isométrica.
 *
 * @param x Coordenada x, en el suelo.
 * @param y Coordenada y, en el suelo.
 * @param z Altura.
 * @returns Las coordenadas del punto en el SVG.
 */
const project = (x: number, y: number, z: number): [number, number] => [
  (x - y) * COS_30,
  (x + y) / 2 - z,
];

/**
 * Número con dos decimales, para escribirlo en un trazado.
 *
 * @param n Número.
 * @returns El número como texto.
 */
const format = (n: number): string => n.toFixed(2);

/**
 * Curva de salida suave: arranca rápido y frena al final.
 *
 * @param t Avance, de 0 a 1.
 * @returns El avance con la curva aplicada, de 0 a 1.
 */
const easeOut = (t: number): number => 1 - (1 - t) ** 3;
/**
 * Curva de entrada y salida suaves: arranca y frena despacio.
 *
 * @param t Avance, de 0 a 1.
 * @returns El avance con la curva aplicada, de 0 a 1.
 */
const easeInOut = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Una hoja: su grupo, su ángulo final, su contorno y sus líneas, con sus trazados exactos */
interface Page {
  group: SVGGElement;
  angle: number;
  sheet: SVGPathElement;
  sheetPath: string;
  lines: { path: SVGPathElement; place: number[]; d: string }[];
}

/** Mando del giro de páginas: pararlo del todo, o pausarlo y seguir donde iba */
export interface FlipControl {
  /** Lo para (también el vaivén) y deja el abanico como en el SVG */
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

/** Mando de un libro sin hojas que pasar: no hace nada */
const NO_FLIP: FlipControl = { stop: () => {}, pause: () => {}, resume: () => {} };

/**
 * Pasa las páginas del libro.
 *
 * @param svg El SVG del libro, ya en la página.
 * @param startDelay Cuándo empieza, en ms.
 * @param onDone Lo que se hace al acabar.
 * @returns Su mando.
 */
export function flipPages(svg: SVGSVGElement, startDelay: number, onDone: () => void): FlipControl {
  const root = svg.querySelector<SVGGElement>('[data-layer="pages"][data-hinge]');
  if (!root) return NO_FLIP;
  const [hx, hy, hz] = (root.dataset.hinge ?? '0,0,0').split(',').map(Number);
  const height = Number(root.dataset.h);
  const width = Number(root.dataset.w);
  const radius = Number(root.dataset.r);

  const pages: Page[] = [...root.querySelectorAll<SVGGElement>('[data-angle]')].flatMap((group) => {
    const sheet = group.querySelector<SVGPathElement>('[data-sheet]');
    if (!sheet) return [];
    return [
      {
        group,
        angle: Number(group.dataset.angle),
        sheet,
        sheetPath: sheet.getAttribute('d') ?? '',
        lines: [...group.querySelectorAll<SVGPathElement>('[data-line]')].map((path) => ({
          path,
          place: (path.dataset.line ?? '').split(',').map(Number),
          d: path.getAttribute('d') ?? '',
        })),
      },
    ];
  });

  /**
   * Dibuja una hoja girada un ángulo.
   *
   * @param page Hoja.
   * @param degrees Ángulo, en grados.
   */
  function shape(page: Page, degrees: number): void {
    const radians = (degrees * Math.PI) / 180;
    const vx = Math.cos(radians);
    const vz = Math.sin(radians);
    // a: a lo largo del lomo; b: a lo ancho de la hoja
    /**
     * Punto de la hoja, proyectado: a lo largo del lomo y a lo ancho de la hoja.
     *
     * @param a Distancia a lo largo del lomo.
     * @param b Distancia a lo ancho, desde el lomo.
     * @returns Las coordenadas del punto en el SVG.
     */
    const point = (a: number, b: number) => project(hx + b * vx, hy + a, hz + b * vz);
    const points = [point(0, 0), point(height, 0), point(height, width - radius)];
    /**
     * Añade al contorno los puntos de una esquina redondeada.
     *
     * @param ca Centro de la esquina, a lo largo del lomo.
     * @param cb Centro de la esquina, a lo ancho.
     * @param from Ángulo inicial, en grados.
     * @param to Ángulo final, en grados.
     */
    const arc = (ca: number, cb: number, from: number, to: number) => {
      Array.from({ length: 10 }, (_, step) => step + 1).forEach((step) => {
        const angle = ((from + ((to - from) * step) / 10) * Math.PI) / 180;
        points.push(point(ca + radius * Math.cos(angle), cb + radius * Math.sin(angle)));
      });
    };
    arc(height - radius, width - radius, 0, 90);
    points.push(point(radius, width));
    arc(radius, width - radius, 90, 180);
    page.sheet.setAttribute(
      'd',
      `M${points.map(([x, y]) => `${format(x)} ${format(y)}`).join('L')}Z`,
    );
    page.lines.forEach(({ path, place: [a, b0, b1] }) => {
      const [sx, sy] = point(a, b0);
      const [ex, ey] = point(a, b1);
      path.setAttribute('d', `M${format(sx)} ${format(sy)}L${format(ex)} ${format(ey)}`);
    });
  }

  pages.forEach((page) => {
    page.group.style.setProperty('opacity', '0');
    shape(page, FROM_DEG);
  });
  root.style.setProperty('opacity', '1');

  /** Cuándo acabó de girar cada hoja (empieza a mecerse desde ahí) */
  const settledAt = new Map<Page, number>();
  let frame = 0;
  let start: number | null = null;
  let finished = false;
  /** Cuándo se pausó, si lo está */
  let pausedAt: number | null = null;

  /**
   * El vaivén de una hoja ya colocada: oscila alrededor de su ángulo, desfasada de la anterior.
   * Crece desde su propio final de giro, con salida rápida, así no hay salto ni parón.
   *
   * @param page Hoja.
   * @param now Ahora.
   */
  function sway(page: Page, now: number): void {
    const amount = easeOut(Math.min(1, (now - settledAt.get(page)!) / SWAY_EASE_IN_MS));
    const turn = (now - start!) / SWAY_MS + ORDER.indexOf(page.angle) * SWAY_PHASE;
    shape(page, page.angle + SWAY_DEG * amount * Math.sin(turn * 2 * Math.PI));
  }

  /**
   * Un fotograma: gira las hojas que aún no han llegado y mece las que ya están en su sitio.
   *
   * @param now Momento del fotograma (requestAnimationFrame).
   */
  const step = (now: number) => {
    start ??= now + startDelay;
    pages.forEach((page) => {
      if (settledAt.has(page)) {
        sway(page, now);
        return;
      }
      const order = ORDER.indexOf(page.angle);
      const progress = Math.min(1, Math.max(0, (now - start! - order * TURN_GAP) / TURN_MS));
      if (progress <= 0) return;
      page.group.style.setProperty('opacity', String(Math.min(1, progress * 6)));
      if (progress >= 1) {
        // Al acabar, el trazado exacto del SVG (con sus arcos); desde aquí, a mecerse
        settledAt.set(page, now);
        page.sheet.setAttribute('d', page.sheetPath);
        page.lines.forEach(({ path, d }) => path.setAttribute('d', d));
      } else {
        const eased = easeInOut(easeOut(progress) * 0.35 + progress * 0.65);
        shape(page, FROM_DEG + (page.angle - FROM_DEG) * eased);
      }
      // Las líneas de texto aparecen en el último tramo del giro
      page.lines.forEach(({ path }) =>
        path.style.setProperty(
          'opacity',
          String(Math.max(0, (progress - LINES_FROM) / (1 - LINES_FROM))),
        ),
      );
    });
    if (!finished && settledAt.size === pages.length) {
      finished = true;
      onDone();
    }
    frame = requestAnimationFrame(step);
  };

  frame = requestAnimationFrame(step);

  /** Pausa: se para el bucle y se guarda cuándo */
  const pause = () => {
    if (pausedAt !== null) return;
    pausedAt = performance.now();
    cancelAnimationFrame(frame);
  };

  /** Sigue: el tiempo pausado no cuenta, así continúa donde iba */
  const resume = () => {
    if (pausedAt === null) return;
    const paused = performance.now() - pausedAt;
    pausedAt = null;
    if (start !== null) start += paused;
    settledAt.forEach((at, page) => settledAt.set(page, at + paused));
    frame = requestAnimationFrame(step);
  };

  /**
   * Lo para del todo y deja el abanico como en el SVG.
   */
  const stop = () => {
    cancelAnimationFrame(frame);
    root.style.removeProperty('opacity');
    pages.forEach((page) => {
      page.group.style.removeProperty('opacity');
      page.sheet.setAttribute('d', page.sheetPath);
      page.lines.forEach(({ path, d }) => {
        path.setAttribute('d', d);
        path.style.removeProperty('opacity');
      });
    });
  };

  return { stop, pause, resume };
}
