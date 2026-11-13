# Tema 1. Ejercicios

Doce ejercicios ordenados de menor a mayor dificultad. Cada uno indica el fichero de respuesta en `mis soluciones/`. En los ficheros `.js`, las respuestas van dentro de un comentario `/* */`; en los `.html`, dentro de `<!-- -->`.

Los mensajes del validador y los resultados de ejecución que aparecen en los enunciados son salidas reales.

---

## Ejercicio 1 (muy fácil): verdadero o falso

**Fichero**: `mis soluciones/ejercicio1.js`

Indicar si cada afirmación es verdadera o falsa. Las falsas se corrigen con una frase.

1. Si un formulario se valida con JavaScript en el cliente, no hace falta validarlo en el servidor.
2. Colocar el código en un fichero `.js` externo impide que los visitantes lo lean.
3. JavaScript puede escribir *cookies* en el ordenador del cliente.
4. `https://www.tienda.es` y `https://www.tienda.es:8080` tienen el mismo origen, porque el dominio es el mismo.
5. Google Chrome y Microsoft Edge usan el mismo motor de JavaScript.
6. Si un `<script>` tiene atributo `src`, el código escrito entre sus etiquetas se ejecuta después del fichero.
7. Un mensaje de tipo Warning del validador significa que el documento no es válido.
8. Atom es una buena elección de editor hoy porque es gratuito y libre.
9. Para aprender JavaScript se recomiendan los editores WYSIWYG.
10. Con AJAX, JavaScript puede escribir un fichero directamente en el servidor.

<details>
<summary>Solución</summary>

1. **Falso.** La validación en el cliente es una comodidad para el usuario; el servidor tiene que validar siempre, porque JavaScript se puede desactivar o saltar (§2.1).
2. **Falso.** Basta abrir la ruta del `.js` para descargarlo entero. El código JavaScript nunca se puede ocultar (§7.4).
3. **Verdadero.** Es la única excepción a la prohibición de escribir en el ordenador del cliente (§4.2).
4. **Falso.** El origen lo forman esquema, host y puerto. Cambia el puerto (443 frente a 8080), así que son orígenes distintos (§4.1).
5. **Verdadero.** Los dos usan V8 (y Blink para HTML y CSS) (§3.3).
6. **Falso.** Con `src`, el código interno se ignora y el validador lo marca como error (§7.1).
7. **Falso.** Un Warning señala algo innecesario o desaconsejado en un documento que sigue siendo válido. Solo los mensajes de tipo Error indican que no lo es (§6.3).
8. **Falso.** Es gratuito y libre, pero GitHub lo archivó en diciembre de 2022: no recibe actualizaciones ni parches de seguridad (§5.1).
9. **Falso.** El temario los desaconseja: están orientados al aspecto de la página, y para aprender JavaScript hay que trabajar sobre el código fuente (§5.1).
10. **Falso.** AJAX solo envía peticiones al servidor; quien escribe, si lo hace, es el programa del servidor (§8, pregunta 2).

</details>

---

## Ejercicio 2 (fácil): ¿cliente, servidor o ambos?

**Fichero**: `mis soluciones/ejercicio2.js`

En una tienda en línea, indicar dónde debe hacerse cada tarea: en el **cliente** (JavaScript en el navegador), en el **servidor** o en **ambos**. Justificar cada respuesta en una línea.

1. Comprobar que el código postal tiene 5 cifras antes de enviar el formulario.
2. Guardar el pedido en la base de datos.
3. Recalcular el total del carrito en pantalla al cambiar la cantidad de un producto.
4. Comprobar que queda stock del producto en el almacén.
5. Desplegar y plegar el menú en el móvil.
6. Enviar el correo de confirmación del pedido.
7. Comprobar que la contraseña introducida al iniciar sesión es la correcta.
8. Recordar que el usuario prefiere el tema oscuro, guardándolo en una *cookie*.

<details>
<summary>Solución</summary>

1. **Ambos.** En el cliente para avisar al momento; en el servidor porque el del cliente se puede saltar.
2. **Servidor.** La base de datos está en el servidor, y JavaScript no puede escribir en él.
3. **Cliente.** Es un cálculo de presentación inmediato. (El total que se cobra lo vuelve a calcular el servidor al confirmar el pedido: un precio enviado desde el cliente se puede manipular.)
4. **Servidor.** El dato del stock está en la base de datos del servidor.
5. **Cliente.** Es comportamiento de la interfaz, sin datos que guardar.
6. **Servidor.** JavaScript no puede enviar correos; solo enviar datos a un programa del servidor que los envíe (§4.2).
7. **Servidor.** Las contraseñas guardadas nunca se envían al navegador. Comprobarla en el cliente obligaría a mandarle la contraseña correcta, y cualquiera podría leerla en el código.
8. **Cliente.** Las *cookies* son lo único que JavaScript puede escribir en el ordenador del cliente.

</details>

---

## Ejercicio 3 (fácil): mismo origen

**Fichero**: `mis soluciones/ejercicio3.js`

Una página cargada desde `https://campus.ejemplo.es/cursos/dwec.html` ejecuta un *script*. Para cada URL, indicar si tiene el **mismo origen** que la página y, si no lo tiene, qué parte cambia (esquema, host o puerto).

1. `https://campus.ejemplo.es/foros/tema1.html?id=3`
2. `http://campus.ejemplo.es/cursos/dwec.html`
3. `https://ejemplo.es/cursos/dwec.html`
4. `https://campus.ejemplo.es:443/cursos/`
5. `https://campus.ejemplo.es:8080/cursos/`
6. `https://campus.ejemplo.com/cursos/dwec.html`

<details>
<summary>Solución</summary>

| URL | ¿Mismo origen? | Motivo |
|---|---|---|
| 1 | **Sí** | Cambian la ruta y la consulta (`?id=3`), que no forman parte del origen |
| 2 | **No** | Cambia el esquema: `http` frente a `https` |
| 3 | **No** | Cambia el host: `ejemplo.es` no es `campus.ejemplo.es` |
| 4 | **Sí** | `443` es el puerto por defecto de `https`; escribirlo no cambia nada |
| 5 | **No** | Cambia el puerto: `8080` frente a `443` |
| 6 | **No** | Cambia el host: `.com` frente a `.es` |

La 4 es la trampa: el puerto está escrito, pero es el mismo que se usa cuando no se escribe.

</details>

---

## Ejercicio 4 (media): rutas de un `<script>`

**Fichero**: `mis soluciones/ejercicio4.js`

La página `https://www.ejemplo.es/blog/2026/post.html` contiene un `<script>` con cada uno de estos valores de `src`. Escribir la URL completa del fichero que descarga el navegador en cada caso, e indicar si la ruta es absoluta o relativa.

1. `app.js`
2. `./js/app.js`
3. `../app.js`
4. `../../js/app.js`
5. `/js/app.js`
6. `js/../app.js`
7. `https://cdn.ejemplo.es/app.js`

<details>
<summary>Solución</summary>

La carpeta de la página es `https://www.ejemplo.es/blog/2026/`. Las rutas relativas se resuelven desde ahí; las que empiezan por `/`, desde la raíz del sitio.

| `src` | URL resultante | Tipo |
|---|---|---|
| `app.js` | `https://www.ejemplo.es/blog/2026/app.js` | Relativa |
| `./js/app.js` | `https://www.ejemplo.es/blog/2026/js/app.js` | Relativa |
| `../app.js` | `https://www.ejemplo.es/blog/app.js` | Relativa (sube a `blog/`) |
| `../../js/app.js` | `https://www.ejemplo.es/js/app.js` | Relativa (sube dos niveles, a la raíz) |
| `/js/app.js` | `https://www.ejemplo.es/js/app.js` | Relativa a la raíz del sitio |
| `js/../app.js` | `https://www.ejemplo.es/blog/2026/app.js` | Relativa (entra en `js/` y vuelve a salir) |
| `https://cdn.ejemplo.es/app.js` | `https://cdn.ejemplo.es/app.js` | Absoluta |

Las rutas 4 y 5 llegan al mismo fichero por caminos distintos. La 6 equivale a la 1.

</details>

---

## Ejercicio 5 (media): leer los mensajes del validador

**Fichero**: `mis soluciones/ejercicio5.html`

Al validar esta página, el validador del W3C devuelve los siete mensajes de la tabla.

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Biblioteca municipal</title>
<script type="text/javascript" src="js/catalogo.js"></script>
</head>
<body>
<h1><font color="green">Biblioteca municipal</font></h1>
<a href="/catalogo">Ver catálogo <a href="/novedades">y novedades</a></a>
<li>Horario de mañana</li>
<form>
<input type="txt" name="busqueda">
<img alt="Lupa">
</form>
</body>
</html>
```

| Nº | Línea | Mensaje |
|---|---|---|
| A | 6 | `The "type" attribute is unnecessary for JavaScript resources.` |
| B | 9 | `The "font" element is obsolete. Use CSS instead.` |
| C | 10 | `Start tag "a" seen but an element of the same type was already open.` |
| D | 10 | `Stray end tag "a".` |
| E | 11 | `Element "li" not allowed as child of element "body" in this context.` |
| F | 13 | `Bad value "txt" for attribute "type" on element "input".` |
| G | 14 | `Element "img" is missing one or more of the following attributes: "src", "srcset".` |

Se pide:

1. Para cada mensaje, indicar su **tipo** (Error, Warning o Info) y su **familia** (tabla del §6.4).
2. Dos de los mensajes proceden del mismo fallo. Indicar cuáles y por qué.
3. Escribir la página corregida en el fichero de respuesta, con las respuestas a los puntos 1 y 2 en un comentario al final.

<details>
<summary>Solución</summary>

**1. Tipo y familia**

| Nº | Tipo | Familia | Corrección |
|---|---|---|---|
| A | Warning | Advertencia de estilo | Quitar `type="text/javascript"` |
| B | Error | Elemento obsoleto | Quitar `<font>` y dar el color con CSS |
| C | Error | Anidamiento incorrecto | No meter un enlace dentro de otro: dos enlaces separados |
| D | Error | Anidamiento incorrecto (cascada de C) | Se resuelve con la misma corrección |
| E | Error | Elemento fuera de su contexto | `li` solo va dentro de `ul` u `ol` |
| F | Error | Valor incorrecto de atributo | `type="text"` (o `type="search"` para un buscador) |
| G | Error | Falta un atributo obligatorio | Añadir `src`: una imagen sin fichero no muestra nada |

**2.** C y D proceden del mismo fallo: un `<a>` dentro de otro `<a>`. Al abrirse el segundo, el navegador cierra el primero por su cuenta (C); luego, el `</a>` final no tiene ningún enlace abierto que cerrar (D). Es un error en cascada.

**3. Página corregida** (valida sin ningún mensaje):

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Biblioteca municipal</title>
<script src="js/catalogo.js"></script>
<style>h1 { color: green; }</style>
</head>
<body>
<h1>Biblioteca municipal</h1>
<a href="/catalogo">Ver catálogo</a> y <a href="/novedades">novedades</a>
<ul><li>Horario de mañana</li></ul>
<form>
<input type="search" name="busqueda">
<img src="img/lupa.png" alt="Lupa">
</form>
</body>
</html>
```

</details>

---

## Ejercicio 6 (media): encontrar los errores sin validador

**Fichero**: `mis soluciones/ejercicio6.html`

Esta página tiene **6 problemas: 5 errores y 1 advertencia** según el validador del W3C. (El validador mostrará además una segunda advertencia que no es un problema nuevo: acompaña a uno de los errores para señalar otra línea.)

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Recetas de la abuela</title>
</head>
<body bgcolor="#fff8e7">
<marquee>Nueva receta cada lunes</marquee>
<h1 id="titulo">Tortilla de patatas</h1>
<img src="tortilla.jpg">
<span class="nota"><div>Para 4 personas</div></span>
<h2 id="titulo">Ingredientes</h2>
<label>Raciones <input type="number" name="raciones" min="cero"></label>
</body>
</html>
```

Se pide:

1. **Sin usar el validador**, localizar los seis problemas: línea, familia y por qué es un problema.
2. Después, pasar la página por el validador (opción **text input**) y comparar. Anotar los que no se hayan encontrado.
3. Escribir la página corregida, que debe validar sin ningún mensaje.

<details>
<summary>Solución</summary>

**1. Los seis problemas** (mensajes reales del validador):

| Línea | Tipo | Mensaje | Familia | Corrección |
|---|---|---|---|---|
| 7 | Warning | `The "bgcolor" attribute on the "body" element is obsolete. Use CSS instead.` | Atributo obsoleto | `body { background-color: #fff8e7; }` |
| 8 | Error | `The "marquee" element is obsolete. Use CSS instead.` | Elemento obsoleto | Un `<p>`; si se quiere movimiento, una animación CSS |
| 10 | Error | `An "img" element must have an "alt" attribute…` | Falta atributo obligatorio | `alt="Tortilla de patatas recién hecha"` |
| 11 | Error | `Element "div" not allowed as child of element "span" in this context.` | Elemento fuera de su contexto | Un `span` (en línea) no puede contener un `div` (de bloque): `<p class="nota">` |
| 12 | Error | `Duplicate ID "titulo".` (y el Warning que acompaña, en la línea 9: `The first occurrence of ID "titulo" was here.`) | `id` duplicado | `id="ingredientes"` en el `h2` |
| 13 | Error | `Bad value "cero" for attribute "min" on element "input": Expected a minus sign or a digit but saw "c" instead.` | Valor incorrecto | `min="0"` |

**Observación**: `bgcolor` en `body` es una advertencia y no un error, mientras que `<marquee>` es un error. Los dos son obsoletos, pero el validador no los trata igual. La única forma de saber qué tipo da cada caso es validar.

**3. Página corregida** (valida sin ningún mensaje):

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Recetas de la abuela</title>
<style>body { background-color: #fff8e7; }</style>
</head>
<body>
<p>Nueva receta cada lunes</p>
<h1 id="titulo">Tortilla de patatas</h1>
<img src="tortilla.jpg" alt="Tortilla de patatas recién hecha">
<p class="nota">Para 4 personas</p>
<h2 id="ingredientes">Ingredientes</h2>
<label>Raciones <input type="number" name="raciones" min="0"></label>
</body>
</html>
```

</details>

---

## Ejercicio 7 (media): una justificación mal hecha

**Fichero**: `mis soluciones/ejercicio7.md`

Un alumno entrega esta justificación en la Tarea 1:

> He elegido Sublime Text porque es el mejor editor que existe, es gratis y lo usa todo el mundo. Además es muy rápido y tiene muchas cosas.

Se pide:

1. Enumerar todos sus defectos, comparándola con la estructura de una justificación del §5.1.
2. Explicar por qué, con el enunciado de la Tarea 1, Sublime Text no se puede justificar de ninguna manera.
3. Redactar una justificación correcta para **Visual Studio Code**, con la estructura del §5.1.

<details>
<summary>Solución</summary>

**1. Defectos**

| Defecto | Por qué |
|---|---|
| "Es el mejor editor que existe" | Es una opinión, sin criterio ni dato que la respalde |
| "Es gratis" | Es falso: la licencia de Sublime Text es de pago, aunque se pueda evaluar sin límite de tiempo |
| "Lo usa todo el mundo" | Es una afirmación sin dato y no es un criterio técnico |
| "Tiene muchas cosas" | No dice cuáles. No recorre las seis características del temario |
| Sin mantenimiento | No dice si se sigue actualizando |
| Sin comparación | No explica por qué se descartan las alternativas |
| Sin inconvenientes | No reconoce ninguna limitación |

**2.** La tarea exige que todo lo instalado sea **gratuito**. Sublime Text tiene licencia de pago, así que incumple un requisito del enunciado, por buena que sea la justificación.

**3. Justificación de ejemplo**

> Se ha elegido Visual Studio Code porque es gratuito y su base, Code - OSS, es software libre con licencia MIT. Cumple las seis características que pide el temario: resalta la sintaxis de HTML, CSS y JavaScript; autocompleta (al escribir `document.getE` propone `getElementById`); permite ir a la definición de una función; marca los errores de sintaxis mientras se escribe; genera el esqueleto HTML5 escribiendo `!` y pulsando Tab; e integra Git para ver los cambios de cada fichero. Recibe actualizaciones mensuales. Se descartó Sublime Text porque su licencia es de pago, y Atom porque GitHub dejó de mantenerlo en 2022. Como inconvenientes, consume más memoria que un editor ligero como Notepad++, y algunas funciones dependen de instalar extensiones.

</details>

---

## Ejercicio 8 (media): crear una página con JavaScript externo

**Fichero**: carpeta `mis soluciones/ejercicio8/`, con `index.html` y `js/tienda.js`

Crear desde cero una página para una librería que cumpla estos requisitos:

1. Título de la pestaña: "Librería Páginas". Idioma: español.
2. Un encabezado con el nombre de la librería y un párrafo con un libro y su precio.
3. Un botón "Añadir al carrito" que, al pulsarlo, muestre el aviso "Libro añadido al carrito".
4. El código JavaScript va en `js/tienda.js`, enlazado desde el `<head>`, en una función llamada `anadirAlCarrito`.
5. Un mensaje para los navegadores sin JavaScript.
6. La página valida en el W3C **sin ningún mensaje** (ni errores ni advertencias).

Comprobar el funcionamiento abriendo `index.html` en dos navegadores con motores distintos, y la validación con la opción **file upload** del validador.

<details>
<summary>Solución</summary>

`index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Librería Páginas</title>
  <script src="js/tienda.js"></script>
</head>
<body>
  <h1>Librería Páginas</h1>
  <noscript>Para añadir libros al carrito hay que activar JavaScript.</noscript>
  <p>El nombre del viento: 22,90 €</p>
  <button onclick="anadirAlCarrito()">Añadir al carrito</button>
</body>
</html>
```

`js/tienda.js`:

```js
// Muestra un aviso al añadir el libro al carrito
function anadirAlCarrito() {
  alert('Libro añadido al carrito');
}
```

Puntos que se suelen fallar:

- `lang="es"` en `<html>`: sin él, el validador da una advertencia.
- `<script src>` **sin** `type="text/javascript"`: con él, otra advertencia.
- `</script>` escrito aunque la etiqueta esté vacía.
- El `<script>` puede ir en el `<head>` sin `defer` porque solo **define** la función; no toca ningún elemento de la página hasta que se pulsa el botón.
- La función se llama `anadirAlCarrito`, sin `ñ`. JavaScript admite la `ñ` en los identificadores, pero se evita por convención.

</details>

---

## Ejercicio 9 (difícil): predecir qué ocurre

**Fichero**: `mis soluciones/ejercicio9.js`

Para cada página, indicar qué texto muestra el `<h1>` (si lo hay), qué aparece en la consola y por qué. En el caso C, el fichero `js/a.js` existe y contiene `console.log('externo cargado');`.

**A.**

```html
<!DOCTYPE html>
<html><head>
<script>document.querySelector('h1').textContent = 'Hola';</script>
</head><body><h1>Título</h1></body></html>
```

**B.**

```html
<!DOCTYPE html>
<html><head></head><body>
<h1>Título</h1>
<script>document.querySelector('h1').textContent = 'Hola';</script>
</body></html>
```

**C.**

```html
<!DOCTYPE html>
<html><head>
<script src="js/a.js">console.log('interno');</script>
</head><body></body></html>
```

**D.**

```html
<!DOCTYPE html>
<html><head>
<script>saludar();</script>
<script>function saludar() { console.log('hola'); }</script>
</head><body></body></html>
```

**E.**

```html
<!DOCTYPE html>
<html><head>
<script>function saludar() { console.log('hola'); }</script>
<script>saludar();</script>
</head><body></body></html>
```

**F.**

```html
<!DOCTYPE html>
<html><head>
<script defer>document.querySelector('h1').textContent = 'Hola';</script>
</head><body><h1>Título</h1></body></html>
```

<details>
<summary>Solución</summary>

| Caso | `<h1>` | Consola | Por qué |
|---|---|---|---|
| A | `Título` | `TypeError: Cannot set properties of null (setting 'textContent')` | El *script* se ejecuta en el `<head>`, antes de que exista el `<h1>`: `querySelector` devuelve `null` |
| B | `Hola` | Nada | El *script* está al final del `<body>`; el `<h1>` ya existe |
| C | (no hay) | `externo cargado` | Con `src`, el código interno se ignora: `interno` no aparece nunca |
| D | (no hay) | `ReferenceError: saludar is not defined` | Los *scripts* se ejecutan en orden. El primero llama a una función que define el segundo, que aún no se ha ejecutado |
| E | (no hay) | `hola` | El orden es el correcto: primero se define, luego se llama |
| F | `Título` | El mismo `TypeError` que en A | `defer` no tiene efecto sin `src`: el código se ejecuta igual que en A. El validador, además, lo marca como error |

Los casos A y F son el mismo fallo; F es la trampa, porque `defer` parece arreglarlo.

</details>

---

## Ejercicio 10 (difícil): ¿es correcto?

**Fichero**: `mis soluciones/ejercicio10.html`

Cada línea se coloca en el `<head>` de una página por lo demás válida. Indicar si es **correcta**, **correcta con advertencia** o **incorrecta**, y explicar por qué. En las incorrectas, describir qué ve el usuario y escribir la versión correcta.

1. `<script src="js/app.js"/>`
2. `<script src="js/app.js" type="text/javascript"></script>`
3. `<script src="js/app.js" defer></script>`
4. `<script defer>console.log('hola');</script>`
5. `<script src="js/app.js">  </script>` (con dos espacios entre las etiquetas)
6. `<script src="js/app.js"></script><script src="js/menu.js"></script>`

<details>
<summary>Solución</summary>

| Nº | Resultado | Explicación |
|---|---|---|
| 1 | **Incorrecta** | La barra final no cierra un `<script>`. Todo lo que sigue (`</head>`, el `<body>` entero) pasa a ser texto del *script*, y como tiene `src`, ese texto se ignora: **la página se ve en blanco**. El validador da `Self-closing syntax ("/>") used on a non-void HTML element.` Correcto: `<script src="js/app.js"></script>` |
| 2 | **Correcta con advertencia** | Válida, pero el validador avisa: `The "type" attribute is unnecessary for JavaScript resources.` |
| 3 | **Correcta** | `defer` con `src`: el fichero se ejecuta cuando el documento se ha leído entero |
| 4 | **Incorrecta** | `defer` sin `src` no tiene efecto, y el validador lo marca como error: `An inline "script" element […] must not have a "defer" attribute.` El usuario no nota nada, porque `console.log` no depende del DOM. Correcto: `<script>console.log('hola');</script>` |
| 5 | **Correcta** | Con `src` se admiten espacios y saltos de línea entre las etiquetas; lo que no se admite es código |
| 6 | **Correcta** | Un `<script>` por fichero; se ejecutan en el orden en que aparecen: primero `app.js`, después `menu.js` |

</details>

---

## Ejercicio 11 (difícil): XSS en un muro de comentarios

**Fichero**: `mis soluciones/ejercicio11.js`

Una página publica comentarios con esta función, que se ejecuta al pulsar "Publicar":

```js
function publicarComentario() {
  const texto = document.getElementById('comentario').value; // ← lo que ha escrito el usuario
  document.getElementById('muro').innerHTML += '<p>' + texto + '</p>';
}
```

Se pide:

1. Nombrar la vulnerabilidad y explicar en qué línea está y por qué.
2. Un compañero propone probarla escribiendo `<script>alert(document.cookie)</script>` en el comentario. ¿Funciona? ¿Por qué?
3. Escribir un comentario que sí ejecute `alert(document.cookie)`.
4. Tal como está, el comentario solo se muestra en el navegador de quien lo escribe. ¿Qué tendría que cambiar en la aplicación para que el ataque afectara a otros usuarios?
5. Corregir la función.

<details>
<summary>Solución</summary>

1. **XSS** (*Cross-Site Scripting*). Está en la segunda línea: el texto del usuario se inserta con `innerHTML`, así que el navegador lo interpreta como HTML. Si el texto contiene etiquetas con atributos de evento, su código se ejecuta con los permisos de la página.
2. **No funciona.** Un `<script>` insertado con `innerHTML` se añade a la página, pero el navegador no lo ejecuta (§4.3).
3. Una imagen con una ruta que no existe y un `onerror`:

   ```html
   <img src="no-existe.png" onerror="alert(document.cookie)">
   ```

   La imagen no carga, salta el evento `error` y se ejecuta su código.
4. Que los comentarios se **guarden en el servidor** y se muestren a todos los que visitan la página. Así el código del atacante llega al navegador de cada visitante y se ejecuta desde el origen legítimo de la web, con acceso a sus *cookies*.
5. Insertar el texto como **texto**, no como HTML:

   ```js
   function publicarComentario() {
     const texto = document.getElementById('comentario').value;
     const parrafo = document.createElement('p');
     parrafo.textContent = texto; // ← se muestra tal cual; las etiquetas no se interpretan
     document.getElementById('muro').append(parrafo);
   }
   ```

   `createElement` y `append` se estudian en el tema 6. Lo esencial es `textContent` en lugar de `innerHTML`. Además, la aplicación debe hacer lo mismo en el servidor al guardar y al mostrar los comentarios.

</details>

---

## Ejercicio 12 (MUY DIFÍCIL): la agenda que no funciona

**Fichero**: carpeta `mis soluciones/ejercicio12/`, con `index.html`, `js/app.js` y `respuestas.md`

Un proyecto tiene esta estructura:

- `proyecto/`
  - `index.html`
  - `js/`
    - `app.js`

`index.html`:

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Agenda</title>
<script src="../js/app.js">
  console.log('Agenda cargada');
</script>
</head>
<body>
<h1 id="titulo">Agenda</h1>
<ul id="lista">
  <li>Dentista, 10:00</li>
  <p>Gimnasio, 18:00</p>
</ul>
<p id="titulo">Hoy</p>
<button onclick="mostrarTotal()">Total de citas</button>
</body>
</html>
```

`js/app.js`:

```js
document.getElementById('titulo').textContent = 'Mi agenda';

function mostrarTotal() {
  alert('Citas: ' + document.querySelectorAll('#lista li').length);
}
```

El resultado esperado es este:

- el encabezado dice "Mi agenda";
- la consola muestra "Agenda cargada";
- el botón muestra "Citas: 2";
- el validador no da ningún mensaje.

Ahora mismo no se cumple ninguna de las cuatro cosas.

Se pide:

1. Localizar **todos** los problemas. Para cada uno, indicar cómo se detecta (validador, consola o comportamiento), su causa y su corrección.
2. Los problemas están en capas: al arreglar uno aparece el siguiente. Describir qué se ve en la consola y en la página **antes de corregir nada** y **después de corregir solo la ruta**.
3. Explicar por qué el botón cuenta mal las citas aunque el JavaScript de `mostrarTotal` sea correcto.
4. Entregar los dos ficheros corregidos, que deben cumplir los cuatro puntos del resultado esperado.

<details>
<summary>Solución</summary>

**1. Los problemas**

| Nº | Problema | Cómo se detecta | Corrección |
|---|---|---|---|
| 1 | Ruta `../js/app.js`: desde `proyecto/index.html`, `..` sale de `proyecto/` y busca un `js/` que no existe | Consola: error de carga del fichero (404 o fichero no encontrado) | `src="js/app.js"` |
| 2 | Código dentro de un `<script>` con `src`: se ignora, así que "Agenda cargada" no sale nunca | Validador: `The text content of element "script" was not in the required format` | Mover el `console.log` a `app.js` (o a un `<script>` aparte) |
| 3 | *Script* en el `<head>` sin `defer`: `app.js` busca `#titulo` antes de que exista | Consola: `TypeError: Cannot set properties of null (setting 'textContent')` | Añadir `defer` (o mover el `<script>` al final del `<body>`) |
| 4 | `<p>` dentro de `<ul>`: el gimnasio no es un `li` | Validador: `Element "p" not allowed as child of element "ul" in this context.` Comportamiento: "Citas: 1" | `<li>Gimnasio, 18:00</li>` |
| 5 | `id="titulo"` repetido en el `<h1>` y en el `<p>` | Validador: `Duplicate ID "titulo".` | Otro `id` para el `<p>`, por ejemplo `subtitulo` |
| 6 | Falta `lang` en `<html>` | Validador (Warning): `Consider adding a "lang" attribute…` | `<html lang="es">` |

**2. Las capas**

- **Antes de corregir nada**: `app.js` no se carga (problema 1). El encabezado sigue diciendo "Agenda", la consola muestra el error de carga del fichero y, al pulsar el botón, `ReferenceError: mostrarTotal is not defined`, porque la función está en un fichero que no ha llegado. Tampoco sale "Agenda cargada" (problema 2).
- **Después de corregir solo la ruta**: `app.js` se carga, pero se ejecuta en el `<head>`. La primera línea lanza el `TypeError` del problema 3 y el encabezado sigue diciendo "Agenda". El botón ya responde, pero muestra "Citas: 1" (problema 4).

**3.** `querySelectorAll('#lista li')` cuenta los `li` de la lista, y solo hay uno: el gimnasio está en un `<p>`. El navegador no corrige ese error, mantiene el `<p>` dentro del `<ul>` tal cual, y el *script* recorre la estructura real, no la que el autor tenía en la cabeza. Es el caso del §6.1: el HTML inválido produce un comportamiento de JavaScript inesperado.

> **Nota (adelanto del tema 2)**: con la ruta corregida y sin `defer`, la primera línea de `app.js` falla y, aun así, el botón funciona. Las funciones declaradas con `function` se crean antes de ejecutar ninguna línea del fichero (*hoisting*), así que `mostrarTotal` ya existe cuando la línea 1 falla.

**4. Ficheros corregidos**

`index.html` (valida sin ningún mensaje):

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Agenda</title>
<script src="js/app.js" defer></script>
</head>
<body>
<h1 id="titulo">Agenda</h1>
<ul id="lista">
  <li>Dentista, 10:00</li>
  <li>Gimnasio, 18:00</li>
</ul>
<p id="subtitulo">Hoy</p>
<button onclick="mostrarTotal()">Total de citas</button>
</body>
</html>
```

`js/app.js`:

```js
console.log('Agenda cargada');
document.getElementById('titulo').textContent = 'Mi agenda';

function mostrarTotal() {
  alert('Citas: ' + document.querySelectorAll('#lista li').length);
}
```

Resultado comprobado: encabezado "Mi agenda", consola "Agenda cargada", botón "Citas: 2" y validador sin mensajes.

> **¿Por qué el `id` duplicado no rompía nada aquí?** `getElementById` devuelve el **primer** elemento con ese `id`, que era el `<h1>`, justo el que se quería cambiar. Si el `<p>` hubiera estado antes, el *script* habría cambiado el `<p>`. Que funcione por casualidad no lo hace correcto.

</details>
