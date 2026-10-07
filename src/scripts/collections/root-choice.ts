/**
 * @file Preferencias de las colecciones que van en atributos de <html> (data-view, data-group):
 * leerlas y cambiarlas. inline/boot.js las aplica antes del primer pintado; los conmutadores
 * (view-toggle.ts, group-toggle.ts) las cambian aquí. Los valores posibles, y el de serie, están en
 * data/storage.ts (ROOT_CHOICES).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { ROOT_CHOICES, STORAGE_KEYS, type RootChoice } from '../../data/storage';
import { writePreference } from '../preferences';

/** Valor posible de una preferencia */
export type RootValue<C extends RootChoice> = (typeof ROOT_CHOICES)[C][number];

/**
 * ¿Es un valor posible de la preferencia?
 *
 * @param name Preferencia.
 * @param value Valor que se comprueba.
 * @returns Si es uno de los valores posibles.
 */
export function isRootValue<C extends RootChoice>(
  name: C,
  value: string | undefined,
): value is RootValue<C> {
  return value !== undefined && (ROOT_CHOICES[name] as readonly string[]).includes(value);
}

/**
 * Valor actual de una preferencia (el de <html>); el de serie si no vale.
 *
 * @param name Preferencia.
 * @returns El valor actual.
 */
export function readRootChoice<C extends RootChoice>(name: C): RootValue<C> {
  const value = document.documentElement.dataset[name];
  return isRootValue(name, value) ? value : ROOT_CHOICES[name][0];
}

/**
 * Cambia una preferencia en <html> y la guarda.
 *
 * @param name Preferencia.
 * @param value Valor nuevo.
 */
export function setRootChoice<C extends RootChoice>(name: C, value: RootValue<C>): void {
  document.documentElement.dataset[name] = value;
  writePreference(STORAGE_KEYS[name], value);
}
