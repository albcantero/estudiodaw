---
title: "Ejercicios"
kind: ejercicios
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

---

## Ejercicio 2 — Identificar partes (fácil)

Dado el siguiente documento XML, identifica y etiqueta cada parte indicada:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!-- Catálogo de productos de la tienda -->
<tienda xmlns:elec="http://mitienda.com/electronica">
    <elec:producto id="P001" disponible="true">
        <elec:nombre>Teclado mecánico</elec:nombre>
        <elec:precio>79&#46;99</elec:precio>
    </elec:producto>
</tienda>
```

Preguntas:
- a) ¿Qué línea es el prólogo? ¿Qué indica `standalone="no"`?
- b) ¿Cuál es el elemento raíz (ejemplar)?
- c) ¿Qué es `elec`? ¿Dónde se declara y qué URI tiene?
- d) ¿Qué es `id="P001"`? ¿Y `disponible="true"`?
- e) `&#46;` — ¿qué carácter representa y por qué no se escribe directamente?

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

---

## Ejercicio 6 — Crear un XML desde cero (medio)

Crea un documento XML bien formado que represente una **biblioteca** con las siguientes condiciones:

- Prólogo completo (versión, encoding UTF-8, standalone yes)
- La biblioteca tiene 2 libros
- Cada libro tiene: título, año de publicación, editorial y al menos 2 autores
- Uno de los libros tiene el precio en euros — usa la entidad correcta si aparece el símbolo €

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

---

## Ejercicio 9 — XML completo con todo (difícil)

Crea un documento XML que represente el **menú de un restaurante** con estas condiciones:

- Prólogo completo con encoding ISO-8859-1 y standalone no
- Dos secciones diferenciadas: `entrantes` y `postres` — usa namespaces con prefijos `ent:` y `post:`
- Cada plato tiene: nombre, precio (con el símbolo € usando entidad), y un atributo `vegetariano` con valor `si` o `no`
- Un plato debe estar marcado como agotado usando un **elemento vacío** `<agotado/>`
- El documento debe tener al menos un comentario

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

---

### Parte C — Reescribir con CDATA

Reescribe este fragmento usando una sección CDATA en lugar de entidades:

```xml
<condicion>Si precio &lt; 50 &amp;&amp; cantidad &gt; 0, aplicar descuento del 10%</condicion>
```

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
