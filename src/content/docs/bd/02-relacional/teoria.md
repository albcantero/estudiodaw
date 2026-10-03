---
title: "Teoría"
kind: teoria
---

## Parte 1: El modelo relacional

---

### §1. Modelos de datos

> **Aviso de terminología:** en el Tema 1 la palabra "modelo" se usó para distinguir tipos de SGBD (jerárquico, en red, relacional, orientado a objetos). Aquí "modelo" significa algo completamente distinto: las tres fases por las que pasa el **diseño** de una base de datos antes de implementarla. Son conceptos diferentes que comparten nombre. No los mezcles.

Antes de escribir una sola línea de SQL hay que pasar por tres fases de diseño. Cada una es más concreta que la anterior:

| Fase | Modelo | Qué produce | Ejemplo |
|------|--------|-------------|---------|
| **Diseño conceptual** | Conceptual | Representación gráfica de la realidad, sin comprometerse con ningún SGBD | Diagrama Entidad-Relación (E-R) |
| **Diseño lógico** | Lógico | Estructura de tablas, relaciones y restricciones adaptadas a un tipo de SGBD | Modelo relacional |
| **Diseño físico** | Físico | Implementación real dentro de un SGBD concreto | Tablas en Oracle, MySQL... |

> **Trampa MCQ:** "¿Qué modelos se implementan en un SGBD?" → **Lógico**. El conceptual es independiente del SGBD; el físico es la implementación dentro de uno concreto.

---

### §2. Terminología del modelo relacional

El modelo relacional usa terminología matemática (Codd era matemático). Hay tres nomenclaturas que se usan como sinónimos:

| Modelo relacional | Tablas | Ficheros |
|-------------------|--------|----------|
| Relación | Tabla | Fichero |
| Tupla | Fila | Registro |
| Atributo | Columna | Campo |
| **Grado** | Número de columnas | Número de campos |
| **Cardinalidad** | Número de filas | Número de registros |

> **Trampa MCQ clásica:** **Grado** = número de **columnas**. **Cardinalidad** = número de **filas**.

#### Dominio

Cada atributo tiene un **dominio**: el conjunto de valores válidos que puede tomar. Los valores del dominio deben ser **atómicos** (no divisibles en partes más pequeñas).

Un dominio se define con cuatro elementos:

| Elemento | Ejemplo (atributo "Sueldo") |
|----------|-----------------------------|
| **Nombre** | Sueldo |
| **Definición lógica** | Sueldo neto del empleado |
| **Tipo de datos** | Número entero |
| **Formato** | 9.999 € |

---

### §3. Características de una tabla relacional

Una tabla válida debe cumplir todas estas reglas:

| Regla | Qué significa | Ejemplo de violación |
|-------|---------------|----------------------|
| **Nombre único** en el esquema | No pueden existir dos tablas con el mismo nombre | Tener dos tablas llamadas `USUARIOS` |
| **Un solo valor** por celda | Cada atributo toma un único valor por fila (no listas) | Guardar "Ana, Juan" en el campo Nombre de una sola fila |
| **Nombre distinto** por columna | Dentro de la misma tabla, dos columnas no se pueden llamar igual | Una tabla con dos columnas llamadas `Nombre` |
| **No hay tuplas duplicadas** | Dos filas no pueden ser idénticas en todos sus campos | Dos filas con exactamente los mismos datos |
| **Orden de filas irrelevante** | El SGBD puede devolver las filas en cualquier orden | — |
| **Orden de columnas irrelevante** | Da igual la posición de cada columna | — |
| **Mismo dominio por columna** | Todos los valores de una columna son del mismo tipo | Mezclar fechas y textos en la misma columna |

> La cuarta regla es la razón de ser de la clave primaria: si no hubiera PK, podrían existir filas duplicadas.

---

### §4. Tipos de relaciones (tablas)

| Tipo | Subtipo | Qué es |
|------|---------|--------|
| **Persistentes** | **Base** | Independientes. Se crean indicando su estructura y sus datos (tuplas). Son las tablas "normales". |
| | **Vistas** | Almacenan solo una definición de consulta. Los datos los obtienen de otras tablas. Si los datos originales cambian, la vista también. |
| | **Instantáneas** | Como las vistas pero además almacenan los datos en el momento de creación. Solo se actualizan cuando el sistema se refresca. Fotografía de la relación. |
| **Temporales** | — | Las elimina automáticamente el sistema. |

> **Trampa MCQ:** "Relaciones que se crean indicando su estructura y sus datos" → **Base**. Las vistas no almacenan datos, solo la consulta. Las instantáneas sí almacenan datos pero son una copia estática.

---

### §5. Tipos de datos

Al crear una tabla hay que asignar un tipo de dato a cada columna. Esto determina qué valores puede guardar y qué operaciones se pueden hacer con ellos.

| Tipo | Para qué |
|------|----------|
| **Texto** | Cadenas de caracteres. También números con los que NO se harán operaciones matemáticas (teléfono, código postal, DNI). |
| **Numérico** | Números con los que SÍ se harán operaciones matemáticas (sueldo, precio, edad). |
| **Fecha/Hora** | Fechas y horas. |
| **Sí/No** | Datos con solo dos posibilidades (verdadero/falso). |
| **Autonumérico** | Número que el SGBD incrementa automáticamente al insertar una fila. Útil como PK. |
| **Memo** | Texto largo (más de lo que permite el tipo Texto estándar). |
| **Moneda** | Valores que representan cantidades de dinero. |
| **Objeto OLE** | Imágenes, gráficos o ficheros de otras aplicaciones. |

> **Regla práctica:** DNI y código postal → **Texto**, aunque parezcan números. Un código postal "06800" perdería el cero inicial si se guardara como número, y no tiene sentido sumarle 1.

---

### §6. Claves

Las claves permiten identificar y relacionar tuplas entre tablas. Hay una jerarquía:

```
Superclaves
  └─ Claves candidatas  (superclaves mínimas: unicidad + irreductibilidad)
        ├─ Clave primaria  (la candidata elegida)
        └─ Claves alternativas  (las candidatas NO elegidas)
```

#### Superclave

Cualquier conjunto de atributos que identifica de forma única cada tupla. La fila entera siempre es una superclave.

#### Clave candidata

Superclave **mínima**: si se elimina cualquier atributo deja de ser única. Debe cumplir:

| Requisito | Qué significa |
|-----------|---------------|
| **Unicidad** | No puede haber dos tuplas con los mismos valores para esos atributos |
| **Irreductibilidad** | Si se elimina algún atributo, deja de ser única |

Puede haber varias claves candidatas en una misma tabla.

#### Clave primaria (PK)

La clave candidata que se elige para identificar las tuplas. Solo puede haber **una por tabla**. Sus valores son NOT NULL y UNIQUE automáticamente.

#### Clave alternativa

Todas las claves candidatas que **no** se eligieron como primaria.

#### Clave ajena / foránea / externa / secundaria (FK)

Atributo o conjunto de atributos cuya valor coincide con la clave primaria de **otra tabla** (o de la misma). Sirve para **relacionar tablas**.

```
USUARIOS                          PARTIDAS
┌─────────┬──────────┐            ┌───────────┬──────────┬─────────┐
│ login   │ nombre   │            │ cod_part  │ nombre   │ login   │
├─────────┼──────────┤            ├───────────┼──────────┼─────────┤
│ ana01   │ Ana      │◄───────────│  P001     │ Ajedrez  │ ana01   │
│ juan02  │ Juan     │            │  P002     │ Parchís  │ juan02  │
└─────────┴──────────┘            └───────────┴──────────┴─────────┘
     PK                                 PK                   FK
```

Características de la FK:
- **Puede repetirse** en la tabla (un usuario puede jugar varias partidas).
- **Puede ser NULL** (una partida sin jugador conocido).
- Sus valores deben existir como PK en la tabla referenciada, **o ser NULL**.
- Si un valor de FK no existe en la tabla padre → **inconsistencia** (el SGBD lo impide con integridad referencial).

> **Trampa MCQ:** La FK puede repetirse. La PK no puede. La FK puede ser NULL. La PK no puede.

---

### §7. Índices

Un **índice** es una estructura auxiliar que permite localizar filas de una tabla de forma rápida, sin recorrerla entera. Funciona como el índice de un libro.

| Qué saber | Detalle |
|-----------|---------|
| **Para qué sirve** | Acelerar consultas frecuentes sobre columnas concretas |
| **Cuándo conviene** | Columnas que se consultan a menudo por rango o valor concreto |
| **Cuándo NO conviene** | Columnas de gran tamaño; demasiados índices ralentizan las inserciones y actualizaciones |
| **Independencia** | Son independientes de los datos: se pueden crear y eliminar sin afectar a las tablas |
| **PK e índices** | El SGBD crea automáticamente un **índice único** (sin valores repetidos) al definir una PK |
| **UNIQUE e índices** | Oracle crea un índice automáticamente al aplicar la restricción UNIQUE |

> Si se elimina un índice, el acceso a esa columna será más lento desde ese momento.

---

### §8. NULL — ausencia de dato

**NULL** designa la ausencia de dato: se desconoce el valor, o el campo no aplica en ese caso.

> **NULL ≠ espacio en blanco** (el espacio es un carácter texto).
> **NULL ≠ cero** (cero es un valor numérico).

#### Operaciones lógicas con NULL

NULL no es ni verdadero ni falso. Las operaciones lógicas se comportan así:

| Operación | Resultado |
|-----------|-----------|
| VERDADERO AND NULL | NULL |
| FALSO AND NULL | FALSO |
| VERDADERO OR NULL | VERDADERO |
| FALSO OR NULL | NULL |
| NOT NULL | NULL |

Para comprobar si un valor es NULL se usa `IS NULL` (nunca `= NULL`).

---

### §9. Vistas

Una **vista** es una tabla **virtual**: no almacena datos, almacena la definición de una consulta. Cada vez que se consulta la vista, el SGBD ejecuta esa consulta y devuelve el resultado.

```
Tabla USUARIOS    Tabla PARTIDAS
      │                 │
      └────────┬─────────┘
               ▼
          [ Consulta ]  ← lo que almacena la vista
               │
               ▼
         Vista JUGADORES_ACTIVOS
         (resultado calculado al consultarla)
```

**Razones para crear una vista:**
- **Seguridad:** mostrar al usuario solo las columnas o filas que le corresponden, sin exponer el resto de la tabla.
- **Comodidad:** simplificar consultas complejas que se repiten frecuentemente.

**Características importantes:**
- Una vista puede proceder de una tabla, varias tablas, o de otras vistas.
- Si los datos de las tablas base cambian, la vista refleja el cambio automáticamente.
- **Oracle no permite actualizar datos a través de una vista** (SQL Server sí).

> **Trampa MCQ:** "¿Qué almacena una vista?" → La **definición de la consulta**, no los datos.

---

### §10. Usuarios, roles y privilegios

#### Usuario

Conjunto de permisos asociado a una conexión de base de datos. Además:
- Es propietario de sus objetos (tablas, vistas, índices).
- Tiene una cuota de almacenamiento asignada.
- En Oracle tiene un **tablespace** por defecto.

#### Privilegio

Permiso dado a un usuario para realizar una operación concreta.

| Tipo | Ejemplo |
|------|---------|
| **De sistema** | Configurar parámetros del servidor, crear usuarios |
| **Sobre objeto** | Leer, modificar o borrar una tabla concreta |

#### Rol

Agrupación de privilegios. En lugar de asignar 10 permisos a 200 usuarios uno a uno, se crea un rol con esos 10 permisos y se asigna el rol. Si se añade un permiso al rol, se propaga automáticamente a todos los usuarios con ese rol.

```
ROL "analista"
  ├─ SELECT en tabla VENTAS
  ├─ SELECT en tabla CLIENTES
  └─ INSERT en tabla INFORMES

   ↓  asignar rol a usuarios

Ana → hereda los 3 permisos
Juan → hereda los 3 permisos
```

---

## Parte 2: DDL — Primer contacto con SQL

---

### §11. SQL — qué es

**SQL** (Structured Query Language) es el lenguaje estándar para trabajar con bases de datos relacionales. Es un lenguaje **declarativo**: describes **qué** quieres obtener, no **cómo** conseguirlo. El SGBD decide el cómo.

Se puede usar de dos formas:
- **Embebido:** las sentencias SQL se escriben dentro de un programa en otro lenguaje (Java, PHP...).
- **Interpretado:** se escribe directamente en un entorno (SQL\*Plus, SQL Developer).

#### Elementos del lenguaje

| Elemento | Qué es | Ejemplo |
|----------|--------|---------|
| **Comandos** | Instrucciones SQL (DDL, DML, DCL) | `CREATE`, `SELECT`, `GRANT` |
| **Cláusulas** | Modifican el comportamiento de un comando | `WHERE`, `ORDER BY` |
| **Operadores** | Construyen expresiones | `+`, `-`, `>`, `AND`, `OR` |
| **Funciones** | Calculan valores complejos | `AVG()`, `COUNT()`, `SYSDATE` |
| **Literales** | Valores constantes | `25`, `'España'`, una fecha |

#### Normas de escritura

- Todas las instrucciones terminan con **punto y coma** `;`
- No distingue entre mayúsculas y minúsculas (`CREATE` = `create`)
- Se puede partir una instrucción con saltos de línea para facilitar la lectura
- Comentarios: `/* comentario */`

---

### §12. DDL — Crear tablas

El DDL (Data Definition Language) define y modifica la **estructura** de la base de datos. Sus instrucciones **no se pueden deshacer**: hay que usarlas con precaución.

#### CREATE TABLE — sintaxis básica

```sql
CREATE TABLE nombre_tabla (
    columna1  tipo_dato,
    columna2  tipo_dato,
    ...
    columnaN  tipo_dato
);
```

**Reglas para los nombres de tabla:**
- Máximo **30 caracteres**
- Debe empezar por una **letra**
- Solo letras, dígitos y guión bajo `_`
- No puede coincidir con **palabras reservadas** de SQL (`WHERE`, `TABLE`...)
- **No distingue mayúsculas de minúsculas** (`USUARIOS` = `Usuarios`)

> **Trampa MCQ:** ¿La tabla JUEGOS es la misma que la tabla Juegos? → **Sí**, SQL no distingue mayúsculas a menos que el nombre esté entre comillas dobles.

---

### §13. Restricciones

Una **restricción** es una condición que una o varias columnas deben cumplir obligatoriamente. Cada restricción lleva un nombre; si no se lo ponemos, Oracle lo genera automáticamente.

**Nomenclatura recomendada por Oracle:** `tabla_campo_tipo`
- `PK` = Primary Key
- `FK` = Foreign Key
- `NN` = Not Null
- `UK` = Unique
- `CK` = Check

Ejemplo: `Usu_Log_PK` = restricción PK sobre el campo Log de la tabla Usu.

---

#### NOT NULL

Prohíbe que la columna tenga valores nulos. Campo obligatorio.

```sql
CREATE TABLE USUARIOS (
    F_Nacimiento DATE CONSTRAINT Usu_Fnac_NN NOT NULL
);
```

O de forma abreviada:

```sql
CREATE TABLE USUARIOS (
    F_Nacimiento DATE NOT NULL
);
```

> Recuerda: `1 * NULL = NULL`. Cualquier operación aritmética con NULL da NULL.

---

#### UNIQUE

Prohíbe que se repitan valores en la columna. Permite NULL (a diferencia de PK).

```sql
-- Un campo único
CREATE TABLE USUARIOS (
    Login VARCHAR2(25) CONSTRAINT Usu_Log_UK UNIQUE
);

-- Varios campos únicos juntos (la combinación debe ser única)
CREATE TABLE USUARIOS (
    Login   VARCHAR2(25),
    Correo  VARCHAR2(25),
    CONSTRAINT Usuario_UK UNIQUE (Login, Correo)
);
```

---

#### PRIMARY KEY

Identifica cada fila de forma única. Implica automáticamente NOT NULL + UNIQUE. Solo puede haber **una PK por tabla**, pero puede estar formada por varios campos.

```sql
-- PK de un solo campo
CREATE TABLE USUARIOS (
    Login VARCHAR2(25) CONSTRAINT Usu_Log_PK PRIMARY KEY
);

-- PK compuesta (varios campos)
CREATE TABLE USUARIOS (
    Nombre       VARCHAR2(25),
    Apellidos    VARCHAR2(30),
    F_Nacimiento DATE,
    CONSTRAINT Usu_PK PRIMARY KEY (Nombre, Apellidos, F_Nacimiento)
);
```

---

#### FOREIGN KEY / REFERENCES

Declara que el campo es clave ajena: referencia la PK de otra tabla.

```sql
-- FK de un solo campo
CREATE TABLE PARTIDAS (
    Cod_Partida NUMBER(8),
    Login       VARCHAR2(25) CONSTRAINT Part_Log_FK REFERENCES USUARIOS
);

-- FK compuesta (al final, con FOREIGN KEY)
CREATE TABLE PARTIDAS (
    Cod_Partida NUMBER(8),
    F_Partida   DATE,
    CONSTRAINT Part_CodF_FK FOREIGN KEY (Cod_Partida, F_Partida)
        REFERENCES JUEGOS
);
```

**Orden de creación:** siempre crear primero las tablas que contienen la PK referenciada, y después las que contienen la FK. Para borrar, al contrario.

**Opciones al borrar el registro padre:**

| Cláusula | Qué ocurre con las filas hijas |
|----------|-------------------------------|
| `ON DELETE CASCADE` | Se borran automáticamente |
| `ON DELETE SET NULL` | La FK se pone a NULL |
| `ON DELETE DEFAULT x` | La FK toma el valor x |

```sql
CREATE TABLE PARTIDAS (
    Login VARCHAR2(25) CONSTRAINT Part_Log_FK
        REFERENCES USUARIOS ON DELETE CASCADE
);
```

---

#### DEFAULT

Asigna un valor por defecto cuando no se especifica ninguno al insertar.

```sql
CREATE TABLE USUARIOS (
    Pais          VARCHAR2(20) DEFAULT 'España',
    Fecha_ingreso DATE         DEFAULT SYSDATE
);
```

`SYSDATE` es una función Oracle que devuelve la fecha y hora actuales.

---

#### CHECK

Valida que el valor introducido cumpla una condición.

```sql
CREATE TABLE USUARIOS (
    Credito NUMBER(4) CHECK (Credito BETWEEN 0 AND 2000)
);
```

---

#### Ejemplo completo — CREATE TABLE con varias restricciones

```sql
CREATE TABLE USUARIOS (
    Login        VARCHAR2(15) CONSTRAINT Usu_Log_PK  PRIMARY KEY,
    Password     VARCHAR2(8)  CONSTRAINT Usu_Pwd_NN  NOT NULL,
    Email        VARCHAR2(50) CONSTRAINT Usu_Ema_UK  UNIQUE,
    Credito      NUMBER(4)    CONSTRAINT Usu_Cre_CK  CHECK (Credito BETWEEN 0 AND 2000),
    Pais         VARCHAR2(20)                         DEFAULT 'España',
    Fecha_ingreso DATE                                DEFAULT SYSDATE
);
```

---

### §14. Modificar y eliminar tablas

#### DROP TABLE — eliminar tabla

Borra la tabla y **todos sus datos**. Irreversible.

```sql
DROP TABLE USUARIOS;

-- Si otras tablas tienen FK que apuntan a esta tabla:
DROP TABLE USUARIOS CASCADE CONSTRAINTS;
```

> Las vistas asociadas a la tabla borrada seguirán existiendo pero dejarán de funcionar.

#### TRUNCATE TABLE — vaciar tabla

Borra **todas las filas** pero mantiene la estructura de la tabla.

```sql
TRUNCATE TABLE USUARIOS;
```

> `DROP TABLE` elimina estructura + datos. `TRUNCATE TABLE` elimina solo los datos, la estructura queda intacta.

#### ALTER TABLE — modificar tabla y restricciones

**Columnas:**

```sql
-- Añadir columna (se añade al final)
ALTER TABLE USUARIOS ADD (Telefono VARCHAR2(15));

-- Modificar tipo o propiedades
ALTER TABLE USUARIOS MODIFY (Telefono VARCHAR2(20));

-- Eliminar columna (irreversible; no se puede si es la única)
ALTER TABLE USUARIOS DROP COLUMN Telefono;

-- Renombrar columna
ALTER TABLE USUARIOS RENAME COLUMN Telefono TO Movil;

-- Renombrar tabla
RENAME USUARIOS TO JUGADORES;
```

**Restricciones:**

```sql
-- Eliminar una restricción
ALTER TABLE USUARIOS DROP CONSTRAINT Usu_Log_UK;

-- Renombrar una restricción
ALTER TABLE USUARIOS RENAME CONSTRAINT Usu_Log_UK TO Usu_Login_UK;

-- Desactivar temporalmente (la restricción sigue existiendo pero no se aplica)
ALTER TABLE USUARIOS DISABLE CONSTRAINT Usu_Log_PK CASCADE;

-- Reactivar
ALTER TABLE USUARIOS ENABLE CONSTRAINT Usu_Log_PK;
```

> `CASCADE` en DISABLE desactiva también las restricciones que dependan de esta (por ejemplo, claves ajenas en otras tablas que apuntan a esta PK).

---

### §15. Índices — SQL

```sql
-- Crear índice
CREATE INDEX idx_apellidos ON EMPLEADOS (Apellidos);

-- Crear índice sobre varios campos
CREATE INDEX idx_nombre ON EMPLEADOS (Apellidos, Nombre);

-- Eliminar índice
DROP INDEX idx_apellidos;
```

> Los índices de **PK** y **UNIQUE** se crean automáticamente por Oracle al definir esas restricciones. Las **FK no generan índice automático**: Oracle recomienda crearlos a mano para evitar bloqueos en operaciones de borrado sobre la tabla padre.

**Cuándo NO crear índices manualmente:**
- Tablas pequeñas (el recorrido completo es igual de rápido)
- Columnas que se actualizan con mucha frecuencia (cada insert/update tiene que actualizar también el índice)
- Columnas que raramente aparecen en consultas

---

### §16. DCL — Gestión de usuarios y permisos

El DCL (Data Control Language) gestiona quién puede acceder a qué. En Oracle, crear usuarios requiere privilegios de administrador.

#### CREATE USER

> **Oracle XE (multitenant):** todos los usuarios comunes deben llevar el prefijo `c##`. Sin él, Oracle rechaza el comando. En otros entornos Oracle (no multitenant) el prefijo no es necesario.

```sql
CREATE USER c##alberto
IDENTIFIED BY mipassword
DEFAULT TABLESPACE users
QUOTA 50M ON users;
```

Parámetros relevantes:

| Parámetro | Para qué |
|-----------|----------|
| `IDENTIFIED BY` | Contraseña del usuario |
| `DEFAULT TABLESPACE` | Espacio de almacenamiento asignado por defecto |
| `TEMPORARY TABLESPACE` | Espacio para operaciones temporales |
| `QUOTA x ON tablespace` | Límite de espacio en MB o KB |
| `QUOTA UNLIMITED ON` | Sin límite de espacio |
| `PROFILE` | Perfil de restricciones del usuario |

Un usuario recién creado sin QUOTA no puede crear objetos aunque tenga permisos de CREATE TABLE.

#### ALTER USER / DROP USER

```sql
-- Cambiar contraseña (cualquier usuario puede cambiar la suya propia)
ALTER USER c##alberto IDENTIFIED BY nuevapassword;

-- Eliminar usuario (CASCADE borra todos sus objetos primero)
DROP USER c##alberto CASCADE;
```

> Sin CASCADE, Oracle no deja borrar un usuario que tenga tablas u objetos creados.

#### GRANT — conceder privilegios

**Sobre objetos** (permiso sobre una tabla o vista concreta):

```sql
-- Dar permiso de SELECT sobre una tabla a un usuario
GRANT SELECT ON USUARIOS TO ana;

-- Dar todos los privilegios sobre una tabla
GRANT ALL ON PARTIDAS TO ana;

-- Dar permiso de INSERT y UPDATE, y permitir que Ana lo ceda a otros
GRANT INSERT, UPDATE ON USUARIOS TO ana WITH GRANT OPTION;

-- Dar privilegio a todos los usuarios
GRANT SELECT ON USUARIOS TO PUBLIC;
```

**De sistema** (permiso para ejecutar comandos SQL):

```sql
-- Dar rol CONNECT (permite conectarse)
GRANT CONNECT TO ana;

-- Dar permiso para crear tablas
GRANT CREATE TABLE TO ana;

-- Dar permiso y permitir que lo ceda a otros
GRANT DROP USER TO ana WITH ADMIN OPTION;
```

| Opción | Qué permite |
|--------|-------------|
| `WITH GRANT OPTION` | El receptor puede ceder ese privilegio de objeto a otros |
| `WITH ADMIN OPTION` | El receptor puede ceder ese privilegio de sistema a otros |
| `PUBLIC` | El privilegio se aplica a todos los usuarios |

#### REVOKE — retirar privilegios

```sql
-- Retirar privilegios sobre objeto
REVOKE SELECT, UPDATE ON USUARIOS FROM ana;

-- Retirar privilegio de sistema
REVOKE DROP USER FROM ana;

-- Retirar todos los privilegios sobre un objeto
REVOKE ALL ON PARTIDAS FROM ana;
```

---

## Resumen rápido — lo que hay que retener del T2

**Modelo y terminología**

| Concepto | Respuesta |
|----------|-----------|
| Modelo conceptual → ejemplo | Diagrama E-R |
| Modelo lógico → ejemplo | Modelo relacional (se implementa en SGBD) |
| Grado | Número de columnas |
| Cardinalidad | Número de filas |
| Sinónimos: relación / tupla / atributo | Tabla / Fila / Columna |
| Dominio | Conjunto de valores válidos para un atributo; debe ser atómico |

**Claves**

| Concepto | Respuesta |
|----------|-----------|
| Clave candidata | Unicidad + irreductibilidad |
| Clave primaria | La candidata elegida; NOT NULL + UNIQUE automáticamente |
| Clave alternativa | Candidatas no elegidas |
| Clave ajena | Referencia la PK de otra tabla; puede repetirse; puede ser NULL |

**NULL, vistas, roles**

| Concepto | Respuesta |
|----------|-----------|
| NULL ≠ ... | Espacio en blanco / cero |
| FALSO AND NULL | FALSO |
| VERDADERO OR NULL | VERDADERO |
| Vista | Tabla virtual; almacena la consulta, no los datos |
| Oracle y vistas | Oracle no permite actualizar datos a través de vistas |
| Rol | Agrupación de privilegios; se propaga automáticamente |

**DDL**

| Concepto | Respuesta |
|----------|-----------|
| DDL es reversible | No — irreversible |
| PRIMARY KEY implica | NOT NULL + UNIQUE |
| UNIQUE permite NULL | Sí |
| NOT NULL permite duplicados | Sí |
| Orden FK al crear | Primero la tabla con la PK, luego la que tiene la FK |
| Orden FK al borrar | Primero la tabla con la FK, luego la que tiene la PK |
| DROP TABLE vs TRUNCATE | DROP borra estructura + datos. TRUNCATE borra solo datos. |
| ON DELETE CASCADE | Borra automáticamente las filas hijas |
| Longitud máxima nombre tabla | 30 caracteres |
| Nomenclatura restricción Oracle | tabla\_campo\_tipo (ej: Usu\_Log\_PK) |
