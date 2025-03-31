create table public.filters (
  id uuid not null default gen_random_uuid (),
  name text not null,
  field text not null,
  type text not null,
  options text[] null,
  min numeric null,
  max numeric null,
  step numeric null,
  isNested boolean not null default false,
  nestedField text null,
  parentField text null,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
  constraint filters_pkey1 primary key (id)
) TABLESPACE pg_default;

create trigger update_filters_modtime BEFORE
update on filters for EACH row
execute FUNCTION update_modified_column ();