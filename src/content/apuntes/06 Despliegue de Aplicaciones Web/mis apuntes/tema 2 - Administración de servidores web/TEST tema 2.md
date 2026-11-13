# Test tema 2: Configuración y administración de servidores web

## 1. Funcionamiento de un servidor web

**1.** El servidor web Apache puede dar servicio de contenido estático y dinámico.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.1

**2.** Abres el navegador y solicitas una página a un servidor web: ¿cuál de las siguientes acciones indica que la página solicitada no es dinámica?

- a) La página tiene un panel de control, al cual accedes mediante tu usuario y tu contraseña, los cuales nunca cambias. La página establece comunicación con una base de datos y te permite el acceso a tu perfil, distinto del perfil del administrador de la página
- b) Al pasar el puntero por encima de una imagen, esta se redimensiona y al salir vuelve al tamaño original
- c) Cuando visitas la página con distintos navegadores aparece un comentario de alerta indicando el navegador con el cual estás accediendo a la página
- d) La página solicitada es un manual sobre el servidor Apache, y está totalmente escrita en código HTML y CSS

**Respuesta:** d

**Apartado:** 1.1

**3.** PHP es una tecnología de programación web en entorno servidor.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.2

**4.** El protocolo HTTP permite cifrar la información entre el navegador y el servidor web.

- a) Sí, mediante el método HTTP basic
- b) No
- c) Sí, independientemente del método HTTP usado
- d) Sí, siempre y cuando el navegador sea el origen de la información

**Respuesta:** b

**Apartado:** 1.3

**5.** Los tipos MIME pueden determinarse mediante: (una o más)

- a) Solamente mediante el navegador web
- b) El código fuente de la página web
- c) El servidor web
- d) El navegador web

**Respuesta:** b, c, d

**Apartado:** 1.4

**6.** Abres el navegador y solicitas una página web que contiene un vídeo con la extensión .flv a un servidor web Apache: ¿cuáles de las siguientes afirmaciones son correctas teniendo en cuenta que el vídeo puede reproducirse y visualizarse sin problemas? (una o más)

- a) El servidor web no identifica el tipo MIME, pero la extensión .flv es reconocida por el navegador; por eso el navegador asocia el programa correspondiente al vídeo y se reproduce sin problemas
- b) El archivo no es reconocido por el servidor web, por lo que el servidor web envía al navegador otro tipo MIME, compatible con el esperado, y el vídeo se reproduce sin problemas
- c) Si la extensión .flv no es reconocida por el navegador ni por el servidor web, es debido a que el tipo MIME es reconocido por cómo está programada la página web
- d) El servidor web no identifica el tipo MIME, pero como reconoce la extensión .flv modifica la programación de la página web incorporando el código necesario para la reproducción del vídeo

**Respuesta:** a, c

**Apartado:** 1.4

## 2. Hosts virtuales. Creación, configuración y utilización

**7.** El servidor web Apache permite configurar hosts virtuales: (una o más)

- a) No
- b) Basados en nombre
- c) Basados en IP
- d) Basados en varios servidores principales

**Respuesta:** b, c, d

**Apartado:** 2

**8.** Los hosts virtuales basados en nombre permiten: (una o más)

- a) Configurar en una misma IP varios dominios
- b) Configurar en un conjunto de IP un único dominio
- c) Configurar dominios independientemente de la IP del servidor web siempre y cuando el puerto TCP de escucha sea el 80
- d) Configurar un único dominio por host virtual, aunque este puede poseer varios alias

**Respuesta:** a, d

**Apartado:** 2.1

**9.** Los hosts virtuales basados en IP permiten: (una o más)

- a) Configurar en una misma IP varios dominios
- b) Configurar en un conjunto de IP un único dominio
- c) Configurar dominios independientemente de la IP del servidor web siempre y cuando el puerto TCP de escucha sea el 80
- d) Configurar un único dominio por host virtual, aunque este puede poseer varios alias

**Respuesta:** a, d

**Apartado:** 2.2

**Ojo:** confirmada por el Moodle, aunque por concepto la a es de los basados en nombre.

**10.** Si deseas que tu servidor web ofrezca en la misma IP las URL `www.sucursal-zona2.empresa-proyecto.com`, `sucursal-zona2.empresa-proyecto.com` y `www.empresa-proyecto.panel-de-control.com`, donde las dos primeras identifican el mismo sitio web y la última otro totalmente distinto, ¿cuántos ficheros podrías utilizar para definir los virtualhosts?

- a) Un solo fichero
- b) Dos ficheros
- c) No se pueden utilizar virtualhosts, debido a que los dominios son distintos
- d) La pregunta es incorrecta, ya que las URL están mal definidas: no pueden contener el carácter guion

**Respuesta:** b

**Apartado:** 2.1

**11.** En un host virtual ___ significa que atenderá peticiones por cualquier interfaz de red y a través del puerto 80.

- a) `<VirtualHost *:??>`
- b) `<VirtualHost 192.168.200.0:80>`
- c) `<VirtualHost *:*>`
- d) `<VirtualHost *:80>`

**Respuesta:** d

**Apartado:** 2.1

**12.** En un host virtual ___ significa que atenderá peticiones por cualquier interfaz de red y, a priori, a través del puerto empleado para cifrado SSL.

- a) `<VirtualHost *:80>`
- b) `<VirtualHost 192.168.200.0:443>`
- c) `<VirtualHost 192.168.200.250:80>`
- d) `<VirtualHost *:443>`

**Respuesta:** d

**Apartado:** 2.1

**13.** Un servidor Apache con una única interfaz de red con IP 192.168.200.250 en el que configuras que acepte conexiones en el puerto 8080: ¿qué directiva usas?

**Respuesta:** `Listen 8080`

**Apartado:** 2.1

**14.** En Apache, para hacer que el servidor acepte solamente conexiones en el puerto 443 en la interfaz de red 192.168.200.250, ¿qué directiva usas?

**Respuesta:** `Listen 192.168.200.250:443`

**Apartado:** 2.1

## 3. Módulos

**15.** Apache es modular y, por lo tanto, debe instalarse cada vez que queremos actualizarlo.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 3

**16.** Los comandos a2dismod y a2enmod...

- a) Permiten, siempre y cuando el paquete gnome-modular esté instalado, habilitar y deshabilitar módulos respectivamente
- b) Permiten, siempre y cuando el paquete gnome-modular esté instalado, deshabilitar y habilitar módulos respectivamente
- c) Son alias de los comandos a2dissite y a2ensite respectivamente, utilizados para desactivar y activar
- d) Permiten deshabilitar y habilitar módulos respectivamente

**Respuesta:** d

**Apartado:** 3

**17.** Los comandos a2dissite y a2ensite...

- a) Permiten, siempre y cuando el paquete gnome-modular esté instalado, habilitar y deshabilitar
- b) Permiten, siempre y cuando el paquete gnome-modular esté instalado, deshabilitar y habilitar
- c) Son alias de los comandos a2dismod y a2enmod respectivamente, utilizados para desactivar y activar
- d) Permiten deshabilitar y habilitar sitios definidos en virtualhosts

**Respuesta:** d

**Apartado:** 3

**Ojo:** los daypo escriben "a2disite"; el comando real es `a2dissite` (dos eses).

**18.** En Debian, cuando se habilita un módulo de Apache se genera un enlace simbólico de sites-enabled a sites-available, donde se encuentra el módulo cargado.

- a) No
- b) Sí, pero el enlace también puede ser duro
- c) No, el enlace se genera de sites-available a sites-enabled
- d) Sí

**Respuesta:** d

**Apartado:** 3

**Ojo:** el Moodle da por buena la d, pero es un error de la pregunta (confunde mods-* con sites-*). En la realidad es **a) No**: `a2enmod` crea enlaces en mods-enabled que apuntan a mods-available; sites-* es de los sitios (`a2ensite`). Si sale tal cual, d; si Miguel la redacta él, a.

## 4. Acceso a carpetas seguras

**19.** En una comunicación cliente (A) - servidor (B) mediante el cifrado asimétrico, A envía la información cifrada mediante la clave ___ y B la descifra mediante su clave privada.

- a) privada de B
- b) privada y pública de B
- c) privada y pública de A
- d) pública de B

**Respuesta:** d

**Apartado:** 4

**20.** SSL utiliza un sistema de cifrado:

- a) Simétrico
- b) Asimétrico
- c) Ambos
- d) Ninguno de ellos

**Respuesta:** c

**Apartado:** 4.2

**Ojo:** el temario solo dice que SSL/TLS usa cifrado asimétrico (de clave pública) para la autenticación del servidor. El daypo da "Ambos", que es lo correcto: el asimétrico sirve para autenticar y acordar la clave, y los datos de la sesión se cifran con una clave simétrica.

**21.** El certificado digital que un servidor web envía a un navegador ___ mediante una autoridad de certificación la autenticación del servidor web.

- a) por sí solo no asegura
- b) mediante el protocolo HTTP basic no asegura
- c) mediante el protocolo HTTPS basic asegura
- d) asegura

**Respuesta:** d

**Apartado:** 4

**22.** Los navegadores web solamente confían y permiten la comunicación cifrada con un servidor web si ya poseen por defecto en su instalación los certificados digitales del mismo.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 4

**23.** El candado en la barra de direcciones del navegador se muestra cuando hemos cargado nuestro certificado digital en el navegador.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 4.4

**24.** Indica el paquete de software que proporciona la funcionalidad del nivel SSL en el entorno Linux.

- a) SSL
- b) OpenSSL
- c) LinxSSL
- d) TSL

**Respuesta:** b

**Apartado:** 4.2

**25.** La directiva SSLEngine... (una o más)

- a) No puede ser empleada dentro de la configuración de un virtualhost
- b) Sí puede ser empleada dentro de la configuración de un virtualhost
- c) Activa o desactiva SSL
- d) Activa SSL si se emplea dentro de la configuración principal de Apache y desactiva SSL si se emplea dentro de la configuración de un host virtual

**Respuesta:** b, c

**Apartado:** 4.3

**26.** En Apache, las directivas SSLCertificateFile y SSLCertificateKeyFile definen:

- a) La clave privada del servidor Apache y el certificado digital del propio servidor Apache respectivamente
- b) El certificado digital del propio servidor Apache y la clave privada del servidor Apache respectivamente
- c) La clave pública del navegador y la clave privada del servidor respectivamente
- d) La clave privada del navegador y la clave privada del servidor respectivamente

**Respuesta:** b

**Apartado:** 4.3

**27.** En Debian, ¿qué comando deshabilita el módulo ssl de Apache (antes de recargar el servicio)?

**Respuesta:** `a2dismod ssl`

**Apartado:** 3.1

## 5. Autenticación y control de acceso

**28.** En Apache, el archivo .htaccess permite, entre otras cosas: (una o más)

- a) Configurar el archivo ServerAlias
- b) Configurar directorios
- c) Configurar el control de acceso en directorios
- d) Configurar el archivo ServerName

**Respuesta:** b, c

**Apartado:** 5

## 6. Monitorización del acceso: archivos de registro (logs)

**29.** El formato CLF es una especificación que emplean los servidores web para: (una o más)

- a) Copias de seguridad en formato ext3
- b) Archivos de registro
- c) Poder establecer una comunicación cifrada con el servidor web Apache
- d) Logs

**Respuesta:** b, d

**Apartado:** 6

**30.** Asocia los siguientes campos con sus correspondientes identificadores.

| Campo | Identificador |
|---|---|
| authuser | %u |
| host | %h |
| date | %t |
| status | %>s |

**Apartado:** 6

**31.** El identificador %r corresponde al campo:

**Respuesta:** request

**Apartado:** 6

**Ojo:** el Moodle tiene mal la clave (`<code>request</code>`, con las etiquetas HTML dentro) y da por mala la respuesta correcta.

**32.** La directiva CustomLog es similar a la directiva ___, pero con la particularidad de que permite personalizar el formato de registro empleando especificadores.

- a) CookieLog
- b) LogFormat
- c) LogTransfer
- d) TransferLog

**Respuesta:** d

**Apartado:** 6.1

**33.** Asocia las siguientes directivas con su posible uso.

| Directiva | Uso |
|---|---|
| Listen 80 | Escuchar la conexión en un puerto TCP |
| SSLEngine On | Activa SSL |
| CustomLog | Guardar información en un archivo de registro personalizando identificadores |
| TransferLog | Guardar información en un archivo de registro |

**Apartado:** 6.1

**34.** El alias logformat permite definir un grupo de modificadores en una palabra, de tal forma que incorporando esa palabra en la directiva log correspondiente se activa todo un grupo de modificadores.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 6.2

**35.** La rotación de logs consiste en guardar y comprimir los archivos de registro, pero, eso sí, siempre por red y a través de Internet entre dos máquinas sincronizadas.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 6.2

**36.** El programa rotatelogs es un programa proporcionado por Apache que permite: (una o más)

- a) Solamente rotar logs por tamaño de los mismos
- b) Rotar logs por tamaño de los mismos
- c) Rotar logs
- d) Rotar logs por intervalo de tiempo, siempre y cuando en el intervalo de tiempo definido existan nuevos datos

**Respuesta:** b, c, d

**Apartado:** 6.2

**37.** El programa logrotate es una utilidad presente en la mayoría de los sistemas GNU/Linux que permite: (una o más)

- a) Solamente rotar logs por tamaño de los mismos
- b) Rotar logs por tamaño de los mismos
- c) Rotar logs
- d) Rotar logs por intervalo de tiempo, usualmente a través del cron del sistema

**Respuesta:** b, c, d

**Apartado:** 6.2
