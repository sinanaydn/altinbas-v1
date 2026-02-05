-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id uuid default uuid_generate_v4() primary key,
  original_name text not null,
  category text,
  material text,
  gemstone text,
  image_url text not null, -- URL to the "cutout" or original uploaded image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Generated Images Table
create table generations (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  prompt text not null,
  image_url text not null, -- URL to the generated result
  aspect_ratio text,
  status text default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: RLS Policies (Row Level Security)
-- Allow public read access (for MVP demo)
alter table products enable row level security;
alter table generations enable row level security;

create policy "Allow public read access"
  on products for select
  using ( true );

create policy "Allow public read access"
  on generations for select
  using ( true );

-- Allow anon insert (for MVP demo - requires anon key to have insert capability)
create policy "Allow anon insert"
  on products for insert
  with check ( true );

create policy "Allow anon insert"
  on generations for insert
  with check ( true );
