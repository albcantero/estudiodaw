-- RLS automático: toda tabla nueva en public nace con Row Level Security activado. Con la API
-- de datos exponiendo las tablas nuevas, una tabla sin RLS quedaría abierta en lectura y
-- escritura a cualquiera con la clave pública (que va en la web). Así nacen cerradas y se abren
-- con políticas, tabla a tabla. Es lo que hace la opción "Enable automatic RLS" del panel.
create or replace function public.auto_enable_rls()
returns event_trigger
language plpgsql
set search_path = ''
as $$
declare
  command record;
begin
  for command in
    select * from pg_event_trigger_ddl_commands()
    where object_type = 'table' and schema_name = 'public'
  loop
    execute format('alter table %s enable row level security', command.object_identity);
  end loop;
end;
$$;

-- Nadie la llama a mano: solo el disparador
revoke execute on function public.auto_enable_rls() from authenticated, anon, public;

drop event trigger if exists auto_enable_rls;
create event trigger auto_enable_rls
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function public.auto_enable_rls();
