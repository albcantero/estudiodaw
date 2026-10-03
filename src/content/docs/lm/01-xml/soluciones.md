---
title: "Soluciones propuestas"
kind: soluciones
---

## Ejercicio 1 — Verdadero o falso (muy fácil)

Indica si cada afirmación es verdadera o falsa. Si es falsa, corrígela.

1. XML y HTML son lo mismo: ambos sirven para mostrar información en el navegador.
2. En XML, las etiquetas las define el programador.
3. El prólogo es obligatorio en todo documento XML.
4. `<Autor>` y `<autor>` son la misma etiqueta en XML.
5. Un documento XML puede tener varios elementos raíz.
6. El valor de un atributo siempre debe ir entre comillas.
7. Un documento bien formado es siempre un documento válido.
8. Los comentarios XML se escriben con `// texto`.

<details>
<summary>Solución</summary>

1. **Falso.** HTML muestra datos visualmente con etiquetas fijas. XML estructura y transporta datos con etiquetas definidas por el programador.
2. **Verdadero.**
3. **Falso.** El prólogo es opcional. Si aparece, debe ser la primera línea.
4. **Falso.** XML es case-sensitive. Son etiquetas distintas.
5. **Falso.** Solo puede haber un elemento raíz que contenga todo lo demás.
6. **Verdadero.** Comillas simples o dobles, pero siempre presentes.
7. **Falso.** Un documento bien formado cumple las reglas sintácticas de XML. La validez requiere además cumplir un esquema (DTD o XSD).
8. **Falso.** Los comentarios en XML son `<!-- texto -->`.

</details>

---

## Ejercicio 2 — Identificar partes (fácil)

Dado el siguiente documento XML, identifica y etiqueta cada parte indicada:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!-- Catálogo de productos de la tienda -->
<tienda xmlns:elec="http://mitienda.com/electronica">
    <elec:producto id="P001" disponible="true">
        <elec:nombre>Teclado mecánico</elec:nombre>
        <elec:precio>79&amp;#46;99</elec:precio>
    </elec:producto>
</tienda>
```

Preguntas:
- a) ¿Qué línea es el prólogo? ¿Qué indica `standalone="no"`?
- b) ¿Cuál es el elemento raíz (ejemplar)?
- c) ¿Qué es `elec`? ¿Dónde se declara y qué URI tiene?
- d) ¿Qué es `id="P001"`? ¿Y `disponible="true"`?
- e) `&amp;#46;` — ¿qué carácter representa y por qué no se escribe directamente?

<details>
<summary>Solución</summary>

- a) `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`. `standalone="no"` indica que el documento depende de un fichero externo (como un DTD) para ser completamente interpretado.
- b) `<tienda>` es el elemento raíz. Todo lo demás está dentro de él.
- c) `elec` es un prefijo de espacio de nombres. Se declara en `<tienda>` con `xmlns:elec="http://mitienda.com/electronica"`. El URI es `http://mitienda.com/electronica` — solo sirve como identificador único, no tiene que ser una URL real.
- d) Son atributos del elemento `<elec:producto>`. `id` es un identificador con valor `P001`, `disponible` indica si el producto está disponible.
- e) `&#46;` es el punto `.` en código decimal Unicode. Se usa así cuando se quiere ser explícito, aunque el punto sí se puede escribir directamente en XML (no es carácter prohibido). `&amp;` es la entidad para `&`, que sí está prohibido directamente.

</details>

---

## Ejercicio 3 — Detectar errores (fácil)

El siguiente documento XML contiene **4 errores**. Identifícalos y corrígelos.

```xml
<?XML version="1.0" encoding="UTF-8" standalone="yes" ?>
<tienda>
    <producto id=001>
        <nombre>Teclado mecánico</nombre>
        <precio>79.99</precio>
        <descripcion>Compatible con Windows & Mac</descripcion>
    </producto>
    <Producto>
        <nombre>Ratón inalámbrico</nombre>
        <precio>34.50</nombre>
    </Producto>
</tienda>
```

<details>
<summary>Solución</summary>

1. `<?XML` → debe ser minúsculas: `<?xml`
2. `id=001` → el valor del atributo debe ir entre comillas: `id="001"`
3. `&` → carácter prohibido directamente, debe ser `&amp;`
4. `<precio>34.50</nombre>` → la etiqueta de cierre no coincide con la de apertura: `</precio>`

Bonus: `<Producto>` y `<producto>` son etiquetas distintas (case-sensitive). No es un error de bien formado, pero sería un error de diseño si se pretende que son el mismo tipo de elemento.

</details>

---

## Ejercicio 4 — Bien formado o no (fácil)

Indica si cada documento está bien formado y explica por qué.

**A)**
```xml
<?xml version="1.0"?>
<agenda>
    <contacto>
        <nombre>Ana López</nombre>
        <telefono>612345678</telefono>
    </contacto>
    <contacto>
        <nombre>Pedro Ruiz</nombre>
    </contacto>
</agenda>
```

**B)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<pedido>
    <cliente>María García</cliente>
<linea>
        <articulo>Libro XML</articulo>
    </pedido>
</linea>
```

**C)**
```xml
<nota>
    <para>Carlos</para>
    <de>Laura</de>
    <texto>¡Nos vemos el lunes!</texto>
</nota>
```

<details>
<summary>Solución</summary>

**A)** ✅ Bien formado. Elemento raíz único, etiquetas correctamente abiertas y cerradas, anidamiento correcto.

**B)** ❌ No bien formado. El anidamiento es incorrecto: `<linea>` se abre dentro de `<pedido>` pero `</pedido>` aparece antes de `</linea>`. El cierre de `<pedido>` interrumpe `<linea>`.

**C)** ✅ Bien formado. No tiene prólogo (es opcional) pero el ejemplar es correcto y cumple todas las reglas.

</details>

---

## Ejercicio 5 — Namespaces: leer y entender (medio)

Analiza este documento y responde las preguntas:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<universidad xmlns:grado="http://uni.es/grados"
             xmlns:admin="http://uni.es/administracion">
    <grado:titulacion codigo="DAW">
        <grado:nombre>Desarrollo de Aplicaciones Web</grado:nombre>
        <grado:horas>2000</grado:horas>
    </grado:titulacion>
    <admin:alumno dni="12345678A">
        <admin:nombre>Carlos López</admin:nombre>
        <admin:titulacion>DAW</admin:titulacion>
    </admin:alumno>
</universidad>
```

Preguntas:
- a) ¿Cuántos espacios de nombres hay? ¿Cuáles son sus prefijos y URIs?
- b) ¿Por qué `<admin:titulacion>` y `<grado:titulacion>` son etiquetas distintas aunque se llamen igual?
- c) Si elimináramos todos los prefijos (`grado:` y `admin:`), ¿el documento seguiría siendo válido? ¿Habría algún problema?
- d) ¿Dónde se declaran los namespaces? ¿Por qué se declaran en el elemento raíz y no en cada elemento?

<details>
<summary>Solución</summary>

- a) Dos espacios de nombres: `grado` con URI `http://uni.es/grados` y `admin` con URI `http://uni.es/administracion`.
- b) Aunque el nombre local es `titulacion` en ambos casos, pertenecen a espacios de nombres distintos. Para el parser XML, `grado:titulacion` y `admin:titulacion` son conceptos completamente diferentes — uno es una titulación académica, el otro es el campo que indica qué estudia un alumno.
- c) El documento seguiría siendo sintácticamente válido (bien formado), pero aparecería ambigüedad: habría dos elementos `<titulacion>` con significados distintos que el parser no podría distinguir.
- d) Se declaran en el elemento raíz para que estén disponibles en todo el documento. Se puede declarar un namespace en cualquier elemento, pero entonces solo aplica a ese elemento y sus hijos.

</details>

---

## Ejercicio 6 — Crear un XML desde cero (medio)

Crea un documento XML bien formado que represente una **biblioteca** con las siguientes condiciones:

- Prólogo completo (versión, encoding UTF-8, standalone yes)
- La biblioteca tiene 2 libros
- Cada libro tiene: título, año de publicación, editorial y al menos 2 autores
- Uno de los libros tiene el precio en euros — usa la entidad correcta si aparece el símbolo €

<details>
<summary>Solución (ejemplo válido)</summary>

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<biblioteca>
    <libro>
        <titulo>Aprendiendo XML</titulo>
        <anio>2021</anio>
        <editorial>Anaya</editorial>
        <autores>
            <autor>Carlos Martínez</autor>
            <autor>Elena Gómez</autor>
        </autores>
        <precio>24.95 &#8364;</precio>
    </libro>
    <libro>
        <titulo>Diseño con CSS</titulo>
        <anio>2023</anio>
        <editorial>Ra-Ma</editorial>
        <autores>
            <autor>Luis Fernández</autor>
            <autor>Marta Sánchez</autor>
        </autores>
    </libro>
</biblioteca>
```

Nota: `&#8364;` es la entidad decimal del símbolo €. También se puede escribir € directamente si el encoding es UTF-8.

</details>

---

## Ejercicio 7 — Elementos vs atributos (medio)

Rediseña el siguiente XML de dos maneras distintas:

1. Usando **solo atributos** para los datos simples y elementos para los complejos
2. Razona qué diseño te parece mejor y por qué

```xml
<empleados>
    <empleado>
        <id>E001</id>
        <nombre>Sofía Torres</nombre>
        <departamento>Desarrollo</departamento>
        <salario>2400</salario>
    </empleado>
    <empleado>
        <id>E002</id>
        <nombre>Jorge Navarro</nombre>
        <departamento>Diseño</departamento>
        <salario>2100</salario>
    </empleado>
</empleados>
```

<details>
<summary>Solución</summary>

**Con atributos para datos simples:**
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<empleados>
    <empleado id="E001" nombre="Sofía Torres"
              departamento="Desarrollo" salario="2400"/>
    <empleado id="E002" nombre="Jorge Navarro"
              departamento="Diseño" salario="2100"/>
</empleados>
```

**Razonamiento:** No hay una respuesta única. La convención habitual es usar atributos para datos atómicos que identifican o califican al elemento (id, fecha, código), y elementos para datos que pueden ser complejos, repetibles o que tengan subestructura. En este caso ambos diseños son válidos. Si el empleado pudiera tener varios departamentos, sería mejor usar elemento para `departamento`.

</details>

---

## Ejercicio 8 — Combinar XMLs con espacios de nombres (difícil)

Tienes dos XMLs separados:

**XML de productos:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<catalogo>
    <nombre>Laptop Pro</nombre>
    <precio>999</precio>
</catalogo>
```

**XML de clientes:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<registro>
    <nombre>Ana García</nombre>
    <email>ana@email.com</email>
</registro>
```

Crea un **único documento XML** que combine ambos usando espacios de nombres para que las etiquetas `<nombre>` no sean ambiguas.

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<tienda xmlns:prod="http://mitienda.com/productos"
        xmlns:cli="http://mitienda.com/clientes">
    <prod:catalogo>
        <prod:nombre>Laptop Pro</prod:nombre>
        <prod:precio>999</prod:precio>
    </prod:catalogo>
    <cli:registro>
        <cli:nombre>Ana García</cli:nombre>
        <cli:email>ana@email.com</cli:email>
    </cli:registro>
</tienda>
```

El elemento raíz `<tienda>` es nuevo — necesitamos uno que envuelva todo. Los dos namespaces se declaran ahí y se aplican con sus prefijos a cada bloque.

</details>

---

## Ejercicio 9 — XML completo con todo (difícil)

Crea un documento XML que represente el **menú de un restaurante** con estas condiciones:

- Prólogo completo con encoding ISO-8859-1 y standalone no
- Dos secciones diferenciadas: `entrantes` y `postres` — usa namespaces con prefijos `ent:` y `post:`
- Cada plato tiene: nombre, precio (con el símbolo € usando entidad), y un atributo `vegetariano` con valor `si` o `no`
- Un plato debe estar marcado como agotado usando un **elemento vacío** `<agotado/>`
- El documento debe tener al menos un comentario

<details>
<summary>Solución (ejemplo válido)</summary>

```xml
<?xml version="1.0" encoding="ISO-8859-1" standalone="no" ?>
<!-- Menú del Restaurante La Plaza — temporada primavera 2026 -->
<menu xmlns:ent="http://restaurante.com/entrantes"
      xmlns:post="http://restaurante.com/postres">

    <ent:seccion>
        <ent:plato vegetariano="no">
            <ent:nombre>Croquetas de jamón</ent:nombre>
            <ent:precio>8 &#8364;</ent:precio>
        </ent:plato>
        <ent:plato vegetariano="si">
            <ent:nombre>Ensalada de temporada</ent:nombre>
            <ent:precio>7 &#8364;</ent:precio>
            <agotado/>
        </ent:plato>
    </ent:seccion>

    <post:seccion>
        <post:plato vegetariano="si">
            <post:nombre>Tarta de queso</post:nombre>
            <post:precio>5 &#8364;</post:precio>
        </post:plato>
        <post:plato vegetariano="si">
            <post:nombre>Flan casero</post:nombre>
            <post:precio>4 &#8364;</post:precio>
        </post:plato>
    </post:seccion>

</menu>
```

</details>

---

## Ejercicio 10 — Diseño libre (difícil)

Diseña desde cero un XML que represente el **horario semanal de un instituto**. Requisitos:

- Prólogo completo
- Al menos 3 días de la semana
- Cada día tiene varias asignaturas con hora de inicio y fin
- El profesor de cada asignatura va como atributo
- Un aula asignada a cada franja horaria
- Usa dos espacios de nombres para distinguir datos del centro (`centro:`) de datos académicos (`acad:`)
- Al menos un elemento vacío y un comentario

No hay solución única — se valora que el documento esté bien formado, que el diseño tenga sentido y que los namespaces se usen correctamente.

---

## Ejercicio 11 — Secciones CDATA (medio-difícil)

### ¿Qué es CDATA?

Normalmente, si necesitas escribir `<`, `>` o `&` dentro del contenido de un elemento, tienes que usar entidades (`&lt;`, `&gt;`, `&amp;`). Las secciones CDATA son una alternativa: le dicen al parser "todo lo que hay aquí es texto literal, no lo interpretes como código":

```xml
<codigo><![CDATA[ if (precio < 100 && stock > 0) { return true; } ]]></codigo>
```

Sin CDATA habría que escribir `&lt;`, `&amp;`, `&gt;`. Con CDATA se escribe directamente.

Sintaxis: `<![CDATA[ contenido ]]>`

**Restricción:** la cadena `]]>` no puede aparecer dentro del contenido de una sección CDATA, porque es la marca de cierre.

---

### Parte A — Verdadero o falso

1. CDATA sirve para que el parser ignore el contenido y lo trate como texto plano.
2. Dentro de una sección CDATA puedes escribir `<elemento>` sin que el parser lo interprete como etiqueta.
3. La cadena `]]>` puede aparecer libremente dentro de una sección CDATA.
4. `<![CDATA[ hola ]]>` y `hola` son equivalentes en contenido.
5. Se puede usar CDATA dentro del valor de un atributo.

<details>
<summary>Solución</summary>

1. **Verdadero.**
2. **Verdadero.** El parser no lo interpreta como etiqueta, solo como texto.
3. **Falso.** `]]>` es la marca de cierre de CDATA — si aparece dentro, cierra la sección prematuramente.
4. **Verdadero.** El contenido es el mismo texto `hola`. CDATA solo cambia cómo se escribe, no el valor.
5. **Falso.** CDATA solo se puede usar como contenido de un elemento, nunca dentro de un atributo.

</details>

---

### Parte B — Detectar errores en CDATA

Indica qué está mal en cada fragmento:

**A)**
```xml
<![CDATA[ <[[aa]]>]]>
```

**B)**
```xml
<descripcion><![CDATA[Precio menor que 10]]></descripcion>
<nota CDATA="si">Texto con & y <</nota>
```

**C)**
```xml
<formula><![CDATA[ a < b && c > d ]]>y algo más</formula>
```

<details>
<summary>Solución</summary>

**A)** La sección CDATA empieza con `<![CDATA[`. El contenido es ` <[[aa` y la sección se cierra con el primer `]]>` que encuentra. Después queda `]]>` fuera de la sección CDATA y fuera de cualquier elemento — eso es un error de formato. El contenido `<[[aa]]>` tiene `]]>` dentro, lo que cierra la CDATA prematuramente.

**B)** La primera línea está bien. La segunda tiene `&` y `<` directamente en el contenido sin usar ni entidades ni CDATA — eso no es XML bien formado. Además, `CDATA="si"` no es una sintaxis válida para declarar CDATA; eso no existe como atributo.

**C)** Está bien formado. La sección CDATA termina en `]]>` y luego `y algo más` es contenido de texto normal del elemento `<formula>`. Un elemento puede mezclar CDATA y texto normal — no es un error.

</details>

---

### Parte C — Reescribir con CDATA

Reescribe este fragmento usando una sección CDATA en lugar de entidades:

```xml
<condicion>Si precio &lt; 50 &amp;&amp; cantidad &gt; 0, aplicar descuento del 10%</condicion>
```

<details>
<summary>Solución</summary>

```xml
<condicion><![CDATA[Si precio < 50 && cantidad > 0, aplicar descuento del 10%]]></condicion>
```

Ambas versiones producen exactamente el mismo texto al leerlas. CDATA es más legible cuando hay muchos caracteres especiales seguidos.

</details>

---

## Ejercicio 12 — Diseño completo con todo (MUY DIFÍCIL)

Diseña desde cero un XML que represente un **sistema de gestión de un torneo deportivo**. Lees el enunciado, tomas tus propias decisiones de diseño y las justificas.

### Requisitos obligatorios

**Estructura de datos:**
- El torneo tiene **equipos** y **partidos**
- Cada equipo tiene: nombre, ciudad, y una lista de jugadores (nombre, dorsal, posición)
- Cada partido tiene: fecha, los dos equipos que juegan (referenciados por ID, no duplicando datos), resultado (puede estar pendiente si aún no se ha jugado), y una descripción libre del partido

**Requisitos técnicos:**
- Prólogo completo con encoding UTF-8 y standalone no
- Dos namespaces: `eq:` para todo lo relacionado con equipos y jugadores, `comp:` para todo lo relacionado con la competición y los partidos
- Los equipos deben tener un atributo `id` único para poder ser referenciados desde los partidos
- Los partidos que aún no se han jugado deben indicarlo con un **elemento vacío** `<comp:pendiente/>`
- La descripción del partido debe ir en una **sección CDATA** (puede contener HTML, símbolos, comillas...)
- Al menos un jugador debe tener un campo opcional que otros no tienen (por ejemplo, `capitan="si"`)
- Al menos dos comentarios en el documento

**Restricciones de diseño:**
- No dupliques datos: los partidos referencian equipos por ID, no repiten nombre/ciudad
- Justifica en comentarios XML por qué usas atributo o elemento en al menos dos decisiones

<details>
<summary>Solución (ejemplo válido)</summary>

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!-- Sistema de gestión — Torneo Regional de Fútbol 2026 -->
<torneo xmlns:eq="http://torneo.es/equipos"
        xmlns:comp="http://torneo.es/competicion">

    <!-- EQUIPOS: cada uno con id único para referenciar desde partidos -->
    <eq:equipos>
        <eq:equipo id="E01">
            <eq:nombre>Salamanca FC</eq:nombre>
            <eq:ciudad>Salamanca</eq:ciudad>
            <eq:plantilla>
                <!-- capitan es atributo porque es un dato booleano simple que califica al jugador -->
                <eq:jugador dorsal="1" posicion="portero" capitan="si">
                    <eq:nombre>Carlos Ruiz</eq:nombre>
                </eq:jugador>
                <eq:jugador dorsal="9" posicion="delantero">
                    <eq:nombre>Miguel Torres</eq:nombre>
                </eq:jugador>
                <eq:jugador dorsal="5" posicion="centrocampista">
                    <eq:nombre>Pedro Sanz</eq:nombre>
                </eq:jugador>
            </eq:plantilla>
        </eq:equipo>

        <eq:equipo id="E02">
            <eq:nombre>Zamora Deportivo</eq:nombre>
            <eq:ciudad>Zamora</eq:ciudad>
            <eq:plantilla>
                <eq:jugador dorsal="1" posicion="portero" capitan="si">
                    <eq:nombre>Javier Blanco</eq:nombre>
                </eq:jugador>
                <eq:jugador dorsal="10" posicion="delantero">
                    <eq:nombre>Andrés Mora</eq:nombre>
                </eq:jugador>
            </eq:plantilla>
        </eq:equipo>
    </eq:equipos>

    <!-- PARTIDOS: referencian equipos por id, no duplican datos -->
    <comp:jornadas>
        <comp:partido id="P01" fecha="2026-05-10">
            <!-- idLocal e idVisitante son atributos porque son referencias simples, no estructuras complejas -->
            <comp:enfrentamiento idLocal="E01" idVisitante="E02"/>
            <comp:resultado golesLocal="2" golesVisitante="1"/>
            <comp:descripcion><![CDATA[
                Partido intenso con dos goles de Torres en la 1ª parte.
                El Zamora empató a los 60' pero Sanz marcó el 2-1 final.
                Temperatura: 18°C. Asistencia: ~3.000 personas.
            ]]></comp:descripcion>
        </comp:partido>

        <comp:partido id="P02" fecha="2026-05-24">
            <comp:enfrentamiento idLocal="E02" idVisitante="E01"/>
            <comp:pendiente/>
            <comp:descripcion><![CDATA[Partido de vuelta pendiente de disputar.]]></comp:descripcion>
        </comp:partido>
    </comp:jornadas>

</torneo>
```

**Decisiones de diseño justificadas:**
- `id` como atributo en `<eq:equipo>`: es un identificador atómico que no tiene subestructura — caso claro de atributo.
- `<eq:nombre>` como elemento dentro de jugador: aunque es un dato simple, sigue el mismo patrón que el resto del documento para consistencia.
- `<comp:pendiente/>` como elemento vacío: su mera presencia comunica información (el partido no se ha jugado). No necesita valor.
- CDATA en descripción: las descripciones pueden contener cualquier símbolo, comillas, incluso fragmentos HTML — CDATA evita tener que escapar todo.

</details>
