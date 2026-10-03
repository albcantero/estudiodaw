---
title: "Teoría"
kind: teoria
---

## 0. El problema que resuelven las bases de datos

Antes de las bases de datos, cada aplicación gestionaba sus propios ficheros. Una empresa de hostelería tendría un fichero de clientes para facturación, otro fichero de clientes para reservas, y otro para fidelización. El mismo cliente aparecía duplicado en tres sitios. Si cambiaba su teléfono y solo se actualizaba en uno, los otros dos quedaban desactualizados: **inconsistencia**.

Además, si la aplicación de facturación cambiaba la estructura de su fichero, la de reservas dejaba de poder leerlo: **dependencia entre programa y datos**.

La solución fue centralizar: una única fuente de datos compartida por todas las aplicaciones, gestionada por un software especializado. Eso es una base de datos.

---

## 1. Ficheros — referencia histórica y MCQ

Los ficheros fueron el primer mecanismo de almacenamiento. Saber distinguirlos puede caer en MCQ.

### Tipos de ficheros

| Tipo | Subtipo | Qué contiene |
|------|---------|--------------|
| **Permanentes** | Maestro | Estado actual de los datos modificables. Núcleo de la aplicación. (Ej.: catálogo de libros de una biblioteca.) |
| | Constante | Datos fijos que raramente cambian. Solo se consultan. (Ej.: editoriales, códigos postales.) |
| | Histórico | Datos que fueron actuales en el pasado. Para reconstruir situaciones anteriores. |
| **Temporales** | Intermedio | Resultados de una aplicación que usará otra aplicación. |
| | Maniobra | Datos que no caben en memoria principal. Almacenamiento provisional. |
| | Resultado | Datos listos para transferir a un dispositivo de salida. |

> **Trampa MCQ:** "fichero de editoriales de una biblioteca" → **constante** (datos fijos). El **maestro** sería el catálogo de libros disponibles (cambia cuando entra o sale un libro).

### Métodos de acceso a ficheros

| Método | Cómo funciona | Soporte |
|--------|---------------|---------|
| **Secuencial** | Lee registro a registro desde el inicio. Sin saltos posibles. | Cualquiera (cinta, disco) |
| **Directo / aleatorio** | La clave del registro coincide con su dirección física. El más rápido. | Solo disco |
| **Indexado** | Usa una tabla de índices para localizar el registro por su clave. Permite acceso directo y secuencial. | Solo disco |
| **Calculado / Hash** | Aplica una función matemática a la clave para obtener la dirección. Problema: **colisiones** (dos claves distintas dan la misma dirección; esas claves se llaman **sinónimos**). | Solo disco |

### Parámetros de utilización

| Parámetro | Qué mide |
|-----------|---------|
| Capacidad / volumen | Espacio que ocupa el fichero |
| Actividad | Frecuencia de consultas y modificaciones |
| **Volatilidad** | **Cantidad de inserciones y borrados** |
| Crecimiento | Variación del tamaño del fichero con el tiempo |

> **Trampa MCQ:** volatilidad ≠ crecimiento. **Volatilidad** = inserciones y borrados. **Crecimiento** = variación del volumen total.

---

## 2. Qué es una base de datos

**Base de datos:** colección de datos relacionados lógicamente entre sí, con una definición y descripción comunes, estructurados de forma que varias aplicaciones y usuarios puedan acceder a ellos eficientemente y con la mínima redundancia.

Tres ideas clave que hay que retener:
- **Datos relacionados:** no son datos sueltos, hay conexiones entre ellos.
- **Mínima redundancia:** cada dato se almacena una sola vez. Si cambia, cambia en un solo sitio.
- **Acceso múltiple:** varios programas y usuarios pueden usarla a la vez.

### Metadatos y diccionario de datos

La base de datos no solo contiene los datos: también contiene **su propia descripción**. Esa descripción se llama **metadatos** y se guarda en el **diccionario de datos** (también llamado catálogo). Gracias a eso, las aplicaciones no necesitan saber cómo están almacenados físicamente los datos — solo piden lo que necesitan y el SGBD lo resuelve. Esto es la **independencia de datos**.

### Elementos formales de una BD

| Elemento | Qué es | Ejemplo (clínica veterinaria) |
|----------|--------|-------------------------------|
| **Entidad** | Objeto real o abstracto del que se almacena información | `Ejemplar`, `Doctor`, `Consulta` |
| **Atributo** | Propiedad de una entidad | `nombre`, `raza`, `fecha_nacimiento` |
| **Registro / tupla** | Conjunto de atributos de una ocurrencia concreta | `(2123, "Sultán", "Podenco", "Gris")` |
| **Campo** | El valor individual de un atributo en un registro | `"Podenco"` |

> En el modelo relacional: entidad = tabla, atributo = columna, registro = fila, campo = celda.

### Tipos de usuarios de una BD

| Tipo | Qué hace |
|------|----------|
| **Administrador (DBA)** | Diseña la estructura física, gestiona seguridad, índices y accesos. |
| **Diseñadores** | Identifican entidades, relaciones y restricciones. Conocen las reglas de negocio. |
| **Programadores** | Desarrollan las aplicaciones que usan la BD. |
| **Usuarios finales** | Consultan, insertan o modifican datos a través de las aplicaciones. |

---

## 3. Modelos de bases de datos

Un **modelo** define cómo se organizan y relacionan los datos. Han existido varios a lo largo de la historia.

| Modelo | Estructura | Característica clave | Estado actual |
|--------|-----------|----------------------|---------------|
| **Jerárquico** | Árbol invertido (padre → hijos) | Un hijo tiene **un solo padre**. Rígido. | En desuso |
| **En red** | Registros conectados por enlaces | Un nodo puede tener **más de un padre**. | En desuso |
| **Relacional** ★ | Tablas bidimensionales (filas y columnas) | Los datos se relacionan mediante claves. Usa SQL. | **El más usado** |
| **Orientado a objetos** | Objetos con propiedades y métodos | Herencia, encapsulación, polimorfismo. | En crecimiento |

> **Trampa MCQ:** jerárquico = **un solo padre**. En red = **más de un padre posible**.

El modelo relacional fue creado por **Codd en 1970** y es la base de Oracle, MySQL, PostgreSQL y prácticamente todo lo que se usa hoy.

### Otros modelos (referencia)

- **Objeto-relacional:** híbrido de relacional y OO. Estándar SQL99. Ejemplo: Oracle, SQL Server.
- **Multidimensional:** datos en "cubos". Para análisis de grandes volúmenes (business intelligence).
- **Transaccional:** operaciones atómicas (o se completan del todo o no se aplican). Banca, producción.
- **Orientado a documentos (NoSQL):** el objeto principal es el documento (JSON, XML). Ejemplo: MongoDB.

---

## 4. El modelo relacional — en detalle

El modelo relacional organiza los datos en **tablas**. Cada tabla representa un tipo de entidad.

```
EMPLEADOS
┌─────┬──────────────┬─────────────┬────────────┐
│ id  │ nombre       │ email       │ depto_id   │
├─────┼──────────────┼─────────────┼────────────┤
│  1  │ Ana López    │ ana@...     │    10      │
│  2  │ Pedro Ruiz   │ pedro@...   │    20      │
└─────┴──────────────┴─────────────┴────────────┘
```

### Terminología

| Término formal | Sinónimos | Ejemplo |
|---------------|-----------|---------|
| **Tabla / relación** | — | `EMPLEADOS` |
| **Fila** | Tupla, registro | La fila de Ana López |
| **Columna** | Atributo, campo | `nombre`, `email` |
| **Dominio** | — | `depto_id` solo acepta enteros positivos |
| **Clave primaria (PK)** | Primary Key | `id` — identifica cada fila de forma única |
| **Clave ajena (FK)** | Foreign Key, clave foránea | `depto_id` → referencia a `DEPARTAMENTOS.id` |

### Clave primaria compuesta

Una PK puede estar formada por **más de una columna**. Se usa cuando ninguna columna por sí sola es única, pero la combinación sí lo es.

Ejemplo: en una tabla de stock de tienda, ni `cod_tienda` ni `cod_producto` son únicos solos, pero `(cod_tienda, cod_producto)` juntos sí identifican un registro concreto.

### Integridad referencial

La clave ajena conecta dos tablas. Si `EMPLEADOS.depto_id` referencia a `DEPARTAMENTOS.id`, el SGBD no permite asignar a un empleado un departamento que no existe. Eso es **integridad referencial**: garantía de que las relaciones entre tablas son siempre consistentes.

```
DEPARTAMENTOS          EMPLEADOS
┌────┬──────────┐      ┌────┬───────────┬────────────┐
│ id │ nombre   │      │ id │ nombre    │ depto_id   │
├────┼──────────┤      ├────┼───────────┼────────────┤
│ 10 │ Ventas   │◄─────│  1 │ Ana López │    10      │
│ 20 │ IT       │◄─────│  2 │ Pedro     │    20      │
└────┴──────────┘      └────┴───────────┴────────────┘
```

Ana trabaja en Ventas. Pedro trabaja en IT. Si intentas insertar un empleado con `depto_id = 99` y ese departamento no existe, el SGBD lo rechaza.

### Requisitos que debe cumplir una tabla relacional

- No hay dos filas idénticas.
- No hay columnas repetidas.
- No existe un orden predefinido en las filas.
- Cada fila se identifica por su clave primaria.

> El Tema 2 §3 amplía estas cuatro reglas a siete. Estas son las más importantes conceptualmente; las tres restantes (nombre único en el esquema, un solo valor por celda, mismo dominio por columna) las encontrarás allí con ejemplos de violación.

---

## 5. SQL — el lenguaje de las bases de datos relacionales

**SQL** (Structured Query Language) es el lenguaje estándar para trabajar con bases de datos relacionales. Publicado por ANSI en 1986. Oracle, MySQL, PostgreSQL y SQL Server lo implementan, aunque con pequeñas diferencias de sintaxis.

Se divide en tres sublengtos según lo que hacen:

| Categoría | Nombre completo | Qué hace | Comandos |
|-----------|----------------|----------|----------|
| **DDL** | Data Definition Language | Define y modifica la **estructura** | `CREATE`, `ALTER`, `DROP` |
| **DML** | Data Manipulation Language | Trabaja con los **datos** | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** | Data Control Language | Gestiona **permisos** y accesos | `GRANT`, `REVOKE` |

> **Trampa MCQ:** DDL = estructura. DML = datos. DCL = permisos.

### Ejemplos básicos (un vistazo)

```sql
-- DDL: crear una tabla
CREATE TABLE empleados (
    id       NUMBER PRIMARY KEY,
    nombre   VARCHAR2(100),
    depto_id NUMBER
);

-- DML: insertar un dato
INSERT INTO empleados VALUES (1, 'Ana López', 10);

-- DML: consultar datos
SELECT nombre, depto_id FROM empleados WHERE depto_id = 10;

-- DCL: dar permiso a un usuario
GRANT SELECT ON empleados TO c##pedro;
```

---

## 6. SGBD — Sistema Gestor de Base de Datos

El **SGBD** (en inglés DBMS, DataBase Management System) es el software que se sitúa entre las aplicaciones y los datos físicos. Es el intermediario que hace posible que varios usuarios accedan a la misma BD de forma simultánea, segura y coherente.

**Definición:** conjunto coordinado de programas, procedimientos y lenguajes que suministra los medios para describir, manipular y controlar los datos, manteniendo su integridad, confidencialidad y seguridad.

Ventajas frente a los ficheros: independencia física y lógica, mínima redundancia, integridad, seguridad, accesos concurrentes, copias de seguridad, consulta directa.

### 6.1 Las tres funciones del SGBD

| Función | Lenguaje | Qué hace |
|---------|----------|---------|
| **Descripción / Definición** | DDL | Define estructuras, relaciones y restricciones. |
| **Manipulación** | DML | Permite consultar, insertar, modificar y borrar datos. |
| **Control** | DCL | Gestiona permisos, auditoría y copias de seguridad. |

### 6.2 Componentes del SGBD

1. **Lenguajes:** DDL, DML, DCL.
2. **Diccionario de datos:** almacena los metadatos (estructura de tablas, índices, restricciones, permisos).
3. **Gestor de la BD:** núcleo del SGBD. Controla el acceso físico, garantiza integridad y gestiona concurrencia.
4. **Perfiles de usuario:** DBA (administrador total) → diseñadores → programadores → usuarios finales.
5. **Herramientas:** generadores de formularios, informes, interfaces gráficas.

### 6.3 Arquitectura ANSI/SPARC — los 3 niveles

El estándar ANSI/SPARC define tres niveles de abstracción para separar lo que el usuario ve de cómo está almacenado físicamente. El objetivo es conseguir **independencia de datos**.

| Nivel | También llamado | Qué contiene | Analogía |
|-------|----------------|--------------|---------|
| **Interno** | Físico | Archivos en disco, índices, métodos de acceso, longitudes de campo. | Los libros en las estanterías físicas. |
| **Conceptual** | Lógico | Entidades, atributos, relaciones, restricciones. El esquema completo. | El catálogo de la biblioteca. |
| **Externo** | Visión del usuario | Lo que cada usuario o grupo ve. Puede haber varios esquemas externos. | Lo que el lector busca en su pantalla. |

**Independencia de datos:**
- **Independencia física:** cambiar cómo están guardados los datos en disco (nivel interno) sin que afecte a las aplicaciones. Cambias los discos duros por SSDs: las aplicaciones no se enteran.
- **Independencia lógica:** cambiar el esquema conceptual (añadir una columna a una tabla) sin romper los programas que ya usan la BD.

> Hay **un único** esquema interno, **un único** esquema conceptual, y **varios** esquemas externos posibles (uno por tipo de usuario o aplicación).

### 6.4 Tipos de SGBD

| Criterio | Tipos |
|----------|-------|
| Modelo de datos | Jerárquico / En red / **Relacional** (dominante) / Orientado a objetos |
| Número de usuarios | Monousuario / **Multiusuario** |
| Distribución | **Centralizado** (un equipo) / Distribuido (varios sitios en red, homogéneo o heterogéneo) |
| Propósito | General / Específico (sistemas transaccionales de alta carga, Ej.: reservas aéreas) |

> **Homogéneo vs heterogéneo:** en una BD distribuida homogénea todos los nodos usan el mismo SGBD (ej: Oracle en todos). En una heterogénea los nodos pueden usar SGBD distintos (ej: Oracle en Madrid, MySQL en Barcelona) — el SGBDD se encarga de hacer de traductor.

---

## 7. Tipos de bases de datos — resumen MCQ

| Criterio | Tipos clave |
|----------|-------------|
| **Variabilidad** | **Estáticas** (solo lectura, datos históricos) / **Dinámicas** (se modifican con el tiempo) |
| **Localización** | **Centralizadas** (un solo equipo) / **Distribuidas** (varios sitios conectados en red) |
| **Contenido documental** | Texto completo / Imágenes / **Referenciales** (no el documento, solo referencias para localizarlo) |
| **Uso** | Individual / Compartida / Pública / Propietaria |

> **Trampa MCQ:** BD **referencial** → no contiene el documento completo, solo metadatos para localizarlo en otro servicio.

### BD centralizadas

Una **base de datos centralizada** es aquella en la que el SGBD está implantado en una sola plataforma desde donde se gestiona la totalidad de los recursos.

```
           Aplicación A
               │
Aplicación B ──┼──► [ SGBD centralizado ] ──► Datos en disco
               │
           Aplicación C
```

Todo pasa por el mismo punto: el servidor central es el único nodo con datos y lógica de gestión.

| | Centralizada |
|-|-------------|
| **Ventajas** | Evita redundancia entre sedes; seguridad y copias de seguridad en un único punto; integridad más fácil de garantizar; mantenimiento y actualización baratos. |
| **Inconvenientes** | **Punto único de fallo:** si cae el servidor, toda la organización queda sin BD. Recuperación ante catástrofes difícil y cara. Sin distribución de carga — no escala bien bajo alta concurrencia. |

### BD distribuidas

Una **base de datos distribuida** reparte los datos entre varios nodos conectados en red. Hay tres siglas que hay que distinguir:

| Sigla | Significado | Qué es |
|-------|-------------|--------|
| **BDD** | Base de Datos Distribuida | El conjunto de múltiples BD lógicamente relacionadas, distribuidas entre nodos de una red. Los datos en sí están en varios sitios. |
| **SBDD** | Sistema de Base de Datos Distribuida | El sistema completo donde un usuario en cualquier nodo accede a datos de cualquier nodo **como si fueran locales**. La distribución es transparente. |
| **SGBDD** | Sistema Gestor de BD Distribuida | El software que gestiona la BDD de forma transparente al usuario. Equivalente al SGBD pero para entornos distribuidos. |

> **Clave conceptual:** *transparencia*. El usuario no sabe ni le importa dónde está físicamente cada dato. El SGBDD se encarga de enrutar cada operación al nodo correcto.

```
    Nodo Madrid ───────────────── Nodo Barcelona
  [ datos clientes ]           [ datos pedidos ]
         │                            │
         └──────────── red ───────────┘
                         │
                    [ SGBDD ]
                         │
                    Aplicación
         ("dame los pedidos del cliente 42")
                → el SGBDD sabe que los clientes
                  están en Madrid y los pedidos
                  en Barcelona; lo une y devuelve
                  el resultado transparentemente
```

| | Distribuida |
|-|------------|
| **Ventajas** | Mayor rendimiento (carga repartida); tolerante a fallos (si cae un nodo, los otros siguen); más económica escalar horizontalmente que un único superservidor. |
| **Inconvenientes** | Mucho más compleja de diseñar y mantener; la seguridad es más difícil de gestionar en múltiples nodos; coste de mantenimiento alto. |

### Fragmentación

Cuando se diseña una BD distribuida hay que decidir **cómo se reparten los datos entre los nodos**. Eso es la fragmentación: dividir las tablas en partes (fragmentos) que se almacenan en nodos distintos.

#### Tipos de fragmentación

| Tipo | Cómo divide | Resultado |
|------|-------------|-----------|
| **Horizontal** | Por **filas (tuplas)**. Cada fragmento contiene un subconjunto de filas de la tabla original. | Fragmento 1: clientes de Madrid. Fragmento 2: clientes de Barcelona. |
| **Vertical** | Por **columnas (atributos)**. Cada fragmento contiene un subconjunto de columnas. **La clave primaria se repite en todos los fragmentos** para poder reconstruir la tabla. | Fragmento 1: `id + nombre + email`. Fragmento 2: `id + dirección + teléfono`. |
| **Mixta** | Combina horizontal y vertical. Puede aplicarse en orden H→V (fragmentar filas y luego columnas) o V→H (columnas y luego filas). | Fragmento cuadrante: clientes de Madrid, solo columnas de contacto. |

```
Tabla original         Fragmentación horizontal     Fragmentación vertical
┌────┬──────┬────┐     ┌────┬──────┬────┐           ┌────┬──────┐  ┌────┬────┐
│ id │ nom  │ cp │     │ 1  │ Ana  │ 28 │  (Madrid) │ id │ nom  │  │ id │ cp │
├────┼──────┼────┤  →  ├────┼──────┼────┤           ├────┼──────┤  ├────┼────┤
│  1 │ Ana  │ 28 │     │ 2  │ Luis │ 28 │           │  1 │ Ana  │  │  1 │ 28 │
│  2 │ Luis │ 28 │     └────┴──────┴────┘           │  2 │ Luis │  │  2 │ 28 │
│  3 │ Marta│ 08 │     ┌────┬──────┬────┐           │  3 │ Marta│  │  3 │ 08 │
└────┴──────┴────┘     │ 3  │ Marta│ 08 │ (Bcn)     └────┴──────┘  └────┴────┘
                       └────┴──────┴────┘            Nodo A          Nodo B
```

#### Las tres reglas de la fragmentación

Cualquier fragmentación correcta debe cumplir estas tres reglas:

| Regla | Qué garantiza |
|-------|---------------|
| **Completitud** | Ningún dato de la tabla original se pierde. Todo dato que existe en la relación original existe en algún fragmento. |
| **Reconstrucción** | La tabla original puede reconstruirse siempre a partir de los fragmentos. En horizontal: `UNION`. En vertical: `JOIN` por la clave primaria. |
| **Disyunción** | Los fragmentos no se solapan: ningún dato aparece en más de un fragmento. **Excepción:** la clave primaria se repite en los fragmentos verticales (es necesario para poder reconstruir). |

> **Trampa MCQ:** en fragmentación vertical la clave primaria **sí se repite** — no viola la regla de disyunción porque esa repetición es obligatoria para garantizar la reconstrucción.

---

## 8. SGBD comerciales y libres

### Comerciales

| SGBD | Lo más importante |
|------|-------------------|
| **Oracle** | El más potente del mercado. Multiplataforma. Relacional. Versión gratuita: **XE**. Es el que usamos. |
| **MySQL** | Licencia dual (comercial y libre). Muy usado en aplicaciones web. Relacional, multihilo, multiplataforma. |
| **MS SQL Server** | Microsoft. **Solo Windows.** Relacional. Cliente/Servidor. |
| **DB2** | IBM. Integra XML de forma nativa (pureXML). Multiplataforma. |
| **Informix** | IBM. Consume menos recursos que Oracle. Buena conectividad web/XML. |
| **Sybase** | Sybase Inc. Relacional. Orientado a entornos empresariales de alta carga. Base para MS SQL Server en sus orígenes. |

### Libres (Open Source)

| SGBD | Lo más importante |
|------|-------------------|
| **MySQL** | Relacional, multihilo, muy ligado al stack web (LAMP). |
| **PostgreSQL** | Relacional orientado a objetos. El más avanzado open source. Multiplataforma. |
| **SQLite** | Relacional, biblioteca en C. Muy rápido. Ideal para aplicaciones embebidas. |
| **Firebird** | Relacional, bajo consumo de recursos, buena concurrencia. |
| **Apache Derby** | Escrito en Java. Muy portable. Puede funcionar embebido dentro de una app Java. |

---

## 9. Oracle Database XE — herramientas de trabajo

El SGBD que se usa en este módulo es **Oracle Database Express Edition (XE)** — versión gratuita de Oracle para Windows y Linux.

| Herramienta | Tipo | Para qué se usa |
|-------------|------|-----------------|
| **SQL\*Plus** | Línea de comandos | Ejecutar SQL y PL/SQL, correr scripts. Siempre disponible. |
| **SQL Developer** | Interfaz gráfica | Editor visual, diagramas E-R, autocompletado, ver resultados en tabla. |

> **Cuándo usar cuál:** SQL\*Plus para tareas administrativas, crear usuarios, ejecutar scripts y cualquier operación en servidores sin entorno gráfico (siempre funciona). SQL Developer cuando quieras ver los resultados en tabla, navegar por el esquema visualmente, autocompletar sentencias o trabajar con diagramas E-R.

---

## 10. Comandos básicos — Tarea 1 (referencia)

### Conectar como administrador

```sql
CONNECT sys AS sysdba;

SHOW USER;       -- muestra el usuario activo
SHOW CON_NAME;   -- muestra el contenedor activo
```

### Crear y configurar un usuario propio

```sql
-- Crear usuario (prefijo c## obligatorio en Oracle XE multitenant)
CREATE USER c##alberto IDENTIFIED BY mipassword;

-- Conceder permisos básicos para conectar y crear objetos
GRANT CONNECT, RESOURCE TO c##alberto;

-- Conectar con el nuevo usuario
CONNECT c##alberto/mipassword;

SHOW USER;
SHOW CON_NAME;
```

> En Oracle XE multitenant, todos los usuarios comunes deben llevar el prefijo `c##`. Es obligatorio — sin él, Oracle rechaza el comando.

**Nombre del archivo de entrega:** `cantero_soriano_alberto_BD01_Tarea`

---

## Resumen rápido — lo que hay que retener del T1

**Ficheros**

| Concepto | Respuesta |
|----------|-----------|
| Fichero maestro vs constante | Maestro = datos que cambian. Constante = datos fijos, solo consulta |
| Volatilidad | Mide inserciones y borrados (no el crecimiento) |
| Colisiones en acceso hash | Dos claves distintas generan la misma dirección; esas claves = sinónimos |

**Bases de datos — concepto y modelos**

| Concepto | Respuesta |
|----------|-----------|
| ¿Por qué existen las BD? | Para eliminar redundancia, inconsistencia y dependencia de los ficheros |
| Modelo más usado | Relacional (Codd, 1970) |
| Jerárquico vs en red | Jerárquico: un solo padre. En red: varios padres posibles |
| BD referencial | Solo contiene referencias, no el documento completo |

**Modelo relacional**

| Concepto | Respuesta |
|----------|-----------|
| Diferencia PK / FK | PK identifica cada fila de su tabla; FK referencia la PK de otra tabla |
| Integridad referencial | No puedes referenciar algo que no existe en la tabla padre |

**SGBD y arquitectura**

| Concepto | Respuesta |
|----------|-----------|
| Tres funciones del SGBD | Descripción (DDL) / Manipulación (DML) / Control (DCL) |
| Tres niveles ANSI/SPARC | Interno (físico) / Conceptual (lógico) / Externo (usuario) |
| Independencia física | Cambiar el almacenamiento sin afectar a las aplicaciones |
| Independencia lógica | Cambiar el esquema sin romper las aplicaciones |

**BD centralizadas, distribuidas y fragmentación**

| Concepto | Respuesta |
|----------|-----------|
| BD centralizada | Un solo servidor gestiona todos los datos. Punto único de fallo. |
| BD distribuida (BDD) | Múltiples BD lógicamente relacionadas, en nodos distintos en red |
| SGBDD | Gestiona la BDD de forma transparente al usuario |
| Homogéneo vs heterogéneo | Homogéneo: mismo SGBD en todos los nodos. Heterogéneo: SGBD distintos. |
| Fragmentación horizontal | Divide por filas (tuplas) |
| Fragmentación vertical | Divide por columnas; la PK se repite en todos los fragmentos |
| Tres reglas de fragmentación | Completitud / Reconstrucción / Disyunción |

**Herramientas**

| Concepto | Respuesta |
|----------|-----------|
| SGBD que usamos | Oracle Database XE (Express Edition) |
| SQL\*Plus vs SQL Developer | SQL\*Plus: línea de comandos, siempre disponible. SQL Developer: interfaz gráfica, visual. |
