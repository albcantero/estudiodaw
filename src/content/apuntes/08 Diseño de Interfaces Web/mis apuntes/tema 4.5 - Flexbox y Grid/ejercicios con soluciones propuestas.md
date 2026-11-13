# Ejercicios del tema 4.5: Flexbox y Grid (con soluciones propuestas)

Cada ejercicio se resuelve en `mis soluciones/ejercicioN.html`, con el CSS dentro de un `<style>` en la cabecera (salvo el 1 y el 3, que son de responder: `ejercicioN.css` con las respuestas en un comentario `/* */`). Todos los HTML empiezan con `<!DOCTYPE html>`, `<html lang="es">`, `<meta charset="utf-8">` y un `<title>`.

Para comprobar el resultado, abre el fichero en el navegador; con F12, el inspector dibuja la rejilla de Grid y los ejes de Flexbox.

---

## Ejercicio 1 (muy fácil): verdadero o falso

Indica si cada afirmación es verdadera o falsa y, si es falsa, corrígela.

1. Flexbox es un sistema de maquetación bidimensional.
2. `display: flex` se pone en los elementos que se quieren colocar en fila.
3. Con `flex-direction: column`, `justify-content` reparte los elementos en vertical.
4. La unidad `fr` se puede usar en `width`: `width: 1fr`.
5. En `grid-area` el nombre de la zona se escribe sin comillas.
6. Con `box-sizing: border-box`, el `margin` queda incluido en el `width`.
7. `space-evenly` deja el mismo espacio en los extremos que entre los elementos.
8. Todas las filas de `grid-template-areas` tienen que tener el mismo número de celdas.

<details>
<summary>Solución propuesta</summary>

```css
/*
1. Falso. Flexbox es unidimensional (una fila o una columna); el bidimensional es Grid.
2. Falso. display: flex se pone en el PADRE (el contenedor); sus hijos directos son los que se colocan.
3. Verdadero. Con column el eje principal es el vertical, y justify-content trabaja en el eje principal.
4. Falso. fr solo existe en grid-template-columns y grid-template-rows.
5. Verdadero. Las comillas van en grid-template-areas, no en grid-area.
6. Falso. border-box incluye el padding y el borde, nunca el margin.
7. Verdadero.
8. Verdadero. Si no, la declaración es inválida y el navegador la ignora.
*/
```

</details>

---

## Ejercicio 2 (muy fácil): centrar una caja

Haz una página con una caja azul de 200 × 200 px **centrada en horizontal y en vertical** en la ventana, sobre un fondo gris claro. Usa Flexbox.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 2</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      height: 100vh;               /* sin altura no hay centrado vertical */
      display: flex;
      justify-content: center;     /* horizontal (eje principal: fila) */
      align-items: center;         /* vertical (eje cruzado) */
      background-color: #eee;
    }
    .caja { width: 200px; height: 200px; background-color: #3C6E8F; }
  </style>
</head>
<body>
  <div class="caja"></div>
</body>
</html>
```

</details>

---

## Ejercicio 3 (fácil): predecir la posición

Un contenedor de **600 px** de ancho tiene `display: flex` y tres hijos de **100 px** de ancho cada uno, sin `gap` ni márgenes. Para cada valor de `justify-content`, indica a cuántos píxeles del borde izquierdo empieza cada caja:

1. `flex-start`
2. `flex-end`
3. `center`
4. `space-between`
5. `space-around`
6. `space-evenly`

Y una más: si el contenedor tuviera **400 px de alto**, `flex-direction: column`, `justify-content: center` y las cajas midieran **100 px de alto**, ¿a qué altura empezaría cada una?

<details>
<summary>Solución propuesta</summary>

```css
/*
Espacio libre: 600 - 3 x 100 = 300 px.

1. flex-start:    0, 100, 200      (todas pegadas a la izquierda)
2. flex-end:      300, 400, 500    (todas pegadas a la derecha)
3. center:        150, 250, 350    (300 libres: 150 a cada lado del grupo)
4. space-between: 0, 250, 500      (300 libres repartidos en los 2 huecos interiores: 150 cada uno)
5. space-around:  50, 250, 450     (300 / 3 cajas = 100 por caja, 50 a cada lado: extremos 50, entre cajas 100)
6. space-evenly:  75, 250, 425     (300 / 4 huecos = 75 en cada hueco, extremos incluidos)

Columna de 400 px: libres 400 - 300 = 100, la mitad arriba y la mitad abajo.
Empiezan a 50, 150 y 250 px del borde superior. Con column, justify-content trabaja en vertical.
*/
```

</details>

---

## Ejercicio 4 (fácil): menú horizontal

Haz un menú con una **lista** de cuatro opciones (Inicio, Productos, Tienda, Contacto), en fila, con 6 px de separación entre opciones, sin viñetas. Cada opción es un enlace con fondo `#2F5E85`, letra blanca y sin subrayado. Al pasar el ratón, el fondo pasa a `#F2A541`. La opción **Inicio** tiene la clase `actual` y se ve siempre en naranja.

Requisito: tiene que poder pulsarse en cualquier punto de la pestaña, no solo sobre el texto.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 4</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .menu {
      display: flex;            /* el ul es el contenedor: los li, en fila */
      gap: 6px;
      list-style-type: none;    /* sin viñetas */
    }
    .menu a {
      display: block;           /* el enlace ocupa toda la pestaña */
      padding: 8px 16px;
      background-color: #2F5E85;
      color: #fff;
      text-decoration: none;
    }
    .menu a:hover,
    .menu a.actual { background-color: #F2A541; }
  </style>
</head>
<body>
  <nav>
    <ul class="menu">
      <li><a href="#" class="actual">Inicio</a></li>
      <li><a href="#">Productos</a></li>
      <li><a href="#">Tienda</a></li>
      <li><a href="#">Contacto</a></li>
    </ul>
  </nav>
</body>
</html>
```

Lo que importa:

- `display: flex` va en el `ul`, que es el padre de los `li`.
- `display: block` en el `a` hace que el relleno sea parte del enlace: se pulsa en toda la pestaña.

</details>

---

## Ejercicio 5 (fácil): cabecera y barra con dos extremos

Haz dos piezas:

1. Una **cabecera** con fondo `#2F5E85` y 20 px de relleno: el nombre "Tienda Ola" (un `h1`, blanco) a la izquierda y un menú de tres enlaces blancos a la derecha, los dos **centrados en vertical**.
2. Debajo, la **barra de un artículo**: fondo `#3C74E6`, el título "Ofertas de noviembre" a la izquierda en mayúsculas y la fecha "13/11/2026" a la derecha.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 5</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    header {
      display: flex;
      justify-content: space-between;   /* título a un extremo, menú al otro */
      align-items: center;              /* los dos a la misma altura */
      padding: 20px;
      background-color: #2F5E85;
      color: #fff;
    }
    header nav { display: flex; gap: 15px; }
    header a { color: #fff; text-decoration: none; }
    .barra {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      background-color: #3C74E6;
      color: #fff;
    }
    .barra h2 { font-size: 1rem; text-transform: uppercase; }
  </style>
</head>
<body>
  <header>
    <h1>Tienda Ola</h1>
    <nav>
      <a href="#">Inicio</a>
      <a href="#">Ofertas</a>
      <a href="#">Contacto</a>
    </nav>
  </header>
  <article>
    <div class="barra">
      <h2>Ofertas de noviembre</h2>
      <span>13/11/2026</span>
    </div>
  </article>
</body>
</html>
```

El mismo patrón (`space-between` + `align-items: center`) resuelve las dos piezas.

</details>

---

## Ejercicio 6 (medio): `flex-grow`

**a)** Un contenedor flex de **900 px** tiene tres hijos con `flex-basis: 100px` y `flex-grow` de 1, 2 y 3. ¿Cuánto mide cada uno? Responde en un comentario.

**b)** Haz un **buscador**: un campo de texto y un botón "Buscar" en la misma línea, dentro de una caja de 500 px. El botón tiene su ancho natural y **el campo ocupa todo lo demás**, con 5 px de separación.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 6</title>
  <style>
    /*
    a) Base: 3 x 100 = 300. Libre: 900 - 300 = 600, repartido en 1 + 2 + 3 = 6 partes de 100.
       Primero: 100 + 100 = 200 px. Segundo: 100 + 200 = 300 px. Tercero: 100 + 300 = 400 px.
       Ojo: no es "1/6, 2/6 y 3/6 del total"; flex-grow reparte solo el espacio SOBRANTE.
    */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .buscador { display: flex; gap: 5px; width: 500px; }
    .buscador input { flex: 1; padding: 5px; }    /* crece y ocupa lo que deja el botón */
    .buscador button { padding: 5px 15px; }
  </style>
</head>
<body>
  <form class="buscador">
    <input type="text" name="q" placeholder="¿Qué buscas?">
    <button type="submit">Buscar</button>
  </form>
</body>
</html>
```

</details>

---

## Ejercicio 7 (medio): galería que se reparte en filas

Dentro de un contenedor de **700 px**, coloca **ocho** cajas de 150 × 100 px (pueden ser `div` de colores, en lugar de imágenes) con **10 px de separación**, que pasen a la línea siguiente cuando no quepan.

Responde también en un comentario: ¿cuántas cajas caben en cada fila y cuántas filas salen?

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 7</title>
  <style>
    /*
    4 cajas: 4 x 150 + 3 x 10 = 630 px, caben en 700.
    5 cajas: 5 x 150 + 4 x 10 = 790 px, no caben.
    Caben 4 por fila: 8 cajas, 2 filas.
    */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .galeria {
      width: 700px;
      display: flex;
      flex-wrap: wrap;     /* sin esto, las 8 se aplastarían en una sola fila */
      gap: 10px;
    }
    .galeria div { width: 150px; height: 100px; background-color: #CAE646; }
  </style>
</head>
<body>
  <div class="galeria">
    <div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div>
  </div>
</body>
</html>
```

</details>

---

## Ejercicio 8 (medio): encuentra los 5 errores

Esta hoja quiere una página con cabecera arriba, lateral y contenido en la fila de en medio, pie abajo, un menú en fila y una barra con el título y la fecha en los extremos. Tiene **5 errores**. Encuéntralos, explica por qué fallan y corrígelos.

```css
.pagina {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-areas:
    "cabecera cabecera"
    "lateral contenido pie";
}
header { grid-area: "cabecera"; }
aside  { grid-area: lateral; width: 1fr; }
main   { grid-area: contenido; }
footer { grid-area: pie; }
nav li { display: flex; }
.barra { display: flex; justify-content: space-between; align-items: middle; }
```

<details>
<summary>Solución propuesta</summary>

```css
/*
1. La segunda fila de grid-template-areas tiene 3 celdas y la primera 2. Todas las filas
   deben tener tantas celdas como columnas; si no, toda la declaración es inválida.
   El pie va en una tercera fila: "pie pie".
2. grid-area: "cabecera" lleva comillas. En grid-area el nombre va sin comillas.
3. width: 1fr no es válido: fr solo existe en grid-template-columns/rows.
   El ancho del lateral ya lo da la rejilla (1fr); se quita el width.
4. display: flex en los li no los pone en fila: flex se pone en el PADRE, el ul.
5. align-items: middle no existe. Es center.
*/
.pagina {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-areas:
    "cabecera cabecera"
    "lateral  contenido"
    "pie      pie";
}
header { grid-area: cabecera; }
aside  { grid-area: lateral; }
main   { grid-area: contenido; }
footer { grid-area: pie; }
nav ul { display: flex; }
.barra { display: flex; justify-content: space-between; align-items: center; }
```

</details>

---

## Ejercicio 9 (medio): rejilla de tarjetas

**a)** Seis tarjetas (`article` con un título y un párrafo) en **3 columnas iguales** con 20 px de separación, dentro de un contenedor de 900 px. Cada tarjeta, con borde gris de 1 px, 15 px de relleno y esquinas redondeadas de 8 px.

**b)** Cambia la rejilla para que se adapte sola: tantas columnas de **al menos 220 px** como quepan. Comprueba en el navegador qué pasa al estrechar la ventana.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 9</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .tarjetas {
      max-width: 900px;
      margin: 20px auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);                        /* a) tres columnas iguales */
      /* grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));   b) adaptable */
      gap: 20px;
    }
    .tarjetas article {
      border: 1px solid #999;
      padding: 15px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <section class="tarjetas">
    <article><h2>Uno</h2><p>Texto de la tarjeta.</p></article>
    <article><h2>Dos</h2><p>Texto de la tarjeta.</p></article>
    <article><h2>Tres</h2><p>Texto de la tarjeta.</p></article>
    <article><h2>Cuatro</h2><p>Texto de la tarjeta.</p></article>
    <article><h2>Cinco</h2><p>Texto de la tarjeta.</p></article>
    <article><h2>Seis</h2><p>Texto de la tarjeta.</p></article>
  </section>
</body>
</html>
```

Con la b), en una ventana ancha caben tres o cuatro columnas; al estrecharla bajan a dos y luego a una. Las tarjetas de una fila miden siempre lo mismo de alto, aunque una tenga más texto.

</details>

---

## Ejercicio 10 (medio): formulario con Grid

Haz un formulario de acceso con **dos columnas**: las etiquetas a la izquierda (120 px) y los campos a la derecha (el resto), con 10 px de separación. Campos: Usuario (texto) y Contraseña (contraseña). El botón "Entrar" va **en la columna de los campos**, alineado a la derecha. Debajo, un enlace "¿Olvidaste la contraseña?" que ocupa **las dos columnas**. Ancho total: 350 px.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 10</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .acceso {
      width: 350px;
      display: grid;
      grid-template-columns: 120px 1fr;   /* etiquetas | campos */
      gap: 10px;
      align-items: center;                /* cada etiqueta, a la altura de su campo */
      padding: 15px;
      border: 1px solid #3E9722;
    }
    .acceso input { padding: 4px; }
    .acceso button {
      grid-column: 2;                     /* el botón, en la columna de los campos */
      justify-self: end;                  /* alineado a la derecha de su celda */
      padding: 4px 12px;
    }
    .acceso a { grid-column: 1 / -1; }    /* el enlace ocupa las dos columnas */
  </style>
</head>
<body>
  <form class="acceso">
    <label for="usuario">Usuario</label>
    <input type="text" id="usuario" name="usuario">
    <label for="clave">Contraseña</label>
    <input type="password" id="clave" name="clave">
    <button type="submit">Entrar</button>
    <a href="#">¿Olvidaste la contraseña?</a>
  </form>
</body>
</html>
```

Lo que importa:

- Cada `label` y su `input` caen solos en una fila, porque la rejilla tiene dos columnas y los elementos se van colocando en orden.
- `grid-column: 2` salta la primera celda para el botón.
- `grid-column: 1 / -1` estira el enlace a todo el ancho.
- El `for` de cada `label` coincide con el `id` de su campo: al pulsar la etiqueta, se activa el campo.

</details>

---

## Ejercicio 11 (difícil): variación del ejemplo de la tutoría

Sin mirar los apuntes, reproduce la maqueta de `GridLayout.html` (cabecera, menú, lateral, contenido con tres secciones y pie, a pantalla completa) con estos **cambios**:

- **Tres columnas** en proporción 1 : 3 : 1: el lateral a la **izquierda** y otro a la **derecha** (`<aside class="publi">`).
- Cabecera, menú y pie ocupan las tres columnas.
- Las tres secciones del contenido van **en fila**, no en columna, repartidas con el mismo espacio en los extremos y entre ellas, y centradas en vertical.
- Cada sección mide el 25 % del ancho y el 50 % del alto de su zona.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 11</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100vw; height: 100vh; }
    .container {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr 1fr 3fr 1fr;
      grid-template-columns: 1fr 3fr 1fr;
      grid-template-areas:
        "header header header"
        "nav    nav    nav"
        "aside  main   publi"
        "footer footer footer";
    }
    header      { grid-area: header; background-color: gray; }
    nav         { grid-area: nav;    background-color: blueviolet; }
    aside       { grid-area: aside;  background-color: green; }
    aside.publi { grid-area: publi;  background-color: teal; }
    main {
      grid-area: main;
      background-color: blue;
      display: flex;                    /* fila por defecto: las secciones, en horizontal */
      justify-content: space-evenly;    /* mismo espacio en extremos y entre secciones */
      align-items: center;              /* centradas en vertical */
    }
    section { width: 25%; height: 50%; background-color: orangered; }
    footer  { grid-area: footer; background-color: yellow; }
  </style>
</head>
<body>
  <div class="container">
    <header></header>
    <nav></nav>
    <aside></aside>
    <main>
      <section></section>
      <section></section>
      <section></section>
    </main>
    <aside class="publi"></aside>
    <footer></footer>
  </div>
</body>
</html>
```

Lo que importa:

- Hay dos `aside`, y el selector `aside.publi` es más específico que `aside`, así que su `grid-area: publi` gana.
- Quitar `flex-direction: column` vuelve a la fila. Con fila, `justify-content` reparte en horizontal y `align-items` centra en vertical, al revés que en el original.

</details>

---

## Ejercicio 12 (difícil): de `float` a Grid

Esta maqueta de la unidad 4 está hecha con `float`. Reescribe **solo el CSS** con Grid, con etiquetas HTML5, para que mida **exactamente lo mismo**: página de 800 px centrada, cabecera con 20 px de relleno arriba y a los lados, lateral de 200 px con 10 px de relleno a cada lado, contenido de 560 px con 20 px de relleno izquierdo, y pie con 10 px de relleno vertical y borde superior gris.

```css
#pagina    { width: 800px; margin: 0 auto; }
#cabecera  { width: 760px; padding: 20px 20px 0; }
#lateral   { float: left; width: 200px; padding: 0 10px; }
#principal { float: left; width: 560px; padding-left: 20px; }
#pie       { clear: both; padding: 10px 0; border-top: 1px solid #999; }
```

Responde también en un comentario: ¿qué ancho ponen las columnas en `grid-template-columns` y por qué?

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 12</title>
  <style>
    /*
    Con box-sizing: border-box el relleno va DENTRO del ancho de la caja:
    lateral   = 200 + 10 + 10 = 220 px
    principal = 560 + 20      = 580 px
    total     = 220 + 580     = 800 px = ancho de la página.
    La cabecera y el pie ocupan las dos columnas: no necesitan width.
    */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .pagina {
      width: 800px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 220px 580px;
      grid-template-areas:
        "cabecera cabecera"
        "lateral  principal"
        "pie      pie";
    }
    header { grid-area: cabecera; padding: 20px 20px 0; }
    aside  { grid-area: lateral; padding: 0 10px; }
    main   { grid-area: principal; padding-left: 20px; }
    footer { grid-area: pie; padding: 10px 0; border-top: 1px solid #999; }
  </style>
</head>
<body>
  <div class="pagina">
    <header><h1>Club de lectura</h1></header>
    <aside><h2>Sesiones</h2><p>Jueves, 19:00.</p></aside>
    <main><h2>Libro del mes</h2><p>Una novela corta.</p></main>
    <footer><p>Biblioteca municipal.</p></footer>
  </div>
</body>
</html>
```

Ya no hacen falta `float`, `clear` ni restar el relleno del ancho a mano: el pie está en su propia fila.

</details>

---

## Ejercicio 13 (difícil): versión para móvil

Parte del ejercicio 12 y haz que, en pantallas de **600 px o menos**:

- la página ocupe todo el ancho (no 800 px);
- haya **una sola columna**, con el orden cabecera, **contenido**, lateral, pie (el lateral pasa debajo del contenido);
- el lateral tenga 10 px de relleno en los cuatro lados.

No toques el HTML. Añade también la etiqueta que hace falta en el `<head>` para que el móvil no muestre la página reducida.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejercicio 13</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .pagina {
      width: 800px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 220px 580px;
      grid-template-areas:
        "cabecera cabecera"
        "lateral  principal"
        "pie      pie";
    }
    header { grid-area: cabecera; padding: 20px 20px 0; }
    aside  { grid-area: lateral; padding: 0 10px; }
    main   { grid-area: principal; padding-left: 20px; }
    footer { grid-area: pie; padding: 10px 0; border-top: 1px solid #999; }

    @media (max-width: 600px) {
      .pagina {
        width: 100%;
        grid-template-columns: 1fr;          /* una columna */
        grid-template-areas:
          "cabecera"
          "principal"
          "lateral"
          "pie";                             /* el lateral, debajo del contenido */
      }
      aside { padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="pagina">
    <header><h1>Club de lectura</h1></header>
    <aside><h2>Sesiones</h2><p>Jueves, 19:00.</p></aside>
    <main><h2>Libro del mes</h2><p>Una novela corta.</p></main>
    <footer><p>Biblioteca municipal.</p></footer>
  </div>
</body>
</html>
```

El HTML no cambia: el orden visual lo decide `grid-template-areas`. Para probarlo, estrecha la ventana del navegador, o usa el modo de dispositivo del inspector (F12, icono del móvil).

</details>

---

## Ejercicio 14 (MUY DIFÍCIL): portal completo

Sin mirar los apuntes y en un solo fichero, maqueta el portal del **Gimnasio Atlas** con Grid y Flexbox:

**Medidas**

- Página de **940 px**, centrada, con fondo blanco sobre fondo de ventana `#DDD`.
- **Cabecera**: 15 px de relleno arriba y a los lados, fondo degradado vertical de `#3E9722` a `#2A6B17`. El nombre "Gimnasio Atlas" (h1, blanco) a la izquierda y, a la derecha y pegado abajo, un **menú de pestañas** (lista) con Inicio, Clases, Tarifas y Contacto. Las pestañas tienen las esquinas de arriba redondeadas (6 px); fondo `#2A6B17`; `#E58C24` al pasar el ratón y en la opción actual.
- **Tres columnas**: izquierda de **200 px**; central de **500 px** con **20 px** de relleno izquierdo; derecha de **180 px** con **20 px** de relleno izquierdo.
- **Pie** a todo el ancho, con borde superior de 2 px `#3E9722` y el texto centrado.
- La zona de las tres columnas tiene un **borde de 2 px `#3E9722`**.

**Contenido**

- **Columna izquierda**: el formulario de acceso del ejercicio 10, adaptado al ancho de la columna, y debajo una lista "Clases de hoy" con tres clases.
- **Columna central**: dos artículos. Cada uno con una **barra** (fondo `#3C74E6`, letra blanca) con el título en mayúsculas a la izquierda y la fecha a la derecha; un párrafo justificado; y una línea punteada gris al final. El primero lleva una imagen de 120 px de ancho **a la izquierda del texto** (puede ser un `div` gris de 120 × 90 px).
- **Columna derecha**: una lista de enlaces "Webs de interés".

Responde en un comentario: ¿qué valores lleva `grid-template-columns` y cuánto suman?

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Gimnasio Atlas</title>
  <style>
    /*
    Columnas con border-box (el relleno va dentro):
    izquierda 200 | central 500 + 20 = 520 | derecha 180 + 20 = 200
    200 + 520 + 200 = 920. Con el borde de 2 px a cada lado de la zona de columnas: 924.
    Para que la página mida 940, la zona de columnas lleva un margen de 8 px a cada lado
    (924 + 16 = 940). Otra opción igual de válida: columnas de 208, 520 y 208.
    */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #DDD; font: 0.9rem/1.5 Arial, sans-serif; color: #333; }

    .pagina {
      width: 940px;
      margin: 0 auto;
      background-color: #fff;
    }

    /* Cabecera: título a la izquierda, menú a la derecha y abajo */
    .cabecera {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 15px 15px 0;
      background: linear-gradient(#3E9722, #2A6B17);
      color: #fff;
    }
    .cabecera h1 { padding-bottom: 10px; }
    .menu { display: flex; gap: 4px; list-style-type: none; }
    .menu a {
      display: block;
      padding: 6px 14px;
      background-color: #2A6B17;
      color: #fff;
      text-decoration: none;
      border-radius: 6px 6px 0 0;
    }
    .menu a:hover,
    .menu a.actual { background-color: #E58C24; }

    /* Zona de columnas */
    .columnas {
      display: grid;
      grid-template-columns: 200px 520px 200px;
      margin: 10px 8px;
      border: 2px solid #3E9722;
    }
    .izquierda, .central, .derecha { padding-top: 10px; padding-bottom: 10px; }
    .izquierda { padding-left: 10px; padding-right: 10px; }
    .central   { padding-left: 20px; padding-right: 10px; }
    .derecha   { padding-left: 20px; padding-right: 10px; }

    /* Formulario de acceso */
    .acceso {
      display: grid;
      grid-template-columns: 1fr;          /* en 180 px, etiqueta encima del campo */
      gap: 5px;
      margin-bottom: 15px;
    }
    .acceso button { justify-self: end; padding: 3px 10px; }
    .izquierda ul, .derecha ul { padding-left: 18px; }

    /* Artículos */
    article { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dotted #999; }
    .barra {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 8px;
      background-color: #3C74E6;
      color: #fff;
    }
    .barra h2 { font-size: 0.95rem; text-transform: uppercase; }
    .cuerpo { display: flex; gap: 10px; margin-top: 8px; }
    .foto { flex-shrink: 0; width: 120px; height: 90px; background-color: #999; }
    article p { text-align: justify; }

    /* Pie */
    .pie {
      padding: 10px;
      border-top: 2px solid #3E9722;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="pagina">
    <header class="cabecera">
      <h1>Gimnasio Atlas</h1>
      <nav>
        <ul class="menu">
          <li><a href="#" class="actual">Inicio</a></li>
          <li><a href="#">Clases</a></li>
          <li><a href="#">Tarifas</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </nav>
    </header>

    <div class="columnas">
      <aside class="izquierda">
        <form class="acceso">
          <label for="usuario">Usuario</label>
          <input type="text" id="usuario" name="usuario">
          <label for="clave">Contraseña</label>
          <input type="password" id="clave" name="clave">
          <button type="submit">Entrar</button>
          <a href="#">¿Olvidaste la contraseña?</a>
        </form>
        <h2>Clases de hoy</h2>
        <ul>
          <li>Spinning, 9:00</li>
          <li>Yoga, 18:00</li>
          <li>Pilates, 20:00</li>
        </ul>
      </aside>

      <main class="central">
        <article>
          <div class="barra">
            <h2>Nuevo horario</h2>
            <span>10/11/2026</span>
          </div>
          <div class="cuerpo">
            <div class="foto"></div>
            <p>Desde diciembre el gimnasio abre a las 7:00 de lunes a viernes, con dos clases nuevas por la mañana.</p>
          </div>
        </article>
        <article>
          <div class="barra">
            <h2>Tarifa de verano</h2>
            <span>05/11/2026</span>
          </div>
          <p>La matrícula es gratuita para quien se apunte antes de fin de mes.</p>
        </article>
      </main>

      <aside class="derecha">
        <h2>Webs de interés</h2>
        <ul>
          <li><a href="#">Federación</a></li>
          <li><a href="#">Nutrición</a></li>
          <li><a href="#">Ayuntamiento</a></li>
        </ul>
      </aside>
    </div>

    <footer class="pie">
      <p>Gimnasio Atlas. Todos los derechos reservados.</p>
    </footer>
  </div>
</body>
</html>
```

Puntos de corrección:

- **La suma de anchos**: el borde de la zona de columnas también ocupa sitio. Es la trampa del ejercicio.
- **Flexbox en cuatro piezas**: cabecera, menú, barras y cuerpo del primer artículo (foto + texto, que sustituye a la imagen flotante).
- **`flex-shrink: 0` en la foto**: sin él, si el texto es largo, la foto encoge.
- **El formulario**: en una columna estrecha, poner la etiqueta encima del campo (una sola columna) es más legible que dos columnas de 90 px.

</details>

---

## Segunda tanda: cada concepto por separado

Del 15 al 40. No hace falta hacerlos en orden; sirven para practicar lo que falle en los primeros.

---

## Ejercicio 15 (muy fácil): ¿flex o grid?

Para cada caso, indica si usarías **Flexbox** o **Grid** y por qué, en una línea:

1. Un menú horizontal de cinco enlaces.
2. La estructura de una página: cabecera, dos laterales, contenido y pie.
3. Centrar un botón dentro de una caja.
4. Un calendario de 7 columnas y 5 filas.
5. Un título a la izquierda y un icono a la derecha en la misma línea.
6. Una galería de fotos en filas y columnas alineadas.

<details>
<summary>Solución propuesta</summary>

```css
/*
1. Flexbox: una sola fila de elementos.
2. Grid: dos dimensiones (filas y columnas); se dibuja con grid-template-areas.
3. Flexbox: justify-content y align-items center (en Grid también vale place-items: center).
4. Grid: filas y columnas a la vez; repeat(7, 1fr).
5. Flexbox: space-between en una fila.
6. Grid: las fotos quedan alineadas por filas Y por columnas (con flex-wrap solo se alinean por filas).
*/
```

</details>

---

## Ejercicio 16 (muy fácil): completa el código

Rellena los huecos para que las tres cajas de `.fila` queden **en columna**, **centradas en horizontal** y **pegadas abajo** del contenedor de 500 px de alto.

```css
.fila {
  display: ____;
  height: 500px;
  flex-direction: ____;
  justify-content: ____;
  align-items: ____;
}
```

<details>
<summary>Solución propuesta</summary>

```css
.fila {
  display: flex;
  height: 500px;
  flex-direction: column;
  justify-content: flex-end;   /* con column, justify-content es vertical: abajo */
  align-items: center;         /* y align-items es horizontal: centro */
}
```

</details>

---

## Ejercicio 17 (fácil): cambiar el orden sin tocar el HTML

Con este HTML, haz que en pantalla aparezca primero **Tres**, luego **Uno** y luego **Dos**, en fila. No puedes tocar el HTML.

```html
<div class="fila">
  <div class="a">Uno</div>
  <div class="b">Dos</div>
  <div class="c">Tres</div>
</div>
```

<details>
<summary>Solución propuesta</summary>

```css
.fila { display: flex; gap: 10px; }
.c { order: -1; }     /* todos tienen order 0; -1 va antes que todos */
/* Alternativa: .a { order: 2; } .b { order: 3; } .c { order: 1; } */
```

`order` solo cambia el orden **visual**: un lector de pantalla y la tecla Tab siguen el orden del HTML.

</details>

---

## Ejercicio 18 (fácil): `align-self`

En un contenedor flex de 200 px de alto con `align-items: flex-start`, tres cajas de 50 px de alto. Haz que la **segunda** quede centrada en vertical y la **tercera** pegada abajo, sin cambiar la regla del contenedor.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 18</title>
  <style>
    .fila { display: flex; gap: 10px; height: 200px; align-items: flex-start; background-color: #eee; }
    .fila div { width: 80px; height: 50px; background-color: #3C74E6; }
    .fila .dos  { align-self: center; }     /* solo esta, centrada */
    .fila .tres { align-self: flex-end; }   /* solo esta, abajo */
  </style>
</head>
<body>
  <div class="fila">
    <div class="uno"></div>
    <div class="dos"></div>
    <div class="tres"></div>
  </div>
</body>
</html>
```

</details>

---

## Ejercicio 19 (fácil): predecir con `flex-direction: column`

```css
.caja {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  justify-content: space-between;
  align-items: flex-end;
}
.caja div { width: 50px; height: 50px; }
```

Dentro hay tres `div`. Describe dónde queda cada uno (arriba, en medio o abajo; izquierda, centro o derecha).

<details>
<summary>Solución propuesta</summary>

```css
/*
Eje principal vertical (column): justify-content: space-between reparte en vertical.
Eje cruzado horizontal: align-items: flex-end los pega a la derecha.
1º: arriba a la derecha. 2º: en medio (a 125 px del borde superior) a la derecha. 3º: abajo a la derecha.
Los tres, alineados en el borde derecho, uno debajo de otro.
*/
```

</details>

---

## Ejercicio 20 (fácil): el pie siempre abajo

Haz una página con `header`, `main` (con solo un párrafo corto) y `footer`, de modo que el pie quede **siempre pegado al fondo de la ventana** aunque haya poco contenido, y que baje con normalidad si el contenido es largo.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 20</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      flex-direction: column;
      min-height: 100vh;      /* min, no height: si hay mucho contenido, crece */
    }
    header, footer { padding: 15px; background-color: #333; color: #fff; }
    main { flex: 1; padding: 15px; }   /* ocupa todo el sobrante y empuja el pie abajo */
  </style>
</head>
<body>
  <header>Cabecera</header>
  <main><p>Poco contenido.</p></main>
  <footer>Pie</footer>
</body>
</html>
```

Con `height: 100vh`, si el contenido fuera más largo que la ventana se saldría de la caja; con `min-height` la caja crece.

</details>

---

## Ejercicio 21 (medio): tarjetas con el botón abajo

Tres tarjetas en fila, de igual altura, cada una con un título, un párrafo de **longitud distinta** y un botón "Ver más". El botón tiene que quedar **pegado abajo** en las tres, alineados entre sí, aunque los textos midan distinto.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 21</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .tarjetas { display: flex; gap: 20px; padding: 20px; }   /* stretch: las tres, igual de altas */
    .tarjeta {
      flex: 1;                     /* las tres, igual de anchas */
      display: flex;               /* cada tarjeta es a su vez un contenedor flex... */
      flex-direction: column;      /* ...en columna */
      padding: 15px;
      border: 1px solid #999;
    }
    .tarjeta button { margin-top: auto; align-self: flex-start; }   /* margen automático: empuja el botón al fondo */
  </style>
</head>
<body>
  <div class="tarjetas">
    <div class="tarjeta"><h2>Básica</h2><p>Texto corto.</p><button>Ver más</button></div>
    <div class="tarjeta"><h2>Media</h2><p>Un texto bastante más largo que ocupa varias líneas para que la tarjeta crezca.</p><button>Ver más</button></div>
    <div class="tarjeta"><h2>Completa</h2><p>Texto medio, de una o dos líneas.</p><button>Ver más</button></div>
  </div>
</body>
</html>
```

Dos ideas que se combinan:

- **`align-items: stretch`** (por defecto) iguala las alturas de las tarjetas.
- **`margin-top: auto`** dentro de un contenedor flex en columna se come todo el espacio libre por encima del botón y lo empuja al fondo.

Sin `align-self: flex-start`, el botón se estiraría a todo el ancho de la tarjeta.

</details>

---

## Ejercicio 22 (medio): objeto multimedia

Un comentario de un foro: una foto de perfil de 60 × 60 px a la izquierda y, a su derecha, el nombre en negrita y el texto del comentario debajo. La foto **no debe encogerse** aunque el texto sea muy largo. Haz tres comentarios seguidos, separados por una línea.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 22</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .comentario {
      display: flex;
      gap: 12px;
      align-items: flex-start;        /* la foto arriba, no estirada */
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
      max-width: 500px;
    }
    .avatar { flex-shrink: 0; width: 60px; height: 60px; border-radius: 50%; background-color: #999; }
    .texto { flex: 1; }
    .texto strong { display: block; }   /* el nombre, en su propia línea */
  </style>
</head>
<body>
  <div class="comentario"><div class="avatar"></div><div class="texto"><strong>Ana</strong><p>Muy buena explicación.</p></div></div>
  <div class="comentario"><div class="avatar"></div><div class="texto"><strong>Luis</strong><p>Un comentario muy largo que ocupa varias líneas y que, sin flex-shrink: 0, haría que la foto se estrechara para dejar sitio al texto.</p></div></div>
  <div class="comentario"><div class="avatar"></div><div class="texto"><strong>Marta</strong><p>De acuerdo.</p></div></div>
</body>
</html>
```

`border-radius: 50%` convierte el cuadrado en un círculo.

</details>

---

## Ejercicio 23 (medio): `flex-wrap` y `align-content`

Contenedor de **400 × 300 px** con `display: flex` y **seis** cajas de 180 × 60 px, con 10 px de `gap`.

1. Sin `flex-wrap`, ¿qué les pasa a las cajas?
2. Con `flex-wrap: wrap`, ¿cuántas filas salen?
3. Con `wrap` y `align-content: center`, ¿dónde quedan las filas en vertical?

<details>
<summary>Solución propuesta</summary>

```css
/*
1. Por defecto flex-wrap es nowrap: las seis se quedan en una fila y ENCOGEN (flex-shrink: 1)
   hasta caber en 400 px: (400 - 5 x 10) / 6 = unos 58 px cada una.
2. Por fila caben 2: 2 x 180 + 10 = 370 <= 400; 3 serían 550. Seis cajas: 3 filas.
3. align-content reparte las LÍNEAS: las 3 filas (3 x 60 + 2 x 10 = 200 px) quedan juntas
   en el centro vertical, con 50 px libres arriba y 50 abajo.
*/
```

</details>

---

## Ejercicio 24 (medio): encuentra los 4 errores (Flexbox)

```css
.menu li { display: flex; justify-content: space-between; }
.cabecera { display: flex; align-items: middle; }
.foto { flex: 1 0 120; }
.contenedor { display: flex; flex-direction: columns; }
```

<details>
<summary>Solución propuesta</summary>

```css
/*
1. display: flex en los li: para poner los li en fila, el contenedor es el ul.
2. align-items: middle no existe: center.
3. flex: 1 0 120 -> el tercer valor (flex-basis) necesita unidad: 120px.
4. flex-direction: columns -> column (singular).
*/
.menu { display: flex; justify-content: space-between; }
.cabecera { display: flex; align-items: center; }
.foto { flex: 1 0 120px; }
.contenedor { display: flex; flex-direction: column; }
```

</details>

---

## Ejercicio 25 (fácil): rejilla básica

Haz una rejilla de **4 columnas iguales** y 8 celdas numeradas del 1 al 8, con 10 px de separación y 80 px de alto cada fila. Escríbela de dos formas en el comentario: con `repeat` y sin él.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 25</title>
  <style>
    /* Sin repeat: grid-template-columns: 1fr 1fr 1fr 1fr; */
    .rejilla {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 80px;        /* alto de todas las filas que se vayan creando */
      gap: 10px;
    }
    .rejilla div { background-color: #CAE646; }
  </style>
</head>
<body>
  <div class="rejilla">
    <div>1</div><div>2</div><div>3</div><div>4</div>
    <div>5</div><div>6</div><div>7</div><div>8</div>
  </div>
</body>
</html>
```

Con 4 columnas, las celdas 5 a 8 pasan solas a la segunda fila. `grid-auto-rows` da altura a las filas que Grid crea automáticamente.

</details>

---

## Ejercicio 26 (medio): colocar por líneas

Con la rejilla del ejercicio 25 (4 columnas), haz que:

- la celda **1** ocupe las **4 columnas** de la primera fila;
- la celda **2** ocupe **dos filas** de alto en la primera columna;
- la celda **3** ocupe **dos columnas**.

Escríbelo con números de línea y, en un comentario, la alternativa con `span`.

<details>
<summary>Solución propuesta</summary>

```css
.rejilla div:nth-child(1) { grid-column: 1 / 5; }   /* de la línea 1 a la 5 = 4 columnas (o 1 / -1) */
.rejilla div:nth-child(2) { grid-row: 2 / 4; }      /* de la línea 2 a la 4 = 2 filas */
.rejilla div:nth-child(3) { grid-column: 2 / 4; }   /* columnas 2 y 3 */
/*
Con span:
1: grid-column: span 4;
2: grid-row: span 2;
3: grid-column: span 2;
Con 4 columnas hay 5 líneas verticales (1 a 5). -1 es siempre la última.
*/
```

</details>

---

## Ejercicio 27 (medio): galería con una foto destacada

Galería de 3 columnas iguales con filas de 120 px. La **primera** foto es destacada y ocupa **2 columnas y 2 filas**; el resto, una celda. Usa `div` grises en vez de imágenes (ocho en total).

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 27</title>
  <style>
    .galeria {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 120px;
      gap: 8px;
      max-width: 600px;
    }
    .galeria div { background-color: #999; }
    .galeria .destacada { grid-column: span 2; grid-row: span 2; background-color: #E58C24; }
  </style>
</head>
<body>
  <div class="galeria">
    <div class="destacada"></div>
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div>
</body>
</html>
```

La destacada ocupa las columnas 1 y 2 de las filas 1 y 2; las dos siguientes se colocan en la columna 3, y las demás siguen debajo.

</details>

---

## Ejercicio 28 (medio): `fr` con columnas fijas

Un contenedor de **1000 px** con `grid-template-columns: 200px 1fr 2fr` y `gap: 20px`. ¿Cuánto mide cada columna? ¿Y si fuera `200px 1fr 2fr 100px`?

<details>
<summary>Solución propuesta</summary>

```css
/*
a) Huecos: 2 x 20 = 40. Fijo: 200. Libre: 1000 - 200 - 40 = 760, en 3 partes de 253,33.
   Columnas: 200 | 253,33 | 506,67.
b) Huecos: 3 x 20 = 60. Fijo: 200 + 100 = 300. Libre: 1000 - 300 - 60 = 640, en 3 partes de 213,33.
   Columnas: 200 | 213,33 | 426,67 | 100.
fr reparte lo que queda DESPUÉS de restar lo fijo y los gap.
*/
```

</details>

---

## Ejercicio 29 (medio): zonas con huecos

Dibuja con `grid-template-areas` esta maqueta de 3 columnas iguales y 3 filas: cabecera en las dos primeras columnas de la fila 1, con la tercera celda **vacía**; menú en toda la columna 1 de las filas 2 y 3; contenido en las columnas 2 y 3 de la fila 2; pie en las columnas 2 y 3 de la fila 3.

<details>
<summary>Solución propuesta</summary>

```css
.pagina {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "cab  cab  ."
    "menu cont cont"
    "menu pie  pie";
}
header { grid-area: cab; }
nav    { grid-area: menu; }
main   { grid-area: cont; }
footer { grid-area: pie; }
/* El punto deja la celda vacía. Todas las zonas son rectángulos. */
```

</details>

---

## Ejercicio 30 (medio): ¿válido o no?

Para cada `grid-template-areas`, di si es válido y, si no, por qué.

```css
/* a */ grid-template-areas: "a a" "b c";
/* b */ grid-template-areas: "a a b" "c d";
/* c */ grid-template-areas: "a b" "b b";
/* d */ grid-template-areas: "a b a";
/* e */ grid-template-areas: "a ." ". b";
```

<details>
<summary>Solución propuesta</summary>

```css
/*
a) Válido: dos filas de dos celdas; a ocupa la fila 1 entera.
b) No: la primera fila tiene 3 celdas y la segunda 2.
c) No: b ocupa la celda (1,2) y toda la fila 2, que forma una L, no un rectángulo.
d) No: la zona a aparece en dos sitios separados; tiene que ser un rectángulo continuo.
e) Válido: los puntos son celdas vacías; a arriba a la izquierda, b abajo a la derecha.
*/
```

</details>

---

## Ejercicio 31 (medio): centrar con Grid

Centra una caja de 150 × 150 px en la ventana usando **Grid**, con una sola propiedad de alineación en el contenedor.

<details>
<summary>Solución propuesta</summary>

```css
body {
  margin: 0;
  height: 100vh;
  display: grid;
  place-items: center;   /* justify-items + align-items a la vez */
}
.caja { width: 150px; height: 150px; background-color: #3C74E6; }
```

</details>

---

## Ejercicio 32 (difícil): rejilla dentro de rejilla

Una página con Grid (cabecera, contenido, pie). Dentro del `main`, **otra rejilla** de tarjetas: 2 columnas en las que la primera tarjeta ocupa todo el ancho. Dentro de cada tarjeta, **Flexbox** para poner un icono (un cuadrado de 40 px) y el título en la misma línea.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 32</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr auto;   /* cabecera y pie a su medida; el contenido, el resto */
    }
    header, footer { padding: 15px; background-color: #333; color: #fff; }
    main {
      display: grid;                       /* segunda rejilla, dentro de una celda de la primera */
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      padding: 15px;
      align-content: start;                /* las tarjetas arriba, sin estirarse para llenar el main */
    }
    .tarjeta { border: 1px solid #999; padding: 10px; }
    .tarjeta:first-child { grid-column: 1 / -1; }
    .titulo { display: flex; align-items: center; gap: 10px; }   /* tercer nivel: flex */
    .icono { width: 40px; height: 40px; background-color: #E58C24; }
  </style>
</head>
<body>
  <header>Mi panel</header>
  <main>
    <div class="tarjeta"><div class="titulo"><div class="icono"></div><h2>Resumen</h2></div><p>Ocupa todo el ancho.</p></div>
    <div class="tarjeta"><div class="titulo"><div class="icono"></div><h2>Ventas</h2></div><p>Texto.</p></div>
    <div class="tarjeta"><div class="titulo"><div class="icono"></div><h2>Clientes</h2></div><p>Texto.</p></div>
  </main>
  <footer>Pie</footer>
</body>
</html>
```

</details>

---

## Ejercicio 33 (fácil): selectores de atributo

Escribe el selector de cada caso:

1. Los enlaces que apuntan a una página segura (empiezan por `https`).
2. Los enlaces a archivos PDF.
3. Los campos de formulario de tipo correo electrónico.
4. Las imágenes que tienen el atributo `alt`, tenga el valor que tenga.
5. Los elementos cuya clase incluye, como palabra suelta, `destacado`.
6. Los enlaces cuyo `href` contiene la palabra `educa`.

<details>
<summary>Solución propuesta</summary>

```css
a[href^="https"] { }
a[href$=".pdf"] { }
input[type="email"] { }
img[alt] { }
[class~="destacado"] { }   /* equivale a .destacado */
a[href*="educa"] { }
```

</details>

---

## Ejercicio 34 (medio): pseudoclases estructurales

Escribe la regla de cada caso:

1. Las filas pares de una tabla, con fondo gris claro.
2. Todas las opciones de un menú (`.menu li`) salvo la última, con un borde derecho blanco.
3. El primer párrafo de cada `article`, en negrita, aunque antes haya un `h2`.
4. Las celdas de una tabla que estén vacías, con fondo rojo claro.
5. Las tres primeras opciones de una lista.

<details>
<summary>Solución propuesta</summary>

```css
tr:nth-child(even) { background-color: #eee; }
.menu li:not(:last-child) { border-right: 1px solid #fff; }
article p:first-of-type { font-weight: bold; }   /* :first-child fallaría: el primer hijo es el h2 */
td:empty { background-color: #fdd; }
li:nth-child(-n+3) { color: #E58C24; }           /* -n+3 da 3, 2, 1: los tres primeros */
```

</details>

---

## Ejercicio 35 (medio): predecir selectores de hermanos

```html
<section>
  <h2>A</h2>
  <p>1</p>
  <p>2</p>
  <div><p>3</p></div>
  <p>4</p>
</section>
```

¿Qué párrafos se seleccionan con cada regla?

1. `h2 + p`
2. `h2 ~ p`
3. `p + p`
4. `section > p`
5. `section p`

<details>
<summary>Solución propuesta</summary>

```css
/*
1. h2 + p    -> el 1 (justo detrás del h2).
2. h2 ~ p    -> el 1, el 2 y el 4 (hermanos del h2 que van después; el 3 está dentro del div).
3. p + p     -> el 2 (va justo detrás del 1). El 4 va detrás de un div, no de un p.
4. section > p -> el 1, el 2 y el 4 (hijos directos).
5. section p -> los cuatro (descendientes a cualquier profundidad).
*/
```

</details>

---

## Ejercicio 36 (medio): menú adaptable

Un menú horizontal de cinco opciones que, en pantallas de **500 px o menos**, pase a **columna**, con cada opción ocupando todo el ancho.

<details>
<summary>Solución propuesta</summary>

```css
.menu { display: flex; gap: 4px; list-style-type: none; }
.menu a { display: block; padding: 8px 14px; background-color: #2F5E85; color: #fff; text-decoration: none; }

@media (max-width: 500px) {
  .menu { flex-direction: column; }   /* las opciones, una debajo de otra */
  .menu a { text-align: center; }     /* align-items: stretch (por defecto) ya les da todo el ancho */
}
```

</details>

---

## Ejercicio 37 (medio): tabla de precios

Tres planes (Básico, Pro y Empresa) en tres columnas iguales. El plan **Pro** está destacado: borde naranja de 3 px, un 5 % más grande (`transform: scale(1.05)`) y la etiqueta "Recomendado" arriba. Cada plan tiene una lista de ventajas y un botón **pegado abajo**. Usa Grid para las columnas y Flexbox dentro de cada plan.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 37</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .planes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 800px;
      margin: 40px auto;
    }
    .plan {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      border: 1px solid #999;
      border-radius: 8px;
      text-align: center;
    }
    .plan ul { list-style-type: none; }
    .plan button { margin-top: auto; padding: 8px; }     /* botón al fondo */
    .plan.pro { border: 3px solid #E58C24; transform: scale(1.05); }
    .etiqueta { align-self: center; padding: 2px 8px; background-color: #E58C24; color: #fff; border-radius: 4px; }
  </style>
</head>
<body>
  <section class="planes">
    <div class="plan"><h2>Básico</h2><ul><li>1 usuario</li></ul><button>Elegir</button></div>
    <div class="plan pro"><span class="etiqueta">Recomendado</span><h2>Pro</h2><ul><li>5 usuarios</li><li>Soporte</li><li>Copias</li></ul><button>Elegir</button></div>
    <div class="plan"><h2>Empresa</h2><ul><li>Ilimitado</li><li>Soporte 24 h</li></ul><button>Elegir</button></div>
  </section>
</body>
</html>
```

</details>

---

## Ejercicio 38 (difícil): encuentra los 5 errores (maqueta completa)

La página tiene que medir 900 px: lateral de 200 px y contenido de 680 px con 20 px de relleno izquierdo, cabecera y pie a todo el ancho, y el título y el menú de la cabecera en los dos extremos.

```css
* { margin: 0; padding: 0; }
.pagina {
  width: 900px;
  margin: auto 0;
  display: grid;
  grid-template-columns: 200px 680px;
  grid-template-areas: "cab cab" "lat cont" "pie pie";
}
.cabecera { grid-area: cab; display: flex; justify-content: space-around; }
aside  { grid-area: lat; }
main   { grid-area: cont; padding-left: 20px; }
footer { grid-area: "pie"; }
```

<details>
<summary>Solución propuesta</summary>

```css
/*
1. Falta box-sizing: border-box en el reinicio: el padding-left de main se suma y la página mide 920.
2. margin: auto 0 centra en vertical (no hace nada) y deja los lados a 0. Para centrar: margin: 0 auto.
3. Con border-box, la columna del contenido es 680 + 20 = 700, no 680: 200 + 700 = 900.
4. justify-content: space-around deja espacio también en los extremos: título y menú no quedan
   pegados a los bordes. Para "en los dos extremos": space-between.
5. grid-area: "pie" lleva comillas: en grid-area el nombre va sin comillas, y el pie
   no se coloca en su zona.
*/
* { margin: 0; padding: 0; box-sizing: border-box; }
.pagina {
  width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 200px 700px;
  grid-template-areas: "cab cab" "lat cont" "pie pie";
}
.cabecera { grid-area: cab; display: flex; justify-content: space-between; }
aside  { grid-area: lat; }
main   { grid-area: cont; padding-left: 20px; }
footer { grid-area: pie; }
```

</details>

---

## Ejercicio 39 (difícil): panel de control

Maqueta a pantalla completa de un panel de administración:

- **Barra lateral** izquierda de 220 px, a **toda la altura**, con el logotipo arriba y un menú vertical de cinco enlaces.
- A la derecha, una **barra superior** de 60 px con un buscador (campo que se estira + botón) a la izquierda y el nombre del usuario a la derecha.
- Debajo, el **contenido**: una fila de **cuatro indicadores** iguales (número grande y texto) y, debajo, dos paneles: uno ancho (2/3) y otro estrecho (1/3).

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ejercicio 39</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      height: 100vh;
      display: grid;
      grid-template-columns: 220px 1fr;
      grid-template-rows: 60px 1fr;
      grid-template-areas:
        "lateral superior"
        "lateral contenido";            /* el lateral ocupa las dos filas: toda la altura */
      font-family: Arial, sans-serif;
    }
    .lateral { grid-area: lateral; background-color: #1E2A38; color: #fff; padding: 15px; }
    .lateral nav { display: flex; flex-direction: column; gap: 5px; margin-top: 20px; }
    .lateral a { color: #fff; text-decoration: none; padding: 8px; }
    .lateral a:hover { background-color: #2F5E85; }

    .superior {
      grid-area: superior;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;
    }
    .buscador { display: flex; gap: 5px; flex: 1; max-width: 400px; }
    .buscador input { flex: 1; padding: 5px; }

    .contenido {
      grid-area: contenido;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: min-content;
      gap: 15px;
      padding: 15px;
      overflow: auto;                   /* si el contenido no cabe, scroll solo en esta zona */
    }
    .indicador { padding: 15px; background-color: #f4f4f4; border-radius: 6px; }
    .indicador strong { display: block; font-size: 2rem; }
    .panel { padding: 15px; border: 1px solid #ddd; border-radius: 6px; min-height: 200px; }
    .panel.ancho { grid-column: span 3; }   /* 3 de 4 columnas, casi 2/3 */
    .panel.estrecho { grid-column: span 1; }
  </style>
</head>
<body>
  <aside class="lateral">
    <strong>Panel</strong>
    <nav>
      <a href="#">Inicio</a><a href="#">Pedidos</a><a href="#">Clientes</a><a href="#">Informes</a><a href="#">Ajustes</a>
    </nav>
  </aside>
  <header class="superior">
    <form class="buscador"><input type="text" name="q"><button type="submit">Buscar</button></form>
    <span>Usuario: Ana</span>
  </header>
  <main class="contenido">
    <div class="indicador"><strong>128</strong>Pedidos</div>
    <div class="indicador"><strong>45</strong>Clientes</div>
    <div class="indicador"><strong>12</strong>Incidencias</div>
    <div class="indicador"><strong>98 %</strong>Satisfacción</div>
    <section class="panel ancho">Gráfico de ventas</section>
    <section class="panel estrecho">Últimos clientes</section>
  </main>
</body>
</html>
```

Con 4 columnas no hay un 2/3 exacto: `span 3` / `span 1` da 3/4 y 1/4. Para un 2/3 exacto, los paneles irían en una rejilla propia con `grid-template-columns: 2fr 1fr`.

</details>

---

## Ejercicio 40 (MUY DIFÍCIL): de la imagen al código, a contrarreloj

Simulacro del práctico: **45 minutos**, sin apuntes ni ayuda, en un solo fichero.

Maqueta la portada de una **tienda de bicicletas, "Pedal"**, con:

- Página de **1000 px** centrada. Reinicio y `border-box`.
- **Cabecera** de fondo `#222`: logotipo "Pedal" (h1, naranja `#E58C24`) a la izquierda; menú de cuatro opciones a la derecha, centrado en vertical, con cambio de color al pasar el ratón; y un **buscador** (campo + botón) entre los dos, que ocupa todo el espacio libre.
- **Banner**: una franja de 250 px de alto con fondo degradado horizontal de `#E58C24` a `#C0392B` y un texto grande **centrado en los dos ejes**.
- **Tres columnas**: filtros a la izquierda (220 px), productos en el centro (el resto) y "Lo más vendido" a la derecha (200 px), con 20 px de separación entre columnas.
- En el centro, una **rejilla de seis productos** en tres columnas: cada producto con una imagen (un `div` gris de 140 px de alto), nombre, precio y un botón "Comprar" **pegado abajo**.
- En los filtros, un **formulario** con tres casillas de verificación y un desplegable, etiquetas a la izquierda.
- **Pie** de tres columnas iguales (Empresa, Ayuda, Redes) con listas de enlaces, y debajo una línea de copyright centrada a todo el ancho.
- En pantallas de **800 px o menos**: una sola columna (banner, productos en dos columnas, filtros, lo más vendido) y el menú debajo del logotipo.

Cuando termines, compara con la solución y apunta en `errores.md` lo que te haya costado.

<details>
<summary>Solución propuesta</summary>

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font: 0.95rem/1.5 Arial, sans-serif; color: #333; background-color: #f2f2f2; }
    .pagina { width: 1000px; margin: 0 auto; background-color: #fff; }

    /* Cabecera: logo | buscador (crece) | menú */
    .cabecera {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 15px 20px;
      background-color: #222;
    }
    .cabecera h1 { color: #E58C24; }
    .buscador { flex: 1; display: flex; gap: 5px; }
    .buscador input { flex: 1; padding: 5px; }
    .menu { display: flex; gap: 15px; list-style-type: none; }
    .menu a { color: #fff; text-decoration: none; }
    .menu a:hover { color: #E58C24; }

    /* Banner centrado en los dos ejes */
    .banner {
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to right, #E58C24, #C0392B);
      color: #fff;
      font-size: 2.5rem;
      font-weight: bold;
    }

    /* Tres columnas */
    .columnas {
      display: grid;
      grid-template-columns: 220px 1fr 200px;
      grid-template-areas: "filtros productos vendidos";
      gap: 20px;
      padding: 20px;
    }
    .filtros   { grid-area: filtros; }
    .productos { grid-area: productos; }
    .vendidos  { grid-area: vendidos; }

    /* Formulario de filtros: etiqueta | control */
    .filtros form {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      align-items: center;
    }

    /* Rejilla de productos */
    .productos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .producto {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 10px;
      border: 1px solid #ddd;
    }
    .producto .foto { height: 140px; background-color: #ccc; }
    .producto .precio { font-weight: bold; color: #C0392B; }
    .producto button { margin-top: auto; padding: 6px; }

    .vendidos ol { padding-left: 20px; }

    /* Pie */
    .pie { background-color: #222; color: #ccc; padding: 20px; }
    .pie-columnas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .pie ul { list-style-type: none; }
    .pie a { color: #ccc; }
    .copyright { margin-top: 15px; text-align: center; }

    /* Móvil */
    @media (max-width: 800px) {
      .pagina { width: 100%; }
      .cabecera { flex-wrap: wrap; }
      .menu { order: 3; width: 100%; }               /* el menú pasa a una línea propia, debajo */
      .columnas {
        grid-template-columns: 1fr;
        grid-template-areas: "productos" "filtros" "vendidos";
      }
      .productos { grid-template-columns: repeat(2, 1fr); }
      .pie-columnas { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="pagina">
    <header class="cabecera">
      <h1>Pedal</h1>
      <form class="buscador"><input type="text" name="q"><button type="submit">Buscar</button></form>
      <nav>
        <ul class="menu">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Bicicletas</a></li>
          <li><a href="#">Accesorios</a></li>
          <li><a href="#">Taller</a></li>
        </ul>
      </nav>
    </header>

    <div class="banner">Rebajas de invierno</div>

    <div class="columnas">
      <aside class="filtros">
        <h2>Filtros</h2>
        <form>
          <label for="f1">Montaña</label><input type="checkbox" id="f1" name="tipo" value="montana">
          <label for="f2">Carretera</label><input type="checkbox" id="f2" name="tipo" value="carretera">
          <label for="f3">Eléctrica</label><input type="checkbox" id="f3" name="tipo" value="electrica">
          <label for="f4">Precio</label>
          <select id="f4" name="precio"><option>Cualquiera</option><option>Hasta 500 €</option></select>
        </form>
      </aside>

      <main class="productos">
        <div class="producto"><div class="foto"></div><h3>Urbana</h3><span class="precio">390 €</span><button>Comprar</button></div>
        <div class="producto"><div class="foto"></div><h3>Montaña Pro</h3><span class="precio">890 €</span><button>Comprar</button></div>
        <div class="producto"><div class="foto"></div><h3>Carretera</h3><span class="precio">1.200 €</span><button>Comprar</button></div>
        <div class="producto"><div class="foto"></div><h3>Infantil</h3><span class="precio">150 €</span><button>Comprar</button></div>
        <div class="producto"><div class="foto"></div><h3>Plegable con un nombre largo</h3><span class="precio">450 €</span><button>Comprar</button></div>
        <div class="producto"><div class="foto"></div><h3>Eléctrica</h3><span class="precio">1.600 €</span><button>Comprar</button></div>
      </main>

      <aside class="vendidos">
        <h2>Lo más vendido</h2>
        <ol>
          <li>Urbana</li>
          <li>Eléctrica</li>
          <li>Montaña Pro</li>
        </ol>
      </aside>
    </div>

    <footer class="pie">
      <div class="pie-columnas">
        <div><h3>Empresa</h3><ul><li><a href="#">Quiénes somos</a></li><li><a href="#">Tiendas</a></li></ul></div>
        <div><h3>Ayuda</h3><ul><li><a href="#">Envíos</a></li><li><a href="#">Devoluciones</a></li></ul></div>
        <div><h3>Redes</h3><ul><li><a href="#">Instagram</a></li><li><a href="#">YouTube</a></li></ul></div>
      </div>
      <p class="copyright">Pedal. Todos los derechos reservados.</p>
    </footer>
  </div>
</body>
</html>
```

Puntos de corrección:

- **Cabecera**: el buscador con `flex: 1` entre el logo y el menú.
- **Banner**: centrado en los dos ejes con Flexbox.
- **Columnas**: con `gap` en vez de márgenes.
- **Productos**: rejilla anidada con el botón al fondo (`margin-top: auto`).
- **Formulario de filtros**: con Grid.
- **Pie**: rejilla de tres columnas.
- **Móvil**: con `@media`; el menú baja con `flex-wrap` y `order`.

</details>
