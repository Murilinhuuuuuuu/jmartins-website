create or replace function public.admin_update_quote_status(
  request_quote_id uuid,
  request_status public.quote_status
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  previous_status public.quote_status;
begin
  if not private.has_permission('quotes.manage') then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  select q.status
  into previous_status
  from public.quotes q
  where q.id = request_quote_id
  for update;

  if not found then
    raise exception 'quote not found' using errcode = 'P0002';
  end if;

  if previous_status = request_status then
    return true;
  end if;

  update public.quotes
  set
    status = request_status,
    closed_at = case
      when request_status in ('completed', 'lost', 'cancelled') then now()
      else null
    end
  where id = request_quote_id;

  insert into public.quote_status_history (
    quote_id,
    from_status,
    to_status,
    changed_by
  ) values (
    request_quote_id,
    previous_status,
    request_status,
    (select auth.uid())
  );

  return true;
end;
$$;

revoke all on function public.admin_update_quote_status(uuid, public.quote_status) from public;
grant execute on function public.admin_update_quote_status(uuid, public.quote_status) to authenticated;
