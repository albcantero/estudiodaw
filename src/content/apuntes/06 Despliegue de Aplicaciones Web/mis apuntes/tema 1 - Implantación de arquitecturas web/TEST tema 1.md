# Test tema 1: Implantación de arquitecturas web

## 1. Aspectos generales de arquitecturas web

**1.** La arquitectura que es un modelo de aplicación distribuida en el que las tareas se reparten entre los proveedores y los demandantes se llama:

- a) Arquitectura secuencial
- b) Arquitectura de tres niveles
- c) Arquitectura cliente-servidor
- d) No existe ese tipo de modelo

**Respuesta:** c

**Apartado:** 1

**2.** La arquitectura web es un modelo de tres capas, que son:

- a) Base de datos, sistema operativo, navegador web
- b) Base de datos, servidor de aplicaciones web, clientes de servicio web
- c) Base de datos, servidor Linux, servidor IIS
- d) Base de datos, clientes HTML, clientes XML

**Respuesta:** b

**Apartado:** 1

**3.** Teniendo en cuenta los componentes de la arquitectura web, la aplicación Tomcat estaría situada en:

- a) Base de datos
- b) Servidor de aplicaciones web
- c) Clientes de servicio web
- d) Sistema operativo

**Respuesta:** b

**Apartado:** 1

**4.** Entre los factores que han impulsado el uso de los servicios web se encuentran: (una o más)

- a) Sistemas operativos Microsoft Windows de "Open Source"
- b) Ancho de banda más barato
- c) Éxito de la computación extendida
- d) Contenido web más dinámico

**Respuesta:** b, c, d

**Apartado:** 1.1

**5.** Las páginas web pueden contener código que se ejecute en el servidor web y código que se ejecute en el navegador.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.2

**6.** ¿Podemos ver una página web sin que intervenga un servidor web?

- a) Sí
- b) No

**Respuesta:** a

**Apartado:** 1.2

**7.** CSS (Cascading Style Sheets) es una tecnología de programación web en entorno servidor.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.2

**8.** JavaScript es un lenguaje que trabaja en el cliente, es decir, se ejecuta en el navegador del equipo cliente y no en el servidor.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.2

**9.** Java es un lenguaje que trabaja en el cliente, es decir, se ejecuta en el navegador del equipo cliente y no en el servidor.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.2

**10.** Los applets de Java se ejecutan en el lado del cliente, es decir, en el navegador web y no en el servidor.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.2

**11.** Escribe el nombre de la tecnología asociada a aplicaciones web que corresponde a cada enunciado (PHP, ASP, CGI, CSS, PERL).

| Enunciado | Tecnología |
|---|---|
| La Interface Común de Entrada es uno de los estándares más antiguos en Internet para trasladar la información desde una página web a un servidor web | CGI |
| Las Hojas de Estilo en Cascada se usan para formatear las páginas web | CSS |
| Las Páginas Activas se ejecutan del lado del servidor | ASP |
| Este lenguaje es, como ASP, usado en el lado del servidor; es similar a ASP y puede ser usado en circunstancias similares | PHP |
| Algo así como "lenguaje práctico de extracción y de informes", nace con el objetivo principal de simplificar las tareas de administración de un sistema UNIX | PERL |

**Apartado:** 1.2

**12.** Una página web que está compuesta de elementos HTML, GIF animados y vídeos corresponde a un tipo de página:

- a) Dinámica
- b) Estática
- c) Animada
- d) Híbrida

**Respuesta:** b

**Apartado:** 1.3

**13.** La plataforma LAMP emplea como servidor web:

- a) IIS
- b) Apache
- c) SQL
- d) CGI

**Respuesta:** b

**Apartado:** 1.5

**14.** Relaciona cada componente de una plataforma LAMP con el software que lo cubre.

| Componente | Software |
|---|---|
| Sistema operativo | Linux |
| Servidor web | Apache |
| Gestor de base de datos | MySQL |
| Lenguaje de programación | PHP |

**Apartado:** 1.5

**15.** El lenguaje de programación más utilizado en plataformas AMP es ___.

**Respuesta:** PHP

**Apartado:** 1.5

**16.** La plataforma WISA está basada en tecnologías desarrolladas empleando software libre.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 1.5

**17.** Un servidor ___ puede correr con MySQL y PHP; a esta plataforma se la conoce como WIMP.

- a) Microsoft Windows
- b) Linux
- c) Unix
- d) Mac

**Respuesta:** a

**Apartado:** 1.5

**18.** Los middlewares actúan como elementos conectores encargados de distribuir la aplicación web...

- a) De forma horizontal mediante un balanceador software
- b) De forma horizontal mediante un balanceador hardware
- c) De forma horizontal mediante un balanceador hardware http
- d) De forma vertical distribuyendo las capas de la aplicación en diferentes máquinas

**Respuesta:** d

**Apartado:** 1.6

**19.** Un balanceador de carga es una solución de escalabilidad horizontal.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1.6

**20.** ¿En qué tipo de escalabilidad se emplean los balanceadores de carga?

- a) Horizontal
- b) Vertical

**Respuesta:** a

**Apartado:** 1.6

## 2. Servidor web Apache

**21.** El servidor web Apache... (una o más)

- a) Es de código abierto
- b) Únicamente está disponible para Linux
- c) Está disponible para Microsoft Windows y Linux
- d) Está estructurado en módulos

**Respuesta:** a, c, d

**Apartado:** 2

**22.** De forma genérica, para probar si funciona nuestro servidor Apache debemos escribir ___ en la barra de direcciones del navegador.

- a) http://localhost
- b) http://192.168.0.1
- c) http://10.0.0.1
- d) http://apache.es

**Respuesta:** a

**Apartado:** 2.1

**23.** En una máquina Linux, si instalamos el servidor Apache, este por defecto sirve las páginas web que están en la carpeta /var/www/.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.1

**24.** Para modificar el servidor virtual predeterminado, editamos el archivo /etc/apache2/sites-available/default.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.1

**25.** La directiva DocumentRoot especifica el puerto (y, opcionalmente, la dirección IP) por el que escuchará Apache.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 2.1

**26.** La forma más habitual de integrar la ejecución de páginas PHP en el servidor web Apache es utilizar...

- a) Un servidor de aplicaciones
- b) Una solución como FastCGI
- c) Tomcat
- d) El módulo mod_php

**Respuesta:** d

**Apartado:** 2.1

**27.** Si utilizamos mod_php para ejecutar PHP como un módulo del servidor web Apache, los cambios que realicemos en la configuración de PHP se aplicarán inmediatamente al recargar la página.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 2.1

**28.** El fichero que contiene la configuración del entorno de ejecución de PHP se llama:

- a) php.cfg
- b) apache.conf
- c) php.ini
- d) php.xml

**Respuesta:** c

**Apartado:** 2.1

**29.** El demonio httpd se debería invocar empleando el script de control apachectl, que es el que se encarga de fijar variables de entorno y pasa al demonio (httpd) cualquier opción que se le pase como argumento por línea de comandos.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.2

## 3. Aplicaciones web y servidores de aplicaciones

**30.** Tomcat es:

- a) Un navegador web
- b) Un servlet
- c) Un sistema operativo
- d) Un servidor de aplicaciones

**Respuesta:** d

**Apartado:** 3.1

**31.** Las funciones del servidor Apache y las funciones del servidor Tomcat, ¿son equivalentes?

- a) Sí
- b) No

**Respuesta:** b

**Apartado:** 3.1

**32.** Tomcat puede utilizarse como plugin para un servidor web existente (actualmente se soportan los servidores Apache e IIS).

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.1

**33.** El servidor Tomcat se gestiona a través de un script denominado:

- a) apache2
- b) sys.ctl
- c) catalina
- d) tomcate

**Respuesta:** c

**Apartado:** 3.1.1

**34.** De forma genérica, para probar si funciona nuestro servidor Tomcat debemos escribir ___ en la barra de direcciones del navegador.

- a) http://localhost:8080
- b) http://192.168.0.1:80
- c) http://10.0.0.1:8080
- d) http://apache.es/tomcat:8080

**Respuesta:** a

**Apartado:** 3.1.1

## 4. Estructura y despliegue de una aplicación web

**35.** El código necesario para ejecutar correctamente una aplicación web se encuentra distribuido en una estructura de directorios, agrupando ficheros según su funcionalidad.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 4

**36.** Un archivo .war...

- a) Es un conjunto de páginas .html
- b) Es un conjunto de páginas .css
- c) Contiene una aplicación web completa, empaquetada
- d) Es lo mismo que un archivo .zip

**Respuesta:** c

**Apartado:** 4.1

**37.** Un archivo .WAR...

- a) Es un archivo comprimido que se puede generar con cualquier tipo de compresor, por ejemplo winzip, winrar, tar, etc.
- b) Es una aplicación web formada únicamente por archivos .html
- c) Es un archivo en el cual se empaqueta en una sola unidad aplicaciones web completas
- d) Es un archivo que engloba el protocolo de comunicación de las aplicaciones web generadas con Java

**Respuesta:** c

**Apartado:** 4.1

**38.** Una aplicación web puede ser desplegada por medio de archivos WAR.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 4.2

**39.** Un descriptor de despliegue... (una o más)

- a) Es un único archivo
- b) Tiene formato XML
- c) Es una aplicación web
- d) Describe las características de despliegue de una aplicación web

**Respuesta:** a, b, d

**Apartado:** 4.3

**40.** Para probar el servlet, una vez arrancado el servidor Tomcat, abrimos un navegador web, en el cual escribiríamos una URL con el siguiente formato:

- a) http://{address}:{port}/{servletName}
- b) http://{port}:{address}/{servletName}
- c) http://{address}:{servletName}/{port}
- d) http://{servletName}:{port}/{address}

**Respuesta:** a

**Apartado:** 4.3

## 5. PHP en el servidor web

**41.** En php.ini, la directiva que se utiliza para definir el tiempo máximo que puede durar la ejecución de un script se llama ___.

**Respuesta:** max_execution_time

**Apartado:** 2.1
