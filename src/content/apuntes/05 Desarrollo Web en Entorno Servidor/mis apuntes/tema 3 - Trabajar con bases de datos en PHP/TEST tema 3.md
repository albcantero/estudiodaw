# Test tema 3: Trabajar con bases de datos en PHP

## 2. MySQL

**1.** ¿A qué hacen referencia las siglas PDO?

- a) A un motor de almacenamiento utilizado por MariaDB o MySQL
- b) A una extensión de PHP que permite acceder a varios gestores de bases de datos

**Respuesta:** b

**Apartado:** 2

**2.** ¿Cuáles no son ventajas del motor de almacenamiento InnoDB sobre MyISAM? (una o más)

- a) es el que se utiliza por defecto
- b) soporta transacciones
- c) soporta integridad referencial
- d) es más rápido

**Respuesta:** a, d

**Apartado:** 2

**Ojo:** según el temario, el motor por defecto es MyISAM. Desde MySQL 5.5 lo es InnoDB, pero se responde según el temario.

### 2.1 Instalación y configuración

**3.** Al instalar el paquete correspondiente al servidor MySQL en un sistema Linux, se instalan también los programas cliente que permiten conectarse con el mismo.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.1

**4.** ¿Cuál es el fichero de configuración de MySQL?

- a) se configura en el mismo fichero que Apache, httpd.conf
- b) se configura en el mismo fichero que PHP, php.ini
- c) my.cnf
- d) my.ini

**Respuesta:** c

**Apartado:** 2.1

### 2.2 Herramientas de administración

**5.** Relaciona cada herramienta de administración con el tipo de interface que utiliza.

| Herramienta | Tipo de interface |
|---|---|
| MySQL Workbench | Nativo |
| mysql | Línea de comandos |
| phpMyAdmin | Web |
| mysqladmin | Línea de comandos (administración) |

**Apartado:** 2.2

**6.** ¿Cuál de las siguientes no es una herramienta de administración de MySQL?

- a) myadmin
- b) mysql
- c) mysqladmin
- d) phpmyadmin

**Respuesta:** a

**Apartado:** 2.2

**7.** Si quieres saber si en una tabla de una base de datos existe o no un registro, ¿qué herramienta en línea de comandos puedes usar?

- a) mysqladmin
- b) mysql

**Respuesta:** b

**Apartado:** 2.2.1

## 3. Utilización de bases de datos MySQL en PHP

**8.** ¿Cuáles son las dos extensiones más recomendables para acceder a MySQL desde PHP? (una o más)

- a) mysql
- b) libmysql
- c) MySQLi
- d) PDO

**Respuesta:** c, d

**Apartado:** 3

**9.** La extensión mysql se ha usado habitualmente para acceder a bases de datos MySQL, pero hoy en día su uso está desaconsejado.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3

**10.** mysqlnd es el nombre de un driver de bajo nivel para MySQL, que se puede usar tanto con la extensión MySQLi como con PDO, y sustituye al habitual libmysql.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3

### 3.1 Extensión MySQLi

**11.** ¿Qué interface o interfaces de programación admite la extensión MySQLi?

- a) Orientado a objetos únicamente
- b) Dos interfaces de programación: procedimental y orientado a objetos

**Respuesta:** b

**Apartado:** 3.1

**12.** ¿Cuáles son ventajas de la extensión MySQLi sobre la extensión mysql? (una o más)

- a) ofrece un interface orientado a objetos
- b) es una extensión nativa
- c) permite utilizar excepciones para la gestión de errores
- d) soporta transacciones

**Respuesta:** a, d

**Apartado:** 3.1

**13.** ¿Dónde se realiza la configuración de MySQLi?

- a) en el fichero httpd.conf
- b) en el fichero mysqli.conf
- c) en el fichero php.ini
- d) en el fichero my.ini

**Respuesta:** c

**Apartado:** 3.1

#### 3.1.1 Establecimiento de conexiones

**14.** Para establecer una conexión con una base de datos mediante MySQLi, se puede utilizar indistintamente el constructor o el método connect.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.1.1

**15.** Si al establecer una conexión mediante la extensión MySQLi se produce algún error, se puede obtener el mensaje de error correspondiente accediendo a la propiedad ___.

- a) connect_error
- b) connect_err
- c) connect_error_msg
- d) connect_errno

**Respuesta:** a

**Apartado:** 3.1.1

**16.** Al acabar una conexión mediante la extensión MySQLi, se debe ejecutar el método close para liberar los recursos que utiliza.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.1.1

#### 3.1.2 Ejecución de consultas

**17.** Con la extensión MySQLi, puedes utilizar ___ para ejecutar una consulta. (una o más)

- a) el método exec
- b) el método query
- c) la función mysqli_query
- d) la función mysqli_exec

**Respuesta:** b, c

**Apartado:** 3.1.2

**18.** De las dos opciones que admite el método query, MYSQLI_STORE_RESULT y MYSQLI_USE_RESULT, ¿qué opción será recomendable utilizar para ejecutar una consulta que devuelva una enorme cantidad de datos?

- a) MYSQLI_STORE_RESULT
- b) MYSQLI_USE_RESULT

**Respuesta:** b

**Apartado:** 3.1.2

**19.** Al ejecutar una consulta con la extensión MySQLi, puedes utilizar la opción MYSQLI_STORE_RESULT para no recuperar todos los datos a la vez desde el servidor MySQL, sino de forma progresiva según se vayan necesitando.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.1.2

#### 3.1.3 Transacciones

**20.** Para poder utilizar transacciones por código con la extensión MySQLi, has de:

- a) ejecutar el método beginTransaction para comenzar la transacción
- b) utilizar el método autocommit para deshabilitar el comportamiento por defecto
- c) utilizar la propiedad autocommit para deshabilitar el comportamiento por defecto
- d) MySQLi no permite utilizar transacciones

**Respuesta:** b

**Apartado:** 3.1.3

**21.** En el modo de gestión de transacciones que se utiliza por defecto, ¿es posible revertir los cambios que se aplican al ejecutar una consulta de acción?

- a) No
- b) Sí

**Respuesta:** a

**Apartado:** 3.1.3

**22.** Si usas la extensión nativa MySQLi, se pueden utilizar transacciones sobre el motor de almacenamiento MyISAM, pero esto nunca es posible con la extensión PDO.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.1.3

#### 3.1.4 Obtención y utilización de conjuntos de resultados

**23.** Con la extensión MySQLi, para obtener un array a partir de un conjunto de resultados debes utilizar: (una o más)

- a) el método fetch_assoc
- b) el método fetch_array
- c) el método fetch
- d) el método fetch_row

**Respuesta:** a, b, d

**Apartado:** 3.1.4

#### 3.1.5 Consultas preparadas

**24.** Para crear una consulta preparada con MySQLi, el primer paso es utilizar el método prepare para hacerle llegar el SQL al servidor.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.1.5

**25.** Con la extensión MySQLi, antes de ejecutar una consulta preparada debes asignarle valores a los parámetros utilizando:

- a) una llamada al método bind_param
- b) una llamada al método bind_param por cada parámetro
- c) una llamada al método bindParam por cada parámetro
- d) MySQLi no permite utilizar consultas preparadas

**Respuesta:** a

**Apartado:** 3.1.5

**26.** Si utilizas PDO al programar, podrás cambiar el sistema gestor que utilizan tus aplicaciones sin más que adaptar las sentencias de establecimiento de conexión.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.2

#### 3.2.1 Establecimiento de conexiones

**27.** Para establecer una conexión con MySQL utilizando PDO, ¿dónde se puede indicar el número de puerto TCP?

- a) En la cadena DSN que indica el origen de datos
- b) En el array en que figuran las opciones específicas de conexión con el servidor

**Respuesta:** a

**Apartado:** 3.2.1

**28.** Al utilizar PDO, si no se puede establecer una conexión con el gestor de bases de datos, se lanzará una excepción que es conveniente capturar.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.2.1

**29.** Para ejecutar una consulta mediante PDO, puedes utilizar indistintamente los métodos query y exec.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.2.2

**30.** Para poder utilizar transacciones por código con la extensión PDO, has de:

- a) ejecutar el método beginTransaction para comenzar la transacción
- b) utilizar el método autocommit para deshabilitar el comportamiento por defecto
- c) utilizar la propiedad autocommit para deshabilitar el comportamiento por defecto
- d) PDO no permite utilizar transacciones

**Respuesta:** a

**Apartado:** 3.2.2

**31.** Si programas tu aplicación correctamente utilizando "beginTransaction" antes de realizar un cambio, ¿siempre será posible revertirlo utilizando "rollback"?

- a) Sí
- b) No

**Respuesta:** b

**Apartado:** 3.2.2

**32.** Si al utilizar PDO intentas comenzar una transacción con un motor de almacenamiento que no las soporta, obtendrás un error.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.2.2

#### 3.2.3 Obtención y utilización de conjuntos de resultados

**33.** ¿Cuál es el comportamiento por defecto del método "fetch"?

- a) Devuelve un array con claves numéricas y asociativas
- b) Devuelve un array asociativo

**Respuesta:** a

**Apartado:** 3.2.3

**34.** Con la extensión PDO, para obtener un array a partir de un conjunto de resultados debes utilizar:

- a) el método fetch_assoc
- b) el método fetch_array
- c) el método fetch
- d) el método fetch_row

**Respuesta:** c

**Apartado:** 3.2.3

#### 3.2.4 Consultas preparadas

**35.** Con la extensión PDO, antes de ejecutar una consulta preparada debes asignarle valores a los parámetros utilizando:

- a) una llamada al método bind_param
- b) una llamada al método bind_param por cada parámetro
- c) una llamada al método bindParam por cada parámetro
- d) PDO no permite utilizar consultas preparadas

**Respuesta:** c

**Apartado:** 3.2.4

## 4. Errores y manejo de excepciones

**36.** Para configurar los niveles de error de los que debe notificar PHP, debes utilizar el parámetro ___ del fichero php.ini.

- a) display_errors
- b) error_notice
- c) error_reporting
- d) show_errors

**Respuesta:** c

**Apartado:** 4

**37.** Mediante la función set_error_handler es posible personalizar el comportamiento de PHP cuando se produce un error, sea cual sea su nivel.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 4

### 4.1 Excepciones

**38.** En el modelo de excepciones de PHP, cada bloque try debe tener al menos un bloque catch asociado.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 4.1

**39.** ¿Cuántos bloques "catch" se han de utilizar después de un bloque "try"?

- a) Uno
- b) Uno o más

**Respuesta:** b

**Apartado:** 4.1

**40.** Se puede configurar PDO para que cuando se produzca un error genere excepciones utilizando el manejador base de PHP, Exception.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 4.1

**41.** ¿Cuáles de las siguientes son ventajas exclusivas de la extensión MySQLi frente a la extensión mysql de PHP? (una o más)

- a) Ofrece un interfaz orientado a objetos
- b) Es una extensión nativa de PHP
- c) Soporta consultas preparadas
- d) Soporta transacciones

**Respuesta:** a, c, d

**Apartado:** 3.1
