/**
 * @file Diálogo de entrar (layout/AuthDialog): empieza con un botón que lleva al paso 1, el usuario
 * y "Enviar código"; paso 2, el código, que se comprueba al pulsar "Iniciar sesión". "Reenviar
 * código" espera 60 s entre envíos. Al entrar, si la cuenta ya tiene nombre, se cierra: la barra se
 * repinta sola con el cambio de sesión (account.ts) y el foco pasa al usuario. Si no, sigue: paso
 * 3, el nombre (propuesto a partir del correo), y paso 4, la matrícula, que se abre en su diálogo o
 * se deja para después. Si lo cierran antes de guardar el nombre, se vuelve a pedir la próxima vez
 * que entren.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { animate } from 'motion';
import { SPRING, prefersReducedMotion } from '../motion';
import { focusAccount } from './account';
import { AUTH_MESSAGES } from './errors';
import { openEnrollment } from '../enrollment';
import { currentName, requestCode, saveName, verifyCode } from './session';
import {
  CODE_LENGTH,
  isValidUser,
  nameFromEmail,
  normalizeCode,
  normalizeName,
  normalizeUser,
  toSchoolEmail,
} from './user';

/** Paso del diálogo: el botón de inicio, el usuario, el código, el nombre o la matrícula */
type Step = 'start' | 'request' | 'verify' | 'name' | 'enrollment';

/** Pasos en orden: hacia delante, el nuevo entra por la derecha; hacia atrás, por la izquierda */
const ORDER: Step[] = ['start', 'request', 'verify', 'name', 'enrollment'];

/** Paso que se ve */
let current: Step = 'start';

/** Cambio de paso en marcha (los siguientes esperan a que acabe) */
let transition: Promise<void> = Promise.resolve();

/** Segundos entre un envío y el siguiente */
const RESEND_SECONDS = 60;

/** Correo al que se ha enviado el último código */
let email = '';
/** Cuenta atrás de "Reenviar código" */
let countdown = 0;
let timer = 0;
/** Hay un envío en marcha: no se manda otro hasta que acabe */
let sending = false;

/**
 * El diálogo de entrar de la página.
 *
 * @returns El diálogo, o null si la página no lo tiene.
 */
const dialogOf = (): HTMLDialogElement | null =>
  document.querySelector<HTMLDialogElement>('[data-auth-dialog]');

/** Margen que cancela el hueco del formulario (gap-3) mientras el error no está */
const ERROR_GAP = 'calc(var(--spacing) * -3)';

/** Mensaje de error: aparece y se va en 200 ms, sin empujar de golpe lo que tiene debajo */
const ERROR_REVEAL = { duration: 0.2, ease: 'easeOut' } as const;

/**
 * Agita lo que ha fallado (el campo del correo o las casillas del código), con la animación
 * shake-x (layout.css). Quitar la clase y forzar un reflow la reinicia, así se repite en cada
 * fallo.
 *
 * @param form Formulario del paso.
 */
function shake(form: HTMLFormElement): void {
  const target = form.querySelector<HTMLElement>('[data-auth-shake]');
  if (!target) return;
  target.classList.remove('shake-active');
  target.getBoundingClientRect();
  target.classList.add('shake-active');
}

/**
 * Pone o quita el mensaje de error de un paso. Al aparecer, crece de alto 0 al suyo con un
 * fundido y empuja con suavidad lo de debajo (y lo que ha fallado se agita); al irse, al revés.
 * Si ya había uno, solo cambia el texto y se repite el agitado: no vuelve a aparecer.
 *
 * @param form Formulario del paso.
 * @param message Mensaje; vacío lo quita.
 */
function showError(form: HTMLFormElement, message: string): void {
  form.querySelectorAll('input').forEach((input) => {
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  });
  const error = form.querySelector<HTMLElement>('[data-auth-error]');
  if (!error) return;
  const shown = error.textContent !== '';
  const options =
    prefersReducedMotion() || !form.closest('dialog')?.open ? { duration: 0 } : ERROR_REVEAL;
  if (message) {
    error.textContent = message;
    shake(form);
    if (shown) return;
    // El hueco del formulario (gap) entra con él: sin el margen negativo saldría de golpe
    animate(
      error,
      {
        height: ['0px', `${error.scrollHeight}px`],
        marginTop: [ERROR_GAP, '0px'],
        opacity: [0, 1],
      },
      options,
    ).then(() => error.style.setProperty('height', 'auto'));
  } else if (shown) {
    animate(error, { height: '0px', marginTop: ERROR_GAP, opacity: 0 }, options).then(() => {
      error.textContent = '';
    });
  }
}

/**
 * Los pasos del diálogo, por su nombre.
 *
 * @param dialog Diálogo.
 * @returns Los pasos, o null si falta alguno.
 */
function stepsOf(dialog: HTMLDialogElement): Record<Step, HTMLElement> | null {
  const start = dialog.querySelector<HTMLElement>('[data-auth-start]');
  const request = dialog.querySelector<HTMLElement>('[data-auth-request]');
  const code = dialog.querySelector<HTMLElement>('[data-auth-verify]');
  const name = dialog.querySelector<HTMLElement>('[data-auth-name]');
  const enrollment = dialog.querySelector<HTMLElement>('[data-auth-enrollment]');
  return start && request && code && name && enrollment
    ? { start, request, verify: code, name, enrollment }
    : null;
}

/**
 * Pinta las casillas del código con lo que lleva el campo real (layout/AuthDialog: es transparente
 * y va encima). La activa, la siguiente por rellenar (o la última, si están todas), solo con el
 * campo enfocado; si está vacía, con el cursor de mentira. El cursor real se queda siempre al
 * final: se escribe y se borra de casilla en casilla.
 *
 * @param input Campo del código.
 */
function renderOtp(input: HTMLInputElement): void {
  const otp = input.closest('[data-otp]');
  if (!otp) return;
  const focused = document.activeElement === input;
  const active = Math.min(input.value.length, CODE_LENGTH - 1);
  otp.querySelectorAll<HTMLElement>('[data-otp-slot]').forEach((slot) => {
    const index = Number(slot.dataset.otpSlot);
    const char = input.value[index] ?? '';
    const charElement = slot.querySelector('[data-otp-char]');
    if (charElement) charElement.textContent = char;
    slot.toggleAttribute('data-active', focused && index === active);
    slot.toggleAttribute('data-caret', focused && index === active && char === '');
  });
  if (focused) input.setSelectionRange(input.value.length, input.value.length);
}

/**
 * Quita lo que la transición deja puesto en línea en un elemento.
 *
 * @param element Paso o diálogo.
 * @param properties Propiedades que se quitan.
 */
const clearStyles = (element: HTMLElement, properties: string[]): void => {
  properties.forEach((property) => element.style.removeProperty(property));
};

/**
 * Cambia de paso. Animado, como un carrusel: el que se va sale por un lado y el nuevo entra por
 * el otro (hacia delante, de derecha a izquierda; hacia atrás, al revés), y el diálogo cambia
 * de alto a la vez hasta el de su contenido nuevo (se recentra solo: scripts/modal.ts). El que
 * sale se saca del flujo, en su sitio, para que el alto final ya sea el del nuevo.
 *
 * @param dialog Diálogo.
 * @param step Paso al que se va.
 * @param animated Animarlo (al abrir el diálogo, no).
 * @param focusField Enfocar su campo; si no, el foco se queda en el paso, sin anillo.
 */
async function changeStep(
  dialog: HTMLDialogElement,
  step: Step,
  animated: boolean,
  focusField: boolean,
): Promise<void> {
  const steps = stepsOf(dialog);
  if (!steps) return;
  const from = steps[current];
  const to = steps[step];
  const instant = !animated || !dialog.open || from === to || prefersReducedMotion();

  const startHeight = dialog.offsetHeight;
  if (!instant) {
    Object.assign(from.style, {
      position: 'absolute',
      top: `${from.offsetTop}px`,
      left: '0',
      right: '0',
    });
  }
  (Object.keys(steps) as Step[]).forEach((name) => {
    steps[name].hidden = name !== step && (instant || steps[name] !== from);
  });
  const direction = ORDER.indexOf(step) >= ORDER.indexOf(current) ? 1 : -1;
  current = step;
  const field = focusField ? to.querySelector<HTMLElement>('input, button') : null;
  if (!field) to.setAttribute('tabindex', '-1');
  (field ?? to).focus({ preventScroll: true });
  if (instant) return;

  const endHeight = dialog.offsetHeight;
  dialog.style.setProperty('overflow', 'hidden');
  await Promise.all([
    animate(dialog, { height: [`${startHeight}px`, `${endHeight}px`] }, SPRING),
    animate(from, { x: ['0%', `${-direction * 100}%`], opacity: [1, 0] }, SPRING),
    animate(to, { x: [`${direction * 100}%`, '0%'], opacity: [0, 1] }, SPRING),
  ]);
  from.hidden = true;
  clearStyles(from, ['position', 'top', 'left', 'right', 'transform', 'opacity']);
  clearStyles(to, ['transform', 'opacity']);
  clearStyles(dialog, ['height', 'overflow']);
}

/**
 * Cambia de paso y enfoca su campo.
 *
 * @param dialog Diálogo.
 * @param step Paso al que se va.
 * @param animated Animarlo (al abrir el diálogo, no).
 * @param focusField Enfocar su campo (de serie, sí).
 */
function showStep(dialog: HTMLDialogElement, step: Step, animated = true, focusField = true): void {
  // En cola: si se pide otro paso a mitad de una transición, va detrás
  transition = transition.then(() => changeStep(dialog, step, animated, focusField));
}

/**
 * Pinta "Reenviar código": con la cuenta atrás y deshabilitado mientras dura.
 *
 * @param dialog Diálogo.
 */
function paintResend(dialog: HTMLDialogElement): void {
  const button = dialog.querySelector<HTMLButtonElement>('[data-auth-resend]');
  if (!button) return;
  button.disabled = countdown > 0;
  button.textContent = countdown > 0 ? `Reenviar código en ${countdown}s` : 'Reenviar código';
}

/**
 * Empieza la cuenta atrás de "Reenviar código".
 *
 * @param dialog Diálogo.
 */
function startCountdown(dialog: HTMLDialogElement): void {
  window.clearInterval(timer);
  countdown = RESEND_SECONDS;
  paintResend(dialog);
  timer = window.setInterval(() => {
    countdown -= 1;
    paintResend(dialog);
    if (countdown <= 0) window.clearInterval(timer);
  }, 1000);
}

/**
 * Pide el código para el usuario escrito y pasa al paso 2.
 *
 * @param dialog Diálogo.
 */
async function send(dialog: HTMLDialogElement): Promise<void> {
  const form = dialog.querySelector<HTMLFormElement>('[data-auth-request]');
  const input = form?.querySelector<HTMLInputElement>('input[name="user"]');
  if (!form || !input || sending) return;
  const user = normalizeUser(input.value);
  if (!isValidUser(user)) {
    showError(form, user === '' ? AUTH_MESSAGES.empty : AUTH_MESSAGES.invalidUser);
    return;
  }
  // El mismo correo con un código aún reciente: se vuelve a ese, sin pedir otro (Supabase no deja
  // pedir otro al mismo correo antes de 60 s y saldría "demasiados códigos")
  if (toSchoolEmail(user) === email && countdown > 0) {
    showStep(dialog, 'verify');
    return;
  }
  sending = true;
  const error = await requestCode(toSchoolEmail(user));
  sending = false;
  if (error) {
    showError(form, error);
    return;
  }
  // Ha salido: fuera el error que quedara (si vuelven a este paso, no debe seguir ahí)
  showError(form, '');
  email = toSchoolEmail(user);
  const label = dialog.querySelector('[data-auth-email]');
  if (label) label.textContent = email;
  const code = dialog.querySelector<HTMLInputElement>('input[name="code"]');
  if (code) {
    code.value = '';
    renderOtp(code);
  }
  const verifyForm = dialog.querySelector<HTMLFormElement>('[data-auth-verify]');
  if (verifyForm) showError(verifyForm, '');
  startCountdown(dialog);
  // Si lo cerraron mientras se enviaba, el código ya ha salido: queda listo para cuando vuelvan
  if (dialog.open) showStep(dialog, 'verify');
}

/**
 * Cierra el diálogo con la sesión ya iniciada: el botón que lo abrió ya no se ve, así que el foco
 * pasa al usuario.
 *
 * @param dialog Diálogo.
 */
function finish(dialog: HTMLDialogElement): void {
  dialog.close();
  focusAccount();
}

/**
 * Verifica el código escrito; si vale, pide el nombre si la cuenta no lo tiene, o cierra.
 *
 * @param dialog Diálogo.
 */
async function verify(dialog: HTMLDialogElement): Promise<void> {
  const form = dialog.querySelector<HTMLFormElement>('[data-auth-verify]');
  const input = form?.querySelector<HTMLInputElement>('input[name="code"]');
  if (!form || !input || input.disabled) return;
  const code = normalizeCode(input.value);
  if (code.length !== CODE_LENGTH) {
    showError(form, code === '' ? AUTH_MESSAGES.empty : AUTH_MESSAGES.incompleteCode);
    input.focus();
    return;
  }
  input.disabled = true;
  const error = await verifyCode(email, code);
  input.disabled = false;
  if (error) {
    showError(form, error);
    input.focus();
    input.select();
    return;
  }
  if (await currentName()) {
    finish(dialog);
    return;
  }
  // Sin nombre: el paso del nombre, con el que se deduce del correo ya escrito
  const nameForm = dialog.querySelector<HTMLFormElement>('[data-auth-name]');
  const nameInput = nameForm?.querySelector<HTMLInputElement>('input[name="name"]');
  if (!nameForm || !nameInput) {
    finish(dialog);
    return;
  }
  nameInput.value = nameFromEmail(email);
  showError(nameForm, '');
  showStep(dialog, 'name');
}

/** Hay un guardado del nombre en marcha */
let savingName = false;

/**
 * Guarda el nombre escrito y pasa al paso de la matrícula.
 *
 * @param dialog Diálogo.
 */
async function submitName(dialog: HTMLDialogElement): Promise<void> {
  const form = dialog.querySelector<HTMLFormElement>('[data-auth-name]');
  const input = form?.querySelector<HTMLInputElement>('input[name="name"]');
  if (!form || !input || savingName) return;
  const name = normalizeName(input.value);
  if (name === '') {
    showError(form, AUTH_MESSAGES.emptyName);
    input.focus();
    return;
  }
  savingName = true;
  const error = await saveName(name);
  savingName = false;
  if (error) {
    showError(form, error);
    return;
  }
  showError(form, '');
  showStep(dialog, 'enrollment');
}

/**
 * Reenvía el código al mismo correo.
 *
 * @param dialog Diálogo.
 */
async function resend(dialog: HTMLDialogElement): Promise<void> {
  const form = dialog.querySelector<HTMLFormElement>('[data-auth-verify]');
  if (!form || countdown > 0) return;
  startCountdown(dialog);
  const error = await requestCode(email);
  showError(form, error ?? '');
}

/**
 * Abre el diálogo en el paso 1, con el formulario vacío.
 *
 * @param dialog Diálogo.
 */
function open(dialog: HTMLDialogElement): void {
  const request = dialog.querySelector<HTMLFormElement>('[data-auth-request]');
  if (request) {
    request.reset();
    showError(request, '');
  }
  dialog.showModal();
  showStep(dialog, 'start', false);
}

document.addEventListener('input', (event) => {
  const input = event.target as HTMLInputElement;
  const dialog = input.closest<HTMLDialogElement>('[data-auth-dialog]');
  if (!dialog) return;
  if (input.name === 'user') {
    // Si pegan el correo entero, se queda el usuario
    if (input.value.includes('@')) [input.value] = input.value.split('@');
  } else if (input.name === 'code') {
    input.value = normalizeCode(input.value);
    renderOtp(input);
  }
});

// En la captura y sin dejarlo seguir: el enrutador de Astro (ClientRouter) convierte los envíos de
// formulario en una navegación (?user=…) que cambia la página y se lleva el diálogo por delante
document.addEventListener(
  'submit',
  (event) => {
    const form = event.target as HTMLFormElement;
    const dialog = form.closest<HTMLDialogElement>('[data-auth-dialog]');
    if (!dialog) return;
    event.preventDefault();
    event.stopPropagation();
    if (form.matches('[data-auth-request]')) send(dialog);
    else if (form.matches('[data-auth-name]')) submitName(dialog);
    else verify(dialog);
  },
  { capture: true },
);

/** Dónde empezó la última pulsación: un clic en el fondo solo cierra si también empezó ahí */
let pressTarget: EventTarget | null = null;

document.addEventListener('pointerdown', (event) => {
  pressTarget = event.target;
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const dialog = dialogOf();
  if (!dialog) return;
  if (target.closest('[data-auth-open]')) open(dialog);
  else if (target.closest('[data-auth-close]')) dialog.close();
  // El campo del correo, solo si se ha pulsado con el teclado (detail 0): con el ratón, se hace
  // clic en él cuando se quiera escribir
  else if (target.closest('[data-auth-start-button]')) {
    showStep(dialog, 'request', true, event.detail === 0);
  } else if (target.closest('[data-auth-change]')) showStep(dialog, 'request');
  else if (target.closest('[data-auth-back]')) showStep(dialog, 'start');
  else if (target.closest('[data-auth-resend]')) resend(dialog);
  else if (target.closest('[data-auth-enroll-now]')) {
    dialog.close();
    openEnrollment();
  } else if (target.closest('[data-auth-enroll-later]')) finish(dialog);
  else if (target === dialog && pressTarget === dialog) dialog.close();
  // Clic en el dominio fijo: enfoca el campo del usuario
  else target.closest('[data-auth-user-box]')?.querySelector('input')?.focus();
});

// Las casillas siguen al foco del campo del código (y a cualquier clic, que no mueve el cursor)
['focusin', 'focusout', 'click', 'select'].forEach((type) => {
  document.addEventListener(type, (event) => {
    const input = event.target as HTMLElement;
    if (input instanceof HTMLInputElement && input.name === 'code') renderOtp(input);
  });
});
