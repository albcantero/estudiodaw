-- Prueba del hook que limita el registro a @educa.jcyl.es. Se pega en el editor SQL de
-- Supabase después de la migración: si algo falla, lanza un error con el correo; si no,
-- termina sin más. (No va en supabase/tests: esa carpeta es para pgTAP y supabase test db.)
do $$
declare
  allowed text[] := array['a@educa.jcyl.es', 'A.B_c-1@EDUCA.JCYL.ES'];
  rejected text[] := array[
    'a@gmail.com',
    'a@alumnos.educa.jcyl.es',
    'a@educa.jcyl.es.evil.com',
    'a@b@educa.jcyl.es',
    '@educa.jcyl.es',
    'sin-arroba',
    ''
  ];
  email text;
  result jsonb;
begin
  foreach email in array allowed loop
    result := public.hook_restrict_signup_domain(
      jsonb_build_object('user', jsonb_build_object('email', email))
    );
    if result <> '{}'::jsonb then
      raise exception 'Debería aceptar %: %', email, result;
    end if;
  end loop;

  foreach email in array rejected loop
    result := public.hook_restrict_signup_domain(
      jsonb_build_object('user', jsonb_build_object('email', email))
    );
    if (result -> 'error' ->> 'http_code')::int is distinct from 403 then
      raise exception 'Debería rechazar %: %', email, result;
    end if;
  end loop;

  -- Sin correo en el evento (p. ej. registro por teléfono): se rechaza
  result := public.hook_restrict_signup_domain('{"user": {}}'::jsonb);
  if (result -> 'error' ->> 'http_code')::int is distinct from 403 then
    raise exception 'Debería rechazar un evento sin correo: %', result;
  end if;
end;
$$;
