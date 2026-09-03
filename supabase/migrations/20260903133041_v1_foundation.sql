create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.app_role as enum ('super_admin', 'admin', 'support', 'content', 'viewer');
create type public.quote_type as enum ('repair', 'purchase');
create type public.quote_status as enum ('new', 'under_review', 'quote_sent', 'waiting_customer', 'approved', 'in_progress', 'completed', 'lost', 'cancelled');
create type public.customer_type as enum ('individual', 'company', 'condominium', 'public_body');
create type public.product_condition as enum ('new', 'like_new', 'used', 'refurbished');
create type public.project_image_type as enum ('before', 'after', 'process', 'other');

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  trade_name text not null,
  legal_name text not null,
  cnpj text not null unique,
  founded_year integer not null,
  description text,
  slogan text,
  phone text,
  whatsapp text,
  public_email text,
  quote_notification_email text,
  street text,
  number text,
  neighborhood text,
  city text,
  state text,
  postal_code text,
  country text not null default 'BR',
  instagram_url text,
  google_business_url text,
  maps_place_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, weekday),
  check (is_closed or (opens_at is not null and closes_at is not null))
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, key)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key public.app_role not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text unique,
  category_id uuid references public.product_categories(id) on delete set null,
  condition public.product_condition,
  description text,
  short_description text,
  material text,
  color text,
  dimensions jsonb,
  weight_capacity numeric,
  available boolean not null default false,
  made_to_order boolean not null default false,
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  internal_price numeric(12,2) check (internal_price is null or internal_price >= 0),
  featured boolean not null default false,
  published boolean not null default false,
  archived_at timestamptz,
  sort_order integer not null default 0,
  is_illustrative boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text,
  icon text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.project_categories(id) on delete set null,
  description text,
  featured boolean not null default false,
  published boolean not null default false,
  client_name_private text,
  client_company_private text,
  client_authorized_public boolean not null default false,
  completed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  type public.project_image_type not null default 'other',
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('google', 'whatsapp', 'instagram', 'manual')),
  customer_name text,
  show_customer_name boolean not null default false,
  rating smallint check (rating between 1 and 5),
  comment text not null,
  source_url text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text,
  type public.customer_type not null default 'individual',
  company_name text,
  cnpj text,
  postal_code text,
  city text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.quote_protocol_seq start 1;

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique default ('JM-' || lpad(nextval('public.quote_protocol_seq')::text, 6, '0')),
  customer_id uuid not null references public.customers(id) on delete restrict,
  type public.quote_type not null,
  chair_type text,
  quantity integer not null default 1 check (quantity > 0),
  problem_description text,
  budget_range text,
  desired_date date,
  needs_pickup boolean,
  needs_delivery boolean,
  postal_code text,
  street text,
  neighborhood text,
  city text,
  state text,
  source text not null default 'website',
  status public.quote_status not null default 'new',
  tracking_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table public.quote_services (
  quote_id uuid not null references public.quotes(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  primary key (quote_id, service_id)
);

create table public.quote_attachments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);

create table public.quote_status_history (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  from_status public.quote_status,
  to_status public.quote_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.quote_internal_notes (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  quote_id uuid not null unique references public.quotes(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  status text not null default 'scheduled',
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  internal_total numeric(12,2),
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  description text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.order_attachments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);

create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  bucket text not null,
  category text not null,
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  provider_conversation_id text,
  ai_paused boolean not null default true,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  provider_message_id text,
  content text,
  status text,
  created_at timestamptz not null default now()
);

create table public.whatsapp_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.whatsapp_messages(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  recipient text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  anonymous_id uuid not null,
  analytics boolean not null default false,
  marketing boolean not null default false,
  policy_version text not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table private.rate_limit_attempts (
  id bigint generated always as identity primary key,
  fingerprint text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create table private.quote_upload_tokens (
  token uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '1 hour'),
  max_files smallint not null default 20 check (max_files between 1 and 20),
  used_count smallint not null default 0 check (used_count between 0 and 20),
  created_at timestamptz not null default now()
);

create index rate_limit_attempts_lookup_idx on private.rate_limit_attempts(action, fingerprint, created_at desc);
create index products_public_idx on public.products(published, featured, sort_order) where archived_at is null;
create index projects_public_idx on public.projects(published, featured, created_at desc);
create index quotes_status_created_idx on public.quotes(status, created_at desc);
create index quotes_customer_idx on public.quotes(customer_id);
create index quote_status_history_quote_idx on public.quote_status_history(quote_id, created_at desc);
create index orders_status_created_idx on public.orders(status, created_at desc);
create index customers_whatsapp_idx on public.customers(whatsapp);
create index customers_email_idx on public.customers(lower(email)) where email is not null;
create index analytics_events_name_occurred_idx on public.analytics_events(event_name, occurred_at desc);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create or replace function private.has_permission(required_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    left join public.role_permissions rp on rp.role_id = r.id
    left join public.permissions p on p.id = rp.permission_id
    where ur.user_id = (select auth.uid())
      and (r.key = 'super_admin' or p.key = required_permission)
  );
$$;

revoke all on function private.has_permission(text) from public;
grant execute on function private.has_permission(text) to authenticated;

create or replace function public.current_user_can(required_permission text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.has_permission(required_permission);
$$;

revoke all on function public.current_user_can(text) from public;
grant execute on function public.current_user_can(text) to authenticated;

create or replace function public.submit_quote(payload jsonb, fingerprint text)
returns table (quote_id uuid, protocol text, upload_token uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_fingerprint alias for $2;
  new_customer_id uuid;
  new_quote_id uuid;
  new_protocol text;
  new_upload_token uuid;
  normalized_type public.quote_type;
  normalized_customer_type public.customer_type;
begin
  if request_fingerprint is null or length(request_fingerprint) < 32 then
    raise exception 'invalid request';
  end if;

  if (
    select count(*)
    from private.rate_limit_attempts a
    where a.action = 'submit_quote'
      and a.fingerprint = request_fingerprint
      and a.created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate limit exceeded';
  end if;

  insert into private.rate_limit_attempts (fingerprint, action)
  values (request_fingerprint, 'submit_quote');

  if coalesce(length(trim(payload->>'name')), 0) < 2
    or coalesce(length(regexp_replace(payload->>'whatsapp', '\\D', '', 'g')), 0) < 10
    or coalesce(length(trim(payload->>'postal_code')), 0) < 8
    or coalesce(length(trim(payload->>'city')), 0) < 2 then
    raise exception 'invalid request';
  end if;

  normalized_type := (payload->>'type')::public.quote_type;
  normalized_customer_type := coalesce(nullif(payload->>'customer_type', ''), 'individual')::public.customer_type;

  insert into public.customers (name, whatsapp, email, type, company_name, cnpj, postal_code, city, state)
  values (
    trim(payload->>'name'),
    regexp_replace(payload->>'whatsapp', '\\D', '', 'g'),
    nullif(lower(trim(payload->>'email')), ''),
    normalized_customer_type,
    nullif(trim(payload->>'company_name'), ''),
    nullif(regexp_replace(payload->>'cnpj', '\\D', '', 'g'), ''),
    regexp_replace(payload->>'postal_code', '\\D', '', 'g'),
    trim(payload->>'city'),
    upper(trim(payload->>'state'))
  )
  returning id into new_customer_id;

  insert into public.quotes (
    customer_id, type, chair_type, quantity, problem_description, budget_range,
    desired_date, needs_pickup, needs_delivery, postal_code, street, neighborhood,
    city, state, source
  ) values (
    new_customer_id,
    normalized_type,
    nullif(trim(payload->>'chair_type'), ''),
    greatest(coalesce((payload->>'quantity')::integer, 1), 1),
    nullif(trim(payload->>'description'), ''),
    nullif(trim(payload->>'budget_range'), ''),
    nullif(payload->>'desired_date', '')::date,
    nullif(payload->>'needs_pickup', '')::boolean,
    nullif(payload->>'needs_delivery', '')::boolean,
    regexp_replace(payload->>'postal_code', '\\D', '', 'g'),
    nullif(trim(payload->>'street'), ''),
    nullif(trim(payload->>'neighborhood'), ''),
    trim(payload->>'city'),
    upper(trim(payload->>'state')),
    'website'
  ) returning id, quotes.protocol into new_quote_id, new_protocol;

  insert into public.quote_status_history (quote_id, to_status)
  values (new_quote_id, 'new');

  insert into private.quote_upload_tokens (quote_id)
  values (new_quote_id)
  returning token into new_upload_token;

  insert into public.notifications (kind, recipient, payload)
  values (
    'quote.received',
    'juliflex1988@gmail.com',
    jsonb_build_object('quote_id', new_quote_id, 'protocol', new_protocol)
  );

  return query select new_quote_id, new_protocol, new_upload_token;
end;
$$;

revoke all on function public.submit_quote(jsonb, text) from public;
grant execute on function public.submit_quote(jsonb, text) to anon, authenticated;

create or replace function private.valid_quote_upload(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.quote_upload_tokens t
    where t.token::text = split_part(object_name, '/', 1)
      and t.expires_at > now()
      and t.used_count < t.max_files
  );
$$;

revoke all on function private.valid_quote_upload(text) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.valid_quote_upload(text) to anon, authenticated;

create or replace function public.register_quote_attachment(
  upload_token uuid,
  storage_path text,
  original_name text,
  mime_type text,
  size_bytes bigint
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_upload_token alias for $1;
  request_storage_path alias for $2;
  request_original_name alias for $3;
  request_mime_type alias for $4;
  request_size_bytes alias for $5;
  target_quote_id uuid;
begin
  select t.quote_id into target_quote_id
  from private.quote_upload_tokens t
  where t.token = request_upload_token
    and t.expires_at > now()
    and t.used_count < t.max_files
  for update;

  if target_quote_id is null
    or split_part(request_storage_path, '/', 1) <> request_upload_token::text
    or not exists (
      select 1 from storage.objects o
      where o.bucket_id = 'private-quotes' and o.name = request_storage_path
    ) then
    return false;
  end if;

  insert into public.quote_attachments (quote_id, storage_path, original_name, mime_type, size_bytes)
  values (target_quote_id, request_storage_path, left(request_original_name, 255), request_mime_type, request_size_bytes);

  update private.quote_upload_tokens
  set used_count = used_count + 1
  where token = request_upload_token;

  return true;
end;
$$;

revoke all on function public.register_quote_attachment(uuid, text, text, text, bigint) from public;
grant execute on function public.register_quote_attachment(uuid, text, text, text, bigint) to anon, authenticated;

create or replace function public.track_quote(public_protocol text, contact_value text, fingerprint text)
returns table (protocol text, status public.quote_status, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  tracking_fingerprint alias for $3;
begin
  if tracking_fingerprint is null or length(tracking_fingerprint) < 32 then
    return;
  end if;

  if (
    select count(*) from private.rate_limit_attempts a
    where a.action = 'track_quote'
      and a.fingerprint = tracking_fingerprint
      and a.created_at > now() - interval '10 minutes'
  ) >= 10 then
    raise exception 'rate limit exceeded';
  end if;

  insert into private.rate_limit_attempts (fingerprint, action)
  values (tracking_fingerprint, 'track_quote');

  return query
  select q.protocol, q.status, q.updated_at
  from public.quotes q
  join public.customers c on c.id = q.customer_id
  where upper(q.protocol) = upper(trim(public_protocol))
    and (
      regexp_replace(c.whatsapp, '\\D', '', 'g') = regexp_replace(contact_value, '\\D', '', 'g')
      or lower(c.email) = lower(trim(contact_value))
    )
  limit 1;
end;
$$;

revoke all on function public.track_quote(text, text, text) from public;
grant execute on function public.track_quote(text, text, text) to anon, authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create trigger companies_updated_at before update on public.companies for each row execute function private.set_updated_at();
create trigger business_hours_updated_at before update on public.business_hours for each row execute function private.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings for each row execute function private.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger product_categories_updated_at before update on public.product_categories for each row execute function private.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function private.set_updated_at();
create trigger services_updated_at before update on public.services for each row execute function private.set_updated_at();
create trigger project_categories_updated_at before update on public.project_categories for each row execute function private.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger testimonials_updated_at before update on public.testimonials for each row execute function private.set_updated_at();
create trigger faqs_updated_at before update on public.faqs for each row execute function private.set_updated_at();
create trigger customers_updated_at before update on public.customers for each row execute function private.set_updated_at();
create trigger quotes_updated_at before update on public.quotes for each row execute function private.set_updated_at();
create trigger quote_internal_notes_updated_at before update on public.quote_internal_notes for each row execute function private.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function private.set_updated_at();
create trigger order_items_updated_at before update on public.order_items for each row execute function private.set_updated_at();
create trigger media_library_updated_at before update on public.media_library for each row execute function private.set_updated_at();
create trigger whatsapp_conversations_updated_at before update on public.whatsapp_conversations for each row execute function private.set_updated_at();

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'companies','business_hours','site_settings','profiles','roles','permissions','user_roles','role_permissions',
    'product_categories','products','product_images','services','project_categories','projects','project_images',
    'testimonials','faqs','customers','quotes','quote_services','quote_attachments','quote_status_history',
    'quote_internal_notes','orders','order_items','order_status_history','order_attachments','media_library',
    'whatsapp_conversations','whatsapp_messages','whatsapp_attachments','notifications','analytics_events',
    'consent_records','audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
  end loop;
end;
$$;

grant select on public.companies, public.business_hours, public.product_categories, public.products,
  public.product_images, public.services, public.project_categories, public.projects, public.project_images,
  public.testimonials, public.faqs to anon, authenticated;

create policy companies_public_read on public.companies for select to anon, authenticated using (true);
create policy business_hours_public_read on public.business_hours for select to anon, authenticated using (true);
create policy product_categories_public_read on public.product_categories for select to anon, authenticated using (active);
create policy products_public_read on public.products for select to anon, authenticated using (published and archived_at is null);
create policy product_images_public_read on public.product_images for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.published and p.archived_at is null)
);
create policy services_public_read on public.services for select to anon, authenticated using (active);
create policy project_categories_public_read on public.project_categories for select to anon, authenticated using (true);
create policy projects_public_read on public.projects for select to anon, authenticated using (published);
create policy project_images_public_read on public.project_images for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.published)
);
create policy testimonials_public_read on public.testimonials for select to anon, authenticated using (published);
create policy faqs_public_read on public.faqs for select to anon, authenticated using (published);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'companies','business_hours','site_settings','profiles','roles','permissions','user_roles','role_permissions',
    'product_categories','products','product_images','services','project_categories','projects','project_images',
    'testimonials','faqs','customers','quotes','quote_services','quote_attachments','quote_status_history',
    'quote_internal_notes','orders','order_items','order_status_history','order_attachments','media_library',
    'whatsapp_conversations','whatsapp_messages','whatsapp_attachments','notifications','analytics_events',
    'consent_records','audit_logs'
  ]
  loop
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('create policy %I on public.%I for all to authenticated using (private.has_permission(''admin.access'')) with check (private.has_permission(''admin.access''))', table_name || '_admin_all', table_name);
  end loop;
end;
$$;

insert into public.companies (
  trade_name, legal_name, cnpj, founded_year, description, slogan, phone, whatsapp,
  public_email, quote_notification_email, street, number, neighborhood, city, state,
  postal_code, instagram_url, google_business_url
) values (
  'JMartins Móveis', 'J. MARTINS MOVEIS LTDA', '69338507000156', 1988,
  'Empresa familiar especializada em reforma e venda de cadeiras e mobiliário, com oficina e execução próprias.',
  'Desde 1988, tradição, qualidade e cuidado em cada móvel.', '1138258297', '551138258297',
  'jmartins.expressao@gmail.com', 'juliflex1988@gmail.com', 'Av. São João', '2023',
  'Santa Cecília', 'São Paulo', 'SP', '01211100', 'https://www.instagram.com/jmartins.expressao/',
  'https://share.google/g5DTPRKVpLklFTeiE'
);

insert into public.business_hours (company_id, weekday, opens_at, closes_at, is_closed)
select c.id, h.weekday, h.opens_at, h.closes_at, h.is_closed
from public.companies c
cross join (values
  (0, null::time, null::time, true),
  (1, '08:00'::time, '18:00'::time, false),
  (2, '08:00'::time, '18:00'::time, false),
  (3, '08:00'::time, '18:00'::time, false),
  (4, '08:00'::time, '18:00'::time, false),
  (5, '08:00'::time, '18:00'::time, false),
  (6, '08:00'::time, '18:00'::time, false)
) as h(weekday, opens_at, closes_at, is_closed)
where c.cnpj = '69338507000156';

insert into public.roles (key, name) values
  ('super_admin', 'Super Admin'), ('admin', 'Administrador'), ('support', 'Atendimento'),
  ('content', 'Conteúdo'), ('viewer', 'Somente leitura');

insert into public.permissions (key, name) values
  ('admin.access', 'Acessar administração'), ('quotes.manage', 'Gerenciar orçamentos'),
  ('orders.manage', 'Gerenciar ordens'), ('catalog.manage', 'Gerenciar catálogo'),
  ('content.manage', 'Gerenciar conteúdo'), ('users.manage', 'Gerenciar usuários'),
  ('analytics.view', 'Visualizar analytics'), ('audit.view', 'Visualizar auditoria');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.key in ('admin', 'super_admin');

insert into public.product_categories (name, slug, sort_order) values
  ('Escritório', 'escritorio', 10), ('Ergonômicas', 'ergonomicas', 20), ('Executivas', 'executivas', 30),
  ('Presidente', 'presidente', 40), ('Secretária', 'secretaria', 50), ('Caixa', 'caixa', 60),
  ('Fixas', 'fixas', 70), ('Recepção', 'recepcao', 80), ('Poltronas', 'poltronas', 90),
  ('Outros móveis', 'outros-moveis', 100);

insert into public.services (name, slug, description, category, icon, featured, sort_order) values
  ('Estofamento e revestimento', 'estofamento-revestimento', 'Tecido, courvin e couro com escolha de acabamento.', 'repair', 'Layers3', true, 10),
  ('Espuma e conforto', 'espuma-conforto', 'Troca ou reforço de espuma para recuperar o conforto.', 'repair', 'Armchair', true, 20),
  ('Pistões e regulagens', 'pistoes-regulagens', 'Correção de altura, inclinação e regulagens.', 'repair', 'Settings2', true, 30),
  ('Rodízios, braços e bases', 'rodizios-bracos-bases', 'Substituição e reparo de componentes de uso diário.', 'repair', 'Wrench', true, 40),
  ('Mecanismos', 'mecanismos', 'Diagnóstico e recuperação dos mecanismos da cadeira.', 'repair', 'Cog', true, 50),
  ('Estrutura e solda', 'estrutura-solda', 'Reparos estruturais e reforços executados na oficina.', 'repair', 'Hammer', true, 60),
  ('Pintura e acabamento', 'pintura-acabamento', 'Revitalização estética com acabamento cuidadoso.', 'repair', 'Paintbrush', true, 70),
  ('Restauração completa', 'restauracao-completa', 'Recuperação completa da estrutura ao revestimento.', 'repair', 'Sparkles', true, 80);

insert into public.project_categories (name, slug, sort_order) values
  ('Cadeiras', 'cadeiras', 10), ('Poltronas', 'poltronas', 20), ('Sofás', 'sofas', 30),
  ('Bancos', 'bancos', 40), ('Mobiliário corporativo', 'mobiliario-corporativo', 50);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('public-products', 'public-products', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif']),
  ('public-portfolio', 'public-portfolio', true, 83886080, array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/quicktime']),
  ('public-brand', 'public-brand', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml']),
  ('private-quotes', 'private-quotes', false, 83886080, array['image/jpeg','image/png','image/webp','image/heic','video/mp4','video/quicktime','application/pdf']),
  ('private-orders', 'private-orders', false, 83886080, null),
  ('private-whatsapp', 'private-whatsapp', false, 83886080, null),
  ('private-admin', 'private-admin', false, 83886080, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy public_media_read on storage.objects for select to anon, authenticated
using (bucket_id in ('public-products', 'public-portfolio', 'public-brand'));

create policy admin_media_all on storage.objects for all to authenticated
using (private.has_permission('admin.access'))
with check (private.has_permission('admin.access'));

create policy quote_upload_insert on storage.objects for insert to anon, authenticated
with check (bucket_id = 'private-quotes' and private.valid_quote_upload(name));
