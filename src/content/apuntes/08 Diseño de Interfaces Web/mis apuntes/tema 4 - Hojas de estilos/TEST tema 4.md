# Test tema 4: Hojas de estilos

## 1. Introducción a CSS

**1.** Si quieres definir la presentación de una página web, utilizas...

- a) CSS
- b) XHTML
- c) JavaScript
- d) PHP

**Respuesta:** a

**Apartado:** 1

**2.** ¿Con qué atributo le indicamos a una marca HTML que emplee una determinada clase CSS?

**Respuesta:** class

**Apartado:** 2.3

**3.** Relaciona los elementos XHTML con el tipo de elemento que son: de bloque o en línea.

| Elemento | Tipo |
|---|---|
| `p` | De bloque |
| `div` | De bloque |
| `strong` | En línea |
| `em` | En línea |

**Apartado:** 1.3

**4.** Para dar una medida en píxeles emplearemos como unidad ___.

**Respuesta:** px

**Apartado:** 3.1

**5.** El margin es el margen exterior del objeto.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.4

**6.** ¿El padding es el margen exterior del objeto?

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.4

**7.** ¿En qué orden se dan las medidas de los márgenes en CSS?

- a) top bottom right left
- b) left right top bottom
- c) top left right bottom
- d) top right bottom left

**Respuesta:** d

**Apartado:** 1.4

**8.** Si a un contenedor le configuramos un borde de 1 píxel de ancho, por defecto adquiere el estilo solid.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.4.2

**9.** La propiedad inline en CSS hace que todos los elementos tengan una línea en la zona interior bordeando el elemento.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.3

## 2. Selectores

**10.** Escribe el selector CSS que seleccionaría todos los encabezados de tamaño 4 en un documento.

**Respuesta:** `h4`

**Apartado:** 2.1

**11.** Escribe el selector CSS que seleccionaría todos los formularios de un documento.

**Respuesta:** `form`

**Apartado:** 2.1

**12.** Escribe el selector CSS que seleccionaría todos los objetos contenidos dentro de un formulario.

**Respuesta:** `form *`

**Apartado:** 2.2

**13.** Escribe el selector CSS que seleccionaría todos los enlaces y todos los párrafos (sin espacios).

**Respuesta:** `a,p`

**Apartado:** 2.1

**14.** Escribe el selector CSS que seleccionaría todas las imágenes y todos los enlaces que estén dentro de una tabla.

**Respuesta:** `table img,table a`

**Apartado:** 2.2

**Ojo:** sin espacio después de la coma; el Moodle compara el texto exacto.

**15.** Escribe el selector CSS que seleccionaría todos los párrafos contenidos en una tabla.

**Respuesta:** `table p`

**Apartado:** 2.2

**16.** Escribe el selector CSS que seleccionaría todos los enlaces contenidos dentro de un párrafo que se encuentre además dentro de un contenedor.

**Respuesta:** `div p a`

**Apartado:** 2.2

**17.** Escribe el selector CSS que seleccionaría aquellos párrafos que sean hijos directos de un contenedor.

**Respuesta:** `div > p`

**Apartado:** 2.2

**18.** Escribe el selector CSS que seleccionaría aquellos hiperenlaces hijos directos de un párrafo y que estén contenidos en un contenedor que emplee la clase nueva.

**Respuesta:** `div.nueva p > a`

**Apartado:** 2.2

**19.** Escribe el selector CSS que seleccionaría todos los elementos h1 y párrafos que sean hermanos.

**Respuesta:** `h1 + p`

**Apartado:** 2.2

**20.** Con la regla `h2+p { color: green; }`, en un documento con "Título 1" (h1), "Subtítulo 1" (h2), "Párrafo 1" (p), "Subtítulo 2" (h2) y "Párrafo 2" (p), ¿qué textos aparecen en verde?

**Respuesta:** Párrafo 1 y Párrafo 2

**Apartado:** 2.2

**21.** Escribe el selector CSS que seleccionaría todos los objetos que empleen la clase nuevo.

**Respuesta:** `.nuevo`

**Apartado:** 2.3

**Ojo:** el Moodle tiene mal la clave (`.nuevo .nuevo`) y da por mala la respuesta correcta.

**22.** Escribe el selector CSS que seleccionaría los párrafos que empleen la clase tronic.

**Respuesta:** `p.tronic`

**Apartado:** 2.3

**23.** Escribe el selector CSS que seleccionaría todos los objetos con id=nuevo.

**Respuesta:** `#nuevo`

**Apartado:** 2.3

**24.** Escribe el selector CSS que seleccionaría una tabla que tenga como id=nuevo.

**Respuesta:** `table#nuevo`

**Apartado:** 2.3

**25.** Escribe el selector CSS que seleccionaría todos los objetos con id=nuevo y que estén contenidos en una tabla.

**Respuesta:** `table #nuevo`

**Apartado:** 2.3

**26.** Escribe el selector CSS que seleccionaría una tabla con id=nuevo que esté dentro de un contenedor.

**Respuesta:** `div table#nuevo`

**Apartado:** 2.3

**27.** ¿Cuál de los siguientes es el selector CSS que selecciona todos los objetos con class="nuevo" que están contenidos en una tabla?

- a) `table .nuevo`
- b) `table.nuevo`
- c) `table#nuevo`

**Respuesta:** a

**Apartado:** 2.3

**28.** Escribe el selector CSS que seleccionaría un párrafo que emplee la clase nuevo y que esté contenido en otro párrafo con id=viejo.

**Respuesta:** `p#viejo p.nuevo`

**Apartado:** 2.3

**29.** Escribe el selector CSS que seleccionaría todos los elementos de una lista ordenada con id nueva.

**Respuesta:** `ol#nueva li`

**Apartado:** 2.2

**30.** Escribe el selector CSS que seleccionaría todos los enlaces visitados de un documento.

**Respuesta:** `a:visited`

**Apartado:** 2.4

**31.** Escribe el selector CSS que seleccionaría aquellos campos de tipo input cuando pongamos el foco en ese campo.

**Respuesta:** `input:focus`

**Apartado:** 2.4

**32.** Escribe el selector CSS que seleccionaría todos aquellos enlaces contenidos en un párrafo con id=nuevo cuando pasemos el ratón por encima de ellos.

**Respuesta:** `p#nuevo a:hover`

**Apartado:** 2.4

**Ojo:** el Moodle tiene mal la clave (`p#novo a:hover`) y da por mala la respuesta correcta.

**33.** Dado un conjunto de 15 párrafos, cada uno en una etiqueta `p` diferente, contenidos dentro de una etiqueta `main`, ¿qué regla utilizaríamos para seleccionar los párrafos 4, 7, 10 y 13?

- a) `main p:nth-child(3n+4)`
- b) `main+p:nth-child(4n+3)`
- c) `p:nth-child(3n+3)`
- d) `main,p:nth-child(3n+4)`

**Respuesta:** a

**Apartado:** 2.4

## 3. Fuente, texto, colores y fondos

**34.** Queremos un documento web donde la fuente base de toda la página sea de color negro, de tipo Arial, con un tamaño 0.9 veces la letra por defecto del navegador y un espaciado entre líneas de 1,4. ¿Cuál sería la regla CSS que lo consigue? (una o más)

- a) `body { font: 0.9em/1.4 Arial, Helvetica, sans-serif; color: #000; }`
- b) `body { font: 0.9em/1.4 Arial, sans-serif; color: #000; }`
- c) `body { color: #000; font: .9em/1.4 Arial; }`
- d) `body { font: .9em/1.4 Arial; color: #000; }`

**Respuesta:** a, b, c, d

**Apartado:** 3.1

**35.** ¿Qué regla nos permite incorporar una nueva fuente a nuestra página web?

- a) `@font-style`
- b) `@font-variant`
- c) `@font-face`
- d) `@fontface`

**Respuesta:** c

**Apartado:** 3.1

**36.** Para poder incorporar una nueva fuente a nuestra página web, esta tiene que estar instalada en nuestro sistema operativo.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.1

**37.** La propiedad CSS que me permite poner un color o una imagen de fondo es ___.

**Respuesta:** background

**Apartado:** 4.2

**38.** Una sombra creada con la propiedad text-shadow solo puede ir desde el borde hacia el margen, o dicho de otra forma, desde el interior de la caja hacia el exterior.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 7

**Ojo:** sale en el mismo daypo con esa respuesta. Fuera del test, la que admite sombra hacia dentro (`inset`) es `box-shadow`; `text-shadow` no la admite.

**39.** Una sombra creada con la propiedad text-shadow puede ir desde el borde hacia el margen, o dicho de otra forma, desde el interior de la caja hacia el exterior y viceversa.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 7

**Ojo:** sale en el mismo daypo con esa respuesta. Fuera del test, la que admite sombra hacia dentro (`inset`) es `box-shadow`; `text-shadow` no la admite.

## 4. Flotar y posicionar

**40.** Para limpiar el float empleamos la propiedad CSS ___.

**Respuesta:** clear

**Apartado:** 5.1

**41.** En el posicionamiento absoluto, el origen de coordenadas dependerá de si el elemento a posicionar está contenido dentro de otro que ya está previamente posicionado absoluta o relativamente.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 5.2

**42.** La propiedad z-index se aplica a los elementos que tengan la propiedad position igual a:

- a) absolute o relative
- b) float
- c) clear
- d) display

**Respuesta:** a

**Apartado:** 5.2

**43.** Flexbox es un sistema de maquetación bidimensional.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 7

**44.** La propiedad flex-grow permite hacer crecer un elemento hijo contenido en un elemento definido como flex.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 7

## 5. Tablas y listas

**45.** Un modo directo de elegir el marcador de una lista sería empleando la propiedad:

- a) list-style-type
- b) list-type
- c) list-boliche
- d) list-point

**Respuesta:** a

**Apartado:** 6.2

**46.** ¿Cuál de las siguientes reglas de estilo eliminan el marcador de los elementos de una lista? (una o más)

- a) `ul {list-style-type: none; }`
- b) `ul li {list-style-type: none; }`
- c) `ul {list-style: none; }`
- d) `ul li {list-style: none; }`

**Respuesta:** a, b

**Apartado:** 6.2

**Ojo:** el temario es contradictorio: la explicación dice que las cuatro son correctas, pero la solución marca solo la a y la b. Dos daypos marcan las cuatro y uno solo la a y la b.

**47.** El pseudoelemento `::marker` permite aplicar estilo a los símbolos de una lista.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.4

**48.** La pseudoclase `::marker` permite aplicar estilo a los símbolos de una lista.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 2.4
