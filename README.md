# estudiodaw.dev

Apuntes, ejercicios y soluciones de DAW (CIFP Ponferrada, a distancia), tema a tema. Los apuntes están escritos con palabras propias a partir del material del ciclo; se comparten con la clase.

## Stack

Astro 7 + Tailwind 4 + `@tailwindcss/typography`, con `ClientRouter` (navegación sin recarga; el panel lateral persiste). Iconos de Tabler (`@tabler/icons` + `Icon.astro`, en el build y sin JavaScript). Fuentes: Funnel Sans (texto) y Cardo (títulos) con la API de fuentes de Astro; Geist Mono (código) y Geist Pixel (marca) desde `public/fonts/`.

Estilo: tokens de shadcn/ui (zinc, `--radius: 0.625rem`, oscuro por clase `.dark`, claro por defecto), sistema de columna y líneas de chanhdai.com y marco con panel lateral de designeer.xyz.

JavaScript de cliente, todo pequeño y por delegación en el documento:

- **Tema** claro/oscuro (`ThemeToggle.astro`, tecla D).
- **Vista** rejilla o lista de asignaturas y temas (`ViewToggle.astro`) y **buscador** sin tildes (`CollectionTools.astro`).
- **Mi matrícula** (`EnrollmentDialog.astro`): se marcan los módulos de 1º y 2º y la web filtra asignaturas, panel lateral y calendario.
- **Calendario**: cuenta atrás por días, filtro por curso y descarga `.ics`.

Las preferencias se guardan en `localStorage` (claves en `src/data/storage.ts`); el script del `<head>` de `Base.astro` las aplica antes del primer pintado.

## Estructura

```
src/content/
├─ subjects/<id>.json          asignatura: name, description, order, year (1|2), color
├─ temas/<subject>-<slug>.json tema: subject, slug, number, title, description, unit, downloads[]
└─ docs/<subject>/<slug>/      teoria.md · ejercicios.md · soluciones.md (frontmatter: title, kind)
src/data/
├─ exams.ts      calendario oficial: una fila por módulo, como en el PDF del centro
├─ modules.ts    módulos por curso (matrícula), módulos sin página y etiquetas de curso
├─ content.ts    consultas comunes (asignaturas ordenadas, temas, documentos de un tema)
├─ site.ts       URL de GitHub y secciones de la barra
└─ storage.ts    claves de localStorage
src/scripts/     código de navegador compartido: visibilidad de listas, buscador, .ics
public/downloads/<subject>/<slug>/   ficheros de "mis soluciones" (.xml, .xsd, .sql…)
```

Rutas: `/` → `/<subject>` → `/<subject>/<slug>/<kind>`. `/<subject>/<slug>` redirige al primer documento del tema. Cada documento se descarga en `.md` desde `/<subject>/<slug>/<kind>.md`. Además: `/calendario` y `/guia`.

## Añadir una asignatura

1. Crear `src/content/subjects/<id>.json`.
2. Añadir el `<id>` a su curso en `courseModules` (`src/data/modules.ts`). Si falta, la build se para: sin eso no se podría marcar en "Mi matrícula".
3. Si tiene exámenes, añadir su fila en `src/data/exams.ts`.

## Añadir un tema

1. Crear `src/content/temas/<subject>-<slug>.json`.
2. Copiar los markdown a `src/content/docs/<subject>/<slug>/` con el frontmatter `title` y `kind`. Sin H1 inicial: lo pone la página.
3. Si hay soluciones propias, copiarlas a `public/downloads/<subject>/<slug>/` y listarlas en `downloads`.

## Comandos

```
npm install
npm run dev
npm run check
npm run build
```

`astro dev` y `astro build` comparten la caché de contenido de `.astro/`: no lanzar la build (ni borrar `.astro/`) con el servidor de desarrollo encendido, que se queda con las colecciones vacías.
