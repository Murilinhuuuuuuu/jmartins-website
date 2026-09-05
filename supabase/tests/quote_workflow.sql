begin;

do $$
declare
  test_whatsapp text := '55119' || lpad((txid_current() % 100000000)::text, 8, '0');
  test_payload jsonb;
  first_quote record;
  second_quote record;
  selected_service_count integer;
  tracked_count integer;
begin
  if has_table_privilege('anon', 'public.customers', 'INSERT') then
    raise exception 'anon must not insert customers directly';
  end if;

  if not has_function_privilege('anon', 'public.submit_quote(jsonb,text)', 'EXECUTE')
    or not has_function_privilege('anon', 'public.track_quote(text,text,text)', 'EXECUTE')
    or not has_function_privilege(
      'anon',
      'public.register_quote_attachment(uuid,text,text,text,bigint)',
      'EXECUTE'
    ) then
    raise exception 'public quote RPC grants are incomplete';
  end if;

  test_payload := jsonb_build_object(
    'type', 'repair',
    'name', 'Cliente de Teste',
    'whatsapp', test_whatsapp,
    'email', '',
    'postal_code', '01211100',
    'street', 'Av. São João',
    'neighborhood', 'Santa Cecília',
    'city', 'São Paulo',
    'state', 'SP',
    'quantity', 1,
    'chair_type', 'Cadeira',
    'description', 'Troca completa do revestimento.',
    'services', jsonb_build_array(
      'Espuma',
      'Rodízios',
      'Braços',
      'Higienização',
      'Não sei / quero uma avaliação'
    ),
    'desired_date', '',
    'needs_pickup', true,
    'needs_delivery', true,
    'customer_type', 'individual',
    'company_name', '',
    'cnpj', '',
    'budget_range', ''
  );

  select *
  into first_quote
  from public.submit_quote(
    test_payload,
    lpad(txid_current()::text, 64, 'a')
  );

  select *
  into second_quote
  from public.submit_quote(
    test_payload || jsonb_build_object(
      'name', 'Cliente Atualizado',
      'email', 'cliente@example.com'
    ),
    lpad(txid_current()::text, 64, 'b')
  );

  if first_quote.quote_id = second_quote.quote_id then
    raise exception 'each submission must create a distinct quote';
  end if;

  if (
    select count(distinct quote.customer_id)
    from public.quotes quote
    where quote.id in (first_quote.quote_id, second_quote.quote_id)
  ) <> 1 then
    raise exception 'submissions with the same WhatsApp must reuse the customer';
  end if;

  select count(*)
  into selected_service_count
  from public.quote_services selected
  where selected.quote_id = first_quote.quote_id;

  if selected_service_count <> 3 then
    raise exception 'expected three distinct mapped services, found %', selected_service_count;
  end if;

  select count(*)
  into tracked_count
  from public.track_quote(
    first_quote.protocol,
    format(
      '+%s (%s) %s-%s',
      substr(test_whatsapp, 1, 2),
      substr(test_whatsapp, 3, 2),
      substr(test_whatsapp, 5, 5),
      substr(test_whatsapp, 10, 4)
    ),
    lpad(txid_current()::text, 64, 'c')
  );

  if tracked_count <> 1 then
    raise exception 'formatted WhatsApp must find the quote';
  end if;

  begin
    perform *
    from public.submit_quote(
      test_payload || jsonb_build_object('desired_date', '2026-02-30'),
      lpad(txid_current()::text, 64, 'd')
    );
    raise exception 'expected invalid date rejection';
  exception
    when others then
      if sqlerrm <> 'invalid request' then
        raise;
      end if;
  end;
end
$$;

rollback;
