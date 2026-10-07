/**
 * @file Conmutador Lista / Tablero (ViewToggle): cambia html[data-view] y lo guarda. La vista
 * guardada la aplica inline/boot.js antes del primer pintado; aquí se marca en el control.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { selectSegment } from '../segmented';
import { isRootValue, readRootChoice, setRootChoice } from './root-choice';

/** Nombre del control segmentado de la vista (data-segmented) */
const CONTROL = 'view';

document.addEventListener('click', (event) => {
  const option = (event.target as HTMLElement).closest<HTMLElement>(
    `[data-segmented="${CONTROL}"] [data-segment]`,
  );
  const view = option?.dataset.segment;
  if (!isRootValue('view', view)) return;
  setRootChoice('view', view);
  selectSegment(CONTROL, view);
});

document.addEventListener('astro:page-load', () => {
  selectSegment(CONTROL, readRootChoice('view'), true);
});
