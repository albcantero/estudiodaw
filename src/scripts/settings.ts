/**
 * @file Ajustes de la web (SettingsMenu): los dos interruptores. El desplegable lo lleva
 * scripts/dropdown.ts.
 *
 * - Scroll suave: encendido salvo que se apague (se guarda 'off'). Con reducir movimiento no
 *   hay suavizado, así que se ve apagado y no se puede tocar.
 * - Reducir movimiento: encendido si lo pide el sistema o este interruptor (html
 *   [data-reduce-motion], "system" o "site", ver inline/boot.js). Si lo pide el sistema, aquí
 *   no se puede quitar (es una preferencia del sistema): se ve encendido y bloqueado. Al quitarlo, el scroll
 *   suave vuelve encendido.
 *
 * Un interruptor bloqueado lleva aria-disabled, no disabled: así se sigue llegando a él con el
 * teclado y el lector de pantalla lo anuncia, aunque no cambie. Los interruptores reflejan
 * siempre el estado real, también si cambia el sistema o se cambian en otra pestaña.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { STORAGE_KEYS } from '../data/storage';
import { onReducedMotionChange, prefersReducedMotion } from './motion';
import { removePreference, writePreference } from './preferences';
import { smoothScrollWanted, syncSmoothScroll } from './smooth-scroll';

/**
 * ¿Lo pide el sistema? Entonces el interruptor de la web no lo puede quitar.
 *
 * @returns Si lo pide el sistema.
 */
const systemReduces = (): boolean => document.documentElement.dataset.reduceMotion === 'system';

/**
 * Pone un interruptor en su estado.
 *
 * @param key Clave del ajuste (data-setting).
 * @param checked Encendido.
 * @param locked Bloqueado.
 */
function setSwitch(key: string, checked: boolean, locked: boolean): void {
  document.querySelectorAll(`[data-setting="${key}"]`).forEach((toggle) => {
    toggle.setAttribute('aria-checked', String(checked));
    toggle.setAttribute('aria-disabled', String(locked));
  });
}

/** Pone todos los interruptores en el estado real. */
function refreshSwitches(): void {
  const reduced = prefersReducedMotion();
  setSwitch('smooth-scroll', smoothScrollWanted() && !reduced, reduced);
  setSwitch('reduce-motion', reduced, systemReduces());
}

/**
 * Cambia un ajuste.
 *
 * @param key Clave del ajuste (data-setting).
 * @param on Encender o apagar.
 */
function changeSetting(key: string, on: boolean): void {
  if (key === 'smooth-scroll') {
    if (on) removePreference(STORAGE_KEYS.smoothScroll);
    else writePreference(STORAGE_KEYS.smoothScroll, 'off');
    syncSmoothScroll();
    refreshSwitches();
  } else if (key === 'reduce-motion') {
    if (on) {
      writePreference(STORAGE_KEYS.reduceMotion, 'on');
    } else {
      removePreference(STORAGE_KEYS.reduceMotion);
      // Al quitar reducir movimiento, el scroll suave vuelve encendido
      removePreference(STORAGE_KEYS.smoothScroll);
    }
    // Lo aplica a <html>: el scroll suave y los interruptores se enteran solos
    window.applyReduceMotion?.();
  }
}

document.addEventListener('click', (event) => {
  const toggle = (event.target as HTMLElement).closest<HTMLElement>('[data-setting]');
  const key = toggle?.dataset.setting;
  if (!toggle || !key || toggle.getAttribute('aria-disabled') === 'true') return;
  // El estirón de la bolita solo después de tocarlo (ver ui/Switch.astro)
  toggle.setAttribute('data-touched', '');
  changeSetting(key, toggle.getAttribute('aria-checked') !== 'true');
});

onReducedMotionChange(refreshSwitches);
// El scroll suave cambiado en otra pestaña (reducir movimiento ya llega por el atributo)
window.addEventListener('storage', refreshSwitches);
document.addEventListener('astro:page-load', refreshSwitches);
