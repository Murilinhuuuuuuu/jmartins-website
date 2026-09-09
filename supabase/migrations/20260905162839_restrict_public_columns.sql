begin;

-- Public row policies must not give signed-in, non-admin users access to the
-- full base rows. Authenticated administrators continue to use the existing
-- *_admin_all policies, guarded by private.has_permission('admin.access').
drop policy if exists companies_public_read on public.companies;
create policy companies_public_read
  on public.companies
  for select
  to anon
  using (true);

drop policy if exists products_public_read on public.products;
create policy products_public_read
  on public.products
  for select
  to anon
  using (published and archived_at is null);

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read
  on public.projects
  for select
  to anon
  using (published);

drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read
  on public.testimonials
  for select
  to anon
  using (published);

-- RLS filters rows, not columns. Remove the table-wide grants and expose only
-- the fields that the public catalogue may legitimately read.
revoke select on table public.companies from anon;
grant select (
  id, trade_name, legal_name, cnpj, founded_year, description, slogan,
  phone, whatsapp, public_email, street, number, neighborhood, city, state,
  postal_code, country, instagram_url, google_business_url, maps_place_id
) on table public.companies to anon;

revoke select on table public.products from anon;
grant select (
  id, name, slug, sku, category_id, condition, description,
  short_description, material, color, dimensions, weight_capacity,
  available, made_to_order, featured, published, sort_order, is_illustrative
) on table public.products to anon;

revoke select on table public.projects from anon;
grant select (
  id, title, slug, category_id, description, featured, published
) on table public.projects to anon;

revoke select on table public.testimonials from anon;
grant select (
  id, source, rating, comment, source_url, sort_order, published
) on table public.testimonials to anon;

-- This address was never supplied or approved as a public contact channel.
update public.companies
set public_email = null,
    updated_at = now()
where public_email = 'jmartins.expressao@gmail.com';

commit;
