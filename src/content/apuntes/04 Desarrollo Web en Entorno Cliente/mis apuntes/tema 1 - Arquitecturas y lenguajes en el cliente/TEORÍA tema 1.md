# Tema 1. Arquitecturas y lenguajes de programación en clientes web

**Unidad oficial**: UD1 de Desarrollo Web en Entorno Cliente (DWEC01). **Parcial**: primero (1 de diciembre de 2026), salvo que el profesor indique otra cosa. **Formato del examen**: sin confirmar.

Es un tema introductorio y en buena parte descriptivo. Lo que puede caer en un test se resume en los apartados 1 a 4. La mayor parte del espacio se dedica a lo que exige la tarea: elegir y justificar herramientas (apartado 5) y validar una página con el validador del W3C (apartado 6). El apartado 7 explica cómo se incluye JavaScript en HTML, que es la base de todos los temas siguientes.

## Qué pide la tarea y dónde se explica

| La Tarea 1 pide | Dónde se explica |
|---|---|
| Instalar 2 navegadores web gratuitos, además del que trae el sistema | §5.2 |
| Instalar 1 editor de páginas web gratuito | §5.1 |
| Explicar las razones por las que se ha elegido ese editor | §5.1 (criterios y forma de una justificación) |
| Validar la página de Google con el validador del W3C | §6.2 (procedimiento) |
| Indicar los tipos de errores encontrados | §6.3 (tipos de mensaje) y §6.4 (familias de errores) |
| Citar 3 errores y proponer una solución para cada uno | §6.4 y §6.5 (ejemplo resuelto sobre otra página) |

> Las páginas 3 y 4 de la tarea en la plataforma ("Información de interés" y "Evaluación de la tarea") no están descargadas. Conviene leerlas antes de entregar: pueden pedir capturas o un formato concreto.

---

## 1. La web y el modelo cliente-servidor

### 1.1 Origen y significado de "la Web"

La web la creó **Tim Berners-Lee** en el **CERN** en **1989**, con **Robert Cailliau**, como herramienta para compartir documentos científicos. Se basa en el **hipertexto**: texto que, al pulsarlo, lleva a otro documento. Su difusión se debió en gran parte a **Mosaic**, el navegador de la NCSA. Los estándares los desarrolla y mantiene el **W3C** (World Wide Web Consortium).

El término "Web" admite tres sentidos:

1. El proyecto inicial del CERN.
2. El conjunto de protocolos creados en ese proyecto (HTTP, HTML, URL).
3. **El espacio de información formado por todos los servidores interconectados.** Es el sentido habitual.

> **Trampa de examen**: cuando se pregunta a qué se refiere "la Web", la respuesta es el espacio de información que proporcionan los servidores a través de Internet, no el proyecto del CERN ni sus protocolos.

### 1.2 Las cinco áreas del diseño web

| Área | Qué abarca | Tecnología típica |
|---|---|---|
| **Contenido** | Forma, organización y estructura del contenido | HTML |
| **Visual** | Plantilla y aspecto del sitio | CSS, imágenes |
| **Tecnología** | Elementos interactivos construidos con programación | JavaScript |
| **Distribución** | Velocidad y fiabilidad con que el sitio llega al usuario | Hardware, red |
| **Propósito** | Razón de ser del sitio, normalmente económica | Afecta a todas las decisiones |

El peso de cada área depende del sitio: una página personal apenas tiene propósito económico; una tienda en línea, sí. El temario lo representa como una **pirámide**: el contenido son los ladrillos, la base la forman lo visual y lo tecnológico, y el propósito es el objetivo final.

### 1.3 Los tres elementos del modelo cliente-servidor

| Elemento | Qué es | Tecnologías |
|---|---|---|
| **Servidor** (*server-side*) | Hardware y software del servidor web y los programas que se ejecutan en él | PHP, Java, Node.js, bases de datos |
| **Cliente** (*client-side*) | El navegador web | HTML, CSS, **JavaScript** |
| **Red** | La conectividad que lleva el sitio al usuario | Protocolos, cableado, enrutadores |

**Ejemplo: qué ocurre al abrir una página.**

1. El navegador (cliente) pide `https://www.tienda.es/` al servidor a través de la red.
2. El servidor ejecuta su código (por ejemplo, PHP que consulta la base de datos) y devuelve un documento HTML.
3. El navegador interpreta el HTML, descarga el CSS y el JavaScript que el documento enlaza y pinta la página.
4. A partir de ahí, **JavaScript se ejecuta en el navegador**: responde a clics, valida formularios y modifica la página sin volver a pedirla entera.

Este módulo trata el paso 4: la programación en el cliente.

---

## 2. Lenguajes de programación en el cliente

### 2.1 Cliente y servidor: complementarios, no rivales

Las tecnologías *client-side* se ejecutan en el navegador; las *server-side*, en el servidor. Cada una resuelve una parte del problema, y lo normal es combinarlas.

**Ejemplo: un formulario de registro.**

| Paso | Dónde | Por qué ahí |
|---|---|---|
| Comprobar que el correo tiene formato válido antes de enviar | Cliente (JavaScript) | Respuesta inmediata; el usuario corrige sin esperar ni recargar |
| Volver a comprobarlo al recibirlo | Servidor (PHP) | El cliente no es de fiar: JavaScript se puede desactivar o saltar |
| Guardar el usuario en la base de datos | Servidor | La base de datos está en el servidor y solo él tiene acceso |

> **¿Por qué hay que validar dos veces?** La validación en el cliente es una comodidad para el usuario, no una protección. Cualquiera puede desactivar JavaScript, modificar el código desde las herramientas del navegador o enviar la petición directamente al servidor sin pasar por el formulario. Por eso la integridad de los datos solo la garantiza la validación del servidor.

**Analogía con Odoo**: un `required="1"` en la vista XML lo comprueba el cliente web (OWL) al guardar; un `@api.constrains` en el modelo Python lo comprueba el servidor. Una llamada por XML-RPC se salta la vista, pero no la restricción del modelo.

### 2.2 Dos tipos de lenguajes en el cliente

1. **Lenguajes de formato y estilo**: HTML y CSS. Describen qué hay en la página y cómo se ve.
2. **Lenguajes de *scripting***: aportan dinamismo. El módulo se centra en **JavaScript**, el más usado y el único que interpretan de forma nativa todos los navegadores.

Un **lenguaje de *script*** (de guiones) es un lenguaje cuyo código se guarda en texto plano y lo ejecuta un **intérprete**, sin compilación previa por parte del programador.

### 2.3 Tecnologías de cada lado según el temario

| Lado del cliente | Lado del servidor |
|---|---|
| Aplicaciones de ayuda | *Scripts* y programas CGI |
| Programas del API del navegador | Programas del API del servidor |
| *Plug-ins* de Netscape | Módulos de Apache |
| Controles ActiveX | Extensiones y filtros ISAPI |
| Pepper para Chrome | *Servlets* de Java |
| *Applets* de Java | Lenguajes de *scripting*: PHP, ASP/ASP.NET, JavaScript (Node.js) |
| Lenguajes de *scripting*: JavaScript, VBScript | |

> **Contexto actual (no entra en examen)**: de la columna del cliente, hoy solo sigue en uso JavaScript (y WebAssembly, que no aparece en el temario). Los *plug-ins* de Netscape, ActiveX, Pepper, los *applets* de Java y VBScript han desaparecido de los navegadores. En el examen se responde con la tabla del temario.

### 2.4 Las cuatro capas del desarrollo en el cliente

De arriba abajo:

1. **Comportamiento**: JavaScript.
2. **Presentación**: CSS.
3. **Estructura**: HTML y su representación en memoria, el DOM.
4. **Contenido**: texto, imágenes, vídeos.

JavaScript ocupa la capa superior: actúa sobre las otras tres (cambia contenido, estructura y estilos en respuesta al usuario).

---

## 3. Características y limitaciones de JavaScript

### 3.1 Por qué no sustituye a la programación en el servidor

El temario da tres razones:

1. **No puede escribir ficheros en el servidor.** Prepara los datos y se los entrega a un programa del servidor, que es quien los guarda.
2. **No todos los clientes ejecutan JavaScript** (lectores de pantalla antiguos, buscadores, usuarios que lo desactivan). Una página bien hecha debe seguir siendo funcional sin él; JavaScript mejora la experiencia, pero no debe ser imprescindible.
3. **AJAX** integra cliente y servidor: JavaScript pide o envía datos al servidor en segundo plano y actualiza solo una parte de la página. Se estudia en el tema 7.

### 3.2 Para qué se usa

- Reaccionar a la interacción del usuario con formularios y enlaces.
- Presentar pequeños conjuntos de datos con una interfaz cómoda.
- Controlar ventanas y marcos según lo que elige el usuario.
- Preprocesar datos en el cliente antes de enviarlos al servidor.
- Modificar estilos y contenido de forma inmediata.
- Pedir ficheros al servidor y enviarle peticiones de lectura y escritura (que ejecuta el servidor).

JavaScript no está limitado a las páginas web: muchas aplicaciones integran un intérprete de JavaScript para automatizarlas (por ejemplo, los *scripts* de Google Sheets o las extensiones de VS Code).

### 3.3 Compatibilidad entre navegadores

A diferencia del código de servidor, que se ejecuta siempre en la misma máquina y con la misma versión, **el código de cliente lo interpreta el navegador de cada usuario**. El programador no controla qué navegador ni qué versión se usará. Cada navegador implementa el estándar con diferencias y con sus propios fallos.

Lo que de verdad interpreta el código es el **motor** del navegador:

| Navegador | Motor de renderizado (HTML y CSS) | Motor de JavaScript | Gratuito |
|---|---|---|---|
| Google Chrome | Blink | V8 | Sí |
| Microsoft Edge (el de Windows) | Blink | V8 | Sí |
| Opera | Blink | V8 | Sí |
| Brave | Blink | V8 | Sí |
| Mozilla Firefox | Gecko | SpiderMonkey | Sí |
| Safari (solo macOS e iOS) | WebKit | JavaScriptCore | Sí |

> **Ojo con el término "navegador distinto"**: Chrome, Edge, Opera y Brave son navegadores distintos, pero comparten motor (Blink y V8). Para probar la compatibilidad de verdad hay que probar en **motores** distintos: Blink y Gecko como mínimo, y WebKit si se dispone de un Mac o un iPhone.

**El HTML también causa incompatibilidades.** Muchas diferencias entre navegadores no vienen del JavaScript sino de un HTML incorrecto: cada navegador puede reconstruir de forma distinta un documento mal formado, y el JavaScript que recorre esa estructura se comporta de forma distinta. Por eso el temario recomienda validar el HTML con el validador del W3C (apartado 6).

Limitaciones de uso que enumera el temario:

- No todos los navegadores soportan JavaScript.
- Algunos dispositivos móviles no lo ejecutan.
- Las implementaciones de los navegadores principales no son totalmente compatibles entre sí.
- El usuario puede desactivarlo.
- Algunos navegadores de voz no lo interpretan.

La tabla de compatibilidad de referencia que cita el temario es la de Kangax (`kangax.github.io/compat-table/es6/`). Hoy se consulta sobre todo **Can I use** (`caniuse.com`) y la documentación de **MDN**, que indica la compatibilidad de cada función por navegador y versión.

---

## 4. Seguridad

### 4.1 Las dos restricciones del navegador

| Restricción | Qué impide |
|---|---|
| **Espacio seguro de ejecución** (*sandbox*) | El código solo puede hacer tareas relacionadas con la web: nada de crear ficheros, lanzar programas ni tocar el sistema |
| **Política del mismo origen** (*same-origin policy*) | Los *scripts* de una web no pueden acceder a los datos (usuarios, contraseñas, *cookies*) de otra web |

**Qué es un origen.** Dos URL tienen el **mismo origen** si coinciden en tres cosas: **esquema** (protocolo), **host** (dominio) y **puerto**. La ruta no cuenta.

Tomando como referencia `https://www.tienda.es/productos/index.html`:

| URL | ¿Mismo origen? | Por qué |
|---|---|---|
| `https://www.tienda.es/carrito/ver.html` | Sí | Solo cambia la ruta |
| `http://www.tienda.es/productos/index.html` | No | Cambia el esquema (http frente a https) |
| `https://tienda.es/productos/index.html` | No | Cambia el host (sin `www`) |
| `https://api.tienda.es/productos` | No | Cambia el host (otro subdominio) |
| `https://www.tienda.es:8443/productos/` | No | Cambia el puerto (el de https por defecto es 443) |

> **Trampa de examen**: un subdominio (`api.tienda.es`) es otro origen, aunque pertenezca a la misma empresa.

### 4.2 Lo que JavaScript no puede hacer

Según el temario, JavaScript **no** puede:

- Modificar las preferencias del navegador, el aspecto de la ventana principal, la impresión ni los botones del navegador.
- Lanzar una aplicación en el ordenador del cliente.
- Leer ni escribir ficheros o directorios del cliente, **salvo las *cookies***.
- Escribir directamente ficheros en el servidor.
- Capturar una transmisión en *streaming* para retransmitirla.
- Enviar correos de forma invisible (sí puede enviar datos a un programa del servidor que los envíe).
- Interactuar directamente con los lenguajes del servidor.
- Acceder a páginas de otros dominios.
- Proteger el origen de las imágenes de la página.
- Implementar multiprocesamiento o multitarea.

> **Contexto actual (no entra en examen)**: dos puntos de esta lista ya no son exactos. Los **Web Workers** permiten ejecutar código en hilos paralelos, y la **File API** permite leer un fichero que el usuario elige expresamente con `<input type="file">`. La política del mismo origen también se puede relajar desde el servidor con **CORS**. En el examen, la lista del temario.

### 4.3 XSS (*Cross-Site Scripting*)

Un **XSS** se produce cuando un atacante consigue que una página muestre a otros usuarios un código suyo, que el navegador ejecuta como si fuera de la propia página. Así se salta la política del mismo origen: el código malicioso se ejecuta *desde* el origen legítimo y puede leer sus *cookies*.

**Ejemplo**: una web de comentarios que pinta el texto del usuario tal cual.

```js
const comentario = '<img src="x" onerror="alert(document.cookie)">'; // ← texto que ha escrito un atacante

caja.innerHTML = comentario;   // ← INCORRECTO: el navegador lo interpreta como HTML y ejecuta el onerror
caja.textContent = comentario; // ← CORRECTO: se muestra como texto, no se ejecuta nada
```

> **¿Por qué el ataque usa una imagen y no un `<script>`?** Un `<script>` insertado con `innerHTML` **no se ejecuta**: el navegador lo añade a la página pero no lo lanza. Los atributos de evento (`onerror`, `onload`) de otros elementos sí se ejecutan. Por eso los ataques reales usan una imagen con una ruta que no existe y un `onerror`.

El temario atribuye estos fallos a errores de implementación de los navegadores. En la práctica, la causa más frecuente es la propia web, que inserta datos del usuario como HTML sin escaparlos. **Analogía con Odoo**: en QWeb, `t-out` escapa el texto; solo se interpreta como HTML lo que se marca expresamente con `markup()`.

### 4.4 Motores de JavaScript

El **motor** es el programa que ejecuta el código JavaScript, y en él recae casi toda la seguridad. Ejemplos del temario:

- **Active Script** de Microsoft, que ejecuta **JScript**: compatible con JavaScript en gran parte, pero con extensiones fuera del estándar ECMA.
- El *toolkit* **Qt** (C++) incluye un intérprete de JavaScript.
- **Java** incorporó en el JDK 1.6 el paquete `javax.script` para ejecutar JavaScript desde Java.
- Los motores de los navegadores (tabla del §3.3).

Hoy los navegadores compiten sobre todo por la **velocidad** de su motor y por el **aislamiento** entre pestañas.

---

## 5. Herramientas: editor y navegadores

### 5.1 El editor

El temario desaconseja los editores **WYSIWYG** (*what you see is what you get*, como Dreamweaver en modo diseño): están pensados para el aspecto de la página, y para aprender JavaScript hay que trabajar sobre el código fuente. Tampoco hace falta un IDE completo; un editor ligero con extensiones ofrece casi lo mismo.

**Las seis características que debe tener el editor**, según el temario:

| Característica | Qué hace | Ejemplo práctico |
|---|---|---|
| **Resaltado de sintaxis** | Colorea palabras clave, variables, cadenas y comentarios, e indenta los bloques | Un `"` sin cerrar tiñe de color de cadena todo lo que sigue |
| **Autocompletado** | Propone cómo terminar lo que se escribe | Al escribir `document.getE` ofrece `getElementById` |
| **Navegación por el código** | Localiza definiciones y usos | Ir a la definición de una función desde una llamada |
| **Comprobación de errores al editar** | Marca los errores de sintaxis mientras se escribe | Subraya en rojo un paréntesis sin cerrar |
| **Generación automática de código** | Crea estructuras repetitivas | Escribir `!` y Tab en un `.html` genera el esqueleto HTML5 |
| **Gestión de versiones** | Se integra con un control de versiones | Ver los cambios respecto al último *commit* de Git |

A estas se suman dos condiciones prácticas: que guarde con extensión `.html` y `.js` sin problemas, y que permita elegir la **codificación** del fichero (UTF-8).

**Editores habituales:**

| Editor | Licencia y coste | Situación | Observaciones |
|---|---|---|---|
| **Visual Studio Code** | Gratuito (Microsoft; su base, Code - OSS, es libre con licencia MIT) | Mantenido, actualizaciones mensuales | Cumple las seis características; extensiones, terminal integrado, depurador y Git incorporados |
| **Sublime Text** | **De pago**; se puede evaluar sin límite de tiempo con avisos para comprar licencia | Mantenido | Muy rápido; muchas funciones dependen de paquetes |
| **Atom** | Gratuito y libre | **Archivado por GitHub el 15 de diciembre de 2022**: sin actualizaciones ni parches de seguridad | El temario lo recomienda porque es de 2021 |
| **Notepad++** | Gratuito y libre (GPL) | Mantenido | Solo Windows; ligero; resaltado y autocompletado básicos, sin comprobación de errores de JavaScript |
| **WebStorm** (IDE) | Gratuito para uso no comercial desde 2024 | Mantenido | IDE completo de JetBrains; más pesado |

> **Trampa para la tarea**: la tarea exige que todo lo instalado sea **gratuito**. Sublime Text no lo es (se puede usar sin pagar, pero la licencia es de pago). Atom es gratuito, pero está abandonado: elegirlo hoy es difícil de justificar.

**Cómo se escribe una justificación.** Una buena justificación no dice "es el mejor" ni "es el más usado": recorre los criterios uno a uno y aporta un hecho comprobable para cada uno, incluidos los inconvenientes. Estructura recomendada:

1. **Requisito de la tarea**: si es gratuito y con qué licencia.
2. **Las seis características del temario**: cuáles cumple y cómo (con un ejemplo concreto de cada una).
3. **Mantenimiento**: si sigue recibiendo actualizaciones.
4. **Comparación**: por qué se descartan las alternativas.
5. **Inconvenientes asumidos**: qué le falta o qué cuesta.

**Ejemplo de justificación** (sobre Notepad++, para mostrar la forma):

> Se ha elegido Notepad++ por ser gratuito y de software libre (licencia GPL) y por su bajo consumo de recursos. Ofrece resaltado de sintaxis para HTML, CSS y JavaScript, autocompletado de palabras y búsqueda en el código, y guarda en UTF-8 con cualquier extensión. Sigue actualizándose. Se descartó Sublime Text porque su licencia es de pago y Atom porque dejó de mantenerse en 2022. Como inconvenientes, no detecta errores de JavaScript mientras se escribe, no genera código y no integra Git, y solo funciona en Windows.

### 5.2 Los navegadores

El navegador es imprescindible para ejecutar JavaScript, y no requiere conexión: un fichero `.html` local con su `.js` se abre directamente desde el disco.

**Criterio de elección para la tarea.** Windows trae **Edge** (Blink). Si los dos navegadores adicionales también usan Blink, la prueba de compatibilidad no añade nada: el código se ejecuta en el mismo motor tres veces. Lo razonable es que al menos uno use un **motor distinto** (Firefox, con Gecko) y justificarlo con la tabla del §3.3. Safari no se puede instalar en Windows, así que WebKit queda fuera.

**Instalación, de forma general:**

1. Descargar el instalador **solo desde la web oficial** del navegador.
2. Ejecutarlo y aceptar las opciones por defecto, salvo la de convertirlo en navegador predeterminado, que es indiferente.
3. Comprobar la versión instalada en el menú **Ayuda → Acerca de** (en Firefox, Ayuda → Acerca de Firefox; en Chrome, Ayuda → Información de Google Chrome).
4. Abrir las **herramientas de desarrollo** con **F12** y comprobar que la consola funciona.

**Las herramientas de desarrollo (F12)**, que son lo que el temario llama "extensiones" del navegador:

| Panel | Para qué sirve |
|---|---|
| **Consola** (*Console*) | Muestra los errores de JavaScript y lo que imprime `console.log()`; permite ejecutar código al momento |
| **Elementos** (*Elements*, en Firefox *Inspector*) | Muestra el DOM actual de la página y sus estilos |
| **Fuentes** (*Sources*, en Firefox *Depurador*) | Permite poner puntos de ruptura y ejecutar el código paso a paso |
| **Red** (*Network*) | Muestra cada fichero que descarga la página y cuánto tarda |

**Prueba rápida en la consola**: escribir `2 + 2` devuelve `4`; escribir `document.title` devuelve el título de la página abierta.

---

## 6. Validación de HTML con el validador del W3C

### 6.1 Qué es validar

**Validar** un documento HTML es comprobar que cumple la especificación de HTML: que los elementos existen, que están anidados donde se permite, que los atributos son válidos para cada elemento y que sus valores son correctos. Lo hace el **validador del W3C** (*Nu Html Checker*), en `https://validator.w3.org/nu/`. La dirección clásica, `https://validator.w3.org/`, ofrece lo mismo para HTML5.

> **¿Por qué funciona una página con errores?** Los navegadores son **tolerantes**: la especificación de HTML define con detalle cómo reconstruir un documento incorrecto (cerrar etiquetas que faltan, mover elementos mal colocados), y todos aplican esas reglas. Por eso una página con decenas de errores se ve bien. Pero la estructura reconstruida puede no ser la que el autor pensaba, y el JavaScript que la recorre puede fallar o comportarse distinto. Que una página funcione no significa que sea válida.

### 6.2 Procedimiento

1. Abrir `https://validator.w3.org/nu/`.
2. Elegir cómo se le da el documento, en el desplegable **Check by**:
   - **address**: la URL de una página publicada (es la opción para validar una web como la de Google);
   - **file upload**: un fichero `.html` del disco;
   - **text input**: el código pegado directamente.
3. Escribir la dirección completa, con `https://`, y pulsar **Check**.
4. Leer la lista de mensajes. Cada uno indica el tipo, el texto en inglés, la posición y un extracto del código. Marcando **Show source** se ve el código fuente con los errores resaltados.

> El validador analiza la página tal como se la sirve el servidor **en ese momento**. Las webs grandes cambian a menudo, de modo que el número de errores puede variar de un día a otro. Conviene anotar la fecha de la validación y guardar una captura.

### 6.3 Los tipos de mensaje

| Tipo | Significado | ¿Hay que corregirlo? |
|---|---|---|
| **Error** | El documento incumple la especificación | Sí |
| **Warning** (advertencia) | El documento es válido, pero hay algo innecesario o desaconsejado (`type` innecesario, falta `lang`). También acompaña a un error para señalar otra posición relacionada, como la primera aparición de un `id` repetido | Recomendable |
| **Info** | Observación sin efecto en la validez. Ejemplo: `Trailing slash on void elements has no effect…`, que aparece al escribir `<br/>` en lugar de `<br>` | No es necesario |

**Cómo se lee la posición.** `From line 13, column 19; to line 13, column 22` indica que el fragmento problemático empieza en la línea 13, carácter 19, y termina en el carácter 22 de la misma línea.

> **Errores en cascada.** Un solo fallo puede generar varios mensajes. En el ejemplo del §6.5, la línea 13 tiene un único error (dos etiquetas cerradas en orden incorrecto) y el validador da tres mensajes. Al corregir, se empieza por el primero y se vuelve a validar.

### 6.4 Familias de errores y cómo se corrigen

Los mensajes son innumerables, pero casi todos pertenecen a unas pocas familias. Identificar la familia es lo que permite "indicar los tipos de errores encontrados".

| Familia | Cómo empieza el mensaje (en inglés) | Causa | Solución general |
|---|---|---|---|
| **Elemento obsoleto** | `The "…" element is obsolete.` | Etiqueta retirada de HTML5 (`center`, `font`, `marquee`) | Sustituirla por su equivalente actual, normalmente CSS |
| **Atributo obsoleto o no permitido** | `Attribute "…" not allowed on element "…" at this point.` | Atributo que no existe para ese elemento, retirado de HTML5 o inventado | Si es de presentación, pasarlo a CSS; si es un dato propio, usar `data-*` |
| **Valor incorrecto de atributo** | `Bad value "…" for attribute "…" on element "…"` | El atributo existe, pero su valor no es válido | Poner un valor permitido o quitar el atributo |
| **Falta un atributo obligatorio** | `An "img" element must have an "alt" attribute…` | Atributo exigido por la especificación | Añadirlo con un valor adecuado |
| **Elemento fuera de su contexto** | `Element "…" not allowed as child of element "…" in this context.` | Elemento colocado donde la especificación no lo admite | Moverlo a su sitio o cambiar el elemento padre |
| **Anidamiento o cierre incorrecto** | `End tag "…" seen, but there were open elements.` / `Unclosed element "…".` / `Stray end tag "…".` | Etiquetas que se cierran en orden incorrecto, sin abrir o sin cerrar | Cerrar en orden inverso al de apertura |
| **`id` duplicado** | `Duplicate ID "…".` | Dos elementos con el mismo `id` | Hacer únicos los `id`; si se quiere agrupar, usar `class` |
| **Advertencias de estilo** | `The "type" attribute is unnecessary…` / `Consider adding a "lang" attribute…` | Algo válido pero innecesario o recomendable | Quitar lo innecesario o añadir lo recomendado |

> **¿Por qué `data-*` resuelve los atributos inventados?** HTML5 reserva todos los atributos que empiezan por `data-` para datos propios de la página. Son válidos en cualquier elemento y JavaScript los lee con `elemento.dataset`. `<span tooltip="…">` es un error; `<span data-tooltip="…">` es válido y JavaScript lo lee como `span.dataset.tooltip`.

### 6.5 Ejemplo resuelto

Página de prueba `tienda.html` con errores típicos:

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Tienda de ejemplo</title>
<script type="text/javascript" src="tienda.js"></script>
</head>
<body>
<center>Rebajas de otoño</center>
<div id="menu"><a href="/">Inicio</a></div>
<div id="menu"><a href="/ofertas">Ofertas</a></div>
<img src="logo.png">
<p>Precio: <b>20 €</p></b>
<div><style>p { color: red; }</style></div>
<span tooltip="Ver carrito">Carrito</span>
<a href="/ayuda" target="">Ayuda</a>
<ul><p>Lista</p></ul>
<input type="text" width="200">
</body>
</html>
```

Mensajes que devuelve el validador (salida real, en el orden en que aparecen):

| Línea | Tipo | Mensaje | Familia | Solución |
|---|---|---|---|---|
| 6 | Warning | `The "type" attribute is unnecessary for JavaScript resources.` | Advertencia de estilo | Quitar `type="text/javascript"`: en HTML5 es el valor por defecto |
| 9 | Error | `The "center" element is obsolete. Use CSS instead.` | Elemento obsoleto | `<p class="aviso">` con `.aviso { text-align: center; }` |
| 11 | Error | `Duplicate ID "menu".` (seguido de un Warning que señala la primera aparición, en la línea 10) | `id` duplicado | Dos `id` distintos: `menu-inicio` y `menu-ofertas` |
| 12 | Error | `An "img" element must have an "alt" attribute, except under certain conditions.` | Falta atributo obligatorio | `alt="Logotipo de la tienda"`; si la imagen fuera decorativa, `alt=""` |
| 13 | Error | `End tag "p" seen, but there were open elements.` | Anidamiento incorrecto | `<p>Precio: <b>20 €</b></p>` |
| 13 | Error | `Unclosed element "b".` | (cascada del anterior) | Se resuelve con la misma corrección |
| 13 | Error | `No "b" element in scope but a "b" end tag seen.` | (cascada del anterior) | Se resuelve con la misma corrección |
| 14 | Error | `Element "style" not allowed as child of element "div" in this context.` | Elemento fuera de su contexto | Mover el `<style>` al `<head>` o a un `.css` enlazado |
| 15 | Error | `Attribute "tooltip" not allowed on element "span" at this point.` | Atributo no permitido | `data-tooltip="Ver carrito"` |
| 16 | Error | `Bad value "" for attribute "target" on element "a": Browsing context name must be at least one character long.` | Valor incorrecto | `target="_blank"` o quitar el atributo |
| 17 | Error | `Element "p" not allowed as child of element "ul" in this context.` | Elemento fuera de su contexto | Los hijos de `ul` son `li`: `<ul><li>Lista</li></ul>` |
| 18 | Error | `Attribute "width" not allowed on element "input" at this point.` | Atributo no permitido | Anchura con CSS: `style="width: 200px"` o una clase |
| 2 | Warning | `Consider adding a "lang" attribute to the "html" start tag…` | Advertencia de estilo | `<html lang="es">` |

Versión corregida, que el validador acepta **sin ningún mensaje**:

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Tienda de ejemplo</title>
<script src="tienda.js"></script>
<style>p { color: red; } .aviso { text-align: center; }</style>
</head>
<body>
<p class="aviso">Rebajas de otoño</p>
<div id="menu-inicio"><a href="/">Inicio</a></div>
<div id="menu-ofertas"><a href="/ofertas">Ofertas</a></div>
<img src="logo.png" alt="Logotipo de la tienda">
<p>Precio: <b>20 €</b></p>
<span data-tooltip="Ver carrito">Carrito</span>
<a href="/ayuda" target="_blank">Ayuda</a>
<ul><li>Lista</li></ul>
<input type="text" style="width: 200px">
</body>
</html>
```

**Cómo se redacta cada error en la tarea.** Para cada uno de los tres errores elegidos:

1. **Mensaje** del validador, copiado tal cual, con su línea.
2. **Explicación** en castellano de qué incumple y por qué (su familia, del §6.4).
3. **Solución propuesta**: el fragmento corregido.

Conviene elegir tres errores de **familias distintas**: demuestra que se entienden los tipos y no solo un caso.

---

## 7. Integración de JavaScript en HTML

### 7.1 Las dos formas de incluir código

| Forma | Sintaxis | Cuándo se usa |
|---|---|---|
| **Código en la página** | `<script>` … `</script>` con el código dentro | Pruebas y fragmentos muy cortos |
| **Fichero externo** | `<script src="ruta/fichero.js"></script>` | Lo recomendado en cualquier proyecto real |

**Código en la página** (`index.html`):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Hola mundo desde DWEC</title>
  <script>
    const saludar = () => {
      alert('Hola mundo desde DWEC');
    };
  </script>
</head>
<body>
  <h1>Hola mundo desde DWEC</h1>
  <button onclick="saludar()">Saludar</button> <!-- ← al pulsar, llama a la función -->
</body>
</html>
```

**Fichero externo**: el mismo código, separado en dos ficheros.

```js
// js/saludo.js
const saludar = () => {
  alert('Hola mundo desde DWEC');
};
```

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Hola mundo desde DWEC</title>
  <script src="js/saludo.js"></script> <!-- ← sin código dentro -->
</head>
<body>
  <h1>Hola mundo desde DWEC</h1>
  <button onclick="saludar()">Saludar</button>
</body>
</html>
```

**Ventajas del fichero externo**, según el temario: separa el código de la estructura, se comparte entre varias páginas, centraliza la depuración, da claridad y modularidad, y **acelera la carga**, porque el navegador guarda el `.js` en caché y no lo vuelve a descargar en cada página que lo usa.

**Reglas del `<script>` con `src`:**

- La etiqueta de cierre `</script>` es obligatoria, aunque no haya nada dentro. **`<script src="…"/>` no cierra la etiqueta**: en HTML la barra final solo vale en los elementos vacíos (`<br>`, `<img>`, `<meta>`), y en `<script>` se ignora. El navegador toma todo lo que sigue como contenido del *script* hasta encontrar un `</script>`, y la página se queda en blanco. El validador lo señala con `Self-closing syntax ("/>") used on a non-void HTML element.`
- **No se escribe código entre las etiquetas** cuando se usa `src`: el navegador lo ignora y el validador lo marca como error (`The text content of element "script" was not in the required format`). Solo se admiten espacios y saltos de línea.
- Para cargar varios ficheros se repite la etiqueta, una por fichero. Se ejecutan en el orden en que aparecen.
- El atributo `type="text/javascript"` que aparece en el temario es opcional en HTML5, y el validador lo marca como innecesario (§6.5).

```html
<!-- INCORRECTO: el alert nunca se ejecuta -->
<script src="js/saludo.js">
  alert('Esto se ignora');
</script>

<!-- CORRECTO: un script para el fichero y otro para el código -->
<script src="js/saludo.js"></script>
<script>
  alert('Esto sí se ejecuta');
</script>
```

### 7.2 Rutas al fichero

Para una página en `https://www.midominio.com/tienda/index.html`:

| Tipo de ruta | `src` | Fichero que se carga |
|---|---|---|
| Relativa, misma carpeta | `miScript.js` | `https://www.midominio.com/tienda/miScript.js` |
| Relativa, subcarpeta | `./js/miScript.js` (equivale a `js/miScript.js`) | `https://www.midominio.com/tienda/js/miScript.js` |
| Relativa, carpeta superior | `../js/miScript.js` | `https://www.midominio.com/js/miScript.js` |
| Relativa a la raíz del sitio | `/js/miScript.js` | `https://www.midominio.com/js/miScript.js` |
| Absoluta | `https://www.midominio.com/js/miScript.js` | La indicada, sea cual sea la página |

El temario distingue solo entre absoluta (empieza por `http://` o `https://`) y relativa (todo lo demás).

### 7.3 `<noscript>`

Muestra un contenido solo cuando el navegador no ejecuta JavaScript:

```html
<noscript>Esta página necesita JavaScript para funcionar.</noscript>
```

### 7.4 El código es siempre visible

Todo lo que el navegador descarga para mostrar una página está al alcance de cualquiera: basta abrir la URL del `.js` o el panel Fuentes de las herramientas de desarrollo. **No hay forma de ocultar el código JavaScript.**

> **Trampa de examen**: el fichero externo no protege el código. Al ver el código fuente de la página solo aparece la etiqueta `<script src>`, pero abriendo esa ruta se descarga el fichero completo.

Lo único posible es dificultar su lectura:

| Técnica | Qué hace | Objetivo |
|---|---|---|
| **Minificación** | Elimina espacios, saltos de línea y comentarios, y acorta nombres | Que el fichero pese menos y cargue antes |
| **Ofuscación** | Además, transforma el código para que sea difícil de entender (nombres sin sentido, código troceado en variables) | Que cueste copiarlo o entenderlo |

```js
// Original
function calcularTotal(precio, cantidad) {
  return precio * cantidad;
}

// Minificado
function calcularTotal(n,t){return n*t}
```

Ninguna de las dos impide que alguien copie el código. El temario propone el planteamiento contrario: incluir un aviso de *copyright* o una licencia, y publicar y compartir el código (por ejemplo, en GitHub).

### 7.5 Dónde colocar el `<script>`

> **¿Por qué el ejemplo del §7.1 funciona con el `<script>` en el `<head>`?** Porque el *script* solo **define** una función y no toca la página. El código se ejecuta en cuanto el navegador lo encuentra, cuando todavía no ha leído el `<body>`. Si el *script* intentara acceder a un elemento del `<body>`, ese elemento aún no existiría:
>
> ```html
> <head>
>   <script>
>     document.querySelector('h1').textContent = 'Hola'; // ← querySelector devuelve null
>   </script>
> </head>
> <body>
>   <h1>Título</h1>
> </body>
> ```
>
> La consola muestra `TypeError: Cannot set properties of null (setting 'textContent')`. Hay dos soluciones: colocar el `<script>` al final del `<body>`, cuando todos los elementos ya existen, o añadir el atributo `defer` (`<script src="js/app.js" defer></script>`), que retrasa la ejecución hasta que el documento se ha leído entero.
>
> **`defer` solo funciona con `src`.** En un `<script>` con el código dentro, `defer` no tiene ningún efecto: el código se ejecuta igual en cuanto se lee y falla igual. Además, el validador lo marca como error. El DOM se estudia en el tema 6.

---

## 8. Preguntas de autoevaluación de la plataforma

**1. Cuando nos referimos a la Web, ¿de qué estamos hablando?**

- a) Del proyecto del CERN.
- b) De los protocolos utilizados en el proyecto del CERN.
- **c) Del espacio de información que proporcionan los servidores a través de Internet.** ✅

El proyecto del CERN es el origen de la Web y los protocolos son solo uno de sus componentes. Hoy "la Web" designa el conjunto de información que ofrecen los servidores interconectados.

**2. ¿Se podría escribir con JavaScript un fichero de texto directamente en el servidor?**

- a) Sí, pero solo si se trata de una *cookie*.
- **b) De ninguna manera.** ✅
- c) Sí, empleando AJAX.

JavaScript se ejecuta en el navegador y no tiene acceso a los recursos del servidor. Las *cookies* se escriben en el cliente, no en el servidor. AJAX solo envía peticiones al servidor en segundo plano: quien escribe el fichero, si lo hace, es el programa del servidor que recibe la petición.

---

## 9. Resumen para el examen

- **La Web** es el espacio de información de los servidores interconectados. Creada por Tim Berners-Lee en el CERN en 1989; estándares del W3C.
- **Cinco áreas del diseño web**: contenido, visual, tecnología, distribución y propósito.
- **Tres elementos del modelo cliente-servidor**: servidor, cliente y red.
- Cliente y servidor son **complementarios**: se valida en el cliente por comodidad y en el servidor por seguridad.
- **Cuatro capas en el cliente**: comportamiento (JavaScript), presentación (CSS), estructura (HTML/DOM) y contenido.
- JavaScript **no puede** escribir en el servidor, ni leer o escribir ficheros del cliente (salvo *cookies*), ni lanzar programas, ni acceder a otros dominios, ni (según el temario) hacer multitarea.
- **Dos restricciones de seguridad**: espacio seguro de ejecución (*sandbox*) y política del mismo origen.
- **Mismo origen** = mismo esquema, mismo host y mismo puerto. La ruta no cuenta.
- **XSS**: inyección de código ajeno que se ejecuta desde el origen legítimo.
- **Editor**: no WYSIWYG; seis características (resaltado, autocompletado, navegación, comprobación de errores, generación de código, control de versiones).
- **Validador del W3C**: mensajes de tipo Error, Warning e Info.
- **Fichero `.js` externo**: recomendado; `</script>` obligatorio y nada de código dentro si hay `src`.
- **El código JavaScript nunca se puede ocultar**: como mucho, minificar u ofuscar.
