# Ejercicios del tema 4.5: Flexbox y Grid

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

---

## Ejercicio 2 (muy fácil): centrar una caja

Haz una página con una caja azul de 200 × 200 px **centrada en horizontal y en vertical** en la ventana, sobre un fondo gris claro. Usa Flexbox.

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

---

## Ejercicio 4 (fácil): menú horizontal

Haz un menú con una **lista** de cuatro opciones (Inicio, Productos, Tienda, Contacto), en fila, con 6 px de separación entre opciones, sin viñetas. Cada opción es un enlace con fondo `#2F5E85`, letra blanca y sin subrayado. Al pasar el ratón, el fondo pasa a `#F2A541`. La opción **Inicio** tiene la clase `actual` y se ve siempre en naranja.

Requisito: tiene que poder pulsarse en cualquier punto de la pestaña, no solo sobre el texto.

---

## Ejercicio 5 (fácil): cabecera y barra con dos extremos

Haz dos piezas:

1. Una **cabecera** con fondo `#2F5E85` y 20 px de relleno: el nombre "Tienda Ola" (un `h1`, blanco) a la izquierda y un menú de tres enlaces blancos a la derecha, los dos **centrados en vertical**.
2. Debajo, la **barra de un artículo**: fondo `#3C74E6`, el título "Ofertas de noviembre" a la izquierda en mayúsculas y la fecha "13/11/2026" a la derecha.

---

## Ejercicio 6 (medio): `flex-grow`

**a)** Un contenedor flex de **900 px** tiene tres hijos con `flex-basis: 100px` y `flex-grow` de 1, 2 y 3. ¿Cuánto mide cada uno? Responde en un comentario.

**b)** Haz un **buscador**: un campo de texto y un botón "Buscar" en la misma línea, dentro de una caja de 500 px. El botón tiene su ancho natural y **el campo ocupa todo lo demás**, con 5 px de separación.

---

## Ejercicio 7 (medio): galería que se reparte en filas

Dentro de un contenedor de **700 px**, coloca **ocho** cajas de 150 × 100 px (pueden ser `div` de colores, en lugar de imágenes) con **10 px de separación**, que pasen a la línea siguiente cuando no quepan.

Responde también en un comentario: ¿cuántas cajas caben en cada fila y cuántas filas salen?

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

---

## Ejercicio 9 (medio): rejilla de tarjetas

**a)** Seis tarjetas (`article` con un título y un párrafo) en **3 columnas iguales** con 20 px de separación, dentro de un contenedor de 900 px. Cada tarjeta, con borde gris de 1 px, 15 px de relleno y esquinas redondeadas de 8 px.

**b)** Cambia la rejilla para que se adapte sola: tantas columnas de **al menos 220 px** como quepan. Comprueba en el navegador qué pasa al estrechar la ventana.

---

## Ejercicio 10 (medio): formulario con Grid

Haz un formulario de acceso con **dos columnas**: las etiquetas a la izquierda (120 px) y los campos a la derecha (el resto), con 10 px de separación. Campos: Usuario (texto) y Contraseña (contraseña). El botón "Entrar" va **en la columna de los campos**, alineado a la derecha. Debajo, un enlace "¿Olvidaste la contraseña?" que ocupa **las dos columnas**. Ancho total: 350 px.

---

## Ejercicio 11 (difícil): variación del ejemplo de la tutoría

Sin mirar los apuntes, reproduce la maqueta de `GridLayout.html` (cabecera, menú, lateral, contenido con tres secciones y pie, a pantalla completa) con estos **cambios**:

- **Tres columnas** en proporción 1 : 3 : 1: el lateral a la **izquierda** y otro a la **derecha** (`<aside class="publi">`).
- Cabecera, menú y pie ocupan las tres columnas.
- Las tres secciones del contenido van **en fila**, no en columna, repartidas con el mismo espacio en los extremos y entre ellas, y centradas en vertical.
- Cada sección mide el 25 % del ancho y el 50 % del alto de su zona.

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

---

## Ejercicio 13 (difícil): versión para móvil

Parte del ejercicio 12 y haz que, en pantallas de **600 px o menos**:

- la página ocupe todo el ancho (no 800 px);
- haya **una sola columna**, con el orden cabecera, **contenido**, lateral, pie (el lateral pasa debajo del contenido);
- el lateral tenga 10 px de relleno en los cuatro lados.

No toques el HTML. Añade también la etiqueta que hace falta en el `<head>` para que el móvil no muestre la página reducida.

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

---

## Ejercicio 18 (fácil): `align-self`

En un contenedor flex de 200 px de alto con `align-items: flex-start`, tres cajas de 50 px de alto. Haz que la **segunda** quede centrada en vertical y la **tercera** pegada abajo, sin cambiar la regla del contenedor.

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

---

## Ejercicio 20 (fácil): el pie siempre abajo

Haz una página con `header`, `main` (con solo un párrafo corto) y `footer`, de modo que el pie quede **siempre pegado al fondo de la ventana** aunque haya poco contenido, y que baje con normalidad si el contenido es largo.

---

## Ejercicio 21 (medio): tarjetas con el botón abajo

Tres tarjetas en fila, de igual altura, cada una con un título, un párrafo de **longitud distinta** y un botón "Ver más". El botón tiene que quedar **pegado abajo** en las tres, alineados entre sí, aunque los textos midan distinto.

---

## Ejercicio 22 (medio): objeto multimedia

Un comentario de un foro: una foto de perfil de 60 × 60 px a la izquierda y, a su derecha, el nombre en negrita y el texto del comentario debajo. La foto **no debe encogerse** aunque el texto sea muy largo. Haz tres comentarios seguidos, separados por una línea.

---

## Ejercicio 23 (medio): `flex-wrap` y `align-content`

Contenedor de **400 × 300 px** con `display: flex` y **seis** cajas de 180 × 60 px, con 10 px de `gap`.

1. Sin `flex-wrap`, ¿qué les pasa a las cajas?
2. Con `flex-wrap: wrap`, ¿cuántas filas salen?
3. Con `wrap` y `align-content: center`, ¿dónde quedan las filas en vertical?

---

## Ejercicio 24 (medio): encuentra los 4 errores (Flexbox)

```css
.menu li { display: flex; justify-content: space-between; }
.cabecera { display: flex; align-items: middle; }
.foto { flex: 1 0 120; }
.contenedor { display: flex; flex-direction: columns; }
```

---

## Ejercicio 25 (fácil): rejilla básica

Haz una rejilla de **4 columnas iguales** y 8 celdas numeradas del 1 al 8, con 10 px de separación y 80 px de alto cada fila. Escríbela de dos formas en el comentario: con `repeat` y sin él.

---

## Ejercicio 26 (medio): colocar por líneas

Con la rejilla del ejercicio 25 (4 columnas), haz que:

- la celda **1** ocupe las **4 columnas** de la primera fila;
- la celda **2** ocupe **dos filas** de alto en la primera columna;
- la celda **3** ocupe **dos columnas**.

Escríbelo con números de línea y, en un comentario, la alternativa con `span`.

---

## Ejercicio 27 (medio): galería con una foto destacada

Galería de 3 columnas iguales con filas de 120 px. La **primera** foto es destacada y ocupa **2 columnas y 2 filas**; el resto, una celda. Usa `div` grises en vez de imágenes (ocho en total).

---

## Ejercicio 28 (medio): `fr` con columnas fijas

Un contenedor de **1000 px** con `grid-template-columns: 200px 1fr 2fr` y `gap: 20px`. ¿Cuánto mide cada columna? ¿Y si fuera `200px 1fr 2fr 100px`?

---

## Ejercicio 29 (medio): zonas con huecos

Dibuja con `grid-template-areas` esta maqueta de 3 columnas iguales y 3 filas: cabecera en las dos primeras columnas de la fila 1, con la tercera celda **vacía**; menú en toda la columna 1 de las filas 2 y 3; contenido en las columnas 2 y 3 de la fila 2; pie en las columnas 2 y 3 de la fila 3.

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

---

## Ejercicio 31 (medio): centrar con Grid

Centra una caja de 150 × 150 px en la ventana usando **Grid**, con una sola propiedad de alineación en el contenedor.

---

## Ejercicio 32 (difícil): rejilla dentro de rejilla

Una página con Grid (cabecera, contenido, pie). Dentro del `main`, **otra rejilla** de tarjetas: 2 columnas en las que la primera tarjeta ocupa todo el ancho. Dentro de cada tarjeta, **Flexbox** para poner un icono (un cuadrado de 40 px) y el título en la misma línea.

---

## Ejercicio 33 (fácil): selectores de atributo

Escribe el selector de cada caso:

1. Los enlaces que apuntan a una página segura (empiezan por `https`).
2. Los enlaces a archivos PDF.
3. Los campos de formulario de tipo correo electrónico.
4. Las imágenes que tienen el atributo `alt`, tenga el valor que tenga.
5. Los elementos cuya clase incluye, como palabra suelta, `destacado`.
6. Los enlaces cuyo `href` contiene la palabra `educa`.

---

## Ejercicio 34 (medio): pseudoclases estructurales

Escribe la regla de cada caso:

1. Las filas pares de una tabla, con fondo gris claro.
2. Todas las opciones de un menú (`.menu li`) salvo la última, con un borde derecho blanco.
3. El primer párrafo de cada `article`, en negrita, aunque antes haya un `h2`.
4. Las celdas de una tabla que estén vacías, con fondo rojo claro.
5. Las tres primeras opciones de una lista.

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

---

## Ejercicio 36 (medio): menú adaptable

Un menú horizontal de cinco opciones que, en pantallas de **500 px o menos**, pase a **columna**, con cada opción ocupando todo el ancho.

---

## Ejercicio 37 (medio): tabla de precios

Tres planes (Básico, Pro y Empresa) en tres columnas iguales. El plan **Pro** está destacado: borde naranja de 3 px, un 5 % más grande (`transform: scale(1.05)`) y la etiqueta "Recomendado" arriba. Cada plan tiene una lista de ventajas y un botón **pegado abajo**. Usa Grid para las columnas y Flexbox dentro de cada plan.

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

---

## Ejercicio 39 (difícil): panel de control

Maqueta a pantalla completa de un panel de administración:

- **Barra lateral** izquierda de 220 px, a **toda la altura**, con el logotipo arriba y un menú vertical de cinco enlaces.
- A la derecha, una **barra superior** de 60 px con un buscador (campo que se estira + botón) a la izquierda y el nombre del usuario a la derecha.
- Debajo, el **contenido**: una fila de **cuatro indicadores** iguales (número grande y texto) y, debajo, dos paneles: uno ancho (2/3) y otro estrecho (1/3).

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

