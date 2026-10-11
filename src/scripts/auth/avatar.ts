/**
 * @file Avatar de la cuenta: pinta los avatares (ui/Avatar) con lo elegido y lleva el selector
 * del menú de la cuenta (layout/AccountButton): una rejilla de iconos y una fila de colores.
 *
 * El selector es un popover que se abre desde el avatar del menú y queda dentro del menú, así
 * que elegir algo no lo cierra. Al pulsar un icono o un color, todos los avatares cambian en el
 * momento y se guarda en la cuenta; si no se puede guardar, vuelven a lo que había.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { AVATAR_COLORS, type AvatarChoice, avatarColorOf } from '../../data/avatar';
import { placeFloating } from '../floating';
import { saveAvatar, storedAvatar } from './session';

/** Clases de todos los colores, para quitarlas antes de poner el elegido */
const COLOR_CLASSES = AVATAR_COLORS.map((color) => color.className);
/** El gris de serie, sin color elegido */
const DEFAULT_CLASSES = ['bg-muted', 'text-muted-foreground'];

/**
 * Pinta un avatar: la inicial o el icono elegido, y el gris de serie o el color elegido.
 *
 * @param avatar Avatar ([data-avatar]).
 * @param choice Icono y color elegidos.
 * @param initial Inicial del nombre; sin ella, se deja la que tenga.
 */
export function paintAvatar(avatar: Element, choice: AvatarChoice, initial?: string): void {
  const fill = avatar.querySelector('[data-avatar-fill]');
  const letter = avatar.querySelector<HTMLElement>('[data-avatar-initial]');
  if (!fill || !letter) return;
  const color = avatarColorOf(choice.color);
  fill.classList.remove(...COLOR_CLASSES, ...DEFAULT_CLASSES, 'text-white');
  fill.classList.add(...(color ? [color.className, 'text-white'] : DEFAULT_CLASSES));
  if (initial !== undefined) letter.replaceChildren(initial);
  letter.hidden = choice.icon !== null;
  avatar.querySelectorAll<HTMLElement>('[data-avatar-icon]').forEach((icon) => {
    // eslint-disable-next-line no-param-reassign
    icon.hidden = icon.dataset.avatarIcon !== choice.icon;
  });
}

/**
 * Marca en el selector el icono y el color elegidos.
 *
 * @param choice Icono y color elegidos.
 */
export function paintPicker(choice: AvatarChoice): void {
  document.querySelectorAll<HTMLElement>('[data-avatar-pick-icon]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.avatarPickIcon === choice.icon));
  });
  document.querySelectorAll<HTMLElement>('[data-avatar-pick-color]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.avatarPickColor === choice.color));
  });
}

/**
 * Pinta todos los avatares de la página y el selector con lo elegido, sin tocar la inicial.
 *
 * @param choice Icono y color elegidos.
 */
function paintAll(choice: AvatarChoice): void {
  document.querySelectorAll('[data-avatar]').forEach((avatar) => paintAvatar(avatar, choice));
  paintPicker(choice);
}

/**
 * Elige un icono o un color: se ve en el momento y se guarda en la cuenta.
 *
 * @param patch Lo que cambia: el icono, el color o los dos.
 */
async function choose(patch: { icon?: string; color?: string }): Promise<void> {
  paintAll({ ...storedAvatar(), ...patch });
  const error = await saveAvatar(patch);
  // Sin guardar, vuelve a lo que había
  if (error) paintAll(storedAvatar());
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const icon = target.closest<HTMLElement>('[data-avatar-pick-icon]')?.dataset.avatarPickIcon;
  const color = target.closest<HTMLElement>('[data-avatar-pick-color]')?.dataset.avatarPickColor;
  if (icon) choose({ icon });
  else if (color) choose({ color });
});

// El selector, debajo del avatar del menú, cada vez que se abre. Mientras está abierto, el
// avatar se queda con el lápiz (aria-expanded: el navegador no lo escribe en el HTML)
document.addEventListener(
  'toggle',
  (event) => {
    const picker = event.target as HTMLElement;
    if (!picker.matches('[data-avatar-picker]')) return;
    const anchor = document.querySelector('[data-avatar-edit]');
    const open = picker.matches(':popover-open');
    anchor?.setAttribute('aria-expanded', String(open));
    if (open && anchor) placeFloating(picker, anchor, 'bottom');
  },
  { capture: true },
);

// Al cerrar el menú, el selector se cierra con él
document.addEventListener(
  'toggle',
  (event) => {
    const panel = event.target as HTMLElement;
    if (panel.id !== 'account-menu' || panel.matches(':popover-open')) return;
    document.querySelector<HTMLElement>('[data-avatar-picker]:popover-open')?.hidePopover();
  },
  { capture: true },
);
