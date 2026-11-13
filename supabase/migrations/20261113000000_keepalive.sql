-- Latido para que Supabase no pause el proyecto: el plan gratuito lo pausa tras 7 días sin
-- actividad en la base de datos, y la web no tiene tablas que consultar. La llama cada 3 días la
-- GitHub Action .github/workflows/supabase-keepalive.yml con la clave pública. Solo devuelve la
-- hora del servidor: no lee ni escribe ningún dato.
create or replace function public.keepalive()
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select now();
$$;

revoke execute on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
