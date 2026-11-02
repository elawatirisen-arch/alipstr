-- ALIP STORE — skema database Supabase
-- Jalankan ini di Supabase Dashboard > SQL Editor

create extension if not exists "pgcrypto";

-- Kategori game
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Produk / akun game
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null unique,       -- contoh: ML-0231 (ditampilkan ke pembeli)
  title text not null,
  description text default '',
  game text not null,                      -- nama kategori game
  price numeric not null default 0,
  promo_price numeric,
  promo_active boolean not null default false,
  stock int not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Foto produk (bisa banyak per produk)
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Pengaturan toko (satu baris saja, id tetap 1)
create table if not exists store_settings (
  id int primary key default 1,
  store_name text not null default 'ALIP STORE',
  logo_url text,
  banner_url text,
  wa_number_1 text not null default '6285840840520',
  wa_number_2 text not null default '6285764594213',
  updated_at timestamptz not null default now()
);
insert into store_settings (id) values (1) on conflict (id) do nothing;

-- Riwayat perubahan (diisi oleh admin site)
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

-- Trigger: auto-update updated_at pada products
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
before update on products
for each row execute function set_updated_at();

-- ======= ROW LEVEL SECURITY =======
-- Publik (pengunjung) hanya boleh membaca. Semua tulis (insert/update/delete)
-- hanya untuk user yang sudah login (admin), lewat Supabase Auth.

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table store_settings enable row level security;
alter table activity_log enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read product_images" on product_images for select using (true);
create policy "public read store_settings" on store_settings for select using (true);

create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write product_images" on product_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write store_settings" on store_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write activity_log" on activity_log for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ======= STORAGE (foto produk) =======
-- Buat bucket "product-images" lewat Supabase Dashboard > Storage, set jadi Public.
-- Lalu jalankan policy ini supaya hanya admin yang login boleh upload/hapus:
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read product-images bucket"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin write product-images bucket"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin update product-images bucket"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin delete product-images bucket"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Data contoh (boleh dihapus nanti dari admin)
insert into categories (name, sort_order) values
  ('Mobile Legends', 1), ('Free Fire', 2), ('Genshin Impact', 3), ('Valorant', 4), ('PUBG Mobile', 5)
on conflict (name) do nothing;
