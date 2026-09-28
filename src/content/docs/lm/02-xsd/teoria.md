---
title: "Teoría"
kind: teoria
---


---

## 1. Por qué existe XSD

Un documento XML puede estar **bien formado** (sintaxis correcta) pero contener datos inválidos. Por ejemplo:

```xml
<impresora>
    <peso>mucho</peso>
    <tipo>cohete</tipo>
</impresora>
```

Esto es XML bien formado — pero `peso` debería ser un número decimal, y `tipo` solo puede ser "láser", "matricial" o "tinta". XML por sí solo no puede verificar nada de esto.

Para resolver ese problema existen los **esquemas de validación**. Dos opciones:

| | DTD | XSD |
|--|--|--|
| Sintaxis | Propia (no es XML) | Es XML |
| Tipos de datos | Solo texto | Muchos: enteros, decimales, fechas, booleanos... |
| Restricciones | Muy limitadas | Completas: rangos, patrones, longitudes... |
| Integridad referencial | ID/IDREF (básico) | xs:key/xs:keyref (robusto) |
| Namespaces | No soporta | Soporta |
| Uso actual | Legacy | Estándar actual |

**XSD es el estándar actual.** DTD sigue existiendo en sistemas legados y en la Tarea 4.

---

## 2. Estructura de un XSD

Un XSD es un documento XML normal. Su elemento raíz es `xs:schema`:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <!-- aquí van las declaraciones -->

</xs:schema>
```

El atributo `xmlns:xs="http://www.w3.org/2001/XMLSchema"` es **obligatorio** — declara el namespace de XSD. El prefijo `xs:` se puede cambiar (también se ve `xsd:`), pero `xs:` es el más común.

> **Nota:** el prefijo `xs:` se usa en la propia etiqueta donde se declara (`<xs:schema xmlns:xs="...">`). Esto es válido porque en XML una declaración `xmlns:` aplica al elemento en el que está escrita, incluido él mismo. El parser procesa el prefijo y su declaración como parte del mismo token de apertura — no hay "antes" ni "después" dentro de una misma etiqueta.

### ¿Dónde va xmlns:xs?

`xmlns:xs="http://www.w3.org/2001/XMLSchema"` solo va en el fichero **`.xsd`** — el esquema necesita declarar ese namespace para poder usar `xs:element`, `xs:complexType`, etc.

En el fichero **`.xml`** de datos no hay ningún `xs:`. Solo hay tus propios elementos (`<impresoras>`, `<marca>`...) y el `xmlns:xsi` para apuntar al esquema. No importas XSD para nada porque no estás escribiendo reglas — estás escribiendo datos.

| Fichero | Lleva `xmlns:xs` | Lleva `xmlns:xsi` |
|---------|-----------------|-------------------|
| `.xsd` (el esquema) | Sí — obligatorio | No |
| `.xml` (los datos) | No | Sí — para vincularlo al esquema |

### Vincular el XSD al XML

En el elemento raíz del XML:

```xml
<impresoras
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="impresoras.xsd">
    ...
</impresoras>
```

`xmlns:xsi` es **obligatorio** — sin él, el prefijo `xsi:` no existe y no puedes usar `xsi:noNamespaceSchemaLocation` ni `xsi:schemaLocation`.

Hay dos variantes según si el XML tiene namespace o no:

| Situación | Atributo | Valor |
|-----------|----------|-------|
| XML sin namespace (lo normal en los ejercicios) | `xsi:noNamespaceSchemaLocation` | `"impresoras.xsd"` |
| XML con namespace propio | `xsi:schemaLocation` | `"http://miempresa.com/ns impresoras.xsd"` (par: namespace + ruta) |

El "no namespace" describe al XML, no al esquema: significa "este XML no tiene namespace, aquí está su esquema".

**Lectura de las dos líneas juntas:**

```xml
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:noNamespaceSchemaLocation="impresoras.xsd"
```

- Primera línea: el prefijo `xsi:` pertenece al namespace W3C de XMLSchema-instance — permite usar sus atributos especiales.
- Segunda línea: los elementos de este documento (los que no tienen prefijo) se **validan** contra las reglas definidas en `impresoras.xsd`.

La primera dice *de dónde viene `xsi:`*. La segunda usa `xsi:` para apuntar al fichero con las reglas de validación. No es "importar datos de impresoras.xsd" — es "validar contra las reglas de impresoras.xsd".

**¿Se pueden mezclar `schemaLocation` y `noNamespaceSchemaLocation`?**

Sí. Puedes usar los dos a la vez si el documento mezcla elementos con namespace y elementos sin él:

```xml
<impresoras
    xmlns:tin="http://miempresa.com/tintas"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://miempresa.com/tintas tintas.xsd"
    xsi:noNamespaceSchemaLocation="impresoras.xsd">

    <marca>Epson</marca>          <!-- sin namespace → validado por impresoras.xsd -->
    <tin:color>negro</tin:color>  <!-- con namespace → validado por tintas.xsd -->

</impresoras>
```

Lo que no puedes es tener dos bloques **ambos sin namespace** con esquemas distintos — el validador no podría distinguirlos. Si necesitas dos esquemas para elementos sin namespace, la solución es darle namespace a uno de los bloques.

**¿Cómo sabe el validador qué esquema corresponde a qué namespace?**

`schemaLocation` no referencia el prefijo (`tin:`), referencia el URI completo. El validador cruza el URI de `xmlns:` con el URI del par en `schemaLocation`:

```xml
xmlns:tin="http://miempresa.com/tintas"
xsi:schemaLocation="http://miempresa.com/tintas tintas.xsd"
```

Lee: "el namespace `http://miempresa.com/tintas` está definido en `tintas.xsd`". Como `tin:` tiene ese URI, todo elemento `tin:` se valida contra `tintas.xsd`. El prefijo es el alias — la identidad real es el URI.

Con varios namespaces:

```xml
xmlns:tin="http://miempresa.com/tintas"
xmlns:imp="http://miempresa.com/impresoras"
xsi:schemaLocation="http://miempresa.com/tintas     tintas.xsd
                    http://miempresa.com/impresoras impresoras.xsd"
```

El validador distingue `tin:` de `imp:` por sus URIs, no por sus prefijos. Podrías renombrar los prefijos y seguiría funcionando igual.

---

## 3. Tipos de datos predefinidos

XSD incluye tipos de datos listos para usar. Los más importantes:

| Tipo | Qué representa | Ejemplo |
|------|---------------|---------|
| `xs:string` | Cadena de texto | `"Epson"` |
| `xs:boolean` | Verdadero/falso | `true`, `false` |
| `xs:integer` | Entero (positivo, negativo o cero) | `42`, `-3` |
| `xs:positiveInteger` | Entero estrictamente positivo (> 0) | `1`, `99` |
| `xs:negativeInteger` | Entero estrictamente negativo (< 0) | `-1`, `-99` |
| `xs:nonNegativeInteger` | Entero mayor o igual a 0 (≥ 0) | `0`, `1`, `99` |
| `xs:nonPositiveInteger` | Entero menor o igual a 0 (≤ 0) | `0`, `-1`, `-99` |
| `xs:decimal` | Número con decimales (positivo, negativo o cero) | `4.52`, `-3.2`, `0` |
| `xs:date` | Fecha ISO | `2024-05-06` |
| `xs:dateTime` | Fecha y hora | `2024-05-06T09:00:00` |
| `xs:anyURI` | URI/URL | `http://ejemplo.com` |
| `xs:ID` | Identificador único (herencia DTD) | `"i245"` |
| `xs:IDREF` | Referencia a un ID (herencia DTD) | `"i245"` |

> No existe `xs:positiveDecimal` ni variantes predefinidas para decimales. Para restringir decimales a positivos hay que usar `xs:restriction` con `xs:minExclusive value="0"` manualmente:
>```xml
><xs:simpleType name="tipoPrecio">
>    <xs:restriction base="xs:decimal">
>        <xs:minExclusive value="0" />
>    </xs:restriction>
></xs:simpleType>
>```

---

## 4. Elementos simples — `xs:element`

Un **elemento simple** es el que solo contiene texto (sin atributos ni elementos hijo):

```xml
<xs:element name="marca" type="xs:string" />
<xs:element name="peso" type="xs:decimal" />
<xs:element name="año" type="xs:positiveInteger" />
```

El atributo `name` es literalmente el nombre de la etiqueta que aparecerá en el XML:

```xml
<!-- XSD -->
<xs:element name="nombre" type="xs:string" />

<!-- XML resultante -->
<nombre>Juan</nombre>
```

### Cardinalidad — minOccurs y maxOccurs

Controlan cuántas veces puede aparecer un elemento:

| Atributo | Valor por defecto | Significado |
|----------|------------------|-------------|
| `minOccurs` | `1` | Mínimo de apariciones |
| `maxOccurs` | `1` | Máximo de apariciones |

Valores especiales:
- `minOccurs="0"` → el elemento es **opcional**
- `maxOccurs="unbounded"` → puede repetirse **sin límite**

```xml
<!-- Obligatorio, exactamente una vez (por defecto) -->
<xs:element name="marca" type="xs:string" />

<!-- Opcional -->
<xs:element name="enred" minOccurs="0" maxOccurs="1" />

<!-- Puede repetirse: uno o más tamaños -->
<xs:element name="tamaño" type="xs:string"
            minOccurs="1" maxOccurs="unbounded" />
```

---

## 5. Atributos — `xs:attribute`

Los atributos se declaran dentro de un `xs:complexType` (ver §6), después de los elementos hijo:

```xml
<xs:attribute name="numSerie" type="xs:string" use="required" />
<xs:attribute name="tipo" type="xs:string" use="required" />
<xs:attribute name="compra" type="xs:positiveInteger" use="optional" />
```

El atributo `use` controla si es obligatorio:

| `use` | Significado |
|-------|------------|
| `required` | Obligatorio |
| `optional` | Opcional (valor por defecto) |
| `prohibited` | No puede aparecer |

---

## 6. Tipos complejos — `xs:complexType`

Un **tipo complejo** es cualquier elemento que tenga atributos o elementos hijo. Se define con `xs:complexType`.

### Composición de hijos

Tres formas de organizar los elementos hijo:

| Compositor | Significado |
|-----------|------------|
| `xs:sequence` | Los hijos deben aparecer **en ese orden** |
| `xs:choice` | Solo puede aparecer **uno** de los hijos |
| `xs:all` | Todos los hijos deben aparecer, **en cualquier orden** |

### xs:choice — ejemplo

```xml
<xs:element name="contacto">
    <xs:complexType>
        <xs:choice>
            <xs:element name="email" type="xs:string" />
            <xs:element name="telefono" type="xs:string" />
            <xs:element name="direccion" type="xs:string" />
        </xs:choice>
    </xs:complexType>
</xs:element>
```

`<contacto>` solo puede tener **uno** de los tres — o email, o teléfono, o dirección. Nunca dos a la vez. Si el XML tiene `<email>` y `<telefono>` a la vez, falla.

### xs:all — ejemplo y comportamiento

```xml
<xs:element name="direccion">
    <xs:complexType>
        <xs:all>
            <xs:element name="calle" type="xs:string" />
            <xs:element name="ciudad" type="xs:string" />
            <xs:element name="cp" type="xs:string" />
        </xs:all>
    </xs:complexType>
</xs:element>
```

Los tres hijos son **obligatorios por defecto** (`minOccurs="1"`) y pueden aparecer en cualquier orden. Para hacer uno opcional: `minOccurs="0"` en ese elemento concreto.

Limitación importante: `xs:all` no permite `maxOccurs > 1` en sus hijos — cada elemento puede aparecer como máximo una vez. No se pueden anidar compositors dentro de `xs:all`.

### Ejemplo completo — impresora

```xml
<xs:element name="impresora">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="marca" type="xs:string" />
            <xs:element name="modelo" type="xs:string" />
            <xs:element name="peso" type="xs:decimal" />
            <xs:element name="tamaño" type="xs:string"
                        minOccurs="1" maxOccurs="unbounded" />
            <xs:element name="cartucho" type="xs:string" />
            <xs:element name="enred" minOccurs="0">
                <xs:complexType />
            </xs:element>
        </xs:sequence>
        <xs:attribute name="numSerie" type="xs:string" use="required" />
        <xs:attribute name="tipo" type="xs:string" use="required" />
        <xs:attribute name="compra" type="xs:positiveInteger" use="optional" />
    </xs:complexType>
</xs:element>
```

> `<xs:complexType />` sin contenido = elemento vacío (como `<enred/>`).

### Contenido mixto

Si un elemento mezcla texto con elementos hijo, se añade `mixed="true"`:

```xml
<xs:element name="descripcion">
    <xs:complexType mixed="true">
        <xs:sequence>
            <xs:element name="destacado" type="xs:string" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

---

## 7. Restricciones — `xs:simpleType` y `xs:restriction`

Cuando un tipo predefinido no es suficiente (quieres limitar los valores posibles), defines un **tipo simple personalizado** con `xs:simpleType` y `xs:restriction`.

### Estructura

```xml
<xs:simpleType name="miTipo">
    <xs:restriction base="xs:tipoPredefinido">
        <!-- facetas -->
    </xs:restriction>
</xs:simpleType>
```

### Facetas disponibles

| Faceta | Se aplica a | Significado |
|--------|------------|-------------|
| `xs:enumeration` | Cualquier tipo | Lista de valores permitidos |
| `xs:minInclusive` | Números | Valor mínimo (incluido) |
| `xs:maxInclusive` | Números | Valor máximo (incluido) |
| `xs:minExclusive` | Números | Valor mínimo (excluido) |
| `xs:maxExclusive` | Números | Valor máximo (excluido) |
| `xs:totalDigits` | Decimal | Número total máximo de dígitos |
| `xs:fractionDigits` | Decimal | Número máximo de decimales |
| `xs:length` | String | Longitud exacta |
| `xs:minLength` | String | Longitud mínima |
| `xs:maxLength` | String | Longitud máxima |
| `xs:pattern` | Cualquier tipo | Expresión regular |
| `xs:whiteSpace` | String | Tratamiento de espacios |

### Ejemplos

**Enumeración** — tipo solo puede valer tres cosas:
```xml
<xs:simpleType name="tipoImpresora">
    <xs:restriction base="xs:string">
        <xs:enumeration value="láser" />
        <xs:enumeration value="matricial" />
        <xs:enumeration value="tinta" />
    </xs:restriction>
</xs:simpleType>
```

**Rango numérico** — peso entre 0 y 999.99 con máximo 2 decimales:
```xml
<xs:simpleType name="tipoPeso">
    <xs:restriction base="xs:decimal">
        <xs:minExclusive value="0" />
        <xs:fractionDigits value="2" />
    </xs:restriction>
</xs:simpleType>
```

---

## 8. Expresiones regulares — `xs:pattern`

`xs:pattern` permite definir el formato exacto de una cadena mediante expresiones regulares.

### Sintaxis básica

| Patrón | Significado |
|--------|------------|
| `[A-Z]` | Una letra mayúscula |
| `[a-z]` | Una letra minúscula |
| `[0-9]` | Un dígito |
| `[A-Za-z]` | Una letra (mayúscula o minúscula) |
| `[^abc]` | Cualquier carácter excepto a, b, c |
| `X` (sin cuantificador) | X aparece exactamente **1** vez — el `{1}` está implícito y nunca se escribe |
| `X?` | X aparece 0 o 1 vez (opcional) |
| `X+` | X aparece 1 o más veces |
| `X*` | X aparece 0 o más veces |
| `X{n}` | X aparece exactamente n veces |
| `X{n,m}` | X aparece entre n y m veces |
| `A\|B` | A o B |
| `.` | Cualquier carácter |
| `\d` | Un dígito (equivale a `[0-9]`) |
| `\D` | Un no-dígito |

### Ejemplos

**Cartucho** — C mayúscula, guión, 3 números, 1 o 2 letras mayúsculas:
```xml
<xs:simpleType name="tipoCartucho">
    <xs:restriction base="xs:string">
        <xs:pattern value="C-[0-9]{3}[A-Z]{1,2}" />
    </xs:restriction>
</xs:simpleType>
```

**DNI español** — 8 dígitos seguidos de 1 letra mayúscula:
```xml
<xs:simpleType name="tipoDNI">
    <xs:restriction base="xs:string">
        <xs:pattern value="[0-9]{8}[A-Z]" />
    </xs:restriction>
</xs:simpleType>
```

**Año** — 4 dígitos entre 1900 y 2099:
```xml
<xs:simpleType name="tipoAño">
    <xs:restriction base="xs:string">
        <xs:pattern value="(19|20)[0-9]{2}" />
    </xs:restriction>
</xs:simpleType>
```

---

## 9. Tipos vs elementos — la distinción fundamental

**Tipos y elementos son cosas distintas.** Un tipo define una estructura o restricción. Un elemento declara una etiqueta que aparece en el XML. Un tipo solo existe en el XML si un elemento lo referencia.

```xml
<!-- Esto NO crea ninguna etiqueta <empleado> en el XML -->
<xs:complexType name="tipoEmpleado">
    <xs:sequence>
        <xs:element name="nombre" type="xs:string" />
    </xs:sequence>
</xs:complexType>

<!-- Esto SÍ crea la etiqueta <empleado> -->
<xs:element name="empleado" type="tipoEmpleado" />
```

**Convención de nombres:** los tipos llevan el prefijo `tipo` (`tipoEmpleado`, `tipoDireccion`) para distinguirlos de los elementos (`empleado`, `direccion`).

### xs:simpleType suelto vs xs:complexType suelto

Ambos sirven para lo mismo: definir una vez y reutilizar en muchos sitios con `type=""`.

| | `xs:simpleType` suelto | `xs:complexType` suelto |
|--|----------------------|------------------------|
| Para qué | Tipo de texto con restricciones | Estructura con hijos y/o atributos |
| Cómo se referencia | `type="tipoCP"` en un xs:element | `type="tipoDireccion"` en un xs:element |
| Crea etiqueta en el XML | No — necesita un xs:element | No — necesita un xs:element |

```xml
<!-- simpleType reutilizado -->
<xs:simpleType name="tipoCP">
    <xs:restriction base="xs:string">
        <xs:pattern value="[0-9]{5}" />
    </xs:restriction>
</xs:simpleType>

<!-- complexType reutilizado en dos sitios distintos -->
<xs:complexType name="tipoDireccion">
    <xs:sequence>
        <xs:element name="calle" type="xs:string" />
        <xs:element name="ciudad" type="xs:string" />
    </xs:sequence>
</xs:complexType>

<xs:element name="direccionEnvio" type="tipoDireccion" />
<xs:element name="direccionFactura" type="tipoDireccion" />
```

La recursividad (§18) es solo un caso especial de esto — el tipo se referencia a sí mismo, pero el mecanismo es idéntico.

## 10. Usar tipos personalizados en elementos y atributos

Los `xs:simpleType` definidos con nombre se reutilizan referenciándolos por nombre:

```xml
<xs:element name="cartucho" type="tipoCartucho" />
<xs:attribute name="tipo" type="tipoImpresora" use="required" />
```

Esto es la base del principio **"no muñeca rusa"** — definir los tipos con nombre arriba y referenciarlos abajo, en lugar de anidarlos inline. Se verá en detalle en XSD 2.

---

## 10. Esquema completo — ejemplo impresoras

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <!-- Tipos simples reutilizables -->

    <xs:simpleType name="tipoImpresora">
        <xs:restriction base="xs:string">
            <xs:enumeration value="láser" />
            <xs:enumeration value="matricial" />
            <xs:enumeration value="tinta" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPeso">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoCartucho">
        <xs:restriction base="xs:string">
            <xs:pattern value="C-[0-9]{3}[A-Z]{1,2}" />
        </xs:restriction>
    </xs:simpleType>

    <!-- Estructura -->

    <xs:element name="impresoras">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="impresora" maxOccurs="unbounded">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="marca" type="xs:string" />
                            <xs:element name="modelo" type="xs:string" />
                            <xs:element name="peso" type="tipoPeso" />
                            <xs:element name="tamaño" type="xs:string"
                                        minOccurs="1" maxOccurs="unbounded" />
                            <xs:element name="cartucho" type="tipoCartucho" />
                            <xs:element name="enred" minOccurs="0">
                                <xs:complexType />
                            </xs:element>
                        </xs:sequence>
                        <xs:attribute name="numSerie" type="xs:string" use="required" />
                        <xs:attribute name="tipo" type="tipoImpresora" use="required" />
                        <xs:attribute name="compra" type="xs:positiveInteger" use="optional" />
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

---

## 11. El patrón "no muñeca rusa"

### El problema: tipos inline anidados

Cuando defines tipos directamente dentro de elementos, el esquema se convierte en una estructura de cajas dentro de cajas — como muñecas rusas:

```xml
<!-- Muñeca rusa — los tipos están atrapados dentro de otros tipos -->
<xs:element name="agenda">
    <xs:complexType>                   <!-- tipo inline de agenda -->
        <xs:sequence>
            <xs:element name="contacto" maxOccurs="unbounded">
                <xs:complexType>       <!-- tipo inline de contacto -->
                    <xs:sequence>
                        <xs:element name="nombre" type="xs:string" />
                        <xs:element name="direccion">
                            <xs:complexType>   <!-- tipo inline de direccion -->
                                <xs:sequence>
                                    <xs:element name="calle" type="xs:string" />
                                    <xs:element name="ciudad" type="xs:string" />
                                </xs:sequence>
                            </xs:complexType>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

Problema: `tipoDireccion` está enterrado dentro de `tipoContacto` que está enterrado dentro de `tipoAgenda`. Si otro elemento necesita el mismo tipo de dirección, hay que repetir todo el bloque.

### La solución: tipos con nombre en el nivel raíz

```xml
<!-- Nivel raíz del xs:schema — todos los tipos definidos aquí -->

<xs:complexType name="tipoDireccion">
    <xs:sequence>
        <xs:element name="calle" type="xs:string" />
        <xs:element name="ciudad" type="xs:string" />
    </xs:sequence>
</xs:complexType>

<xs:complexType name="tipoContacto">
    <xs:sequence>
        <xs:element name="nombre" type="xs:string" />
        <xs:element name="direccion" type="tipoDireccion" />   <!-- referencia por nombre -->
    </xs:sequence>
    <xs:attribute name="id" type="xs:string" use="required" />
</xs:complexType>

<xs:complexType name="tipoAgenda">
    <xs:sequence>
        <xs:element name="contacto" type="tipoContacto" maxOccurs="unbounded" />
    </xs:sequence>
</xs:complexType>

<xs:element name="agenda" type="tipoAgenda" />   <!-- elemento raíz declarado en raíz -->
```

### Reglas del patrón

1. Todos los `xs:complexType` y `xs:simpleType` con `name=""` en el **nivel raíz** del `xs:schema`
2. Los elementos los referencian con `type="nombreDelTipo"` — nunca definen tipos dentro de sí mismos
3. Los elementos raíz del documento (el que valida el XML entero) se declaran también en el nivel raíz con `name=""`
4. **Excepción permitida:** elementos completamente simples (`type="xs:string"`, `type="tipoCP"`, etc.) no necesitan un `complexType` con nombre — solo los complejos

### Por qué lo exige la profesora

Es más legible (lees el nivel raíz y ves todos los tipos), los tipos son reutilizables, y el esquema es mantenible. El enunciado de la Tarea 4 lo llama explícitamente "flexible y mantenible".

---

## 12. default y fixed

Ambos se pueden poner en `xs:element` y en `xs:attribute`.

### En atributos

```xml
<xs:attribute name="moneda" type="xs:string" default="EUR" />
<xs:attribute name="version" type="xs:string" fixed="2.0" />
```

| Situación | `default="EUR"` | `fixed="2.0"` |
|-----------|----------------|---------------|
| El atributo **no aparece** en el XML | El validador lo trata como `EUR` — válido | El validador lo trata como `2.0` — válido |
| El atributo aparece con el **mismo valor** | Válido | Válido |
| El atributo aparece con **otro valor** | Válido (el autor puede cambiarlo) | **Inválido** — el valor debe ser exactamente `2.0` |

### En elementos

```xml
<xs:element name="cantidad" type="xs:integer" default="1" />
```

`default` en elementos **no hace el elemento opcional** — el elemento sigue siendo obligatorio (`minOccurs="1"` por defecto). Solo actúa si el elemento aparece **vacío** en el XML:

```xml
<cantidad/>        → el validador lo lee como <cantidad>1</cantidad>
<cantidad>5</cantidad> → válido, usa el valor del autor
```

Para hacer un elemento opcional con valor por defecto hay que combinar los dos:
```xml
<xs:element name="cantidad" type="xs:integer" default="1" minOccurs="0" />
```

`fixed` en elementos funciona igual que en atributos: el elemento puede aparecer vacío (toma el valor fijo) o con exactamente ese valor. Cualquier otro valor es inválido.

---

## 13. Elemento vacío con solo atributos

Un `xs:complexType` **sin ningún compositor** (`xs:sequence`, `xs:choice`, `xs:all`) define un elemento que solo puede tener atributos — ningún texto ni elementos hijo:

```xml
<xs:complexType name="tipoServidor">
    <xs:attribute name="host" type="xs:string" use="required" />
    <xs:attribute name="puerto" type="xs:integer" use="required" />
    <xs:attribute name="ssl" type="xs:boolean" use="required" />
</xs:complexType>

<xs:element name="servidor" type="tipoServidor" />
```

Esto valida:
```xml
<servidor host="192.168.1.1" puerto="8080" ssl="true" />
```

**Regla:** si un `xs:complexType` no tiene compositor, el elemento validado no puede tener contenido de ningún tipo. Si el XML intenta poner texto o elementos hijo dentro, falla la validación.

---

## 14. xs:whiteSpace

Controla cómo el validador trata los espacios en blanco (espacios, tabulaciones `\t`, saltos de línea `\n`, retornos de carro `\r`) **antes** de comparar con el tipo o el patrón.

| Valor | Qué hace |
|-------|----------|
| `preserve` | No modifica nada — conserva los espacios tal cual |
| `replace` | Sustituye `\t`, `\n` y `\r` por espacios normales |
| `collapse` | Aplica `replace` + elimina espacios al inicio y al final + colapsa secuencias de espacios internos en un único espacio |

```xml
<xs:simpleType name="tipoCodigo">
    <xs:restriction base="xs:string">
        <xs:whiteSpace value="collapse" />
        <xs:pattern value="[A-Z]{2}[0-9]{3}" />
    </xs:restriction>
</xs:simpleType>
```

Con `collapse`:
- `"  AB123  "` → se normaliza a `"AB123"` → el patrón lo acepta → **válido**
- `"AB 123"` → se normaliza a `"AB 123"` (el espacio interno persiste, solo se colapsan múltiples) → el patrón no lo acepta → **inválido**

**Nota:** `xs:string` tiene `preserve` por defecto. `xs:token` es `xs:string` con `collapse` ya incorporado — si usas `xs:token` como base, no necesitas declarar `xs:whiteSpace`.

---

## 15. xs:choice con maxOccurs

Por defecto `xs:choice` permite exactamente **uno** de los hijos declarados. Con `maxOccurs` se permite que aparezcan varios hijos, de cualquiera de las opciones, en cualquier orden:

```xml
<xs:element name="mensaje">
    <xs:complexType>
        <xs:choice maxOccurs="unbounded">
            <xs:element name="parrafo" type="xs:string" />
            <xs:element name="imagen" type="xs:anyURI" />
            <xs:element name="separador">
                <xs:complexType />
            </xs:element>
        </xs:choice>
    </xs:complexType>
</xs:element>
```

Este XML es **válido** porque `xs:choice maxOccurs="unbounded"` significa "elige uno de estos, tantas veces como quieras, en cualquier orden":

```xml
<mensaje>
    <parrafo>Hola</parrafo>
    <imagen>http://img.com/foto.jpg</imagen>
    <parrafo>Adiós</parrafo>
    <separador/>
</mensaje>
```

**Comparación:**

| | `xs:choice` sin maxOccurs | `xs:choice maxOccurs="unbounded"` |
|--|--------------------------|----------------------------------|
| Hijos permitidos | Exactamente 1, de los declarados | Cualquier número, de cualquiera de los declarados, en cualquier orden |
| `<mensaje/>` vacío | Inválido (minOccurs=1 por defecto) | Inválido (mismo motivo) |

Para permitir cero hijos: `<xs:choice minOccurs="0" maxOccurs="unbounded">`.

---

## 16. Grupos opcionales — minOccurs en el compositor

`minOccurs` y `maxOccurs` se pueden poner no solo en `xs:element` sino también en el propio **compositor** (`xs:sequence`, `xs:choice`, `xs:all`). Esto convierte todo el grupo en opcional o repetible.

**Diferencia clave:**

```xml
<!-- Esquema 1: descuento opcional individualmente, direccion siempre obligatoria -->
<xs:sequence>
    <xs:element name="cliente" type="xs:string" />
    <xs:element name="descuento" type="xs:decimal" minOccurs="0" />
    <xs:element name="direccion" type="xs:string" />   <!-- obligatoria -->
</xs:sequence>
```

```xml
<!-- Esquema 2: el par (descuento + direccion) va junto o no va -->
<xs:sequence>
    <xs:element name="cliente" type="xs:string" />
    <xs:sequence minOccurs="0">            <!-- el grupo es opcional -->
        <xs:element name="descuento" type="xs:decimal" />
        <xs:element name="direccion" type="xs:string" />
    </xs:sequence>
</xs:sequence>
```

En el esquema 1: `<cliente>` + `<direccion>` siempre, `<descuento>` puede no estar.
En el esquema 2: o van `<descuento>` y `<direccion>` juntos, o no va ninguno de los dos. Si hay `<descuento>` sin `<direccion>`, falla.

**Caso de uso típico:** datos que deben ir en pareja (cliente + NIF, fecha inicio + fecha fin):

```xml
<xs:element name="factura">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="numero" type="xs:string" />
            <xs:sequence minOccurs="0">
                <xs:element name="cliente" type="xs:string" />
                <xs:element name="nif" type="xs:string" />
            </xs:sequence>
            <xs:element name="total" type="xs:decimal" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

---

## 17. xs:element ref

Un elemento declarado en el **nivel raíz** del esquema es global y puede reutilizarse en otro lugar con `ref=`:

```xml
<!-- Declaración global en el nivel raíz -->
<xs:element name="autor">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="nacionalidad" type="xs:string" />
        </xs:sequence>
        <xs:attribute name="id" type="xs:string" use="required" />
    </xs:complexType>
</xs:element>

<!-- Referencia desde otro elemento -->
<xs:element name="libro">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="titulo" type="xs:string" />
            <xs:element ref="autor" maxOccurs="unbounded" />   <!-- ref, no name ni type -->
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

`<xs:element ref="autor" />` reutiliza la declaración completa del elemento `<autor>` — nombre, tipo, atributos, todo incluido.

### ref vs type

| | `type="tipoAutor"` | `ref="autor"` |
|--|-------------------|---------------|
| Reutiliza | Solo el **tipo** (la estructura interna) | El **elemento completo** (nombre + tipo + atributos) |
| Nombre del elemento en el XML | Lo decides tú | Queda fijo al del elemento global |
| Puedes cambiar minOccurs/maxOccurs | Sí | Sí |
| Puedes cambiar atributos | Sí | No |

**Cuándo usar `ref`:** cuando el mismo elemento (`<autor>`, `<direccion>`...) debe aparecer en varios sitios del documento con exactamente la misma estructura y nombre. Si solo quieres reutilizar la estructura pero dar nombre distinto, usa `type`.

---

## 18. Tipos recursivos

Un `xs:complexType` puede referenciarse a **sí mismo** para modelar estructuras de profundidad arbitraria: secciones dentro de secciones, categorías con subcategorías, comentarios con respuestas...

**Requisito imprescindible:** el tipo debe tener **nombre**. Un tipo inline no puede referenciarse a sí mismo porque para escribir `type="tipoSeccion"` necesita ese nombre.

```xml
<xs:complexType name="tipoSeccion">
    <xs:sequence>
        <xs:element name="contenido" type="xs:string" minOccurs="0" />
        <xs:element name="seccion" type="tipoSeccion"        <!-- se referencia a sí mismo -->
                    minOccurs="0" maxOccurs="unbounded" />
    </xs:sequence>
    <xs:attribute name="titulo" type="xs:string" use="required" />
</xs:complexType>

<xs:element name="portal">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="seccion" type="tipoSeccion"
                        minOccurs="0" maxOccurs="unbounded" />
        </xs:sequence>
        <xs:attribute name="nombre" type="xs:string" use="required" />
    </xs:complexType>
</xs:element>
```

Esto valida XML de cualquier profundidad:

```xml
<portal nombre="Mi Web">
    <seccion titulo="Intro">
        <contenido>Texto.</contenido>
        <seccion titulo="Subsección">
            <seccion titulo="Sub-sub">
                <contenido>Anidado.</contenido>
            </seccion>
        </seccion>
    </seccion>
</portal>
```

**Por qué `minOccurs="0"` en las subsecciones:** si fuera `minOccurs="1"` la recursión no podría terminar — siempre habría que tener al menos una subsección dentro de cada sección, al infinito. Con `minOccurs="0"` una sección puede ser hoja del árbol (sin hijos) y la recursión termina.

---

## 19. xs:ID y xs:IDREF

XSD incluye tipos especiales para referencias cruzadas dentro del mismo documento:

| Tipo | Uso |
|------|-----|
| `xs:ID` | Identificador único — su valor debe ser único en todo el documento |
| `xs:IDREF` | Referencia a un ID existente — su valor debe coincidir con algún `xs:ID` del documento |
| `xs:IDREFS` | Lista de IDREFs separados por espacio |

```xml
<!-- En el XSD -->
<xs:complexType name="tipoPropietario">
    <xs:sequence>...</xs:sequence>
    <xs:attribute name="id" type="xs:ID" use="required" />      <!-- define el ID -->
</xs:complexType>

<xs:complexType name="tipoAnimal">
    <xs:sequence>
        ...
        <xs:element name="propietarioRef" type="xs:IDREF" />    <!-- referencia al ID -->
    </xs:sequence>
    <xs:attribute name="id" type="xs:ID" use="required" />
</xs:complexType>
```

```xml
<!-- En el XML -->
<propietario id="CLI0001">...</propietario>   <!-- id es xs:ID → debe ser único -->
<animal id="AN0001">
    <propietarioRef>CLI0001</propietarioRef>  <!-- debe existir un xs:ID con ese valor -->
</animal>
```

### Limitaciones

- El valor de un `xs:ID` debe ser un **nombre XML válido** — no puede empezar por número ni contener espacios. Válido: `AN0001`, `CLI-01`. Inválido: `001`, `mi id`.
- El validador comprueba que el IDREF apunta a **algún** ID existente, pero no que apunte al tipo correcto. `propietarioRef` podría valer `AN0001` (un id de animal) y el validador no se quejaría.
- Para referencias con validación de tipo existe `xs:key`/`xs:keyref` — más potente pero fuera del alcance de XSD 1.

### Diferencia con xs:string normal

Un atributo `type="xs:string"` con valor `"CLI0001"` es texto libre — el validador no hace nada especial con él. Un atributo `type="xs:ID"` con valor `"CLI0001"` le dice al validador "este valor debe ser único en el documento". Un atributo `type="xs:IDREF"` le dice "este valor debe coincidir con algún xs:ID".
