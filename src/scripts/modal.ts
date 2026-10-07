/**
 * @file Diálogos modales abiertos ("Mi matrícula", iniciar sesión): mientras hay uno, la web de
 * detrás se queda en pausa. Una sola señal para todos: html[data-modal-open], que bloquea el scroll
 * y pausa las animaciones de CSS (layout.css), y el evento MODAL_EVENT, para lo que se anima con
 * JavaScript (el scroll suave, las ilustraciones).
 *
 * Se vigila el atributo open de los <dialog>, así vale para cualquier diálogo sin tocar su código.
 * El <html> se conserva entre páginas (ClientRouter): se vigila una vez para toda la visita.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Evento en document al abrirse o cerrarse un diálogo modal: detail.open */
export const MODAL_EVENT = 'estudiodaw:modal';

/** Datos del evento */
export interface ModalDetail {
  open: boolean;
}

/**
 * ¿Hay un diálogo modal abierto?
 *
 * @returns Si hay alguno abierto.
 */
export const isModalOpen = (): boolean => document.querySelector('dialog:modal') !== null;

/** Estado anunciado la última vez: solo se avisa cuando cambia */
let announced = false;

/**
 * Redondea una medida en px de CSS al píxel real de la pantalla más cercano.
 *
 * @param value Medida en px de CSS.
 * @returns La medida, redondeada.
 */
const toDevicePixel = (value: number): number =>
  Math.round(value * window.devicePixelRatio) / window.devicePixelRatio;

/**
 * Centra un diálogo abierto en un píxel entero de la pantalla. Centrado con CSS (margin: auto)
 * cae a menudo a medio píxel real (con zoom o escala de Windows, devicePixelRatio 1,25, 1,375…),
 * y lo que se repinta dentro por su cuenta, como el fondo de un botón al pasar el ratón, se
 * redondea hacia otro lado: la caja del botón "subía" medio píxel y su texto no.
 *
 * @param dialog Diálogo abierto.
 */
function snap(dialog: HTMLDialogElement): void {
  const { offsetWidth: width, offsetHeight: height } = dialog;
  dialog.style.setProperty('margin', '0');
  dialog.style.setProperty('left', `${toDevicePixel((window.innerWidth - width) / 2)}px`);
  dialog.style.setProperty('top', `${toDevicePixel((window.innerHeight - height) / 2)}px`);
}

/** Vuelve a centrar los diálogos abiertos (cambia su tamaño o el de la ventana) */
const snapOpen = (): void => {
  document.querySelectorAll<HTMLDialogElement>('dialog:modal').forEach(snap);
};

const resizes = new ResizeObserver(snapOpen);
window.addEventListener('resize', snapOpen);

/** Pone la señal según los diálogos abiertos y avisa si ha cambiado. */
function sync(): void {
  // Los recién abiertos, centrados en píxel entero y vigilados por si cambian de tamaño (otro
  // paso del diálogo, un mensaje de error)
  document.querySelectorAll<HTMLDialogElement>('dialog:modal').forEach((dialog) => {
    snap(dialog);
    resizes.observe(dialog);
  });
  const open = isModalOpen();
  document.documentElement.toggleAttribute('data-modal-open', open);
  if (open === announced) return;
  announced = open;
  document.dispatchEvent(new CustomEvent<ModalDetail>(MODAL_EVENT, { detail: { open } }));
}

new MutationObserver(sync).observe(document.documentElement, {
  subtree: true,
  attributes: true,
  attributeFilter: ['open'],
});

// Página nueva: sus atributos de <html> llegan sin la señal
document.addEventListener('astro:after-swap', sync);
