---
title: "Ejercicios"
kind: ejercicios
---

## Ejercicio 1 — Verdadero o falso (muy fácil)

Indica si cada afirmación es verdadera o falsa. Si es falsa, corrígela.

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

---

## Ejercicio 2 — Tipos predefinidos: ¿cuál uso? (muy fácil)

Elige el tipo XSD más adecuado para cada dato:

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

---

## Ejercicio 3 — Identificar partes (fácil)

Dado el siguiente fragmento de XSD, identifica cada parte:

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

Preguntas:
- a) ¿Qué es `tipoDNI`? ¿Dónde se define y cómo se usa?
- b) ¿Qué hace `xs:restriction base="xs:string"`?
- c) ¿Qué valida el patrón `[0-9]{8}[A-Z]`? Da un ejemplo válido y uno inválido.
- d) ¿Cuántas veces puede aparecer `<telefono>`? ¿Y `<nombre>`?
- e) ¿Qué diferencia hay entre `<xs:element name="dni" type="tipoDNI" />` y definir el tipo directamente dentro del `xs:element`?

---

## Ejercicio 4 — Detectar errores (fácil)

El siguiente XSD contiene **5 errores**. Identifícalos y corrígelos.

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

---

## Ejercicio 5 — Leer restricciones (fácil)

Lee cada definición y responde: ¿qué valores acepta y cuáles rechaza? Da un ejemplo válido y uno inválido.

**A)**
```xml
<xs:simpleType name="tipoNota">
    <xs:restriction base="xs:decimal">
        <xs:minInclusive value="0" />
        <xs:maxInclusive value="10" />
        <xs:fractionDigits value="2" />
    </xs:restriction>
</xs:simpleType>
```

**B)**
```xml
<xs:simpleType name="tipoCategoria">
    <xs:restriction base="xs:string">
        <xs:enumeration value="bronce" />
        <xs:enumeration value="plata" />
        <xs:enumeration value="oro" />
    </xs:restriction>
</xs:simpleType>
```

**C)**
```xml
<xs:simpleType name="tipoMatricula">
    <xs:restriction base="xs:string">
        <xs:pattern value="[0-9]{4}[A-Z]{3}" />
    </xs:restriction>
</xs:simpleType>
```

**D)**
```xml
<xs:simpleType name="tipoCodigo">
    <xs:restriction base="xs:string">
        <xs:minLength value="3" />
        <xs:maxLength value="8" />
    </xs:restriction>
</xs:simpleType>
```

---

## Ejercicio 6 — default y fixed en atributos y elementos (fácil)

**Parte A — Conceptual**

Lee este fragmento y responde:

```xml
<xs:element name="producto">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="cantidad" type="xs:integer" default="1" />
        </xs:sequence>
        <xs:attribute name="moneda" type="xs:string" default="EUR" />
        <xs:attribute name="version" type="xs:string" fixed="2.0" />
    </xs:complexType>
</xs:element>
```

1. ¿Qué ocurre si el XML tiene `<producto>` sin el atributo `moneda`?
2. ¿Qué ocurre si el XML tiene `version="1.0"`?
3. ¿Qué ocurre si el XML tiene `<producto version="2.0">`?
4. ¿Qué diferencia hay entre `default` y `fixed`?
5. ¿Es válido este XML?
   ```xml
   <producto version="2.0">
       <nombre>Teclado</nombre>
   </producto>
   ```

**Parte B — Escribir**

Escribe el `xs:attribute` para un atributo `estado` de tipo `xs:string` cuyo valor por defecto sea `activo`, y un atributo `formato` de tipo `xs:string` cuyo valor deba ser siempre `JSON`.

---

## Ejercicio 7 — Elemento vacío con solo atributos (fácil)

Un XML de configuración usa elementos vacíos que solo tienen atributos:

```xml
<configuracion>
    <servidor host="192.168.1.1" puerto="8080" ssl="true" />
    <servidor host="10.0.0.1" puerto="443" ssl="true" />
    <timeout segundos="30" />
    <cache activa="false" />
</configuracion>
```

Escribe el XSD que lo valide sabiendo que:
- `host`: patrón de IP simplificado — uno a tres dígitos, punto, uno a tres dígitos, punto, uno a tres dígitos, punto, uno a tres dígitos
- `puerto`: entero entre 1 y 65535
- `ssl`, `activa`: booleano, obligatorio
- `segundos`: entero positivo
- `<servidor>` puede repetirse 1 o más veces
- `<timeout>` y `<cache>` son obligatorios y aparecen exactamente una vez

---

## Ejercicio 8 — Vincular XSD al XML (fácil-medio)

**A)** Dado el siguiente XML sin namespace, escribe las líneas necesarias en el elemento raíz para vincularlo a `productos.xsd`:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<productos>
    <producto>
        <nombre>Teclado</nombre>
        <precio>49.99</precio>
    </producto>
</productos>
```

**B)** Mismo XML, pero ahora tiene el namespace `http://mitienda.com/productos`. El esquema sigue siendo `productos.xsd`. ¿Cómo cambia la vinculación?

**C)** ¿Qué ocurre si olvidas poner `xmlns:xsi`?

---

## Ejercicio 9 — Refactorizar: de inline a nombrado (fácil-medio)

El siguiente XSD usa tipos inline. Reescríbelo extrayendo **todos** los `xs:complexType` a tipos con nombre en el nivel raíz, sin cambiar qué valida.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:element name="agenda">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="contacto" maxOccurs="unbounded">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="nombre" type="xs:string" />
                            <xs:element name="telefono" type="xs:string"
                                        minOccurs="0" maxOccurs="3" />
                            <xs:element name="direccion" minOccurs="0">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="calle" type="xs:string" />
                                        <xs:element name="ciudad" type="xs:string" />
                                        <xs:element name="cp" type="xs:string" />
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                        <xs:attribute name="id" type="xs:string" use="required" />
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

---

## Ejercicio 10 — Leer un XSD y escribir el XML (fácil-medio)

Dado el siguiente XSD, escribe **un XML válido** y **un XML inválido** (explicando qué regla rompe cada error):

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoISO">
        <xs:restriction base="xs:string">
            <xs:pattern value="[A-Z]{2}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPoblacion">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="1" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="paises">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="pais" maxOccurs="unbounded">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="nombre" type="xs:string" />
                            <xs:element name="capital" type="xs:string" />
                            <xs:element name="poblacion" type="tipoPoblacion" />
                            <xs:element name="idioma" type="xs:string"
                                        minOccurs="1" maxOccurs="unbounded" />
                            <xs:element name="moneda" type="xs:string" minOccurs="0" />
                        </xs:sequence>
                        <xs:attribute name="codigo" type="tipoISO" use="required" />
                        <xs:attribute name="enUE" type="xs:boolean" use="optional" />
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

---

## Ejercicio 11 — Escribir simpleTypes (medio)

Escribe el `xs:simpleType` completo para cada restricción:

**A)** Código postal español: exactamente 5 dígitos.

**B)** Color de semáforo: solo `rojo`, `amarillo` o `verde`.

**C)** Teléfono español: empieza por `6`, `7`, `8` o `9`, seguido de 8 dígitos.

**D)** Año entre 1900 y 2099 (como cadena con patrón).

**E)** Precio: decimal positivo (mayor que 0), máximo 2 decimales.

**F)** NIE español: letra (X, Y o Z) + 7 dígitos + letra mayúscula.

---

## Ejercicio 12 — xs:choice y xs:all (medio)

Lee los siguientes esquemas y responde:

**A)**
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

1. ¿Cuántos elementos hijo puede tener `<contacto>`?
2. ¿Este XML es válido? `<contacto><email>a@b.com</email><telefono>600000000</telefono></contacto>`
3. ¿Cuándo usarías `xs:choice` en lugar de `xs:sequence`?

**B)**
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

1. ¿En qué se diferencia `xs:all` de `xs:sequence`?
2. ¿Es válido un `<direccion>` sin `<cp>`? ¿Por qué?

---

## Ejercicio 13 — Completar el esquema (medio)

El siguiente XSD está incompleto. Complétalo respetando las indicaciones en los comentarios.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <!-- TODO: simpleType "tipoISBN": 3 dígitos, guión, 1 dígito, guión,
         5 dígitos, guión, 3 dígitos, guión, 1 dígito -->

    <!-- TODO: simpleType "tipoGenero": solo ficcion, ensayo, poesia, teatro -->

    <!-- TODO: simpleType "tipoPrecio": decimal mayor que 0, máximo 2 decimales -->

    <xs:element name="biblioteca">
        <xs:complexType>
            <xs:sequence>
                <!-- TODO: elemento "libro" que puede repetirse 1 o más veces -->
            </xs:sequence>
        </xs:complexType>
    </xs:element>

    <xs:element name="libro">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="titulo" type="xs:string" />
                <!-- TODO: "isbn" usando tipoISBN -->
                <!-- TODO: "genero" usando tipoGenero -->
                <!-- TODO: "autores" que contiene 1 o más "autor" de tipo xs:string -->
                <!-- TODO: "precio" usando tipoPrecio, opcional -->
                <!-- TODO: "anio" de tipo xs:positiveInteger, opcional -->
            </xs:sequence>
            <!-- TODO: atributo "id" de tipo xs:string, obligatorio -->
            <!-- TODO: atributo "disponible" de tipo xs:boolean, opcional -->
        </xs:complexType>
    </xs:element>

</xs:schema>
```

---

## Ejercicio 14 — Crear XSD con tipos nombrados: tienda (medio)

Diseña el XSD para validar este XML usando **tipos con nombre** para todos los `xs:complexType` y `xs:simpleType`. No uses tipos inline.

```xml
<tienda nombre="ElectroMax">
    <productos>
        <producto id="P001" categoria="audio">
            <nombre>Auriculares BT</nombre>
            <precio>79.99</precio>
            <stock>15</stock>
        </producto>
        <producto id="P002" categoria="imagen">
            <nombre>Webcam HD</nombre>
            <precio>49.50</precio>
            <stock>0</stock>
        </producto>
    </productos>
</tienda>
```

Restricciones:
- `id`: patrón `P` + 3 dígitos
- `categoria`: solo `audio`, `imagen`, `periférico` o `almacenamiento`
- `precio`: decimal mayor que 0, máximo 2 decimales
- `stock`: entero mayor o igual a 0
- `nombre` de la tienda y del producto: cadena
- **Todos los `xs:complexType` y `xs:simpleType` deben tener nombre**

---

## Ejercicio 15 — Crear XSD con tipos nombrados: liga de fútbol (medio)

Diseña el XSD para este XML con **tipos con nombre** obligatorios. Hay tres entidades distintas: equipos, jugadores y partidos.

```xml
<liga temporada="2025-2026">
    <equipos>
        <equipo id="E01" ciudad="Salamanca">
            <nombre>Salamanca FC</nombre>
            <jugadores>
                <jugador id="J01" dorsal="9" posicion="delantero">
                    <nombre>Carlos Torres</nombre>
                    <edad>24</edad>
                </jugador>
                <jugador id="J02" dorsal="1" posicion="portero">
                    <nombre>Miguel Ruiz</nombre>
                    <edad>31</edad>
                </jugador>
            </jugadores>
        </equipo>
    </equipos>
    <partidos>
        <partido id="P01" fecha="2026-03-15">
            <local ref="E01" />
            <visitante ref="E01" />
            <resultado golesLocal="2" golesVisitante="1" />
        </partido>
    </partidos>
</liga>
```

Restricciones:
- `id` de equipo: `E` + 2 dígitos
- `id` de jugador: `J` + 2 dígitos
- `id` de partido: `P` + 2 dígitos
- `dorsal`: entero entre 1 y 99
- `posicion`: solo `portero`, `defensa`, `centrocampista` o `delantero`
- `edad`: entero entre 15 y 45
- `fecha`: `xs:date`
- `golesLocal`, `golesVisitante`: entero mayor o igual a 0
- `ref` en `<local>` y `<visitante>`: cadena (referencia al id del equipo)
- **Todos los `xs:complexType` y `xs:simpleType` deben tener nombre**

---

## Ejercicio 16 — Grupos opcionales con minOccurs en el compositor (medio)

**Parte A — Entender la diferencia**

Analiza estos dos esquemas y responde: ¿en qué se diferencian? Para cada uno, escribe un XML válido y uno inválido.

**Esquema 1:**
```xml
<xs:element name="pedido">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="cliente" type="xs:string" />
            <xs:element name="descuento" type="xs:decimal" minOccurs="0" />
            <xs:element name="direccion" type="xs:string" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

**Esquema 2:**
```xml
<xs:element name="pedido">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="cliente" type="xs:string" />
            <xs:sequence minOccurs="0">
                <xs:element name="descuento" type="xs:decimal" />
                <xs:element name="direccion" type="xs:string" />
            </xs:sequence>
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

**Parte B — Escribir**

Escribe el XSD para un elemento `<factura>` donde:
- `<numero>` es obligatorio
- `<cliente>` y `<nif>` son opcionales pero siempre van juntos (o los dos o ninguno)
- `<total>` es obligatorio

---

## Ejercicio 17 — xs:element ref (medio)

**Parte A — Conceptual**

Lee este esquema y responde:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:element name="autor">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="nombre" type="xs:string" />
                <xs:element name="nacionalidad" type="xs:string" />
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required" />
        </xs:complexType>
    </xs:element>

    <xs:element name="libro">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="titulo" type="xs:string" />
                <xs:element ref="autor" maxOccurs="unbounded" />
            </xs:sequence>
        </xs:complexType>
    </xs:element>

    <xs:element name="biblioteca">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="libro" maxOccurs="unbounded" />
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

1. ¿Qué significa `<xs:element ref="autor" />`? ¿En qué se diferencia de `<xs:element name="autor" type="tipoAutor" />`?
2. ¿Qué XML valida este esquema? Escribe un ejemplo válido.
3. ¿Puede `<autor>` aparecer directamente como hijo de `<biblioteca>` (fuera de `<libro>`)? ¿Por qué?
4. ¿Cuándo usarías `ref` en lugar de `type`?

**Parte B — Convertir**

El siguiente esquema usa `type`. Reescríbelo usando `ref` en su lugar, extrayendo `<direccion>` como elemento global:

```xml
<xs:complexType name="tipoDireccion">
    <xs:sequence>
        <xs:element name="calle" type="xs:string" />
        <xs:element name="ciudad" type="xs:string" />
    </xs:sequence>
</xs:complexType>

<xs:element name="empresa">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="nombre" type="xs:string" />
            <xs:element name="direccion" type="tipoDireccion" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

---

## Ejercicio 18 — xs:choice con maxOccurs y contenido mixto (medio-difícil)

**Parte A — xs:choice con maxOccurs**

Lee este esquema y responde:

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

1. ¿Cuántos hijos puede tener `<mensaje>`?
2. ¿Es válido este XML?
   ```xml
   <mensaje>
       <parrafo>Hola</parrafo>
       <imagen>http://img.com/foto.jpg</imagen>
       <parrafo>Adiós</parrafo>
   </mensaje>
   ```
3. ¿Qué diferencia hay entre `xs:choice` sin `maxOccurs` y con `maxOccurs="unbounded"`?
4. Escribe un XML inválido según este esquema y explica por qué lo es.

**Parte B — Contenido mixto (`mixed="true"`)**

Dado este esquema:

```xml
<xs:element name="descripcion">
    <xs:complexType mixed="true">
        <xs:sequence>
            <xs:element name="destacado" type="xs:string" minOccurs="0"
                        maxOccurs="unbounded" />
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

1. ¿Qué significa `mixed="true"`?
2. ¿Es válido este XML?
   ```xml
   <descripcion>
       Un producto <destacado>excelente</destacado> con garantía de <destacado>2 años</destacado>.
   </descripcion>
   ```
3. Sin `mixed="true"`, ¿qué pasaría con el texto que rodea a `<destacado>`?
4. ¿En qué tipo de documentos tiene sentido usar `mixed="true"`? ¿Y cuándo NO?

**Parte C — xs:whiteSpace**

Lee estas dos definiciones y responde:

```xml
<xs:simpleType name="tipoCodigoLimpio">
    <xs:restriction base="xs:string">
        <xs:whiteSpace value="collapse" />
        <xs:pattern value="[A-Z]{2}[0-9]{3}" />
    </xs:restriction>
</xs:simpleType>
```

1. ¿Qué hace `xs:whiteSpace value="collapse"`?
2. ¿Cuáles son los tres valores posibles de `xs:whiteSpace` y qué hace cada uno?
3. ¿Es válido el valor `"  AB123  "` (con espacios) con este tipo? ¿Y `"AB 123"`?

---

## Ejercicio 19 — XSD desde XML dado (difícil)

Dado el siguiente XML, escribe el XSD completo que lo valide:

```xml
<?xml version="1.0" encoding="UTF-8"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="vehiculos.xsd" ?>
<vehiculos>
    <vehiculo matricula="1234ABC" tipo="turismo">
        <marca>Toyota</marca>
        <modelo>Corolla</modelo>
        <anio>2021</anio>
        <color>blanco</color>
        <km>45230.50</km>
    </vehiculo>
    <vehiculo matricula="5678DEF" tipo="furgoneta">
        <marca>Ford</marca>
        <modelo>Transit</modelo>
        <anio>2019</anio>
        <color>gris</color>
        <km>112000.00</km>
        <cargaMaxima>1200</cargaMaxima>
    </vehiculo>
</vehiculos>
```

Requisitos:
- `matricula`: patrón de 4 dígitos + 3 letras mayúsculas
- `tipo`: solo `turismo`, `furgoneta` o `moto`
- `anio`: entero positivo
- `km`: decimal mayor que 0, máximo 2 decimales
- `cargaMaxima`: entero positivo, **opcional**
- `marca`, `modelo`, `color`: cadena de texto

> Los `xs:simpleType` deben tener nombre. El `xs:complexType` de `<vehiculo>` puedes definirlo inline o con nombre — practica las dos opciones.

---

## Ejercicio 20 — Tarea 4: impresoras (difícil — nivel examen)

Este ejercicio es la Tarea 4 oficial de la asignatura. Escribe el XSD que valide este XML:

```xml
<impresoras>
    <impresora numSerie="SN-001" tipo="láser" compra="2023">
        <marca>HP</marca>
        <modelo>LaserJet Pro</modelo>
        <peso>4.52</peso>
        <tamaño>A4</tamaño>
        <tamaño>A3</tamaño>
        <cartucho>C-120AB</cartucho>
        <enred/>
    </impresora>
    <impresora numSerie="SN-002" tipo="tinta">
        <marca>Canon</marca>
        <modelo>Pixma G3560</modelo>
        <peso>3.20</peso>
        <tamaño>A4</tamaño>
        <cartucho>C-305C</cartucho>
    </impresora>
</impresoras>
```

Restricciones:
- `numSerie`: cadena, obligatoria
- `tipo`: solo `láser`, `matricial` o `tinta`
- `compra`: entero positivo, **opcional**
- `marca`, `modelo`: cadenas de texto
- `peso`: decimal mayor que 0, máximo 2 decimales
- `tamaño`: cadena, puede repetirse **1 o más veces**
- `cartucho`: patrón `C-` + 3 dígitos + 1 o 2 letras mayúsculas
- `enred`: elemento vacío, **opcional**

> Los `xs:simpleType` deben tener nombre. El `xs:complexType` de `<impresora>` puedes definirlo inline o con nombre — practica las dos opciones.

---

## Ejercicio 21 — Corregir un XSD roto (difícil)

El siguiente XSD tiene **6 errores**. El XML que debe validar es este:

```xml
<catalogo>
    <producto codigo="PRD-001" destacado="true">
        <nombre>Auriculares Pro</nombre>
        <descripcion>Sonido <destacado>premium</destacado> con cancelación de ruido.</descripcion>
        <precio>129.99</precio>
        <etiqueta>electrónica</etiqueta>
        <etiqueta>audio</etiqueta>
    </producto>
    <producto codigo="PRD-002">
        <nombre>Funda protectora</nombre>
        <descripcion>Funda <destacado>resistente</destacado> al agua.</descripcion>
        <precio>19.99</precio>
        <etiqueta>accesorios</etiqueta>
    </producto>
</catalogo>
```

XSD roto:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

    <xs:simpleType name="tipoCodigo">
        <xs:restriction base="xs:string">
            <xs:pattern value="PRD-[0-9]{2}" />
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="tipoPrecio">
        <xs:restriction base="xs:decimal">
            <xs:minInclusive value="0" />
            <xs:fractionDigits value="2" />
        </xs:restriction>
    </xs:simpleType>

    <xs:element name="catalogo">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="producto" maxOccurs="unbounded">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="nombre" type="xs:string" />
                            <xs:element name="descripcion">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="destacado" type="xs:string"
                                                    minOccurs="0" maxOccurs="unbounded" />
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                            <xs:element name="precio" type="tipoPrecio" />
                            <xs:element name="etiqueta" type="xs:string" maxOccurs="unbounded" />
                        </xs:sequence>
                        <xs:attribute name="codigo" type="tipoCodigo" use="required" />
                        <xs:attribute name="destacado" type="xs:boolean" use="required" />
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

Identifica y corrige los 6 errores. Para cada uno explica por qué es un error.

---

## Ejercicio 22 — XSD y XML coordinados (muy difícil)

Diseña desde cero el XSD **y** el XML para un sistema de gestión de una academia de idiomas. Toma tus propias decisiones de diseño y justifícalas.

**Requisitos de datos:**
- La academia tiene alumnos y cursos
- Cada alumno: nombre, DNI (8 dígitos + letra mayúscula), fecha de nacimiento (`xs:date`), nivel (A1, A2, B1, B2, C1 o C2), matriculado en 1 o más cursos (por ID de curso — no dupliques datos)
- Cada curso: código (2 letras mayúsculas + 3 dígitos), idioma, duración en horas (entero positivo), precio (decimal mayor que 0, máximo 2 decimales), profesor asignado (opcional)

**Requisitos del XSD:**
- Define todos los `xs:simpleType` con nombre (no inline)
- `xs:pattern` para DNI y código de curso
- `xs:enumeration` para el nivel
- `minOccurs`/`maxOccurs` donde corresponda
- Atributos marcados con `use` correctamente

---

## Ejercicio 23 — Tipo recursivo (muy difícil)

Un portal web organiza su contenido en secciones que pueden contener subsecciones a cualquier profundidad. Cada sección tiene un título, contenido de texto opcional y puede tener cero o más subsecciones del mismo tipo.

**Parte A** — Escribe el XSD que valide este XML:

```xml
<?xml version="1.0" encoding="UTF-8"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="portal.xsd" ?>
<portal nombre="Mi Web">
    <seccion titulo="Introducción">
        <contenido>Bienvenido al portal.</contenido>
        <seccion titulo="¿Quiénes somos?">
            <contenido>Somos un equipo de profesionales.</contenido>
        </seccion>
        <seccion titulo="Historia">
            <seccion titulo="Fundación">
                <contenido>Fundada en 2010.</contenido>
            </seccion>
            <seccion titulo="Crecimiento">
                <contenido>En 2015 alcanzamos los 1000 usuarios.</contenido>
            </seccion>
        </seccion>
    </seccion>
    <seccion titulo="Servicios">
        <contenido>Ofrecemos los siguientes servicios.</contenido>
    </seccion>
</portal>
```

Requisitos:
- `nombre` en `<portal>`: cadena, obligatoria
- `titulo` en `<seccion>`: cadena, obligatoria
- `<contenido>`: cadena, **opcional**
- `<seccion>` puede contener cero o más `<seccion>` hijas (recursividad)
- El tipo de `<seccion>` debe tener nombre (para poder referenciarse a sí mismo)

**Parte B** — ¿Por qué no se puede definir un tipo recursivo inline (sin nombre)?

---

## Ejercicio 24 — Sistema complejo: instituto (muy difícil — nivel examen recuperación)

Este ejercicio replica el examen de recuperación de 1ª evaluación 2024-25.

**Descripción:** Un instituto gestiona familias. Cada familia tiene un padre, una madre e hijos. A cada hijo se le imponen reglas numeradas. A los 20 años no aplica la regla 4. El hijo de 15 años cumple todas.

**Parte A** — Crea el XML (`instituto.xml`) que represente este supuesto con al menos: 2 familias, 4 hijos en total, 5 reglas distintas.

**Parte B** — Crea el XSD (`instituto.xsd`) que valide el XML anterior. Requisitos:
- **Prohibido** anidar tipos inline (no muñeca rusa) — todos los `xs:complexType` y `xs:simpleType` deben tener nombre y definirse en el nivel raíz del esquema
- Validar que los nombres y apellidos sean cadenas no vacías (usa `xs:minLength`)
- Validar que el sexo sea `M` o `F`
- Validar que la edad sea un entero entre 0 y 120
- Validar que el número de regla sea un entero positivo
- Los hijos son opcionales (una familia puede no tener hijos aún)
- Las reglas de cada hijo: 1 o más

---

## Ejercicio 25 — Superdifícil: clínica veterinaria

Diseña desde cero el XML y el XSD completo para el sistema de gestión de una clínica veterinaria. Es el ejercicio más complejo — combina todo.

**Datos del sistema:**
- La clínica tiene veterinarios, propietarios, animales y visitas
- **Veterinario**: id (VET + 3 dígitos), nombre, especialidad (solo: `general`, `cirugía`, `dermatología`, `odontología`), colegiado (número de 6 dígitos)
- **Propietario**: id (CLI + 4 dígitos), nombre, teléfono (patrón español), email (opcional, patrón: texto + `@` + texto + `.` + 2-4 letras)
- **Animal**: id (AN + 4 dígitos), nombre, especie (solo: `perro`, `gato`, `conejo`, `ave`, `reptil`), raza (opcional), fecha de nacimiento (`xs:date`), peso en kg (decimal mayor que 0, máximo 3 decimales), propietario referenciado por id
- **Visita**: id (VIS + 5 dígitos), fecha (`xs:date`), animal referenciado por id, veterinario referenciado por id, motivo (cadena), diagnóstico (cadena, opcional), precio (decimal mayor que 0, máximo 2 decimales)

**Restricciones del XSD:**
- Todos los tipos con nombre en el nivel raíz (no muñeca rusa)
- Patrones para todos los ids, teléfono, email y colegiado
- Enumeraciones para especialidad y especie
- `minOccurs`/`maxOccurs` correctos (puede haber clínicas sin visitas registradas aún)
- Los animales deben tener al menos 1 propietario referenciado
- Usa `xs:ID` y `xs:IDREF` para las referencias entre entidades

**Crea también el XML** con al menos: 3 veterinarios, 4 propietarios, 6 animales, 8 visitas.
