# Ejercicios: tema 1, Planificación de interfaces gráficas

Cada ejercicio se resuelve en `mis soluciones/`: `ejercicioN.md` para los de teoría y `ejercicioN.html` para los de código. Las soluciones están en `ejercicios con soluciones propuestas.md`.

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

---

## Ejercicio 2: Relacionar (muy fácil)

Asigna cada elemento a su grupo: **C** conceptual, **V** visual, **R** de relación, **P** práctico.

punto · textura · espacio · función · plano · medida · gravedad · representación · línea · color · dirección · significado

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

---

## Ejercicio 5: Color (media)

1. Pasa a decimal: `#FF6600`, `#8B4513`, `#99CC33`, `#F0F0F0`.
2. Pasa a hexadecimal: `rgb(51, 153, 204)` y `rgb(200, 100, 50)`.
3. De los seis colores anteriores, ¿cuáles son colores seguros? Justifícalo.
4. En la rueda de 12 colores: ¿cuál es el complementario del azul? ¿Y los análogos del azul?
5. ¿Para qué se usan los complementarios y para qué los análogos?
6. ¿Cuántos colores seguros son grises (rojo, verde y azul iguales)?
7. (Razonamiento) Si cada canal tuviera 4 bits en lugar de 8, ¿cuántos colores se podrían representar?

---

## Ejercicio 6: Estructura de navegación (media)

Elige la estructura (lineal, reticular, jerárquica o lineal jerárquica) y justifícala en una o dos frases.

1. Curso en línea de primeros auxilios: 10 lecciones que hay que hacer en orden.
2. Web personal de un fotógrafo con cuatro páginas (inicio, galería, sobre mí, contacto), todas enlazadas con todas.
3. Web de un ayuntamiento con 8 áreas (urbanismo, deportes, cultura…), cada una con sus trámites, que no dependen de las demás.
4. Academia de idiomas con niveles A1, A2, B1 y B2; cada nivel tiene unidades que se hacen en orden, y el alumno puede pasar de un nivel a otro.
5. Tienda en línea con 300 productos en 6 categorías.
6. Una novela publicada por capítulos en 40 páginas.

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

---

## Ejercicio 10: Tres columnas con `rowspan` (difícil)

Escribe en `mis soluciones/ejercicio10.html` la portada de una revista con esta estructura (980 px, centrada):

- **Fila 1**: encabezado de 100 px de alto que ocupa todo el ancho.
- **Filas 2 y 3**: a la izquierda, un **menú vertical de 180 px** (Portada, Cultura, Deportes, Contacto) que ocupa las dos filas. A la derecha, una columna de **ofertas de 200 px** que también ocupa las dos filas. En el centro (600 px): en la fila 2, la ubicación (20 px); en la fila 3, el contenido (450 px).
- **Fila 4**: pie de 50 px a todo el ancho.

Antes de escribir código, responde en un comentario: ¿cuántas celdas `td` lleva cada una de las cuatro filas?

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
