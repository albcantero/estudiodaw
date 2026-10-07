-- Hook "Before User Created" de Supabase Auth: solo se pueden crear cuentas con un correo
-- @educa.jcyl.es (exacto: sin subdominios ni nada detrás). Es el filtro de verdad; el
-- formulario de la web solo pone el dominio, y la API de Auth se puede llamar sin pasar por él.
-- Se activa en Authentication → Hooks (ver docs/supabase-setup.md).
create or replace function public.hook_restrict_signup_domain(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  email text := lower(coalesce(event -> 'user' ->> 'email', ''));
begin
  -- Una sola @, algo antes y el dominio exacto al final
  if email ~ '^[^@]+@educa\.jcyl\.es$' then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object(
    'error',
    jsonb_build_object(
      'http_code', 403,
      'message', 'Solo se puede entrar con un correo de educa.jcyl.es'
    )
  );
end;
$$;

-- Solo la llama Supabase Auth
grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_restrict_signup_domain(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_restrict_signup_domain(jsonb) from authenticated, anon, public;
