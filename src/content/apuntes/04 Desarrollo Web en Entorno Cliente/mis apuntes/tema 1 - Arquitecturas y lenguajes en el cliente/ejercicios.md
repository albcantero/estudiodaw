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

---

## Ejercicio 7 (media): una justificación mal hecha

**Fichero**: `mis soluciones/ejercicio7.md`

Un alumno entrega esta justificación en la Tarea 1:

> He elegido Sublime Text porque es el mejor editor que existe, es gratis y lo usa todo el mundo. Además es muy rápido y tiene muchas cosas.

Se pide:

1. Enumerar todos sus defectos, comparándola con la estructura de una justificación del §5.1.
2. Explicar por qué, con el enunciado de la Tarea 1, Sublime Text no se puede justificar de ninguna manera.
3. Redactar una justificación correcta para **Visual Studio Code**, con la estructura del §5.1.

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

