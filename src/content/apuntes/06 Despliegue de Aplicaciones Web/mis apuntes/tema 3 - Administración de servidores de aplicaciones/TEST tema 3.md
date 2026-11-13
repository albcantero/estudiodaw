# Test tema 3: Configuración y administración de servidores de aplicaciones

## 1. Protección del servidor de aplicaciones

**1.** Los ataques que suele recibir una aplicación web se pueden centrar en varios objetivos. ¿Cuáles de los siguientes podrían ser? (una o más)

- a) Ataques a la computadora del usuario (cliente)
- b) Ataques al servidor
- c) Ataques al flujo de información entre cliente y servidor
- d) Ataques a la alimentación eléctrica

**Respuesta:** a, b, c

**Apartado:** 1

**2.** Para conseguir aplicaciones web seguras hay que establecer mecanismos que garanticen: (una o más)

- a) Autorización
- b) Autenticación básica
- c) Autenticación con certificados
- d) Ataques al servidor

**Respuesta:** a, b, c

**Apartado:** 1

**3.** Los firewalls constituyen uno de los mecanismos a emplear para establecer seguridad sobre las aplicaciones web.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 1

## 2. Despliegue de aplicaciones en Tomcat

**4.** Tomcat es:

- a) Un navegador web
- b) Un servlet
- c) Un sistema operativo
- d) Un servidor de aplicaciones

**Respuesta:** d

**Apartado:** 2

**5.** Una aplicación web puede ser desplegada por medio de archivos WAR.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2

**6.** El código necesario para ejecutar correctamente una aplicación web se encuentra distribuido en una estructura de directorios agrupando ficheros según su funcionalidad.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2

**7.** Según la especificación httpd 2.2, una aplicación web puede ser desplegada en diferentes servidores web manteniendo su funcionalidad y sin ningún tipo de modificación en su código.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 2

**8.** Relaciona los componentes de una plataforma LAMP.

| Componente | Software |
|---|---|
| Sistema operativo | Linux |
| Servidor web | Apache |
| Gestor de base de datos | MySQL |
| Lenguaje de programación | PHP |

**Apartado:** 2

**9.** En la estructura de directorios que forman una aplicación web, el directorio ___ contiene el archivo web.xml.

- a) WEB-INF
- b) raíz
- c) lib
- d) classes

**Respuesta:** a

**Apartado:** 2

**10.** El fichero web.xml de una aplicación web se conoce como descriptor de la aplicación.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2

**11.** Un descriptor de despliegue: (una o más)

- a) Es un único archivo
- b) Tiene formato XML
- c) Es una aplicación web
- d) Describe las características de despliegue de una aplicación web

**Respuesta:** a, b, d

**Apartado:** 2.2

**12.** Para probar el servlet, una vez arrancado el servidor Tomcat, se abre un navegador web en el que se escribe una URL con el siguiente formato:

- a) http://{address}:{port}/{servletName}
- b) http://{port}:{address}/{servletName}
- c) http://{address}:{servletName}/{port}
- d) http://{servletName}:{port}/{address}

**Respuesta:** a

**Apartado:** 2.1

**13.** Si queremos acceder a una aplicación llamada web1 que está corriendo en un servidor Tomcat, desde el propio equipo tendríamos que teclear en el navegador:

- a) http://localhost:8080/web1
- b) http://localhost:8080
- c) http://localhost:80/web1
- d) http://localhost:8080/tomcat

**Respuesta:** a

**Apartado:** 2.1

**14.** El método más sencillo para desplegar una aplicación, que se utiliza sobre todo durante la etapa de desarrollo, es copiar la carpeta correspondiente a la aplicación en la carpeta $CATALINA_HOME/___, teniendo en cuenta que la variable $CATALINA_HOME es la ruta de los scripts que emplea Tomcat.

- a) webapps
- b) web.xml
- c) index
- d) classes

**Respuesta:** a

**Apartado:** 2.2

**15.** Los archivos WAR simplemente son archivos Java de una aplicación web.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.2

**16.** Un archivo .war:

- a) Es un conjunto de páginas .html
- b) Es un conjunto de páginas .css
- c) Contiene una aplicación web completa, empaquetada
- d) Es lo mismo que un archivo .zip

**Respuesta:** c

**Apartado:** 2.2

**17.** Las válvulas del Tomcat son una tecnología introducida a partir de Tomcat 4 que permite asociar una instancia de una clase Java a un contenedor "Catalina"; esta configuración permite que la clase asociada actúe como un pre-procesador de las peticiones.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 2.3

**18.** Si configuramos las sesiones persistentes de forma global, tenemos que manipular el archivo:

- a) <CATALINA_HOME>/conf/context.xml
- b) <CATALINA_HOME>/bin/context.xml
- c) <CATALINA_HOME>/META-INF/context.xml
- d) <CATALINA_HOME>/config/context.xml

**Respuesta:** a

**Apartado:** 2.4

**19.** Uno de los inconvenientes del servidor de aplicaciones Tomcat es que no se puede configurar en cluster.

- a) Verdadero
- b) Falso

**Respuesta:** b

**Apartado:** 2.5

## 3. El servidor de aplicaciones JBoss/Wildfly

**20.** Uno de los requisitos previos para instalar JBoss es tener instalado:

- a) Una distribución Linux
- b) Microsoft Windows
- c) Mozilla Firefox
- d) JDK

**Respuesta:** d

**Apartado:** 3.1

**21.** El servidor JBoss es un proyecto de código abierto con el que se consigue un servidor de aplicaciones basado en J2EE e implementado al 100 % en Java.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3

**22.** Uno de los rasgos más importantes de JBoss es su apoyo a la implementación "en caliente": implementar un nuevo EJB es tan simple como copiar el archivo correspondiente en el directorio correspondiente. Si esto se hace mientras el bean ya está cargado, JBoss lo descarga automáticamente y entonces carga la nueva versión.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3

**23.** Tomcat, a diferencia de JBoss, implementa solamente la funcionalidad de contenedor de servlets.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3

**24.** ¿Cuáles de las siguientes son características del servidor de aplicaciones JBoss/Wildfly? (una o más)

- a) Es de código abierto
- b) Está implementado en su totalidad en Java
- c) Es únicamente un "EJB Container"
- d) Funciona únicamente en servidores Microsoft Windows
- e) Está orientado a arquitectura de servicios

**Respuesta:** a, b, e

**Apartado:** 3

**Ojo:** la autoevaluación de la plataforma da por buenas todas menos la d (a, b, c, e). La c contradice el propio temario: JBoss tiene un "Servlet Engine" y un "EJB Engine", así que no es únicamente un EJB Container. Si sale tal cual en el examen, la clave de la plataforma es a, b, c, e.

**25.** ¿Cuáles de las siguientes afirmaciones son correctas? (una o más)

- a) Un archivo .war puede estar formado por varios archivos .ear
- b) Un archivo .ear puede estar formado por varios archivos .war
- c) El comando #jar cvf permite generar archivos .war
- d) El comando #jar cvf permite generar archivos .ear
- e) Un archivo .ear puede contener archivos .jar

**Respuesta:** b, c, d, e

**Apartado:** 3.3

**26.** Un archivo .ear puede contener archivos .jar.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.3

**27.** El comando #jar cvf permite generar archivos .ear.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 3.3

**28.** En la estructura de un archivo EAR podemos encontrar: (una o más)

- a) /*.war: archivos war
- b) /*.jar: archivos (EJB) jar
- c) En la carpeta META-INF/, el descriptor de despliegue del módulo EAR
- d) /*.ear: los archivos EAR

**Respuesta:** a, b, c

**Apartado:** 3.3

## 4. Construcción y despliegue automático con Ant

**29.** Uno de los requerimientos de Ant es tener instalado JDK en versión 1.4 o superior.

- a) Verdadero
- b) Falso

**Respuesta:** a

**Apartado:** 4

**30.** Apache Ant es una herramienta usada en programación para la realización de tareas mecánicas y repetitivas; posee la ventaja de no depender de los comandos shell de cada sistema operativo, ya que se basa en archivos de configuración:

- a) XML
- b) HTML
- c) ANT
- d) ZIP

**Respuesta:** a

**Apartado:** 4

**31.** ¿Cuáles de las siguientes podrían ser etiquetas del fichero build.xml de Ant? (una o más)

- a) project
- b) target
- c) task
- d) apache-tomcat

**Respuesta:** a, b, c

**Apartado:** 4.2

**Ojo:** uno de los daypo escribe "protect" en la opción a; la etiqueta es `project`.

**32.** Rellena los huecos: En la arquitectura Java EE, los componentes web y los ficheros con contenido estático, como imágenes, son llamados ___ (1). Un ___ (2) es la más pequeña unidad de un recurso web que se pueda utilizar y desplegar. El ___ (3) es un fichero XML que contiene información como el contexto raíz de la aplicación web y la relación de los nombres portátiles de los recursos de aplicación a los recursos del servidor de aplicación. Para desplegar un WAR con la herramienta Ant, se abre una ventana de terminal o línea de comando en el directorio donde se ha construido y empaquetado el WAR y se ejecuta ___ (4).

**Respuesta:** (1) recursos web; (2) módulo web; (3) descriptor de despliegue; (4) ant deploy

**Apartado:** 4.4

## 5. El gestor de aplicaciones web de Tomcat

**33.** El archivo ___ contiene información sobre la configuración web de Tomcat.

- a) host-manager.xml
- b) PHP.ini
- c) build.xml
- d) $CATALINA_HOME

**Respuesta:** a

**Apartado:** 5.1

**Ojo:** uno de los daypo escribe "host-maneger.xml"; el fichero es `host-manager.xml`.

**34.** En Tomcat, el motor JSP encargado de compilar las páginas JSP en código Java, en servlets que puedan ser manejados por Catalina, se denomina:

- a) Jasper
- b) Coyote
- c) Apache
- d) Catalina

**Respuesta:** a

**Apartado:** 5.2

**35.** Rellena los huecos: Un servidor Apache-Tomcat consta de 3 componentes principales. ___ (1): es el contenedor de servlets de Tomcat; implementa las especificaciones de Sun para servlets y Java Server Pages (JSP). ___ (2): es el conector HTTP que soporta el protocolo HTTP 1.1 para el servidor web o para el contenedor de aplicaciones; escucha las conexiones entrantes en un puerto ___ (3) determinado y redirige las peticiones al motor ___ (4) para así procesar las peticiones y mandar una respuesta de vuelta al cliente. ___ (5): es el motor JSP de Tomcat; compila las páginas JSP en código Java en servlets que puedan ser manejados por ___ (6). Los modos de operación de Tomcat pueden ser ___ (7) y ___ (8).

**Respuesta:** (1) Catalina; (2) Coyote; (3) TCP; (4) Tomcat; (5) Jasper; (6) Catalina; (7) Servidor de aplicaciones; (8) Standalone

**Apartado:** 5.2
