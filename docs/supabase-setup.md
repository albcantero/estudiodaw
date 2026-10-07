# Supabase y Resend: configuración de panel

Lo que no vive en el repo y hay que hacer a mano, una vez. El login (código por correo) no
funciona hasta que esté todo.

## 0. En local, sin panel

Para tocar la web no hace falta nada de esto: `npm run dev` sin `.env` usa un login de
mentira (vale el código `123456`, no envía correos).

Para tener la base de datos de verdad en tu ordenador (hace falta Docker):

1. Copia `supabase/config.example.toml` como `supabase/config.toml` (no se sube: así la
   integración de GitHub no lo aplica al proyecto publicado).
2. `npx supabase start`: levanta Supabase en local con ese `config.toml` (código de 6 cifras,
   las plantillas del correo y el hook del dominio) y aplica `supabase/migrations/` y
   `supabase/seed.sql`.
3. Copia `.env.example` como `.env`: `PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`, la clave
   `anon` que escribe la CLI al arrancar y `PUBLIC_AUTH_MODE=real`.
4. `npm run dev`. Los correos con el código no salen a ningún sitio: se leen en
   http://127.0.0.1:54324.
5. Las pruebas de `supabase/checks/`, en el SQL Editor de http://127.0.0.1:54323.

Lo de abajo es para el proyecto publicado.

## 1. Proyecto de Supabase

Hecho: proyecto en Europa, vinculado al repo `albcantero/estudiodaw` (Settings → Integrations →
GitHub, working directory `.`).

1. Project Settings → API: copiar la URL y la clave `anon` a `.env` (ver `.env.example`).
2. Authentication → URL Configuration → Site URL: `https://estudiodaw.dev`.

## 2. Migraciones

Con la integración de GitHub, Supabase aplica solo lo que llega a `supabase/migrations/` al
subir a `main`:

- `20261004000000_restrict_signup_domain.sql`: hook que solo deja crear cuentas
  `@educa.jcyl.es`.
- `20261004000100_auto_enable_rls.sql`: toda tabla nueva en `public` nace con RLS activado (lo
  mismo que la opción "Enable automatic RLS", que quedó apagada al crear el proyecto).

Después del push, en el SQL Editor, pegar y ejecutar cada prueba de `supabase/checks/`; las dos
deben terminar con "Success. No rows returned".

## 3. Activar el hook

Authentication → Hooks → Before User Created → Postgres → esquema `public`, función
`hook_restrict_signup_domain` → activar.

## 4. Correo con código

1. Authentication → Sign In / Providers → Email: activo; "Email OTP Length" 6;
   "Email OTP Expiration" 600.
2. Authentication → Emails → Templates: en "Confirm signup" y en "Magic Link", asunto
   `Tu código para entrar en estudiodaw.dev` y cuerpo `supabase/templates/otp.html`.

## 5. Resend

1. Resend → Domains → Add domain `estudiodaw.dev`; añadir en el DNS los registros que da (SPF
   y DKIM) y esperar a "Verified".
2. Resend → API Keys: crear una con permiso solo de envío.
3. Supabase → Authentication → Emails → SMTP Settings → Enable custom SMTP:
   - Sender email `acceso@estudiodaw.dev`, sender name `estudiodaw.dev`.
   - Host `smtp.resend.com`, port `465`, username `resend`, password: la API key.
4. Authentication → Rate Limits: revisar "Rate limit for sending emails" (por hora).

## 6. Vercel

Settings → Environment Variables: `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`
(Production y Preview). Volver a desplegar.
