# Test tema 2: Características del lenguaje PHP

## 1. Elementos del lenguaje PHP

### 1.1 Generación de código HTML

**1.** Para mostrar información en el navegador, podemos utilizar: (una o más)

- a) print
- b) printf
- c) sprintf
- d) echo

**Respuesta:** a, b, d

**Apartado:** 1.1

**2.** ¿Cuál de las siguientes líneas no es correcta?

- a) `echo "PI: "."3.1416";`
- b) `echo "PI: ","3.1416";`
- c) `print "PI: "."3.1416";`
- d) `print "PI: ","3.1416";`

**Respuesta:** d

**Apartado:** 1.1

**3.** Tenemos una variable real, y queremos mostrarla utilizando un número fijo de decimales, por ejemplo 3. ¿Podemos hacerlo sin utilizar la función printf?

- a) Sí
- b) No

**Respuesta:** a

**Apartado:** 1.1

**4.** Relaciona cada especificador de tipo de printf y sprintf con su significado.

| Especificador | Significado |
|---|---|
| d | Número entero con signo |
| f | Número real |
| u | Número entero sin signo |
| s | Cadena de texto |

**Apartado:** 1.1

**5.** ¿Qué muestra la línea `printf("PI vale %+07.3f", 3.1416);`?

- a) PI vale +03.141
- b) PI vale +3.1416
- c) PI vale +03.142
- d) PI vale +3.1410

**Respuesta:** c

**Apartado:** 1.1

### 1.2 Cadenas de texto

**6.** En las cadenas de texto encerradas entre comillas dobles, se deben escapar las comillas simples empleando `\'`.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.2

**Ojo:** un daypo marca Verdadero; los otros cinco y el temario, Falso.

**7.** En las cadenas de texto encerradas entre comillas simples, se deben escapar las comillas dobles empleando `\"`.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.2

**8.** Relaciona cada secuencia de escape con su resultado.

| Secuencia | Resultado |
|---|---|
| `\n` | Avance de línea |
| `\r` | Retorno de carro |
| `\f` | Avance de página |
| `\t` | Tabulador |

**Apartado:** 1.2

### 1.3 Funciones relacionadas con los tipos de datos

**9.** ¿Qué se muestra en pantalla al ejecutar el siguiente código?

```php
$a = "-3.1416";
printf("La variable \'\$a\' vale %+.2f", $a);
```

- a) La variable '$a' vale -3.14.
- b) La variable '$a' vale +3.14.
- c) La variable \\'$a\\' vale -3.14.
- d) La variable \\'$a\\' vale +3.14.

**Respuesta:** c

**Apartado:** 1.3

**10.** La función ___ se utiliza para saber si una variable se considera como vacía (por ejemplo, cuando su valor es cero).

- a) empty()
- b) is_null()
- c) unset()
- d) isset()

**Respuesta:** a

**Apartado:** 1.3

**11.** Para definir una constante en PHP se utiliza:

- a) const
- b) global
- c) define
- d) constant

**Respuesta:** c

**Apartado:** 1.3

**Ojo:** en PHP también existe `const PI = 3.1416;`, pero el temario solo explica `define` y es la respuesta que se da por buena.

**12.** Los identificadores que se utilizan en PHP para las constantes suelen ir en mayúsculas y, al igual que las variables, deben ir precedidos por el signo "$".

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.3

#### 1.3.1 Funciones de fecha

**13.** En PHP la información sobre fechas y horas comparte un mismo tipo de datos específico.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.3.1

**14.** Podemos utilizar `date()` para obtener la hora actual en cualquier lugar del mundo, si establecemos primero su zona horaria con la función `date_default_timezone_set()`. Por ejemplo: `date_default_timezone_set('Australia/Sydney'); print date("d/m/Y H:i");`

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.3.1

**15.** Si queremos obtener la representación interna de la fecha/hora "23/12/2011 17:15:53", debemos hacer:

- a) `date("23/12/2011 17:15:53");`
- b) `getdate(17,15,53,12,23,2011);`
- c) `mktime(17,15,53,12,23,2011);`
- d) `getdate("23/12/2011 17:15:53");`

**Respuesta:** c

**Apartado:** 1.3.1

### 1.4 Variables especiales de PHP

**16.** Relaciona cada variable con la información que contiene.

| Variable | Información |
|---|---|
| `$_SERVER['DOCUMENT_ROOT']` | Directorio raíz del guion actual |
| `$_ENV` | Variables de entorno disponibles |
| `$_SESSION` | Variables de sesión disponibles |
| `$_SERVER['PHP_SELF']` | Guion que se está ejecutando |

**Apartado:** 1.4

## 2. Estructuras de control

### 2.1 Condicionales

**17.** ¿Siempre se puede sustituir una sentencia switch por otra sentencia o sentencias if?

- a) Sí
- b) No

**Respuesta:** a

**Apartado:** 2.1

**18.** Al ejecutarse el siguiente bloque switch: (una o más)

```php
switch ($a) {
    case 0: print "0";
    case 1: print "1";
    default: print "2";
}
```

- a) si $a vale 0, se muestra "0".
- b) si $a vale 0, se muestra "01".
- c) si $a vale 3, se muestra "2".
- d) si $a vale 1, se muestra "12".

**Respuesta:** c, d

**Apartado:** 2.1

**Ojo:** un daypo marca a y c; los otros cuatro, c y d. Con `$a` a 0 se muestra "012", porque no hay ningún `break`.

### 2.2 Bucles

**19.** Si quieres mostrar una cadena de texto letra a letra, y no sabes si está vacía, ¿qué tipo de bucle emplearías, while o do-while?

- a) while
- b) do-while

**Respuesta:** a

**Apartado:** 2.2

**20.** Relaciona cada una de las tres expresiones que forman parte de un bucle for con lo que hace.

| Expresión | Qué hace |
|---|---|
| La primera | Se ejecuta solo una vez al comienzo del bucle |
| La segunda | Se evalúa para saber si se debe volver a ejecutar el bucle |
| La tercera | Se ejecuta en cada iteración del bucle |

**Apartado:** 2.2

**21.** La tercera expresión que forma parte de un bucle for podría ubicarse igualmente como última instrucción del bucle.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.2

**22.** La ejecución de un bucle finaliza: (una o más)

- a) cuando se ejecuta la sentencia end.
- b) cuando se ejecuta la sentencia break.
- c) cuando se cumple la condición.
- d) cuando no se cumple la condición.

**Respuesta:** b, d

**Apartado:** 2.2

**23.** La sentencia continue:

- a) hace que se compruebe la condición del bucle actual para evaluar si se debe ejecutar una nueva iteración del mismo.
- b) fuerza la ejecución de una nueva iteración del bucle actual.
- c) continúa la ejecución del código en la línea siguiente.
- d) finaliza el bucle actual.

**Respuesta:** a

**Apartado:** 2.2

## 3. Funciones

### 3.1 Inclusión de ficheros externos

**24.** ¿Puedes utilizar include o require para incluir el mismo encabezado HTML en varias páginas?

- a) Sí
- b) No

**Respuesta:** a

**Apartado:** 3.1

**25.** Si queremos incluir sentencias PHP en un fichero externo, para incorporarlas posteriormente a nuestro código utilizando include, deberemos delimitarlas utilizando `<?php` y `?>`.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.1

**26.** La diferencia entre require_once y require es que la primera detiene la ejecución del script si el fichero externo no existe.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.1

### 3.2 Ejecución y creación de funciones

**27.** En PHP es siempre obligatorio definir una función antes de que se pueda utilizar.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.2

### 3.3 Argumentos

**28.** ¿Está bien definida una función con el siguiente encabezado?

```php
function precio_final (&$precio, $iva=0.18, $aplicar_iva)
```

- a) Sí
- b) No

**Respuesta:** b

**Apartado:** 3.3

**29.** En el encabezado de la función siguiente, `function iva($&precio) { … }`, el parámetro precio se pasa por referencia.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.3

**30.** Para que una función pueda devolver un valor utilizando return, debemos indicar en el encabezado de la misma el tipo devuelto. Por ejemplo: `float function precio_con_iva() { … }`

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3.3

## 4. Tipos de datos compuestos

**31.** Si al añadir elementos a un array no utilizamos clave (por ejemplo, `$a[]=4;`), estos se añaden utilizando claves numéricas consecutivas.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 4

**32.** Si ejecutamos las siguientes instrucciones: `$a[0]=0; $a["c"]=1; $a[2]=2; $a[]=3;`

- a) El valor 3 se asigna con la clave 0, sobrescribiendo el valor existente.
- b) El valor 3 se asigna con la clave 1.
- c) El valor 3 se asigna con la clave 3.
- d) Obtenemos un error al ejecutar la última sentencia.

**Respuesta:** c

**Apartado:** 4

### 4.1 Recorrer arrays (I)

**33.** La inicialización del array en el código siguiente, ¿generará algún error?

```php
$a[0] = 0;
$a[1] = "uno";
$a["tres"] = 3;
$a[] = 8;
```

- a) Sí
- b) No

**Respuesta:** b

**Apartado:** 4.1

**34.** En el bucle foreach que recorre los elementos de un array, `foreach ($a as $b => $c) { … }`, relaciona cada variable con lo que es.

| Variable | Es |
|---|---|
| `$a` | El array |
| `$b` | La clave |
| `$c` | El valor |

**Apartado:** 4.1

### 4.2 Recorrer arrays (II)

**35.** Si queremos avanzar una posición el puntero interno de un array, podemos utilizar: (una o más)

- a) next()
- b) each()
- c) current()
- d) key()

**Respuesta:** a, b

**Apartado:** 4.2

**36.** La función each recibe como parámetro un array y devuelve:

- a) un elemento del array.
- b) un entero.
- c) otro array.
- d) un boolean.

**Respuesta:** c

**Apartado:** 4.2

**37.** Para recorrer un array utilizando next, es recomendable utilizar la función key para comprobar si estamos dentro de los límites del mismo.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 4.2

**Ojo:** un daypo marca Falso; los otros cinco, Verdadero, que es lo que se deduce del temario (`key()` devuelve null fuera de los límites, y `next()` no distingue ese caso de un valor false).

### 4.3 Funciones relacionadas con los tipos de datos compuestos

**38.** ¿Se puede usar el siguiente código para recorrer un array `$a` cualquiera?

```php
while ($variable = current($a)) {
    …
    next($a);
}
```

- a) No
- b) Sí

**Respuesta:** a

**Apartado:** 4.2

**39.** Si una vez creado un array `$a`, eliminamos algún elemento intermedio, podemos utilizar la función array_values haciendo `array_values($a);` para volver a tener los índices de `$a` consecutivos.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 4.3

## 5. Formularios web

### 5.3 Subiendo archivos al servidor

**40.** ¿Serviría el siguiente código para comprobar si se han recibido los datos de un formulario?

```php
if (count($_REQUEST) > 0) {
    …
}
```

- a) Sí
- b) No

**Respuesta:** a

**Apartado:** 5.1

**41.** ¿Cuál es el resultado de cada una de las siguientes secuencias de escape?

| Secuencia | Resultado |
|---|---|
| `\n` | Avance de línea |
| `\r` | Retorno de carro |
| `\f` | Avance de página |
| `\t` | Tabulador |

**Apartado:** 1.2

**42.** ¿Cuál es el significado de cada uno de los siguientes especificadores de tipo para printf y sprintf?

| Especificador | Significado |
|---|---|
| `d` | Número entero con signo |
| `f` | Número real |
| `u` | Número entero sin signo |
| `s` | Cadena de texto |

**Apartado:** 1.1
