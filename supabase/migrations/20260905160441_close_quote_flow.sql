create unique index if not exists customers_whatsapp_unique_idx
  on public.customers (whatsapp);

create unique index if not exists quote_attachments_storage_path_unique_idx
  on public.quote_attachments (storage_path);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quote_attachments_file_policy_check'
      and conrelid = 'public.quote_attachments'::regclass
  ) then
    alter table public.quote_attachments
      add constraint quote_attachments_file_policy_check
      check (
        char_length(original_name) between 1 and 255
        and (
          (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/heic') and size_bytes <= 15728640)
          or (mime_type in ('video/mp4', 'video/quicktime') and size_bytes <= 83886080)
          or (mime_type = 'application/pdf' and size_bytes <= 20971520)
        )
      );
  end if;
end
$$;

insert into public.services (
  name,
  slug,
  description,
  category,
  icon,
  featured,
  active,
  sort_order
) values (
  'Higienização',
  'higienizacao',
  'Limpeza técnica de tecidos, estofados e superfícies.',
  'repair',
  'SprayCan',
  false,
  true,
  75
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  active = true;

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
  normalized_whatsapp text;
  normalized_postal_code text;
  normalized_email text;
  normalized_cnpj text;
  normalized_quantity integer;
  normalized_desired_date date;
  desired_date_input text;
begin
  if request_fingerprint is null
    or length(request_fingerprint) < 32
    or length(request_fingerprint) > 128
    or payload is null
    or jsonb_typeof(payload) <> 'object'
    or pg_column_size(payload) > 16384 then
    raise exception 'invalid request';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('submit_quote|' || request_fingerprint, 0)
  );

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

  normalized_whatsapp := regexp_replace(coalesce(payload->>'whatsapp', ''), '\D', '', 'g');
  normalized_postal_code := regexp_replace(coalesce(payload->>'postal_code', ''), '\D', '', 'g');
  normalized_email := nullif(lower(trim(coalesce(payload->>'email', ''))), '');
  normalized_cnpj := nullif(regexp_replace(coalesce(payload->>'cnpj', ''), '\D', '', 'g'), '');
  desired_date_input := trim(coalesce(payload->>'desired_date', ''));

  if payload ? 'services' then
    if jsonb_typeof(payload->'services') <> 'array' then
      raise exception 'invalid request';
    end if;

    if jsonb_array_length(payload->'services') > 20
      or exists (
        select 1
        from jsonb_array_elements(payload->'services') requested(value)
        where jsonb_typeof(requested.value) <> 'string'
          or length(trim(requested.value #>> '{}')) not between 1 and 100
      ) then
      raise exception 'invalid request';
    end if;
  end if;

  if coalesce(payload->>'type', '') not in ('repair', 'purchase')
    or coalesce(payload->>'customer_type', 'individual') not in ('individual', 'company', 'condominium', 'public_body')
    or length(trim(coalesce(payload->>'name', ''))) not between 2 and 120
    or length(coalesce(payload->>'whatsapp', '')) > 32
    or length(normalized_whatsapp) not between 10 and 13
    or length(normalized_postal_code) <> 8
    or length(trim(coalesce(payload->>'street', ''))) > 160
    or length(trim(coalesce(payload->>'neighborhood', ''))) > 120
    or length(trim(coalesce(payload->>'city', ''))) not between 2 and 120
    or upper(trim(coalesce(payload->>'state', ''))) !~ '^[A-Z]{2}$'
    or length(trim(coalesce(payload->>'chair_type', ''))) not between 1 and 120
    or length(trim(coalesce(payload->>'description', ''))) > 4000
    or length(trim(coalesce(payload->>'budget_range', ''))) > 120
    or length(trim(coalesce(payload->>'company_name', ''))) > 160
    or length(coalesce(payload->>'cnpj', '')) > 32
    or coalesce(payload->>'quantity', '') !~ '^[0-9]{1,5}$'
    or coalesce(jsonb_typeof(payload->'needs_delivery'), '') <> 'boolean'
    or (
      payload ? 'needs_pickup'
      and coalesce(jsonb_typeof(payload->'needs_pickup'), '') <> 'boolean'
    )
    or (
      normalized_email is not null
      and (
        length(normalized_email) > 254
        or normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
      )
    ) then
    raise exception 'invalid request';
  end if;

  normalized_quantity := (payload->>'quantity')::integer;
  if normalized_quantity not between 1 and 10000 then
    raise exception 'invalid request';
  end if;

  normalized_type := (payload->>'type')::public.quote_type;
  normalized_customer_type := coalesce(nullif(payload->>'customer_type', ''), 'individual')::public.customer_type;

  if normalized_type = 'repair'
    and length(trim(coalesce(payload->>'description', ''))) < 10 then
    raise exception 'invalid request';
  end if;

  if normalized_type = 'purchase'
    and length(trim(coalesce(payload->>'budget_range', ''))) < 1 then
    raise exception 'invalid request';
  end if;

  if normalized_customer_type in ('company', 'public_body')
    and (
      length(trim(coalesce(payload->>'company_name', ''))) < 1
      or length(coalesce(normalized_cnpj, '')) <> 14
    ) then
    raise exception 'invalid request';
  end if;

  if desired_date_input <> '' then
    if desired_date_input !~ '^\d{4}-\d{2}-\d{2}$' then
      raise exception 'invalid request';
    end if;

    begin
      normalized_desired_date := desired_date_input::date;
    exception
      when others then
        raise exception 'invalid request';
    end;

    if to_char(normalized_desired_date, 'YYYY-MM-DD') <> desired_date_input then
      raise exception 'invalid request';
    end if;
  end if;

  insert into public.customers as customer (
    name,
    whatsapp,
    email,
    type,
    company_name,
    cnpj,
    postal_code,
    city,
    state
  ) values (
    trim(payload->>'name'),
    normalized_whatsapp,
    normalized_email,
    normalized_customer_type,
    nullif(trim(coalesce(payload->>'company_name', '')), ''),
    normalized_cnpj,
    normalized_postal_code,
    trim(payload->>'city'),
    upper(trim(payload->>'state'))
  )
  on conflict (whatsapp) do update set
    name = excluded.name,
    email = coalesce(excluded.email, customer.email),
    type = excluded.type,
    company_name = coalesce(excluded.company_name, customer.company_name),
    cnpj = coalesce(excluded.cnpj, customer.cnpj),
    postal_code = excluded.postal_code,
    city = excluded.city,
    state = excluded.state
  returning customer.id into new_customer_id;

  insert into public.quotes as quote (
    customer_id,
    type,
    chair_type,
    quantity,
    problem_description,
    budget_range,
    desired_date,
    needs_pickup,
    needs_delivery,
    postal_code,
    street,
    neighborhood,
    city,
    state,
    source
  ) values (
    new_customer_id,
    normalized_type,
    trim(payload->>'chair_type'),
    normalized_quantity,
    nullif(trim(coalesce(payload->>'description', '')), ''),
    nullif(trim(coalesce(payload->>'budget_range', '')), ''),
    normalized_desired_date,
    coalesce((payload->>'needs_pickup')::boolean, false),
    (payload->>'needs_delivery')::boolean,
    normalized_postal_code,
    nullif(trim(coalesce(payload->>'street', '')), ''),
    nullif(trim(coalesce(payload->>'neighborhood', '')), ''),
    trim(payload->>'city'),
    upper(trim(payload->>'state')),
    'website'
  )
  returning quote.id, quote.protocol into new_quote_id, new_protocol;

  with requested_services as (
    select distinct
      case lower(trim(selected.value))
        when 'tecido / revestimento' then 'estofamento-revestimento'
        when 'estofamento-revestimento' then 'estofamento-revestimento'
        when 'espuma' then 'espuma-conforto'
        when 'espuma-conforto' then 'espuma-conforto'
        when 'pistão' then 'pistoes-regulagens'
        when 'pistoes-regulagens' then 'pistoes-regulagens'
        when 'rodízios' then 'rodizios-bracos-bases'
        when 'braços' then 'rodizios-bracos-bases'
        when 'base' then 'rodizios-bracos-bases'
        when 'rodizios-bracos-bases' then 'rodizios-bracos-bases'
        when 'mecanismo' then 'mecanismos'
        when 'mecanismos' then 'mecanismos'
        when 'pintura' then 'pintura-acabamento'
        when 'pintura-acabamento' then 'pintura-acabamento'
        when 'estrutura' then 'estrutura-solda'
        when 'estrutura-solda' then 'estrutura-solda'
        when 'higienização' then 'higienizacao'
        when 'higienizacao' then 'higienizacao'
        when 'restauração completa' then 'restauracao-completa'
        when 'restauracao-completa' then 'restauracao-completa'
        else null
      end as slug
    from jsonb_array_elements_text(
      coalesce(payload->'services', '[]'::jsonb)
    ) selected(value)
  )
  insert into public.quote_services (quote_id, service_id)
  select new_quote_id, service.id
  from requested_services requested
  join public.services service
    on service.slug = requested.slug
   and service.active
  where requested.slug is not null
  on conflict do nothing;

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

  return query
  select new_quote_id, new_protocol, new_upload_token;
end;
$$;

revoke all on function public.submit_quote(jsonb, text) from public;
grant execute on function public.submit_quote(jsonb, text) to anon, authenticated;

create or replace function private.valid_quote_upload(object_name text)
returns boolean
language sql
volatile
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.quote_upload_tokens token
    where token.token::text = split_part(object_name, '/', 1)
      and token.expires_at > now()
      and token.used_count < token.max_files
      and object_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|heic|mp4|mov|pdf)$'
      and (
        select count(*)
        from storage.objects object
        where object.bucket_id = 'private-quotes'
          and (storage.foldername(object.name))[1] = token.token::text
      ) < token.max_files
  );
$$;

revoke all on function private.valid_quote_upload(text) from public;
grant execute on function private.valid_quote_upload(text) to anon, authenticated;

drop policy if exists quote_upload_insert on storage.objects;
create policy quote_upload_insert
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'private-quotes'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'heic', 'mp4', 'mov', 'pdf')
  and private.valid_quote_upload(name)
);

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
  token_created_at timestamptz;
  stored_mime_type text;
  stored_size_bytes bigint;
  stored_extension text;
  new_attachment_id uuid;
begin
  select token.quote_id, token.created_at
  into target_quote_id, token_created_at
  from private.quote_upload_tokens token
  where token.token = request_upload_token
    and token.expires_at > now()
    and token.used_count < token.max_files
  for update;

  if target_quote_id is null
    or request_storage_path is null
    or split_part(request_storage_path, '/', 1) <> request_upload_token::text
    or request_original_name is null
    or length(trim(request_original_name)) not between 1 and 255
    or request_mime_type is null
    or request_size_bytes is null
    or request_size_bytes <= 0 then
    return false;
  end if;

  select
    lower(coalesce(object.metadata->>'mimetype', '')),
    case
      when coalesce(object.metadata->>'size', '') ~ '^[0-9]+$'
        then (object.metadata->>'size')::bigint
      else null
    end,
    lower(storage.extension(object.name))
  into stored_mime_type, stored_size_bytes, stored_extension
  from storage.objects object
  where object.bucket_id = 'private-quotes'
    and object.name = request_storage_path
    and object.created_at >= token_created_at;

  if stored_mime_type is null
    or stored_size_bytes is null
    or stored_mime_type <> lower(request_mime_type)
    or stored_size_bytes <> request_size_bytes then
    return false;
  end if;

  if stored_mime_type = 'image/jpeg' then
    if stored_extension not in ('jpg', 'jpeg') or stored_size_bytes > 15728640 then
      return false;
    end if;
  elsif stored_mime_type = 'image/png' then
    if stored_extension <> 'png' or stored_size_bytes > 15728640 then
      return false;
    end if;
  elsif stored_mime_type = 'image/webp' then
    if stored_extension <> 'webp' or stored_size_bytes > 15728640 then
      return false;
    end if;
  elsif stored_mime_type = 'image/heic' then
    if stored_extension <> 'heic' or stored_size_bytes > 15728640 then
      return false;
    end if;
  elsif stored_mime_type = 'video/mp4' then
    if stored_extension <> 'mp4' or stored_size_bytes > 83886080 then
      return false;
    end if;
  elsif stored_mime_type = 'video/quicktime' then
    if stored_extension <> 'mov' or stored_size_bytes > 83886080 then
      return false;
    end if;
  elsif stored_mime_type = 'application/pdf' then
    if stored_extension <> 'pdf' or stored_size_bytes > 20971520 then
      return false;
    end if;
  else
    return false;
  end if;

  insert into public.quote_attachments (
    quote_id,
    storage_path,
    original_name,
    mime_type,
    size_bytes
  ) values (
    target_quote_id,
    request_storage_path,
    trim(request_original_name),
    stored_mime_type,
    stored_size_bytes
  )
  on conflict (storage_path) do nothing
  returning id into new_attachment_id;

  if new_attachment_id is null then
    return false;
  end if;

  update private.quote_upload_tokens
  set used_count = used_count + 1
  where token = request_upload_token
    and used_count < max_files;

  return true;
end;
$$;

revoke all on function public.register_quote_attachment(uuid, text, text, text, bigint) from public;
grant execute on function public.register_quote_attachment(uuid, text, text, text, bigint) to anon, authenticated;

create or replace function public.track_quote(
  public_protocol text,
  contact_value text,
  fingerprint text
)
returns table (
  protocol text,
  status public.quote_status,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  tracking_fingerprint alias for $3;
  normalized_contact_digits text;
  normalized_contact_email text;
begin
  if tracking_fingerprint is null
    or length(tracking_fingerprint) < 32
    or length(tracking_fingerprint) > 128
    or public_protocol is null
    or upper(trim(public_protocol)) !~ '^JM-[0-9]{6,}$'
    or contact_value is null
    or length(contact_value) > 254 then
    return;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('track_quote|' || tracking_fingerprint, 0)
  );

  if (
    select count(*)
    from private.rate_limit_attempts attempt
    where attempt.action = 'track_quote'
      and attempt.fingerprint = tracking_fingerprint
      and attempt.created_at > now() - interval '10 minutes'
  ) >= 10 then
    raise exception 'rate limit exceeded';
  end if;

  insert into private.rate_limit_attempts (fingerprint, action)
  values (tracking_fingerprint, 'track_quote');

  normalized_contact_digits := regexp_replace(contact_value, '\D', '', 'g');
  normalized_contact_email := lower(trim(contact_value));

  if length(normalized_contact_digits) not between 10 and 13
    and normalized_contact_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return;
  end if;

  return query
  select quote.protocol, quote.status, quote.updated_at
  from public.quotes quote
  join public.customers customer
    on customer.id = quote.customer_id
  where upper(quote.protocol) = upper(trim(public_protocol))
    and (
      customer.whatsapp = normalized_contact_digits
      or lower(customer.email) = normalized_contact_email
    )
  limit 1;
end;
$$;

revoke all on function public.track_quote(text, text, text) from public;
grant execute on function public.track_quote(text, text, text) to anon, authenticated;
