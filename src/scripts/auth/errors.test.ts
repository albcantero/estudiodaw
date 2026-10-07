/**
 * @file Tests de la traducción de errores de Supabase a mensajes del login (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AUTH_MESSAGES, authMessage } from './errors.ts';

describe('authMessage', () => {
  it('código mal escrito o caducado (otp_expired, 403)', () => {
    assert.equal(authMessage({ code: 'otp_expired', status: 403 }, 'verify'), AUTH_MESSAGES.code);
  });

  it('el hook rechaza el dominio (403 al pedir el código)', () => {
    assert.equal(authMessage({ status: 403 }, 'request'), AUTH_MESSAGES.domain);
  });

  it('un 403 al verificar sin código conocido no es del dominio', () => {
    assert.equal(authMessage({ status: 403 }, 'verify'), AUTH_MESSAGES.code);
  });

  it('límite de envíos', () => {
    assert.equal(
      authMessage({ code: 'over_email_send_rate_limit', status: 429 }, 'request'),
      AUTH_MESSAGES.rateLimit,
    );
    assert.equal(
      authMessage({ code: 'over_request_rate_limit', status: 429 }, 'verify'),
      AUTH_MESSAGES.rateLimit,
    );
    assert.equal(authMessage({ status: 429 }, 'request'), AUTH_MESSAGES.rateLimit);
  });

  it('sin conexión', () => {
    assert.equal(
      authMessage({ name: 'AuthRetryableFetchError', status: 0 }, 'request'),
      AUTH_MESSAGES.network,
    );
  });

  it('cualquier otro error: el genérico', () => {
    assert.equal(authMessage({ status: 500 }, 'request'), AUTH_MESSAGES.network);
    assert.equal(authMessage({}, 'verify'), AUTH_MESSAGES.network);
  });
});
