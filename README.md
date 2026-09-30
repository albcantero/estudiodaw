# estudiodaw.dev

Apuntes, ejercicios y soluciones de DAW (CIFP Ponferrada, a distancia), tema a tema. Los apuntes están escritos con palabras propias a partir del material del ciclo; se comparten con la clase.

## Stack

Astro 7 + Tailwind 4 + `@tailwindcss/typography`. Sin JavaScript de cliente salvo el cambio de tema y el filtro del índice. Fuentes: Funnel Sans (texto) y Cardo (títulos) con la API de fuentes de Astro (descargadas en el build, servidas desde el dominio, con respaldo de métricas ajustadas); Geist Mono (código) desde `public/fonts/`. Geist Sans se conserva declarada como alternativa.

Estilo: tokens de shadcn/ui (tema neutral, `--radius: 0.625rem`, oscuro por clase `.dark`), claro por defecto. La página de lectura y los bloques de código (figure con etiqueta de lenguaje, a sangre en móvil) siguen la estructura de 100cosas.dev.

## Estructura del contenido

```
src/content/
├─ subjects/<id>.json          asignatura: name, short, description, order, color
├─ temas/<subject>-<slug>.json tema: subject, slug, number, title, description, unit, downloads[]
└─ docs/<subject>/<slug>/      teoria.md · ejercicios.md · soluciones.md (frontmatter: title, kind)
public/downloads/<subject>/<slug>/   ficheros de "mis soluciones" (.xml, .xsd, .sql…)
```

Rutas: `/` → `/<subject>` → `/<subject>/<slug>/<kind>`. Cada documento se puede descargar en `.md` desde `/<subject>/<slug>/<kind>.md`.

## Añadir un tema

1. Crear `src/content/temas/<subject>-<slug>.json`.
2. Copiar los markdown a `src/content/docs/<subject>/<slug>/` con el frontmatter `title` y `kind`. Sin H1 inicial: lo pone la página.
3. Si hay soluciones propias, copiarlas a `public/downloads/<subject>/<slug>/` y listarlas en `downloads`.

## Comandos

```
npm install
npm run dev
npm run build
```
