# Changelog

Todos los cambios importantes de este proyecto se anotan en este fichero.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa
[versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

## [0.1.0] - 2026-10-07

Primera versión pública, en fase de pruebas. Los apuntes llegarán en versiones siguientes.

### Añadido

- Portada con las asignaturas de 1.º y 2.º de DAW, en lista o en tablero, con buscador,
  agrupación por curso y propiedades que se pueden mostrar u ocultar.
- "Mi matrícula": filtro con las asignaturas que se cursan.
- Asignaturas fijadas en el panel lateral.
- Calendario de exámenes, con cuenta atrás y descarga en formato `.ics`.
- Inicio de sesión con un código de 6 cifras enviado al correo de `educa.jcyl.es`. La primera
  vez, la web pide el nombre (propuesto a partir del correo) y ofrece configurar la matrícula.
- El nombre de la cuenta en la barra superior y en su menú, con el correo debajo.
- Aviso de versión preliminar.
- Tema claro y oscuro, ajuste para reducir el movimiento y scroll suave opcional.
- Aviso legal y Política de privacidad.
- Base de datos reproducible: migraciones y pruebas en `supabase/`, configuración de ejemplo
  para la CLI de Supabase (`supabase/config.example.toml`) y guía en `docs/supabase-setup.md`.
- Sin `.env`, un inicio de sesión de prueba para trabajar en local.
- Documentación de todo el código: cabecera con `@file`, `@author` y `@license` en cada
  fichero y JSDoc en cada función, comprobados por ESLint (`eslint-plugin-jsdoc`).
- Licencia MIT para el código y CC BY-NC-SA 4.0 para los apuntes.

[Sin publicar]: https://github.com/albcantero/estudiodaw/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/albcantero/estudiodaw/releases/tag/v0.1.0
