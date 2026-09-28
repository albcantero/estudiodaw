---
title: "Teoría"
kind: teoria
---


---

## 1. Qué es XML

**XML** (eXtensible Markup Language) es un lenguaje de etiquetas donde **tú defines las etiquetas**. No representa datos visualmente — solo organiza su estructura.

| | HTML | XML |
|--|--|--|
| Etiquetas | Fijas (`<p>`, `<div>`...) | Las defines tú |
| Propósito | Mostrar datos en el navegador | Almacenar y transportar datos |
| Importa el aspecto | Sí | No |

```xml
<libro>
    <titulo>XML práctico</titulo>
    <autor>Sebastien Lecomte</autor>
    <precio>29.90</precio>
</libro>
```

---

## 2. Estructura de un documento XML

Un documento XML tiene dos partes:

```
documento XML = [prólogo] + ejemplar
                 opcional    obligatorio
```

- **Prólogo** → metainformación sobre el documento (versión, codificación...)
- **Ejemplar** → los datos reales. Es el elemento raíz que contiene todo.

Los comentarios se escriben con `<!-- texto -->` y pueden ir en cualquier posición **excepto** antes del prólogo o dentro de una etiqueta.

---

## 3. El prólogo

Si se incluye, debe ser la primera línea del documento.

### Declaración XML

```xml
<?xml version="1.0" ?>
```

### Encoding — codificación de caracteres

```xml
<?xml version="1.0" encoding="UTF-8" ?>
```

Los más importantes:

| Encoding | Uso |
|--|--|
| `UTF-8` | Universal — recomendado |
| `ISO-8859-1` | Europa occidental y Latinoamérica (permite ñ, acentos) |

### Standalone — autonomía del documento

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
```

- `yes` → el documento es independiente, no necesita ningún otro
- `no` → necesita un documento externo (como un DTD) para ser interpretado

### Declaración de tipo de documento (DOCTYPE)

```xml
<!DOCTYPE nombre_raiz>
```

Conecta el documento con un DTD — el fichero externo donde están escritas las reglas de qué etiquetas son válidas, en qué orden, qué atributos tienen, etc.

Si se usa sin apuntar a ningún DTD externo, no rompe nada: simplemente declara el nombre del elemento raíz pero sin reglas asociadas — es informativo, no funcional.

| Situación | standalone | DOCTYPE |
|---|---|---|
| XML puro sin validación | `yes` | No es obligatorio |
| XML que referencia un DTD externo | `no` | Necesario |

---

## 4. El ejemplar — elementos

El ejemplar es el **elemento raíz** del documento. Todos los datos han de estar dentro de él. Si intentas poner algo fuera, el documento no está bien formado.

```xml
<biblioteca>          ← elemento raíz (ejemplar)
    <libro>           ← elemento hijo
        <titulo>XML práctico</titulo>
    </libro>
</biblioteca>

<otraCosa>esto rompe todo</otraCosa>  ← inválido, fuera del ejemplar
```

El nombre lo eliges tú — `<biblioteca>`, `<tienda>`, `<datos>`, lo que tenga sentido para el documento. En HTML siempre es `<html>` porque está predefinido. En XML es tuyo.

### Reglas de los elementos

**1. Un único elemento raíz** — todo el documento está dentro de él.

**2. Todo elemento tiene etiqueta de apertura y cierre:**
```xml
<autor>Nombre</autor>
```

Los elementos vacíos pueden escribirse en forma corta:
```xml
<imagen/>          equivale a     <imagen></imagen>
```

**3. Anidamiento correcto** — no puede cerrarse un elemento que contenga otro sin cerrar:
```xml
<!-- CORRECTO -->
<a><b></b></a>

<!-- INCORRECTO -->
<a><b></a></b>
```

**4. Case-sensitive** — `<Autor>` y `<autor>` son etiquetas distintas. Apertura y cierre deben coincidir exactamente.

**5. Nombres de etiquetas** — pueden ser cualquier cadena alfanumérica sin espacios que no empiece por `:` ni por `xml` (ni sus variantes en mayúsculas).

---

## 5. Entidades — caracteres especiales

Cinco caracteres no pueden usarse directamente dentro del contenido:

| Carácter | Entidad |
|--|--|
| `>` | `&gt;` |
| `<` | `&lt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| `'` | `&apos;` |

Para caracteres especiales (€, ©, ®...) se usa el código Unicode decimal o hexadecimal:
```xml
&amp;#8364;    ← Euro € en decimal
&amp;#x20AC;   ← Euro € en hexadecimal
```

---

## 6. Atributos

Añaden propiedades a los elementos. Se definen dentro de la etiqueta de apertura:

```xml
<libro isbn="978-2-7460-4958-1" edicion="1" paginas="347">
</libro>
```

### Reglas de atributos

- El valor siempre entre comillas (simples `'` o dobles `"`)
- No pueden contener `<`
- Mismas reglas de nombres que los elementos
- No pueden contener subelementos ni organizarse en jerarquía

```xml
<autor nombre="Sebastien Lecomte" funcion="autor"></autor>
```

**¿Cuándo usar atributo y cuándo elemento?** Regla práctica: si el dato es simple y atómico (un ID, un número, una fecha), atributo. Si es complejo o puede repetirse, elemento.

**Contenido mixto** — un elemento puede tener texto y elementos hijo mezclados:

```xml
<empleado id="E001">Sofía Torres<departamento>Desarrollo</departamento></empleado>
```

Es válido, pero solo se recomienda en documentos narrativos (texto que fluye, como HTML o libros). Para datos estructurados, evitarlo:

| Tipo de documento | Patrón recomendado |
|---|---|
| Narrativo (artículo, libro, HTML) | Contenido mixto OK |
| Datos (empleados, facturas, catálogos) | Solo elementos hijo o atributos |

En cuanto un elemento tiene más de un dato, lo correcto es nombrar todo con etiquetas:

```xml
<!-- Evitar: texto mezclado con hijos -->
<libro>El Archivo de las Tormentas
    <autor>Brandon Sanderson</autor>
</libro>

<!-- Correcto: todo elementos hijo -->
<libro>
    <titulo>El Archivo de las Tormentas</titulo>
    <autor>Brandon Sanderson</autor>
</libro>
```

---

## 7. Documentos XML bien formados

Un documento XML está **bien formado** si cumple las tres reglas del W3C:

1. Tiene un único **elemento raíz** que contiene todos los demás
2. Todas las etiquetas están correctamente **abiertas y cerradas**, con **anidamiento correcto**
3. Cumple todas las **reglas sintácticas** de XML (atributos con comillas, sin caracteres prohibidos, etc.)

> Un documento puede estar bien formado pero no ser válido. La validez se comprueba contra un DTD o XSD — eso es el siguiente paso.

---

## 8. Cross-referencing por ID

XML no tiene variables ni referencias reales. Pero se puede evitar duplicar datos usando un patrón de diseño: definir un elemento con un atributo `id` único arriba, y referenciarlo desde otro elemento con un atributo que contenga ese mismo valor.

```xml
<equipos>
    <equipo id="E01">
        <nombre>Salamanca FC</nombre>
        <ciudad>Salamanca</ciudad>
    </equipo>
</equipos>

<partidos>
    <partido idLocal="E01" idVisitante="E02" />
</partidos>
```

El partido no repite los datos del equipo — solo guarda su ID. Si cambias el nombre del equipo, lo cambias en un sitio.

**Lo que XML no hace:** el parser no sabe que `idLocal="E01"` apunta a `id="E01"`. Para él son dos atributos con el mismo valor de texto, punto. La relación la entiende el código que procesa el documento (XSLT, Java...) porque tú le programas esa lógica. La validación real de que el ID referenciado existe la hace XSD con `xs:key` y `xs:keyref`.

**¿Por qué `id` arriba e `idLocal` abajo y no `id` en los dos?** Para evitar ambigüedad. Con nombres distintos queda claro cuál es la definición y cuál es el puntero. Es la misma lógica que en bases de datos: la columna original se llama `id` y la foránea se llama `equipo_id`.

**Patrón diccionario:** se pueden definir todos los elementos reutilizables en un bloque al principio y referenciarlos después:

```xml
<acad:asignaturas>
    <acad:asignatura id="MAT" materia="Matemáticas" />
    <acad:asignatura id="LEN" materia="Lengua" />
</acad:asignaturas>

<centro:horario>
    <centro:dia dia="lunes">
        <centro:clase idAsignatura="MAT" inicio="9:00" fin="10:00" />
    </centro:dia>
</centro:horario>
```

---

## 9. Secciones CDATA

Cuando el contenido de un elemento tiene muchos caracteres especiales (`<`, `>`, `&`...), escribir todas las entidades se vuelve tedioso. Las secciones CDATA le dicen al parser "trata esto como texto plano, no lo interpretes":

```xml
<condicion><![CDATA[ precio < 100 && stock > 0 ]]></condicion>
```

Sin CDATA habría que escribir `&lt;`, `&amp;&amp;`, `&gt;`. Con CDATA se escribe directamente.

**Sintaxis:**
```
<![CDATA[ contenido ]]>
```

**Reglas:**
- Solo se puede usar como contenido de un elemento, nunca dentro de un atributo
- La cadena `]]>` no puede aparecer dentro del contenido — es la marca de cierre y la terminaría prematuramente
- Se puede mezclar CDATA con texto normal dentro del mismo elemento

```xml
<!-- Válido: mezcla de CDATA y texto normal -->
<nota><![CDATA[precio < 50]]> euros</nota>

<!-- Inválido: ]]> dentro del contenido cierra la sección antes de tiempo -->
<nota><![CDATA[ datos]]>más ]]></nota>
```

---

## 9. Espacios de nombres

Cuando se mezclan dos documentos XML que usan el mismo nombre de etiqueta para cosas distintas, se produce ambigüedad. Los espacios de nombres la resuelven.

### Sintaxis

Las etiquetas ambiguas se prefijan:

```xml
<prefijo:etiqueta>...</prefijo:etiqueta>
```

El prefijo se declara con el atributo especial `xmlns`:

```xml
<raiz xmlns:alumnos="http://DAM/alumnos"
      xmlns:profesores="http://DAM/profesores">
    <alumnos:nombre>Fernando García</alumnos:nombre>
    <profesores:nombre>Pilar Ruiz</profesores:nombre>
</raiz>
```

El URI (`http://DAM/alumnos`) solo sirve como identificador único — no tiene que ser una URL real.

**¿Qué es exactamente un URI?**

URI (Uniform Resource Identifier) es simplemente una cadena de texto que identifica algo de forma única. Nada más.

Cuando lo ves en un namespace, tu instinto es pensar "eso es una URL, habrá algo ahí". Pero no. El parser XML no va a ningún sitio a buscar ese URI. Solo lo usa como etiqueta única para distinguir, por ejemplo, `grado:titulacion` de `admin:titulacion`.

El programador usa formato de URL por convención, no por obligación. Podría ser perfectamente:

```xml
xmlns:grado="esto-es-grados-de-mi-universidad"
xmlns:grado="urn:mi-empresa:grados"
xmlns:grado="patata"
```

Lo que importa es que sea único, no lo que significa. Es como un DNI — su valor es la unicidad, no el número en sí.

**¿Por qué se usa formato de URL por convención?**

Cuando diseñaron XML en 1998, el problema era: el URI tiene que ser único en todo el mundo, para que dos programadores distintos no elijan accidentalmente el mismo. ¿Y qué era ya único en todo el mundo en 1998? Los dominios web. Si tú controlas `miempresa.com`, nadie más puede usar `http://miempresa.com/lo-que-sea` — es tuyo por definición.

La convención fue: usa tu dominio como base del URI, así garantizas unicidad global sin necesidad de ningún registro central.

No es que la URL funcione o apunte a algo. Es que el dominio actúa como espacio reservado globalmente.

**¿Por qué no basta con una palabra corta o dejarlo vacío?**

Podrías poner `xmlns:grado="grado"` o incluso `xmlns:grado=""` — XML no lo prohíbe. El problema es la **colisión accidental**: si tú usas `"grado"` y otro programador en otra empresa también usa `"grado"`, cuando alguien intente combinar ambos XMLs en un sistema más grande, el parser no puede saber si `grado:titulacion` de tu fichero y `grado:titulacion` del suyo son el mismo concepto o dos cosas distintas.

Con `http://miempresa.com/grados` ese problema desaparece porque nadie más controla tu dominio.

En la práctica, para un examen o proyecto pequeño sin riesgo de mezclar XMLs de distintas organizaciones, URIs cortos funcionan perfectamente. La convención del dominio es para sistemas reales a gran escala.

### Prefijo vs namespace — no son lo mismo

- **Namespace** — el identificador único real. Es el URI: `http://DAM/alumnos`. Ese es "el namespace".
- **Prefijo** — el alias corto que usas en el documento para no escribir el URI cada vez. Es `alumnos:`.

El prefijo es intercambiable: dos documentos pueden usar prefijos distintos para el mismo namespace y son equivalentes. Lo que identifica de verdad al namespace es el URI, no el prefijo.

```xml
<!-- Estos dos son equivalentes — mismo namespace, distinto prefijo -->
xmlns:alumnos="http://DAM/alumnos"
xmlns:est="http://DAM/alumnos"
```

### Reglas del prefijo

- Sin espacios ni caracteres especiales
- No puede empezar por un dígito
