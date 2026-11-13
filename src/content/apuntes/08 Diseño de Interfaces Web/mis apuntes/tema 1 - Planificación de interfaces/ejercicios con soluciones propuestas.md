# Ejercicios con soluciones propuestas: tema 1, Planificación de interfaces gráficas

Cada ejercicio se resuelve en `mis soluciones/`: `ejercicioN.md` para los de teoría y `ejercicioN.html` para los de código. Las soluciones están plegadas: se abren solo después de intentarlo.

Todo el XHTML de las soluciones está validado contra la DTD XHTML 1.0 Transitional del W3C.

---

## Ejercicio 1: Verdadero o falso (muy fácil)

Indica si cada afirmación es verdadera o falsa. Si es falsa, corrígela.

1. El volumen es un elemento visual del diseño.
2. La gravedad es un elemento de relación que se percibe con la vista.
3. Una web es educativa cuando enseña algo nuevo al usuario.
4. La estructura de navegación jerárquica es la más común.
5. Toda web, por pequeña que sea, necesita un mapa del sitio.
6. Los colores seguros de la web son 256.
7. En el sistema RGB, los tres colores puros mezclados dan negro.
8. La guía de estilo va dirigida a los usuarios que visitan el sitio.
9. En una web, el subrayado se reserva para los enlaces.
10. Las pruebas y la depuración se hacen cuando el desarrollo ha terminado.

<details>
<summary>Solución</summary>

1. **Falso.** El volumen es un elemento **conceptual** (punto, línea, plano, volumen). Los visuales son forma, medida, color y textura.
2. **Falso.** La gravedad es de relación, pero **no es visual sino psicológica**: se siente. Las que se perciben son la dirección y la posición.
3. **Falso.** Educativa significa que la interfaz es **fácil de aprender** a usar y de recordar sin usarla, no que enseñe contenidos.
4. **Verdadero.**
5. **Falso.** La necesidad del mapa del sitio es **proporcional a la complejidad**: una página única no lo necesita.
6. **Falso.** Son **216** (6 × 6 × 6). Los 256 son los colores que mostraban algunos monitores antiguos.
7. **Falso.** Dan **blanco**: RGB es aditivo. El negro es la ausencia de color.
8. **Falso.** Va dirigida al **equipo que diseña y programa** la interfaz.
9. **Verdadero.** Si se subraya otra cosa, el usuario cree que es un enlace.
10. **Falso.** Se hacen **en paralelo** al desarrollo.

</details>

---

## Ejercicio 2: Relacionar (muy fácil)

Asigna cada elemento a su grupo: **C** conceptual, **V** visual, **R** de relación, **P** práctico.

punto · textura · espacio · función · plano · medida · gravedad · representación · línea · color · dirección · significado

<details>
<summary>Solución</summary>

| Grupo | Elementos |
|---|---|
| **C** conceptual | punto, plano, línea |
| **V** visual | textura, medida, color |
| **R** de relación | espacio, gravedad, dirección |
| **P** práctico | función, representación, significado |

Faltan, para tener los cuatro grupos completos: volumen (C), forma (V) y posición (R).

</details>

---

## Ejercicio 3: Clasificar componentes (fácil)

La web de un gimnasio tiene estos elementos. Clasifica cada uno como **identificación, navegación, contenido o interacción**. Si alguno cumple dos funciones, indica las dos.

1. Logotipo del gimnasio, arriba a la izquierda, que lleva a la portada.
2. Texto "Gimnasio Ejemplo: horarios" en la barra de título del navegador.
3. Menú con Actividades, Horarios, Tarifas y Contacto.
4. Selector de idioma ES | EN.
5. Línea "Estás en: Portada > Actividades > Yoga".
6. Tabla con el horario semanal de clases.
7. Fotografías de las salas.
8. Vídeo de una clase de spinning.
9. Buscador de clases por nombre.
10. Formulario de inscripción con una casilla "Quiero recibir el boletín".
11. Teléfono y croquis de cómo llegar.
12. Enlaces "Aviso legal" y "Privacidad" del pie.

<details>
<summary>Solución</summary>

| N.º | Categoría | Por qué |
|---|---|---|
| 1 | **Identificación** y **navegación** | Dice de quién es la web; enlazado, es el elemento de regreso a la portada |
| 2 | Identificación | Dice en qué página se está |
| 3 | Navegación | Menú de secciones |
| 4 | **Interacción** | El usuario elige algo (el temario lo pone expresamente en la zona de interacción) |
| 5 | Navegación | Información de ubicación |
| 6 | Contenido | Información que se lee |
| 7 | Contenido | Se miran |
| 8 | Contenido | Se mira; no aporta datos |
| 9 | Interacción | El usuario escribe |
| 10 | Interacción | El usuario aporta datos; la casilla de verificación es un elemento de interacción |
| 11 | **Contenido** | Se lee y se mira; no se rellena nada. Trampa típica |
| 12 | Navegación | Navegación complementaria del pie |

</details>

---

## Ejercicio 4: ¿Qué principio de la Gestalt? (fácil)

Indica el principio que se aplica en cada caso.

1. En el pie, los enlaces legales están juntos y separados por un hueco de los de redes sociales: se leen como dos grupos.
2. Todos los botones "Comprar" son naranjas y redondeados, y el usuario los identifica como del mismo tipo.
3. Un logotipo es un círculo al que le falta un trozo, pero se ve como un círculo completo.
4. Un icono blanco pequeño encima de un círculo azul grande: se ve el icono como el objeto y el círculo como fondo.
5. Una fila de puntos separados que va del menú al contenido se ve como una sola línea.
6. Dos columnas de texto, la izquierda alineada a la derecha y la derecha a la izquierda, parecen un único bloque centrado.
7. Un titular negro sobre fondo blanco liso destaca como una forma con borde.
8. El principio que recoge todos los anteriores.

<details>
<summary>Solución</summary>

1. **Proximidad**.
2. **Semejanza**.
3. **Cierre**.
4. **Área o tamaño relativo**: el más pequeño de dos objetos superpuestos se ve como figura. (Es un caso particular de figura-fondo; si preguntan por el del tamaño, es este.)
5. **Continuidad**.
6. **Simetría**.
7. **Figura-fondo**.
8. **Ley de simplicidad, pregnancia o buena forma**.

</details>

---

## Ejercicio 5: Color (media)

1. Pasa a decimal: `#FF6600`, `#8B4513`, `#99CC33`, `#F0F0F0`.
2. Pasa a hexadecimal: `rgb(51, 153, 204)` y `rgb(200, 100, 50)`.
3. De los seis colores anteriores, ¿cuáles son colores seguros? Justifícalo.
4. En la rueda de 12 colores: ¿cuál es el complementario del azul? ¿Y los análogos del azul?
5. ¿Para qué se usan los complementarios y para qué los análogos?
6. ¿Cuántos colores seguros son grises (rojo, verde y azul iguales)?
7. (Razonamiento) Si cada canal tuviera 4 bits en lugar de 8, ¿cuántos colores se podrían representar?

<details>
<summary>Solución</summary>

1. `#FF6600` = 255, 102, 0 · `#8B4513` = 139, 69, 19 (8 × 16 + 11 = 139; 4 × 16 + 5 = 69; 1 × 16 + 3 = 19) · `#99CC33` = 153, 204, 51 · `#F0F0F0` = 240, 240, 240.
2. `rgb(51, 153, 204)` = `#3399CC` (51 = 3 × 16 + 3; 153 = 9 × 16 + 9; 204 = 12 × 16 + 12) · `rgb(200, 100, 50)` = `#C86432` (200 ÷ 16 = 12, resto 8 → C8; 100 ÷ 16 = 6, resto 4 → 64; 50 ÷ 16 = 3, resto 2 → 32).
3. Seguros: **`#FF6600`, `#99CC33` y `#3399CC`**, porque sus tres pares están entre `00 33 66 99 CC FF`. No lo son `#8B4513` (`8B`, `45`, `13`), `#F0F0F0` (`F0`) ni `#C86432`.
4. Complementario del azul: **naranja** (enfrente en la rueda). Análogos: **azul verdoso y azul púrpura** (a los lados).
5. Complementarios → **contraste**; análogos → **armonía**.
6. **6**: `#000000`, `#333333`, `#666666`, `#999999`, `#CCCCCC`, `#FFFFFF`.
7. 4 bits = 16 niveles por canal → 16 × 16 × 16 = **4096** colores.

</details>

---

## Ejercicio 6: Estructura de navegación (media)

Elige la estructura (lineal, reticular, jerárquica o lineal jerárquica) y justifícala en una o dos frases.

1. Curso en línea de primeros auxilios: 10 lecciones que hay que hacer en orden.
2. Web personal de un fotógrafo con cuatro páginas (inicio, galería, sobre mí, contacto), todas enlazadas con todas.
3. Web de un ayuntamiento con 8 áreas (urbanismo, deportes, cultura…), cada una con sus trámites, que no dependen de las demás.
4. Academia de idiomas con niveles A1, A2, B1 y B2; cada nivel tiene unidades que se hacen en orden, y el alumno puede pasar de un nivel a otro.
5. Tienda en línea con 300 productos en 6 categorías.
6. Una novela publicada por capítulos en 40 páginas.

<details>
<summary>Solución</summary>

1. **Lineal**: lectura secuencial obligatoria.
2. **Reticular**: pocas páginas, todas relacionadas; con cuatro no hay riesgo de perderse.
3. **Jerárquica**: secciones bien diferenciadas e independientes; no hace falta saltar de una a otra.
4. **Lineal jerárquica**: secciones (niveles) con lectura secuencial dentro y que son grados de dificultad, con paso de una sección a otra.
5. **Jerárquica**: portada → categorías → fichas. Reticular con 300 páginas haría perderse al usuario.
6. **Lineal**: lo que importa es que la lectura es secuencial, no que haya 40 páginas (trampa de la autoevaluación).

</details>

---

## Ejercicio 7: Detecta los 7 errores de esta guía de estilo (media)

Guía de estilo de la web de una floristería. Tiene **7 errores** respecto a lo que dice el temario. Encuéntralos y corrígelos. Las líneas correctas no se tocan.

1. **Logotipo**: formato PNG.
2. **Fotos de los ramos**: JPG; 300 × 300 px en la ficha de cada ramo y 120 × 120 px en los listados.
3. **Fuente**: Arial en todo el sitio.
4. **Títulos de sección**: 20 px, verde `#336633` (51, 102, 51), **subrayados** para que destaquen.
5. **Color de los enlaces del texto**: `#3366CC` (51, 102, 205).
6. **Texto de la portada**: blanco, sobre una fotografía de flores a toda la página como fondo.
7. **Fondo del pie**: gris claro.
8. **Iconos**: un carrito junto a "Pedidos" en el menú.
9. **Menú de secciones**: horizontal debajo del logotipo en la portada; vertical en el lateral izquierdo en el resto de páginas, para aprovechar el espacio.
10. **Pie**: mismo diseño, tamaño y colores que el encabezado, para dar coherencia.

<details>
<summary>Solución</summary>

| Línea | Error | Corrección |
|---|---|---|
| 1 | Falta el **tamaño en píxeles por ubicación** | Por ejemplo, 200 × 100 px en el encabezado y 100 × 50 px en el pie |
| 4 | **Subrayado** fuera de los enlaces: el usuario creerá que es un enlace | Negrita o un tamaño mayor; el subrayado solo para enlaces |
| 5 | Conversión mal hecha: `CC` = 12 × 16 + 12 = **204**, no 205 | `#3366CC` (51, 102, 204) |
| 6 | Texto **sobre imagen**: se lee mejor sobre fondo liso | Texto oscuro sobre fondo claro liso; la foto, aparte |
| 7 | Color **sin código**: la guía da cada color en hex y decimal | Por ejemplo, `#CCCCCC` (204, 204, 204) |
| 9 | El menú tiene que estar **en la misma posición en todas las páginas** | Horizontal debajo del logotipo en todas (o vertical en todas) |
| 10 | El pie tiene que ser **más sencillo** que el encabezado, para que el usuario sepa que está al final | Pie con diseño más simple y letra más pequeña |

Las líneas 2, 3 y 8 son correctas.

</details>

---

## Ejercicio 8: Detecta los 9 errores de XHTML (media)

Este documento dice ser XHTML 1.0 Transitional y tiene **9 errores** (comprobados con el validador). Encuéntralos, di qué regla rompe cada uno y escribe el documento corregido en `mis soluciones/ejercicio8.html`.

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Taller Dos Ruedas</title>
</head>
<body>
  <table width="980" border="0" cellpadding="0" cellspacing="0" align="center">
    <tr>
      <td width="200"><img src="img/logo.png" width="200" height="100" /></td>
      <td width="780"><H1>Taller Dos Ruedas</H1></td>
    </tr>
    <tr>
      <td colspan=2 height="40">
        <a href="reparaciones.html">Reparaciones</a> |
        <a href="venta.html">Venta</a> |
        <a href="alquiler.html">Alquiler</a>
      </td>
    </tr>
    <tr>
      <td colspan="2" height="400" valign="top">
        <p>Bicis de carretera & montaña.<br>
        <p>Pide cita en el <b>formulario</p></b>
        <form action="cita.html" method="post">
          <p><input type="checkbox" name="urgente" checked /> Es urgente</p>
        </form>
      </td>
    </tr>
  </table>
</body>
</html>
```

<details>
<summary>Solución</summary>

| N.º | Línea | Error | Regla |
|---|---|---|---|
| 1 | 4 | `<meta …>` sin cerrar | Los elementos vacíos se cierran con `/>` |
| 2 | 10 | `img` sin `alt` | `alt` es obligatorio |
| 3 | 11 | `<H1>` en mayúsculas | Etiquetas en minúsculas |
| 4 | 14 | `colspan=2` sin comillas | Valores de atributo siempre entre comillas |
| 5 | 22 | `&` sin escapar | Se escribe `&amp;` |
| 6 | 22 | `<br>` sin cerrar | `<br />` |
| 7 | 22 | El primer `p` no se cierra | Toda etiqueta se cierra |
| 8 | 23 | `<b>formulario</p></b>`: anidamiento cruzado | Se cierra en orden inverso: `</b></p>` |
| 9 | 25 | `checked` minimizado | Sin minimizar: `checked="checked"` |

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Taller Dos Ruedas</title>
</head>
<body>
  <table width="980" border="0" cellpadding="0" cellspacing="0" align="center">
    <tr>
      <td width="200"><img src="img/logo.png" width="200" height="100" alt="Taller Dos Ruedas" /></td>
      <td width="780"><h1>Taller Dos Ruedas</h1></td>
    </tr>
    <tr>
      <td colspan="2" height="40">
        <a href="reparaciones.html">Reparaciones</a> |
        <a href="venta.html">Venta</a> |
        <a href="alquiler.html">Alquiler</a>
      </td>
    </tr>
    <tr>
      <td colspan="2" height="400" valign="top">
        <p>Bicis de carretera &amp; montaña.<br /></p>
        <p>Pide cita en el <b>formulario</b></p>
        <form action="cita.html" method="post">
          <p><input type="checkbox" name="urgente" checked="checked" /> Es urgente</p>
        </form>
      </td>
    </tr>
  </table>
</body>
</html>
```

Diseño (no son errores de XHTML, pero se señalan): el logotipo no enlaza a la portada y no hay línea de ubicación ni pie.

</details>

---

## Ejercicio 9: Maquetar una portada con tablas (difícil)

Escribe en `mis soluciones/ejercicio9.html` la portada del gimnasio del ejercicio 3 en XHTML 1.0 Transitional, solo con tablas, para 1024 × 768. Medidas del boceto:

- Ancho total **980 px**, centrado.
- **Fila 1, encabezado (100 px de alto)**: logotipo de 250 px a la izquierda, enlazado a la portada · nombre "Gimnasio Ejemplo" centrado en 530 px · selector de idioma ES | EN en 200 px, alineado a la derecha.
- **Fila 2, menú (40 px)**: Actividades, Horarios, Tarifas, Contacto, centrados.
- **Fila 3, ubicación (20 px)**: "Estás en: Portada".
- **Fila 4, contenido (450 px)**: un título y un párrafo, pegados arriba.
- **Fila 5, pie (60 px)**: Aviso legal y Contacto, centrados, fondo `#CCCCCC`.

Comenta cada bloque. Comprueba que todas las filas suman las mismas columnas.

<details>
<summary>Solución</summary>

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Gimnasio Ejemplo: portada</title>
</head>
<body>
  <!-- Contenedor de 980 px, centrado; 3 columnas porque el encabezado tiene 3 partes -->
  <table width="980" border="0" cellpadding="0" cellspacing="0" align="center"
         summary="Estructura de la portada">

    <!-- ENCABEZADO -->
    <tr>
      <td width="250" height="100">
        <a href="index.html"><img src="img/logo.png" width="250" height="100"
           alt="Gimnasio Ejemplo. Ir a la portada" /></a>
      </td>
      <td width="530" align="center"><h1>Gimnasio Ejemplo</h1></td>
      <td width="200" align="right">
        <a href="index.html" hreflang="es">ES</a> |
        <a href="en/index.html" hreflang="en">EN</a>
      </td>
    </tr>

    <!-- NAVEGACIÓN -->
    <tr>
      <td colspan="3" height="40" align="center">
        <a href="actividades.html">Actividades</a> |
        <a href="horarios.html">Horarios</a> |
        <a href="tarifas.html">Tarifas</a> |
        <a href="contacto.html">Contacto</a>
      </td>
    </tr>

    <!-- UBICACIÓN -->
    <tr>
      <td colspan="3" height="20">Estás en: Portada</td>
    </tr>

    <!-- CONTENIDO -->
    <tr>
      <td colspan="3" height="450" valign="top">
        <h2>Bienvenida</h2>
        <p>Contenido de la portada.</p>
      </td>
    </tr>

    <!-- PIE -->
    <tr>
      <td colspan="3" height="60" align="center" bgcolor="#CCCCCC">
        <a href="aviso-legal.html">Aviso legal</a> |
        <a href="contacto.html">Contacto</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

- 250 + 530 + 200 = 980. Las demás filas: una celda con `colspan="3"`.
- `valign="top"` en el contenido: sin él, el texto sale centrado en vertical en los 450 px.
- `hreflang` indica el idioma de la página enlazada; es opcional.

</details>

---

## Ejercicio 10: Tres columnas con `rowspan` (difícil)

Escribe en `mis soluciones/ejercicio10.html` la portada de una revista con esta estructura (980 px, centrada):

- **Fila 1**: encabezado de 100 px de alto que ocupa todo el ancho.
- **Filas 2 y 3**: a la izquierda, un **menú vertical de 180 px** (Portada, Cultura, Deportes, Contacto) que ocupa las dos filas. A la derecha, una columna de **ofertas de 200 px** que también ocupa las dos filas. En el centro (600 px): en la fila 2, la ubicación (20 px); en la fila 3, el contenido (450 px).
- **Fila 4**: pie de 50 px a todo el ancho.

Antes de escribir código, responde en un comentario: ¿cuántas celdas `td` lleva cada una de las cuatro filas?

<details>
<summary>Solución</summary>

Celdas por fila: **1, 3, 1, 1**. La fila 3 solo lleva el contenido, porque las columnas izquierda y derecha ya las ocupan los `rowspan="2"` de la fila 2.

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Revista Ejemplo: portada</title>
</head>
<body>
  <!-- 3 columnas: 180 (menú) + 600 (centro) + 200 (ofertas) = 980 -->
  <table width="980" border="0" cellpadding="0" cellspacing="0" align="center"
         summary="Estructura de la portada">

    <!-- FILA 1. ENCABEZADO: ocupa las 3 columnas -->
    <tr>
      <td colspan="3" height="100" align="center"><h1>Revista Ejemplo</h1></td>
    </tr>

    <!-- FILA 2. Menú (baja 2 filas) + ubicación + ofertas (baja 2 filas) -->
    <tr>
      <td width="180" rowspan="2" valign="top">
        <p><a href="index.html">Portada</a><br />
        <a href="cultura.html">Cultura</a><br />
        <a href="deportes.html">Deportes</a><br />
        <a href="contacto.html">Contacto</a></p>
      </td>
      <td width="600" height="20">Estás en: Portada</td>
      <td width="200" rowspan="2" valign="top">
        <h3>Ofertas</h3>
        <p>Suscripción anual con descuento.</p>
      </td>
    </tr>

    <!-- FILA 3. Solo el contenido: las otras dos columnas las ocupan los rowspan -->
    <tr>
      <td height="450" valign="top">
        <h2>Artículo destacado</h2>
        <p>Texto del artículo.</p>
      </td>
    </tr>

    <!-- FILA 4. PIE -->
    <tr>
      <td colspan="3" height="50" align="center">
        <a href="aviso-legal.html">Aviso legal</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

El error típico es poner tres `td` en la fila 3: la tabla se descuadra y sale una cuarta columna.

</details>

---

## Ejercicio 11: Guía de estilo completa (difícil)

Escribe en `mis soluciones/ejercicio11.md` la guía de estilo de la web de una clínica veterinaria, para 1024 × 768:

- Logotipo de la clínica.
- Secciones: servicios, urgencias y consejos.
- Fotos del equipo (6 personas) y de las instalaciones.
- El teléfono de urgencias tiene que verse en todas las páginas.
- Formulario para pedir cita.
- Contacto con dirección y plano.

Cubre los cinco apartados con valores concretos (formatos, píxeles, fuentes, tamaños, colores en hex y decimal) y justifica en una línea las decisiones de color.

<details>
<summary>Solución</summary>

Hay muchas guías correctas. Lo que se corrige: que estén los **cinco apartados**, que **cada elemento del encargo** tenga su entrada y que **todo lleve cifras**. Una propuesta:

**1. Fotos y logos**

| Recurso | Formato | Tamaño (px) | Dónde |
|---|---|---|---|
| Logotipo | PNG | 220 × 90 | Encabezado, izquierda; enlaza a la portada |
| Logotipo pequeño | PNG | 110 × 45 | Pie |
| Foto de cada persona del equipo | JPG | 200 × 250 | Servicios > Equipo, 3 por fila |
| Foto de las instalaciones | JPG | 600 × 400 | Servicios |
| Plano | PNG | 600 × 400 | Contacto |

**2. Tipografía**

| Uso | Fuente | Tamaño | Estilo | Color |
|---|---|---|---|---|
| Títulos de contenido | Arial | 22 px | Negrita | `#006666` |
| Texto | Arial | 14 px | Normal | `#333333` |
| Teléfono de urgencias | Arial | 18 px | Negrita | `#FFFFFF` sobre `#CC0000` |
| Menú | Arial | 14 px | Negrita | `#FFFFFF` |
| Enlaces del texto | Arial | 14 px | Subrayado | `#006699` |
| Pie | Arial | 11 px | Normal | `#666666` |

**3. Colores**

| Uso | Hex | Decimal |
|---|---|---|
| Fondo | `#FFFFFF` | 255, 255, 255 |
| Texto | `#333333` | 51, 51, 51 |
| Menú y títulos | `#006666` | 0, 102, 102 |
| Recuadro de urgencias | `#CC0000` | 204, 0, 0 |
| Enlaces | `#006699` | 0, 102, 153 |
| Fondo del pie | `#CCCCCC` | 204, 204, 204 |

Verdes azulados (fríos, análogos): calma y salud. El rojo de urgencias es casi complementario del verde azulado: contraste para que se vea en todas las páginas.

**4. Iconografía**

| Icono | Dónde | Para qué |
|---|---|---|
| Teléfono | Junto al número de urgencias | Se reconoce sin leer |
| Huella, cruz, bombilla | Delante de Servicios, Urgencias y Consejos en el menú | Identificar la sección |
| Calendario | Botón del formulario de cita | Indica la acción |

16 × 16 px, blancos sobre el menú.

**5. Estructura**

- Ancho fijo de 980 px, centrado.
- Encabezado 980 × 100: logotipo 220 px a la izquierda; nombre centrado (520 px); **recuadro de urgencias 240 px a la derecha, en todas las páginas** (por eso va en el encabezado, que se repite).
- Menú horizontal 980 × 40 debajo del encabezado; mismo sitio en todas las páginas; sin submenús.
- Ubicación 980 × 20 debajo del menú.
- Contenido 980 × 420 mínimo, título arriba a la izquierda.
- Pie 980 × 50, más sencillo: mapa del sitio, aviso legal, privacidad.
- Hueco de 20 px entre contenido y pie.
- Estructura jerárquica: portada → 3 secciones → páginas de cada una.

</details>

---

## Ejercicio 12: Integrador, como la tarea (MUY DIFÍCIL)

**Ola Lenta** es una escuela de surf familiar en la costa cántabra. Quiere darse a conocer y llenar sus cursos. Después de hablar con los dueños:

- La web tiene que leerse en **tres idiomas**: castellano, inglés y francés.
- **Tres secciones**: cursos, alquiler de material y "El mar hoy" (estado del mar y una webcam de la playa).
- **Cursos**: tres niveles (iniciación, medio y avanzado) que se hacen **en orden**; cada nivel tiene **5 lecciones teóricas que se leen una detrás de otra** antes de la clase práctica. Piensan añadir un cuarto nivel, "competición".
- **Alquiler**: 15 artículos (tablas y trajes de neopreno), cada uno con foto, talla y precio por día.
- En la portada, una **animación con dibujos** que muestre cómo se coge una ola.
- Un **formulario para reservar clase** eligiendo nivel y fecha.
- **Contacto**: dirección, teléfono, horario y un croquis de cómo llegar.
- Tiene que verse bien en **1024 × 768** como mínimo.

Se pide, en `mis soluciones/ejercicio12.md` (apartados a-c) y `mis soluciones/ejercicio12.html` (apartado d):

a) Clasifica todos los elementos del enunciado en identificación, navegación, contenido o interacción.
b) Indica la estructura de navegación más adecuada y explica por qué.
c) Escribe la guía de estilo con toda la información que debería figurar según los elementos del enunciado.
d) Codifica en XHTML, con tablas, la estructura de la portada.

<details>
<summary>Solución</summary>

**a) Clasificación**

| Elemento | Categoría |
|---|---|
| Nombre "Ola Lenta" y logotipo (implícitos: "darse a conocer") | Identificación; el logotipo enlazado, también navegación |
| Título de cada página en la barra del navegador | Identificación |
| Menú: Cursos, Alquiler de material, El mar hoy, Contacto | Navegación |
| Enlaces "anterior / siguiente" entre lecciones | Navegación |
| Ubicación ("Estás en: Cursos > Medio > Lección 3") | Navegación |
| Selector de idioma (castellano, inglés, francés) | Interacción |
| Formulario de reserva (nivel y fecha) y su botón | Interacción |
| Animación de la portada | Contenido |
| Lecciones de cada nivel | Contenido |
| Fichas de alquiler: foto, talla y precio | Contenido |
| Estado del mar y webcam | Contenido |
| Dirección, teléfono, horario y croquis | Contenido |
| Enlaces del pie (mapa del sitio, aviso legal) | Navegación |

**b) Estructura: lineal jerárquica.** Desde la portada se baja a tres secciones (parte jerárquica), pero la sección principal, Cursos, tiene **niveles que se hacen en orden** y, dentro de cada nivel, **5 lecciones que se leen en secuencia**: es justo el caso de "secciones con lectura secuencial que representan grados de dificultad" del temario, y se puede pasar de un nivel a otro. Alquiler y El mar hoy se consultan sueltos, como ramas jerárquicas normales. Añadir el nivel "competición" es añadir una rama más al final de la secuencia sin tocar el resto. No es lineal pura (alquiler no se lee en orden) ni reticular (con 3 niveles × 5 lecciones + 15 artículos el usuario se perdería).

**c) Guía de estilo** (resumida; en el examen, con todas las tablas como en el ejercicio 11)

- **Fotos y logos**: logotipo PNG 200 × 100 (encabezado) y 100 × 50 (pie); animación GIF 560 × 315 (portada); fotos de alquiler JPG 300 × 300 (ficha) y 120 × 120 (listado); croquis PNG 600 × 400; webcam 640 × 360.
- **Tipografía**: Arial; nombre 28 px negrita; títulos 20 px negrita `#003366`; texto 14 px `#333333`; menú 14 px negrita `#FFFFFF`; enlaces del texto subrayados `#0066CC`; pie 11 px `#666666`. Negrita solo para precios y niveles.
- **Colores**: fondo `#FFFFFF` (255, 255, 255); texto `#333333` (51, 51, 51); menú y títulos `#003366` (0, 51, 102); recuadro de reserva `#CCE5FF` (204, 229, 255); enlaces `#0066CC` (0, 102, 204); pie `#CCCCCC` (204, 204, 204). Azules análogos (mar); el blanco del menú contrasta con el azul oscuro. El color de cada nivel de curso (verde, naranja, rojo) se usa siempre para lo mismo, con leyenda.
- **Iconografía**: banderas o códigos ES · EN · FR en el selector; ola, tabla y sol delante de las tres secciones; flechas anterior y siguiente en las lecciones; 16 × 16 px.
- **Estructura**: ancho fijo 980 px centrado. Encabezado 980 × 100 (logotipo 200 a la izquierda, nombre 580 en el centro, idiomas 200 a la derecha). Menú horizontal 980 × 40. Ubicación 980 × 20. Contenido 780 px (animación) + 200 px (recuadro de reserva) × 400 de alto. Pie 980 × 50, más sencillo. Lecciones con "anterior / siguiente" abajo del contenido. Sin submenús desplegables: los niveles se eligen en la página de Cursos.

`#CCE5FF` no es un color seguro (`E5`). Si la guía exige colores seguros, se cambia por `#CCCCFF` (204, 204, 255) o `#99CCFF` (153, 204, 255).

**d) Portada en XHTML con tablas**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Ola Lenta, escuela de surf: portada</title>
</head>
<body bgcolor="#FFFFFF">
  <!-- Contenedor: 980 px centrado. 3 columnas: 200 + 580 + 200 -->
  <table width="980" border="0" cellpadding="0" cellspacing="0" align="center"
         summary="Estructura de la portada de Ola Lenta">

    <!-- ENCABEZADO: logotipo enlazado a la portada, nombre, selector de idioma -->
    <tr>
      <td width="200" height="100">
        <a href="index.html"><img src="img/logo.png" width="200" height="100"
           alt="Ola Lenta. Ir a la portada" /></a>
      </td>
      <td width="580" align="center"><h1>Ola Lenta</h1></td>
      <td width="200" align="right">
        <a href="index.html" hreflang="es">Español</a> |
        <a href="en/index.html" hreflang="en">English</a> |
        <a href="fr/index.html" hreflang="fr">Français</a>
      </td>
    </tr>

    <!-- NAVEGACIÓN: menú horizontal de secciones -->
    <tr>
      <td colspan="3" height="40" align="center" bgcolor="#003366">
        <a href="cursos.html"><font color="#FFFFFF">Cursos</font></a> |
        <a href="alquiler.html"><font color="#FFFFFF">Alquiler de material</font></a> |
        <a href="el-mar-hoy.html"><font color="#FFFFFF">El mar hoy</font></a> |
        <a href="contacto.html"><font color="#FFFFFF">Contacto</font></a>
      </td>
    </tr>

    <!-- UBICACIÓN -->
    <tr>
      <td colspan="3" height="20">Estás en: Portada</td>
    </tr>

    <!-- CONTENIDO: animación a la izquierda (2 columnas) y reserva a la derecha -->
    <tr>
      <td colspan="2" height="400" valign="top">
        <h2>Aprende a surfear paso a paso</h2>
        <img src="img/animacion-ola.gif" width="560" height="315"
             alt="Animación: cómo se coge una ola, del remo a ponerse de pie" />
      </td>
      <td valign="top" bgcolor="#CCE5FF">
        <h3>Reserva tu clase</h3>
        <form action="reserva.html" method="post">
          <p>
            <label for="nivel">Nivel</label><br />
            <select id="nivel" name="nivel">
              <option value="1" selected="selected">Iniciación</option>
              <option value="2">Medio</option>
              <option value="3">Avanzado</option>
            </select><br />
            <label for="fecha">Fecha</label><br />
            <input type="text" id="fecha" name="fecha" size="12" /><br />
            <input type="submit" value="Reservar" />
          </p>
        </form>
      </td>
    </tr>

    <!-- PIE: más sencillo que el encabezado -->
    <tr>
      <td colspan="3" height="50" align="center" bgcolor="#CCCCCC">
        <a href="mapa.html">Mapa del sitio</a> |
        <a href="contacto.html">Contacto</a> |
        <a href="aviso-legal.html">Aviso legal</a>
      </td>
    </tr>
  </table>
</body>
</html>
```

- El contenido usa `colspan="2"` (200 + 580 = 780 px) y la reserva ocupa la tercera columna (200 px): todas las filas suman 3.
- `<font color>` solo existe en Transitional y está obsoleto: es la única forma de dar color al texto de un enlace sin CSS. En la UD4 esto se hace con hojas de estilo.
- La animación es un GIF animado: en XHTML 1.0 es la forma más sencilla de poner una animación sin plugins.
- Altura visible: 100 + 40 + 20 + 400 = 560 px, cabe en los unos 600 px visibles de 768 sin desplazar.

</details>
