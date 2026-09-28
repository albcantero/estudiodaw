---
title: "Soluciones propuestas"
kind: soluciones
---


---

## Ejercicio 1 — Verdadero o falso (muy fácil)

1. Un fichero XSD es un documento XML.
2. DTD soporta tipos de datos como `xs:integer` o `xs:date`.
3. Un elemento simple puede tener atributos.
4. `minOccurs="0"` hace que un elemento sea opcional.
5. `xs:positiveInteger` permite el valor `0`.
6. Los atributos en XSD son obligatorios por defecto.
7. `xs:sequence` exige que los hijos aparezcan en el orden declarado.
8. Un `xs:simpleType` puede contener elementos hijo.
9. `maxOccurs="unbounded"` permite que un elemento se repita sin límite.
10. `xs:pattern` solo se puede aplicar a `xs:string`.

<details>
<summary>Solución</summary>

1. **Verdadero.** Un XSD es XML válido con elemento raíz `xs:schema`.
2. **Falso.** DTD solo maneja texto. Los tipos numéricos, de fecha, etc. son exclusivos de XSD.
3. **Falso.** Un elemento simple solo contiene texto — sin atributos ni elementos hijo. Para tener atributos necesita `xs:complexType`.
4. **Verdadero.**
5. **Falso.** `xs:positiveInteger` es estrictamente mayor que 0. Para incluir el 0 se usa `xs:nonNegativeInteger`.
6. **Falso.** Por defecto `use="optional"`. Hay que poner `use="required"` para hacerlo obligatorio.
7. **Verdadero.**
8. **Falso.** `xs:simpleType` define tipos de texto con restricciones. Los elementos hijo requieren `xs:complexType`.
9. **Verdadero.**
10. **Falso.** `xs:pattern` se puede aplicar a cualquier tipo — incluidos numéricos, fechas, etc.

</details>

---

## Ejercicio 2 — Tipos predefinidos: ¿cuál uso? (muy fácil)

| Dato | Tipo XSD |
|------|----------|
| Nombre de una persona | |
| Precio de un producto (puede tener decimales) | |
| Año de publicación (solo positivos) | |
| ¿Está disponible? (sí/no) | |
| Fecha de nacimiento (formato 2024-05-06) | |
| Temperatura que puede ser negativa | |
| URL de una imagen | |
| Identificador único de un elemento | |

<details>
<summary>Solución</summary>

| Dato | Tipo XSD |
|------|----------|
| Nombre de una persona | `xs:string` |
| Precio de un producto (puede tener decimales) | `xs:decimal` |
| Año de publicación (solo positivos) | `xs:positiveInteger` |
| ¿Está disponible? (sí/no) | `xs:boolean` |
| Fecha de nacimiento (formato 2024-05-06) | `xs:date` |
| Temperatura que puede ser negativa | `xs:decimal` o `xs:integer` |
| URL de una imagen | `xs:anyURI` |
| Identificador único de un elemento | `xs:ID` |

</details>

---

## Ejercicio 3 — Identificar partes (fácil)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoDNI">
        <xs:restriction base="xs:string">
            <xs:pattern value="[0-9]{8}[A-Z]" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="empleado">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="nombre" type="xs:string" />
                <xs:element name="dni" type="tipoDNI" />
                <xs:element name="telefono" type="xs:string"
                            minOccurs="0" maxOccurs="3" />
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required" />
        </xs:complexType>
    </xs:element>

</xs:schema>
```

<details>
<summary>Solución</summary>

- **a)** `tipoDNI` es un `xs:simpleType` con nombre — un tipo personalizado que restringe `xs:string` a un formato concreto. Se define al nivel raíz del esquema y se usa en `<xs:element name="dni" type="tipoDNI" />` mediante referencia por nombre.
- **b)** `xs:restriction base="xs:string"` dice: "tomo como base el tipo `xs:string` y le añado restricciones". Sin la base no habría tipo de partida.
- **c)** El patrón `[0-9]{8}[A-Z]` valida exactamente 8 dígitos seguidos de 1 letra mayúscula. Válido: `12345678A`. Inválido: `1234567A` (solo 7 dígitos), `12345678a` (minúscula).
- **d)** `<telefono>` puede aparecer entre 0 y 3 veces (es opcional y repetible). `<nombre>` tiene `minOccurs` y `maxOccurs` por defecto (ambos `1`) — aparece exactamente una vez y es obligatorio.
- **e)** Definirlo con nombre (`type="tipoDNI"`) permite reutilizarlo en otros elementos. Definirlo inline (dentro del `xs:element`) lo hace de un solo uso — si otro elemento necesita el mismo formato, habría que repetir la restricción.

</details>

---

## Ejercicio 4 — Detectar errores (fácil)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema>

    <xs:simpleType name="tipoEdad">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="0">
            <xs:maxInclusive value="120" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="persona">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="nombre" type="string" />
                <xs:element name="edad" type="tipoEdad" />
            </xs:sequence>
            <xs:attribute name="activo" type="xs:boolean" use="si" />
        </xs:complexType>
    </xs:element>

</xs:schema>
```

<details>
<summary>Solución</summary>

1. `<xs:schema>` sin `xmlns:xs="http://www.w3.org/2001/XMLSchema"` — el namespace es obligatorio.
2. `<xs:minInclusive value="0">` — falta el cierre de la etiqueta: debe ser `<xs:minInclusive value="0" />`.
3. `type="string"` — falta el prefijo `xs:`. Debe ser `type="xs:string"`.
4. `use="si"` — valor incorrecto. Solo se admite `required`, `optional` o `prohibited`.

Bonus: el esquema tiene 4 errores claros, pero también hay un problema de diseño: `<xs:element name="persona">` está definido inline dentro del schema pero `<xs:element name="libro">` en el ejercicio 9 está definido a nivel raíz. En este caso no hay error real, pero en esquemas más grandes conviene ser consistente.

</details>

---

## Ejercicio 5 — Leer restricciones (fácil)

<details>
<summary>Solución</summary>

**A) tipoNota**
- Acepta: decimales entre 0 y 10 con máximo 2 decimales. Válido: `7.5`, `10`, `0`. Inválido: `10.5` (supera el máximo), `7.555` (más de 2 decimales), `-1` (negativo).

**B) tipoCategoria**
- Acepta: solo `bronce`, `plata` u `oro`. Válido: `oro`. Inválido: `Oro` (mayúscula), `diamante` (no está en la lista).

**C) tipoMatricula**
- Acepta: exactamente 4 dígitos seguidos de 3 letras mayúsculas. Válido: `1234ABC`. Inválido: `123ABC` (solo 3 dígitos), `1234abc` (minúsculas), `12345ABC` (5 dígitos).

**D) tipoCodigo**
- Acepta: cadenas de entre 3 y 8 caracteres (cualquier carácter). Válido: `abc`, `AB12CD56`. Inválido: `AB` (demasiado corto), `AbCdEfGhI` (9 caracteres, demasiado largo).

</details>

---

## Ejercicio 6 — default y fixed en atributos y elementos (fácil)

<details>
<summary>Solución</summary>

**Parte A:**

1. Si `moneda` no aparece, el validador lo trata como si valiera `EUR`. El XML es válido.
2. `version="1.0"` es inválido — `fixed="2.0"` obliga a que el valor sea exactamente `2.0`. Cualquier otro valor (incluso si el atributo se omite con otro valor implícito) falla.
3. `version="2.0"` es válido — coincide con el valor fijo.
4. `default` proporciona un valor cuando el atributo/elemento no aparece, pero el autor puede poner otro valor. `fixed` impone que el valor sea exactamente ese — no puede cambiarse.
5. **Inválido.** Falta `<cantidad>` — aunque tiene `default="1"`, `default` en elementos no significa que sea opcional. El elemento sigue siendo obligatorio (minOccurs="1" por defecto); `default` solo aplica si el elemento aparece vacío. Para hacerlo opcional habría que añadir `minOccurs="0"`.

**Parte B:**
```xml
<xs:attribute name="estado" type="xs:string" default="activo" />
<xs:attribute name="formato" type="xs:string" fixed="JSON" />
```

</details>

---

## Ejercicio 7 — Elemento vacío con solo atributos (fácil)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoIP">
        <xs:restriction base="xs:string">
            <xs:pattern value="[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPuerto">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="1" />
            <xs:maxInclusive value="65535" />
        </xs:restriction>
    </xs:simpleType>

    <xs:complexType name="tipoServidor">
        <xs:attribute name="host" type="tipoIP" use="required" />
        <xs:attribute name="puerto" type="tipoPuerto" use="required" />
        <xs:attribute name="ssl" type="xs:boolean" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoTimeout">
        <xs:attribute name="segundos" type="xs:positiveInteger" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoCache">
        <xs:attribute name="activa" type="xs:boolean" use="required" />
    </xs:complexType>

    <xs:element name="configuracion">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="servidor" type="tipoServidor"
                            minOccurs="1" maxOccurs="unbounded" />
                <xs:element name="timeout" type="tipoTimeout" />
                <xs:element name="cache" type="tipoCache" />
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

La clave de este ejercicio: un `xs:complexType` sin ningún compositor (`xs:sequence`, `xs:choice`, `xs:all`) declara un elemento que solo puede tener atributos — ningún contenido de texto ni elementos hijo.

</details>

---

## Ejercicio 8 — Vincular XSD al XML (fácil-medio)

<details>
<summary>Solución</summary>

**A) Sin namespace:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<productos
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="productos.xsd">
    <producto>
        <nombre>Teclado</nombre>
        <precio>49.99</precio>
    </producto>
</productos>
```

**B) Con namespace:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<productos
    xmlns="http://mitienda.com/productos"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://mitienda.com/productos productos.xsd">
    ...
</productos>
```
Se usa `xsi:schemaLocation` con el par: namespace + ruta al fichero.

**C)** Sin `xmlns:xsi` el prefijo `xsi:` no existe y los atributos `xsi:noNamespaceSchemaLocation` y `xsi:schemaLocation` no se pueden usar — el validador no sabría dónde está el esquema.

</details>

---

## Ejercicio 9 — Refactorizar: de inline a nombrado (fácil-medio)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:complexType name="tipoDireccion">
        <xs:sequence>
            <xs:element name="calle" type="xs:string" />
            <xs:element name="ciudad" type="xs:string" />
            <xs:element name="cp" type="xs:string" />
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="tipoContacto">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="telefono" type="xs:string"
                        minOccurs="0" maxOccurs="3" />
            <xs:element name="direccion" type="tipoDireccion" minOccurs="0" />
        </xs:sequence>
        <xs:attribute name="id" type="xs:string" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoAgenda">
        <xs:sequence>
            <xs:element name="contacto" type="tipoContacto"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>

    <xs:element name="agenda" type="tipoAgenda" />

</xs:schema>
```

El beneficio clave: `tipoDireccion` y `tipoContacto` ahora son reutilizables. Si otro elemento necesitara el mismo tipo de dirección, bastaría con poner `type="tipoDireccion"`.

</details>

---

## Ejercicio 10 — Leer un XSD y escribir el XML (fácil-medio)

<details>
<summary>Solución</summary>

**XML válido:**
```xml
<?xml version="1.0" encoding="UTF-8"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="paises.xsd" ?>
<paises>
    <pais codigo="ES" enUE="true">
        <nombre>España</nombre>
        <capital>Madrid</capital>
        <poblacion>47400000</poblacion>
        <idioma>Español</idioma>
        <idioma>Catalán</idioma>
        <moneda>Euro</moneda>
    </pais>
    <pais codigo="JP">
        <nombre>Japón</nombre>
        <capital>Tokio</capital>
        <poblacion>125700000</poblacion>
        <idioma>Japonés</idioma>
    </pais>
</paises>
```

**XML inválido (con 3 errores distintos):**
```xml
<paises>
    <!-- Error 1: codigo="esp" — minúsculas, el patrón exige [A-Z]{2} -->
    <pais codigo="esp">
        <nombre>España</nombre>
        <capital>Madrid</capital>
        <!-- Error 2: poblacion="0" — tipoPoblacion exige minInclusive="1" -->
        <poblacion>0</poblacion>
        <!-- Error 3: falta <idioma> — es obligatorio (minOccurs="1") -->
    </pais>
</paises>
```

</details>

---

## Ejercicio 11 — Escribir simpleTypes (medio)

<details>
<summary>Solución</summary>

**A) Código postal:**
```xml
<xs:simpleType name="tipoCP">
    <xs:restriction base="xs:string">
        <xs:pattern value="[0-9]{5}" />
    </xs:restriction>
</xs:simpleType>
```

**B) Color semáforo:**
```xml
<xs:simpleType name="tipoColor">
    <xs:restriction base="xs:string">
        <xs:enumeration value="rojo" />
        <xs:enumeration value="amarillo" />
        <xs:enumeration value="verde" />
    </xs:restriction>
</xs:simpleType>
```

**C) Teléfono español:**
```xml
<xs:simpleType name="tipoTelefono">
    <xs:restriction base="xs:string">
        <xs:pattern value="[6789][0-9]{8}" />
    </xs:restriction>
</xs:simpleType>
```

**D) Año 1900-2099:**
```xml
<xs:simpleType name="tipoAnio">
    <xs:restriction base="xs:string">
        <xs:pattern value="(19|20)[0-9]{2}" />
    </xs:restriction>
</xs:simpleType>
```

**E) Precio:**
```xml
<xs:simpleType name="tipoPrecio">
    <xs:restriction base="xs:decimal">
        <xs:minExclusive value="0" />
        <xs:fractionDigits value="2" />
    </xs:restriction>
</xs:simpleType>
```

**F) NIE español:**
```xml
<xs:simpleType name="tipoNIE">
    <xs:restriction base="xs:string">
        <xs:pattern value="[XYZ][0-9]{7}[A-Z]" />
    </xs:restriction>
</xs:simpleType>
```

</details>

---

## Ejercicio 12 — xs:choice y xs:all (medio)

<details>
<summary>Solución</summary>

**A)**
1. Solo 1 hijo — `xs:choice` permite exactamente uno de los hijos declarados.
2. No es válido — `xs:choice` permite solo uno de los tres, no los dos a la vez.
3. Se usa `xs:choice` cuando los datos son mutuamente excluyentes: o hay email o hay teléfono, no los dos.

**B)**
1. `xs:all` exige que todos los hijos aparezcan pero en cualquier orden. `xs:sequence` exige orden concreto.
2. No es válido. Con `xs:all` todos los hijos son obligatorios por defecto (`minOccurs="1"`). Para hacerlo opcional habría que añadir `minOccurs="0"` al elemento `<cp>`.

</details>

---

## Ejercicio 13 — Completar el esquema (medio)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoISBN">
        <xs:restriction base="xs:string">
            <xs:pattern value="[0-9]{3}-[0-9]-[0-9]{5}-[0-9]{3}-[0-9]" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoGenero">
        <xs:restriction base="xs:string">
            <xs:enumeration value="ficcion" />
            <xs:enumeration value="ensayo" />
            <xs:enumeration value="poesia" />
            <xs:enumeration value="teatro" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPrecio">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="biblioteca">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="libro" type="tipoLibro"
                            minOccurs="1" maxOccurs="unbounded" />
            </xs:sequence>
        </xs:complexType>
    </xs:element>

    <xs:complexType name="tipoLibro">
        <xs:sequence>
            <xs:element name="titulo" type="xs:string" />
            <xs:element name="isbn" type="tipoISBN" />
            <xs:element name="genero" type="tipoGenero" />
            <xs:element name="autores">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="autor" type="xs:string"
                                    minOccurs="1" maxOccurs="unbounded" />
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="precio" type="tipoPrecio"
                        minOccurs="0" maxOccurs="1" />
            <xs:element name="anio" type="xs:positiveInteger"
                        minOccurs="0" maxOccurs="1" />
        </xs:sequence>
        <xs:attribute name="id" type="xs:string" use="required" />
        <xs:attribute name="disponible" type="xs:boolean" use="optional" />
    </xs:complexType>

</xs:schema>
```

</details>

---

## Ejercicio 14 — Crear XSD con tipos nombrados: tienda (medio)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoIdProducto">
        <xs:restriction base="xs:string">
            <xs:pattern value="P[0-9]{3}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoCategoria">
        <xs:restriction base="xs:string">
            <xs:enumeration value="audio" />
            <xs:enumeration value="imagen" />
            <xs:enumeration value="periférico" />
            <xs:enumeration value="almacenamiento" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPrecio">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoStock">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="0" />
        </xs:restriction>
    </xs:simpleType>

    <xs:complexType name="tipoProducto">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="precio" type="tipoPrecio" />
            <xs:element name="stock" type="tipoStock" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdProducto" use="required" />
        <xs:attribute name="categoria" type="tipoCategoria" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoProductos">
        <xs:sequence>
            <xs:element name="producto" type="tipoProducto"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="tipoTienda">
        <xs:sequence>
            <xs:element name="productos" type="tipoProductos" />
        </xs:sequence>
        <xs:attribute name="nombre" type="xs:string" use="required" />
    </xs:complexType>

    <xs:element name="tienda" type="tipoTienda" />

</xs:schema>
```

</details>

---

## Ejercicio 15 — Crear XSD con tipos nombrados: liga de fútbol (medio)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoIdEquipo">
        <xs:restriction base="xs:string">
            <xs:pattern value="E[0-9]{2}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoIdJugador">
        <xs:restriction base="xs:string">
            <xs:pattern value="J[0-9]{2}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoIdPartido">
        <xs:restriction base="xs:string">
            <xs:pattern value="P[0-9]{2}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoDorsal">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="1" />
            <xs:maxInclusive value="99" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPosicion">
        <xs:restriction base="xs:string">
            <xs:enumeration value="portero" />
            <xs:enumeration value="defensa" />
            <xs:enumeration value="centrocampista" />
            <xs:enumeration value="delantero" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoEdad">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="15" />
            <xs:maxInclusive value="45" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoGoles">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="0" />
        </xs:restriction>
    </xs:simpleType>

    <xs:complexType name="tipoJugador">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="edad" type="tipoEdad" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdJugador" use="required" />
        <xs:attribute name="dorsal" type="tipoDorsal" use="required" />
        <xs:attribute name="posicion" type="tipoPosicion" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoJugadores">
        <xs:sequence>
            <xs:element name="jugador" type="tipoJugador"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="tipoEquipo">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="jugadores" type="tipoJugadores" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdEquipo" use="required" />
        <xs:attribute name="ciudad" type="xs:string" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoEquipos">
        <xs:sequence>
            <xs:element name="equipo" type="tipoEquipo"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="tipoRef">
        <xs:attribute name="ref" type="xs:string" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoResultado">
        <xs:attribute name="golesLocal" type="tipoGoles" use="required" />
        <xs:attribute name="golesVisitante" type="tipoGoles" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoPartido">
        <xs:sequence>
            <xs:element name="local" type="tipoRef" />
            <xs:element name="visitante" type="tipoRef" />
            <xs:element name="resultado" type="tipoResultado" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdPartido" use="required" />
        <xs:attribute name="fecha" type="xs:date" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoPartidos">
        <xs:sequence>
            <xs:element name="partido" type="tipoPartido"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="tipoLiga">
        <xs:sequence>
            <xs:element name="equipos" type="tipoEquipos" />
            <xs:element name="partidos" type="tipoPartidos" />
        </xs:sequence>
        <xs:attribute name="temporada" type="xs:string" use="required" />
    </xs:complexType>

    <xs:element name="liga" type="tipoLiga" />

</xs:schema>
```

</details>

---

## Ejercicio 16 — Grupos opcionales con minOccurs en el compositor (medio)

<details>
<summary>Solución</summary>

**Parte A:**

**Esquema 1** — `descuento` es opcional individualmente, `direccion` es siempre obligatoria:
- Válido: `<cliente>` + `<direccion>` (sin descuento)
- Válido: `<cliente>` + `<descuento>` + `<direccion>`
- Inválido: `<cliente>` solo (falta `<direccion>`)

**Esquema 2** — `descuento` y `direccion` forman un grupo opcional: o van los dos o no va ninguno:
- Válido: solo `<cliente>`
- Válido: `<cliente>` + `<descuento>` + `<direccion>`
- Inválido: `<cliente>` + `<descuento>` sin `<direccion>` (el grupo va completo o nada)
- Inválido: `<cliente>` + `<direccion>` sin `<descuento>` (igual)

**Parte B:**
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

</details>

---

## Ejercicio 17 — xs:element ref (medio)

<details>
<summary>Solución</summary>

**Parte A:**

1. `<xs:element ref="autor" />` reutiliza la declaración completa del elemento `<autor>` (nombre + tipo + atributos) ya definida en el nivel raíz. `<xs:element name="autor" type="tipoAutor" />` declara un elemento nuevo llamado `autor` que usa un tipo con nombre. La diferencia: `ref` apunta a un elemento ya declarado globalmente; `type` apunta a un tipo. Con `ref` no puedes cambiar el nombre ni los atributos del elemento referenciado.

2. XML válido:
```xml
<biblioteca>
    <libro>
        <titulo>Cien años de soledad</titulo>
        <autor id="A01">
            <nombre>Gabriel García Márquez</nombre>
            <nacionalidad>colombiana</nacionalidad>
        </autor>
    </libro>
</biblioteca>
```

3. No, `<autor>` no puede aparecer como hijo directo de `<biblioteca>`. El esquema de `<biblioteca>` solo permite `<libro>` como hijo. Para que `<autor>` pudiera aparecer ahí, habría que añadir `<xs:element ref="autor" />` dentro del `xs:sequence` de `<biblioteca>`.

4. Se usa `ref` cuando el elemento ya está declarado globalmente y quieres reutilizarlo tal cual — con el mismo nombre y estructura — en varios sitios. Se usa `type` cuando solo quieres reutilizar el tipo (la estructura interna) pero el elemento en sí lo declaras tú con el nombre que quieras.

**Parte B — Usando `ref`:**
```xml
<xs:element name="direccion">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="calle" type="xs:string" />
            <xs:element name="ciudad" type="xs:string" />
        </xs:sequence>
    </xs:complexType>
</xs:element>

<xs:element name="empresa">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element ref="direccion" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

Con `ref`, `<direccion>` es un elemento global reutilizable. Con `type`, `tipoDireccion` es un tipo reutilizable pero el elemento se declara cada vez. En este caso ambos producen el mismo XML válido; la diferencia es si quieres reutilizar el elemento completo o solo su estructura.

</details>

---

## Ejercicio 18 — xs:choice con maxOccurs y contenido mixto (medio-difícil)

<details>
<summary>Solución</summary>

**Parte A — xs:choice con maxOccurs**

1. Puede tener **ilimitados** hijos — `maxOccurs="unbounded"` en el `xs:choice` permite que cualquiera de las opciones aparezca cualquier número de veces en cualquier orden.
2. **Sí es válido.** Dos `<parrafo>` y una `<imagen>` en cualquier orden — exactamente lo que permite `xs:choice` con `maxOccurs="unbounded"`.
3. Sin `maxOccurs`: solo uno de los tres elementos puede aparecer, exactamente una vez. Con `maxOccurs="unbounded"`: cualquiera puede aparecer tantas veces como se quiera, mezclados en cualquier orden.
4. XML inválido:
   ```xml
   <mensaje/>
   ```
   `minOccurs` por defecto es `1` — debe aparecer al menos un hijo.

**Parte B — mixed="true"**

1. `mixed="true"` permite que un elemento tenga **texto y elementos hijo mezclados**. Sin él, el contenido debe ser puramente elementos hijo o puramente texto, no los dos.
2. **Sí es válido.** El texto que rodea a `<destacado>` es contenido mixto válido porque `mixed="true"` está declarado.
3. Sin `mixed="true"`, el texto `"Un producto "` y `" con garantía de "` causaría un error — el parser esperaría solo elementos hijo, no texto suelto.
4. **Tiene sentido** en documentos narrativos: artículos, documentación, XML tipo HTML donde el texto fluye con marcas dentro. **No tiene sentido** en datos estructurados: precios, fechas, códigos — ahí nunca hay texto libre mezclado con elementos hijo.

**Parte C — xs:whiteSpace**

1. `collapse` elimina los espacios iniciales y finales y colapsa cualquier secuencia de espacios internos en un solo espacio. `"  AB123  "` se normaliza a `"AB123"`.
2. Los tres valores:

   | Valor | Qué hace |
   |-------|----------|
   | `preserve` | No toca los espacios — los conserva tal cual |
   | `replace` | Sustituye tabulaciones, saltos de línea y retornos de carro por espacios |
   | `collapse` | Aplica `replace` y además elimina espacios iniciales/finales y colapsa múltiples espacios en uno |

3. `"  AB123  "` con `collapse` → `"AB123"` → el patrón lo acepta. **Válido.**
   `"AB 123"` con `collapse` → `"AB 123"` (el espacio interno no desaparece) → el patrón no lo acepta. **Inválido.**

</details>

---

## Ejercicio 19 — XSD desde XML dado (difícil)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoMatricula">
        <xs:restriction base="xs:string">
            <xs:pattern value="[0-9]{4}[A-Z]{3}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoVehiculo">
        <xs:restriction base="xs:string">
            <xs:enumeration value="turismo" />
            <xs:enumeration value="furgoneta" />
            <xs:enumeration value="moto" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoKm">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="vehiculos">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="vehiculo" maxOccurs="unbounded">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="marca" type="xs:string" />
                            <xs:element name="modelo" type="xs:string" />
                            <xs:element name="anio" type="xs:positiveInteger" />
                            <xs:element name="color" type="xs:string" />
                            <xs:element name="km" type="tipoKm" />
                            <xs:element name="cargaMaxima" type="xs:positiveInteger"
                                        minOccurs="0" />
                        </xs:sequence>
                        <xs:attribute name="matricula" type="tipoMatricula" use="required" />
                        <xs:attribute name="tipo" type="tipoVehiculo" use="required" />
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

</details>

---

## Ejercicio 20 — Tarea 4: impresoras (difícil — nivel examen)

<details>
<summary>Solución</summary>

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

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

</details>

---

## Ejercicio 21 — Corregir un XSD roto (difícil)

<details>
<summary>Solución</summary>

**Error 1 — Patrón demasiado restrictivo en `tipoCodigo`**

El XML tiene `PRD-001` (3 dígitos) pero el patrón solo permite 2:
```xml
<xs:pattern value="PRD-[0-9]{2}" />   <!-- mal -->
<xs:pattern value="PRD-[0-9]{3}" />   <!-- correcto -->
```

**Error 2 — `tipoPrecio` acepta 0**

`minInclusive="0"` permite precio cero. Los precios del XML son positivos:
```xml
<xs:minInclusive value="0" />   <!-- mal -->
<xs:minExclusive value="0" />   <!-- correcto -->
```

**Error 3 — `<descripcion>` no tiene `mixed="true"`**

El XML tiene texto libre mezclado con `<destacado>` dentro de `<descripcion>`. Sin `mixed="true"` el texto suelto no es válido:
```xml
<xs:element name="descripcion">
    <xs:complexType mixed="true">   <!-- añadir mixed="true" -->
        <xs:sequence>
            <xs:element name="destacado" type="xs:string"
                        minOccurs="0" maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

**Error 4 — Atributo `destacado` como `required`**

El segundo producto no tiene el atributo `destacado`, pero está declarado como `required`. Debe ser `optional`:
```xml
<xs:attribute name="destacado" type="xs:boolean" use="required" />   <!-- mal -->
<xs:attribute name="destacado" type="xs:boolean" use="optional" />   <!-- correcto -->
```

**Error 5 — `<etiqueta>` sin `minOccurs="0"`**

`minOccurs` por defecto es `1`, así que `<etiqueta>` es obligatoria. Si un producto pudiera no tener etiquetas, fallaría. Más seguro:
```xml
<xs:element name="etiqueta" type="xs:string"
            minOccurs="0" maxOccurs="unbounded" />
```

**Error 6 — `xs:complexType` de `producto` inline (no muñeca rusa)**

El tipo de `<producto>` está anidado inline. Si la profesora prohíbe esto, hay que extraerlo:
```xml
<xs:complexType name="tipoProducto">
    <xs:sequence>
        <xs:element name="nombre" type="xs:string" />
        <xs:element name="descripcion"> ... </xs:element>
        <xs:element name="precio" type="tipoPrecio" />
        <xs:element name="etiqueta" type="xs:string"
                    minOccurs="0" maxOccurs="unbounded" />
    </xs:sequence>
    <xs:attribute name="codigo" type="tipoCodigo" use="required" />
    <xs:attribute name="destacado" type="xs:boolean" use="optional" />
</xs:complexType>

<xs:element name="catalogo">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="producto" type="tipoProducto"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

</details>

---

## Ejercicio 22 — XSD y XML coordinados (muy difícil)

<details>
<summary>Solución (ejemplo válido)</summary>

**academia.xsd:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoDNI">
        <xs:restriction base="xs:string">
            <xs:pattern value="[0-9]{8}[A-Z]" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoNivel">
        <xs:restriction base="xs:string">
            <xs:enumeration value="A1" />
            <xs:enumeration value="A2" />
            <xs:enumeration value="B1" />
            <xs:enumeration value="B2" />
            <xs:enumeration value="C1" />
            <xs:enumeration value="C2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoCodigoCurso">
        <xs:restriction base="xs:string">
            <xs:pattern value="[A-Z]{2}[0-9]{3}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPrecio">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="academia">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="cursos">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="curso" maxOccurs="unbounded">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="idioma" type="xs:string" />
                                        <xs:element name="duracion" type="xs:positiveInteger" />
                                        <xs:element name="precio" type="tipoPrecio" />
                                        <xs:element name="profesor" type="xs:string" minOccurs="0" />
                                    </xs:sequence>
                                    <xs:attribute name="codigo" type="tipoCodigoCurso" use="required" />
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
                <xs:element name="alumnos">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="alumno" maxOccurs="unbounded">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="nombre" type="xs:string" />
                                        <xs:element name="dni" type="tipoDNI" />
                                        <xs:element name="fechaNacimiento" type="xs:date" />
                                        <xs:element name="nivel" type="tipoNivel" />
                                        <xs:element name="matriculas">
                                            <xs:complexType>
                                                <xs:sequence>
                                                    <xs:element name="cursoRef" type="tipoCodigoCurso"
                                                                minOccurs="1" maxOccurs="unbounded" />
                                                </xs:sequence>
                                            </xs:complexType>
                                        </xs:element>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

**academia.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="academia.xsd" ?>
<academia>
    <cursos>
        <curso codigo="EN101">
            <idioma>Inglés</idioma>
            <duracion>60</duracion>
            <precio>350.00</precio>
            <profesor>Sarah Collins</profesor>
        </curso>
        <curso codigo="FR202">
            <idioma>Francés</idioma>
            <duracion>45</duracion>
            <precio>290.00</precio>
        </curso>
    </cursos>
    <alumnos>
        <alumno>
            <nombre>Carlos López</nombre>
            <dni>12345678A</dni>
            <fechaNacimiento>1998-03-15</fechaNacimiento>
            <nivel>B2</nivel>
            <matriculas>
                <cursoRef>EN101</cursoRef>
                <cursoRef>FR202</cursoRef>
            </matriculas>
        </alumno>
        <alumno>
            <nombre>Ana Martínez</nombre>
            <dni>87654321B</dni>
            <fechaNacimiento>2001-11-20</fechaNacimiento>
            <nivel>A2</nivel>
            <matriculas>
                <cursoRef>EN101</cursoRef>
            </matriculas>
        </alumno>
    </alumnos>
</academia>
```

</details>

---

## Ejercicio 23 — Tipo recursivo (muy difícil)

<details>
<summary>Solución</summary>

**portal.xsd:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:complexType name="tipoSeccion">
        <xs:sequence>
            <xs:element name="contenido" type="xs:string" minOccurs="0" />
            <xs:element name="seccion" type="tipoSeccion"
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

</xs:schema>
```

**Parte B** — Un tipo inline no tiene nombre, por lo que no hay forma de referenciarlo desde dentro de sí mismo. La recursividad requiere escribir `type="tipoSeccion"` dentro de la propia definición de `tipoSeccion` — imposible sin nombre.

</details>

---

## Ejercicio 24 — Sistema complejo: instituto (muy difícil — nivel examen recuperación)

<details>
<summary>Solución (ejemplo válido)</summary>

**instituto.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="instituto.xsd" ?>
<instituto>
    <familias>
        <familia id="F01">
            <padre nombre="Antonio" apellido="García" />
            <madre nombre="Carmen" apellido="López" />
            <hijos>
                <hijo sexo="M" edad="15">
                    <nombre>Pablo</nombre>
                    <apellido>García</apellido>
                    <reglas>
                        <regla numero="1" />
                        <regla numero="2" />
                        <regla numero="3" />
                        <regla numero="4" />
                        <regla numero="5" />
                    </reglas>
                </hijo>
                <hijo sexo="F" edad="20">
                    <nombre>Lucía</nombre>
                    <apellido>García</apellido>
                    <reglas>
                        <regla numero="1" />
                        <regla numero="2" />
                        <regla numero="3" />
                        <regla numero="5" />
                    </reglas>
                </hijo>
            </hijos>
        </familia>
        <familia id="F02">
            <padre nombre="Roberto" apellido="Sanz" />
            <madre nombre="Elena" apellido="Ruiz" />
            <hijos>
                <hijo sexo="M" edad="12">
                    <nombre>Marcos</nombre>
                    <apellido>Sanz</apellido>
                    <reglas>
                        <regla numero="1" />
                        <regla numero="3" />
                    </reglas>
                </hijo>
                <hijo sexo="F" edad="17">
                    <nombre>Sara</nombre>
                    <apellido>Sanz</apellido>
                    <reglas>
                        <regla numero="1" />
                        <regla numero="2" />
                        <regla numero="4" />
                    </reglas>
                </hijo>
            </hijos>
        </familia>
    </familias>
</instituto>
```

**instituto.xsd:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoNombreNoVacio">
        <xs:restriction base="xs:string">
            <xs:minLength value="1" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoSexo">
        <xs:restriction base="xs:string">
            <xs:enumeration value="M" />
            <xs:enumeration value="F" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoEdad">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="0" />
            <xs:maxInclusive value="120" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoNumRegla">
        <xs:restriction base="xs:positiveInteger" />
    </xs:simpleType>

    <xs:complexType name="tipoProgenitor">
        <xs:attribute name="nombre" type="tipoNombreNoVacio" use="required" />
        <xs:attribute name="apellido" type="tipoNombreNoVacio" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoRegla">
        <xs:attribute name="numero" type="tipoNumRegla" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoHijo">
        <xs:sequence>
            <xs:element name="nombre" type="tipoNombreNoVacio" />
            <xs:element name="apellido" type="tipoNombreNoVacio" />
            <xs:element name="reglas">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="regla" type="tipoRegla"
                                    minOccurs="1" maxOccurs="unbounded" />
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:sequence>
        <xs:attribute name="sexo" type="tipoSexo" use="required" />
        <xs:attribute name="edad" type="tipoEdad" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoFamilia">
        <xs:sequence>
            <xs:element name="padre" type="tipoProgenitor" />
            <xs:element name="madre" type="tipoProgenitor" />
            <xs:element name="hijos" minOccurs="0">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="hijo" type="tipoHijo"
                                    minOccurs="0" maxOccurs="unbounded" />
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:sequence>
        <xs:attribute name="id" type="xs:string" use="required" />
    </xs:complexType>

    <xs:element name="instituto">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="familias">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="familia" type="tipoFamilia"
                                        maxOccurs="unbounded" />
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

</details>

---

## Ejercicio 25 — Superdifícil: clínica veterinaria

<details>
<summary>Solución (ejemplo válido)</summary>

**clinica.xsd:**
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <!-- Tipos simples -->

    <xs:simpleType name="tipoIdVet">
        <xs:restriction base="xs:string">
            <xs:pattern value="VET[0-9]{3}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoIdCliente">
        <xs:restriction base="xs:string">
            <xs:pattern value="CLI[0-9]{4}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoIdAnimal">
        <xs:restriction base="xs:string">
            <xs:pattern value="AN[0-9]{4}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoIdVisita">
        <xs:restriction base="xs:string">
            <xs:pattern value="VIS[0-9]{5}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoEspecialidad">
        <xs:restriction base="xs:string">
            <xs:enumeration value="general" />
            <xs:enumeration value="cirugía" />
            <xs:enumeration value="dermatología" />
            <xs:enumeration value="odontología" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoColegiado">
        <xs:restriction base="xs:string">
            <xs:pattern value="[0-9]{6}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoTelefono">
        <xs:restriction base="xs:string">
            <xs:pattern value="[6789][0-9]{8}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoEmail">
        <xs:restriction base="xs:string">
            <xs:pattern value=".+@.+\.[a-zA-Z]{2,4}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoEspecie">
        <xs:restriction base="xs:string">
            <xs:enumeration value="perro" />
            <xs:enumeration value="gato" />
            <xs:enumeration value="conejo" />
            <xs:enumeration value="ave" />
            <xs:enumeration value="reptil" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPeso">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="3" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPrecio">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <!-- Tipos complejos -->

    <xs:complexType name="tipoVeterinario">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="especialidad" type="tipoEspecialidad" />
            <xs:element name="colegiado" type="tipoColegiado" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdVet" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoPropietario">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="telefono" type="tipoTelefono" />
            <xs:element name="email" type="tipoEmail" minOccurs="0" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdCliente" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoAnimal">
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="especie" type="tipoEspecie" />
            <xs:element name="raza" type="xs:string" minOccurs="0" />
            <xs:element name="fechaNacimiento" type="xs:date" />
            <xs:element name="peso" type="tipoPeso" />
            <xs:element name="propietarioRef" type="xs:IDREF"
                        minOccurs="1" maxOccurs="unbounded" />
        </xs:sequence>
        <xs:attribute name="id" type="xs:ID" use="required" />
    </xs:complexType>

    <xs:complexType name="tipoVisita">
        <xs:sequence>
            <xs:element name="animalRef" type="xs:IDREF" />
            <xs:element name="vetRef" type="xs:IDREF" />
            <xs:element name="motivo" type="xs:string" />
            <xs:element name="diagnostico" type="xs:string" minOccurs="0" />
            <xs:element name="precio" type="tipoPrecio" />
        </xs:sequence>
        <xs:attribute name="id" type="tipoIdVisita" use="required" />
        <xs:attribute name="fecha" type="xs:date" use="required" />
    </xs:complexType>

    <!-- Elemento raíz -->

    <xs:element name="clinica">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="veterinarios">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="veterinario" type="tipoVeterinario"
                                        maxOccurs="unbounded" />
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
                <xs:element name="propietarios">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="propietario" type="tipoPropietario"
                                        maxOccurs="unbounded" />
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
                <xs:element name="animales">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="animal" type="tipoAnimal"
                                        maxOccurs="unbounded" />
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
                <xs:element name="visitas" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="visita" type="tipoVisita"
                                        maxOccurs="unbounded" />
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

**clinica.xml** (resumen — 3 vet, 4 propietarios, 6 animales, 8 visitas):
```xml
<?xml version="1.0" encoding="UTF-8"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="clinica.xsd" ?>
<clinica>
    <veterinarios>
        <veterinario id="VET001">
            <nombre>Dra. María Sanz</nombre>
            <especialidad>general</especialidad>
            <colegiado>123456</colegiado>
        </veterinario>
        <veterinario id="VET002">
            <nombre>Dr. Luis Mora</nombre>
            <especialidad>cirugía</especialidad>
            <colegiado>654321</colegiado>
        </veterinario>
        <veterinario id="VET003">
            <nombre>Dra. Ana Vega</nombre>
            <especialidad>dermatología</especialidad>
            <colegiado>789012</colegiado>
        </veterinario>
    </veterinarios>
    <propietarios>
        <propietario id="CLI0001">
            <nombre>Carlos Ruiz</nombre>
            <telefono>612345678</telefono>
            <email>carlos@email.com</email>
        </propietario>
        <propietario id="CLI0002">
            <nombre>Elena Torres</nombre>
            <telefono>698765432</telefono>
        </propietario>
        <propietario id="CLI0003">
            <nombre>Pedro Gómez</nombre>
            <telefono>711223344</telefono>
            <email>pedro@correo.es</email>
        </propietario>
        <propietario id="CLI0004">
            <nombre>Sofía Navarro</nombre>
            <telefono>655443322</telefono>
        </propietario>
    </propietarios>
    <animales>
        <animal id="AN0001">
            <nombre>Nala</nombre>
            <especie>perro</especie>
            <raza>Golden Retriever</raza>
            <fechaNacimiento>2019-06-10</fechaNacimiento>
            <peso>28.500</peso>
            <propietarioRef>CLI0001</propietarioRef>
        </animal>
        <animal id="AN0002">
            <nombre>Michi</nombre>
            <especie>gato</especie>
            <fechaNacimiento>2021-01-05</fechaNacimiento>
            <peso>4.200</peso>
            <propietarioRef>CLI0001</propietarioRef>
        </animal>
        <animal id="AN0003">
            <nombre>Tobi</nombre>
            <especie>perro</especie>
            <raza>Beagle</raza>
            <fechaNacimiento>2020-09-22</fechaNacimiento>
            <peso>12.800</peso>
            <propietarioRef>CLI0002</propietarioRef>
        </animal>
        <animal id="AN0004">
            <nombre>Piolín</nombre>
            <especie>ave</especie>
            <fechaNacimiento>2022-03-14</fechaNacimiento>
            <peso>0.045</peso>
            <propietarioRef>CLI0003</propietarioRef>
        </animal>
        <animal id="AN0005">
            <nombre>Coco</nombre>
            <especie>conejo</especie>
            <raza>Enano holandés</raza>
            <fechaNacimiento>2023-07-01</fechaNacimiento>
            <peso>1.350</peso>
            <propietarioRef>CLI0004</propietarioRef>
        </animal>
        <animal id="AN0006">
            <nombre>Rex</nombre>
            <especie>reptil</especie>
            <raza>Dragón barbudo</raza>
            <fechaNacimiento>2021-11-30</fechaNacimiento>
            <peso>0.620</peso>
            <propietarioRef>CLI0003</propietarioRef>
        </animal>
    </animales>
    <visitas>
        <visita id="VIS00001" fecha="2026-01-10">
            <animalRef>AN0001</animalRef>
            <vetRef>VET001</vetRef>
            <motivo>Revisión anual</motivo>
            <diagnostico>Animal sano</diagnostico>
            <precio>45.00</precio>
        </visita>
        <visita id="VIS00002" fecha="2026-01-15">
            <animalRef>AN0002</animalRef>
            <vetRef>VET003</vetRef>
            <motivo>Alergia cutánea</motivo>
            <diagnostico>Dermatitis atópica leve</diagnostico>
            <precio>60.00</precio>
        </visita>
        <visita id="VIS00003" fecha="2026-02-03">
            <animalRef>AN0003</animalRef>
            <vetRef>VET002</vetRef>
            <motivo>Cojera pata trasera derecha</motivo>
            <diagnostico>Rotura ligamento cruzado — requiere cirugía</diagnostico>
            <precio>85.00</precio>
        </visita>
        <visita id="VIS00004" fecha="2026-02-20">
            <animalRef>AN0003</animalRef>
            <vetRef>VET002</vetRef>
            <motivo>Cirugía ligamento cruzado</motivo>
            <precio>650.00</precio>
        </visita>
        <visita id="VIS00005" fecha="2026-03-01">
            <animalRef>AN0004</animalRef>
            <vetRef>VET001</vetRef>
            <motivo>Revisión general</motivo>
            <diagnostico>Animal sano</diagnostico>
            <precio>30.00</precio>
        </visita>
        <visita id="VIS00006" fecha="2026-03-15">
            <animalRef>AN0001</animalRef>
            <vetRef>VET001</vetRef>
            <motivo>Vacunación antirrábica</motivo>
            <precio>25.00</precio>
        </visita>
        <visita id="VIS00007" fecha="2026-04-10">
            <animalRef>AN0005</animalRef>
            <vetRef>VET001</vetRef>
            <motivo>Revisión dental</motivo>
            <diagnostico>Maloclusión leve</diagnostico>
            <precio>40.00</precio>
        </visita>
        <visita id="VIS00008" fecha="2026-04-22">
            <animalRef>AN0006</animalRef>
            <vetRef>VET003</vetRef>
            <motivo>Pérdida de escamas</motivo>
            <diagnostico>Ecdisis problemática — cambio de dieta</diagnostico>
            <precio>55.00</precio>
        </visita>
    </visitas>
</clinica>
```

</details>
