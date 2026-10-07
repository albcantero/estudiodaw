-- Prueba del RLS automático: una tabla nueva en public nace con RLS activado. Se pega en el
-- editor SQL de Supabase después de la migración; crea una tabla de prueba y la borra. Si
-- algo falla, lanza un error; si no, termina sin más.
do $$
begin
  create table public.rls_check_probe (id int);
  if not (select relrowsecurity from pg_class where oid = 'public.rls_check_probe'::regclass) then
    raise exception 'La tabla nueva no tiene RLS activado';
  end if;
  drop table public.rls_check_probe;
end;
$$;
