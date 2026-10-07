/**
 * @file Fin de la entrada escalonada (.rise, layout.css): cuando terminan todas las animaciones de
 * entrada de la página, <body> lleva data-content-entered y la entrada se apaga. Así lo que aparece
 * después (una fila que vuelve al limpiar el buscador, el tablero al cambiar de vista) se ve sin
 * más, en vez de volver a entrar con su retraso.
 *
 * Con ClientRouter cada página trae un <body> nuevo, sin el atributo: su cuerpo vuelve a
 * entrar. El panel lateral, que persiste, no (scripts/sidebar/persist.ts).
 *
 * @author Alberto Cantero
 * @license MIT
 */
document.addEventListener('astro:page-load', () => {
  const entering = document
    .getAnimations()
    .filter(
      (animation) => animation instanceof CSSAnimation && animation.animationName === 'rise-in',
    );
  // Una animación cancelada (su elemento se oculta antes de acabar) también cuenta como acabada
  Promise.all(entering.map((animation) => animation.finished.catch(() => undefined))).then(() =>
    document.body.setAttribute('data-content-entered', ''),
  );
});
