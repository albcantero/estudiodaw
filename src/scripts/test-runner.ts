/**
 * @file El test de un tema (components/test/TestRunner): corregir cada pregunta al momento, el
 * recuento de arriba y, al acabar, repetir solo las falladas o empezar de nuevo.
 *
 * El estado vive en el propio DOM: cada pregunta ([data-question]) lleva data-state ("correct" o
 * "wrong"; sin él, sin responder) y las que quedan fuera de la ronda, data-out (y hidden). La
 * ronda es lo que se ve: todas al empezar, solo las falladas al repetirlas. Nada se guarda entre
 * visitas.
 *
 * Se ejecuta una sola vez y escucha en el documento; al llegar a cada página (astro:page-load)
 * prepara el test que haya.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { isCorrect, type GradeKey, type Response as AnswerResponse } from '../lib/tests/grade';

type QuestionState = 'correct' | 'wrong';

/**
 * Una cantidad con su palabra, en singular o en plural: "1 correcta", "3 correctas".
 *
 * @param count Cantidad.
 * @param one Palabra en singular.
 * @param other Palabra en plural.
 * @returns La cantidad con su palabra.
 */
const counted = (count: number, one: string, other: string): string =>
  `${count} ${count === 1 ? one : other}`;

/**
 * Clave de corrección de una pregunta.
 *
 * @param form Pregunta.
 * @returns Su clave, del JSON de data-key.
 */
const keyOf = (form: HTMLFormElement): GradeKey => JSON.parse(form.dataset.key ?? '{}');

/**
 * Los campos de una pregunta, en el orden de la página.
 *
 * @param form Pregunta.
 * @returns Sus campos (opciones, huecos o desplegables).
 */
const fieldsOf = (form: HTMLFormElement): (HTMLInputElement | HTMLSelectElement)[] => [
  ...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
    '[data-question-controls] :is(input, select)',
  ),
];

/**
 * La respuesta del alumno, con la forma que espera la corrección: la letra marcada (`single`),
 * las letras marcadas (`multiple`) o lo escrito o elegido en cada campo (`text`, `match`).
 *
 * @param form Pregunta.
 * @returns La respuesta.
 */
function responseOf(form: HTMLFormElement): AnswerResponse {
  const fields = fieldsOf(form);
  const checked = fields.filter((field) => (field as HTMLInputElement).checked);
  switch (keyOf(form).type) {
    case 'single':
      return checked[0]?.value ?? '';
    case 'multiple':
      return checked.map((field) => field.value);
    default:
      return fields.map((field) => field.value);
  }
}

/**
 * ¿Se puede comprobar ya? Con una opción marcada, en las de elegir; con todos los huecos escritos
 * o todas las filas elegidas, en las demás (comprobar a medias sería fallarla sin querer).
 *
 * @param form Pregunta.
 * @returns Si tiene respuesta.
 */
function hasResponse(form: HTMLFormElement): boolean {
  const response = responseOf(form);
  if (typeof response === 'string') return response !== '';
  if (keyOf(form).type === 'multiple') return response.length > 0;
  return response.every((value) => value.trim() !== '');
}

/**
 * Partes de una pregunta que cambian al corregir.
 *
 * @param form Pregunta.
 * @returns El grupo de campos, Comprobar, el resultado, lo que se enseña al corregir y la
 * respuesta correcta.
 */
function partsOf(form: HTMLFormElement) {
  return {
    controls: form.querySelector<HTMLFieldSetElement>('[data-question-controls]'),
    check: form.querySelector<HTMLButtonElement>('[data-question-check]'),
    verdict: form.querySelector<HTMLElement>('[data-question-verdict]'),
    reveal: form.querySelector<HTMLElement>('[data-question-reveal]'),
    answer: form.querySelector<HTMLElement>('[data-question-answer]'),
  };
}

/**
 * Activa o desactiva Comprobar según haya respuesta.
 *
 * @param form Pregunta.
 */
function refreshCheck(form: HTMLFormElement): void {
  const { check } = partsOf(form);
  if (check) check.disabled = !hasResponse(form);
}

/**
 * Las preguntas de la ronda de un test: las que no se han quedado fuera.
 *
 * @param test Test ([data-test]).
 * @returns Sus preguntas en la ronda.
 */
const roundOf = (test: HTMLElement): HTMLFormElement[] => [
  ...test.querySelectorAll<HTMLFormElement>('[data-question]:not([data-out])'),
];

/**
 * Reescribe el recuento de arriba y, si no queda ninguna sin responder, el final: la nota y los
 * botones (Repetir solo las falladas, si hay alguna).
 *
 * @param test Test.
 */
function refreshTally(test: HTMLElement): void {
  const round = roundOf(test);
  /**
   * Preguntas de la ronda en un estado.
   *
   * @param state Estado.
   * @returns Cuántas hay.
   */
  const count = (state: QuestionState) =>
    round.filter((form) => form.dataset.state === state).length;
  const correct = count('correct');
  const wrong = count('wrong');
  const pending = round.length - correct - wrong;

  const texts: Record<string, string> = {
    correct: counted(correct, 'correcta', 'correctas'),
    wrong: counted(wrong, 'fallada', 'falladas'),
    pending: `${pending} sin responder`,
  };
  test.querySelectorAll<HTMLElement>('[data-tally]').forEach((item) => {
    const label = item.querySelector('[data-badge-text]');
    if (label) label.textContent = texts[item.dataset.tally ?? ''] ?? '';
  });

  const finished = pending === 0 && round.length > 0;
  const score = test.querySelector<HTMLElement>('[data-test-score]');
  const actions = test.querySelector<HTMLElement>('[data-test-actions]');
  const retry = test.querySelector<HTMLElement>('[data-test-retry]');
  if (score) score.textContent = finished ? `${correct} de ${round.length} correctas` : '';
  if (actions) actions.hidden = !finished;
  if (retry) retry.hidden = wrong === 0;
}

/**
 * Corrige una pregunta: la bloquea, cambia Comprobar por el resultado (Correcta o Incorrecta) y
 * enseña la respuesta correcta, si se ha fallado, y la nota, si la hay.
 *
 * @param form Pregunta.
 */
function checkQuestion(form: HTMLFormElement): void {
  if (form.dataset.state || !hasResponse(form)) return;
  const correct = isCorrect(keyOf(form), responseOf(form));
  const state: QuestionState = correct ? 'correct' : 'wrong';
  form.setAttribute('data-state', state);

  const { controls, check, verdict, reveal, answer } = partsOf(form);
  if (controls) controls.disabled = true;
  if (check) check.hidden = true;
  if (answer) answer.hidden = correct;
  if (reveal) reveal.hidden = correct && !reveal.hasAttribute('data-has-note');
  if (verdict) {
    verdict.querySelectorAll<HTMLElement>('[data-verdict]').forEach((item) => {
      item.toggleAttribute('hidden', item.dataset.verdict !== state);
    });
    verdict.hidden = false;
    // Comprobar desaparece: el foco pasa al resultado, que así se lee en voz alta
    verdict.focus({ preventScroll: true });
  }

  const test = form.closest<HTMLElement>('[data-test]');
  if (test) refreshTally(test);
}

/**
 * Deja una pregunta en blanco y desbloqueada, como al cargar la página.
 *
 * @param form Pregunta.
 */
function resetQuestion(form: HTMLFormElement): void {
  form.reset();
  form.removeAttribute('data-state');
  const { controls, check, verdict, reveal, answer } = partsOf(form);
  if (controls) controls.disabled = false;
  if (check) {
    check.hidden = false;
    check.disabled = true;
  }
  if (verdict) verdict.hidden = true;
  if (reveal) reveal.hidden = true;
  if (answer) answer.hidden = true;
}

/**
 * Empieza una ronda nueva: con solo las falladas (las acertadas se esconden) o con todas.
 * Esconde los apartados que se quedan sin preguntas y vuelve arriba, al recuento.
 *
 * @param test Test.
 * @param onlyWrong Repetir solo las falladas (true) o empezar de nuevo (false).
 */
function startRound(test: HTMLElement, onlyWrong: boolean): void {
  // Al repetir, las que ya estaban fuera siguen fuera; al empezar de nuevo, vuelven todas
  test.querySelectorAll<HTMLFormElement>('[data-question]').forEach((form) => {
    const out = onlyWrong && (form.hasAttribute('data-out') || form.dataset.state !== 'wrong');
    form.toggleAttribute('data-out', out);
    form.toggleAttribute('hidden', out);
  });
  roundOf(test).forEach(resetQuestion);
  test.querySelectorAll<HTMLElement>('[data-test-section]').forEach((section) => {
    section.toggleAttribute('hidden', !section.querySelector('[data-question]:not([data-out])'));
  });
  refreshTally(test);

  const tally = test.querySelector<HTMLElement>('[data-test-tally]');
  if (tally) {
    tally.scrollIntoView({ behavior: 'instant', block: 'start' });
    tally.focus({ preventScroll: true });
  }
}

/** Prepara los tests de la página: enseña lo que solo funciona con JavaScript y el recuento */
function setUpTests(): void {
  document.querySelectorAll<HTMLElement>('[data-test]').forEach((test) => {
    const tally = test.querySelector<HTMLElement>('[data-test-tally]');
    if (tally) tally.hidden = false;
    test.querySelectorAll<HTMLFormElement>('[data-question]').forEach((form) => {
      const { check } = partsOf(form);
      if (check) check.hidden = false;
      refreshCheck(form);
    });
    refreshTally(test);
  });
}

/**
 * La pregunta de un evento, si ha pasado dentro de una.
 *
 * @param event Evento.
 * @returns La pregunta, o null.
 */
const questionOf = (event: Event): HTMLFormElement | null =>
  (event.target as HTMLElement).closest<HTMLFormElement>('[data-question]');

/**
 * Activa o desactiva Comprobar de la pregunta donde se ha escrito o elegido algo.
 *
 * @param event Evento input o change.
 */
function onAnswerChange(event: Event): void {
  const form = questionOf(event);
  if (form && !form.dataset.state) refreshCheck(form);
}

document.addEventListener('input', onAnswerChange);
document.addEventListener('change', onAnswerChange);

// Comprobar (o Intro en un hueco): se corrige aquí, sin enviar nada
document.addEventListener('submit', (event) => {
  const form = questionOf(event);
  if (!form) return;
  event.preventDefault();
  checkQuestion(form);
});

document.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest('[data-test-retry], [data-test-restart]');
  const test = button?.closest<HTMLElement>('[data-test]');
  if (!button || !test) return;
  startRound(test, button.hasAttribute('data-test-retry'));
});

document.addEventListener('astro:page-load', setUpTests);
