/**
 * @file Cliente de Supabase, uno para toda la web y cargado solo cuando hace falta (hay una sesión
 * guardada o se abre el diálogo de entrar): quien no usa el login no descarga supabase-js.
 *
 * La sesión se guarda con window.prefs, como el resto de preferencias: con el mismo prefijo y,
 * si el navegador no deja guardar, en memoria durante la visita.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { STORAGE_KEYS } from '../../data/storage';
import { readPreference, removePreference, writePreference } from '../preferences';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/** ¿Hay proyecto de Supabase? Sin él, el login no aparece */
export const isAuthConfigured = SUPABASE_URL !== '' && ANON_KEY !== '';

let client: Promise<SupabaseClient> | null = null;

/**
 * El cliente, creado la primera vez que se pide.
 *
 * @returns El cliente de Supabase.
 */
export function getClient(): Promise<SupabaseClient> {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, ANON_KEY, {
      auth: {
        storageKey: STORAGE_KEYS.auth,
        storage: {
          getItem: readPreference,
          setItem: writePreference,
          removeItem: removePreference,
        },
        persistSession: true,
        autoRefreshToken: true,
        // Se entra con código, nunca con enlace: no hay sesión que leer de la URL
        detectSessionInUrl: false,
      },
    }),
  );
  return client;
}
