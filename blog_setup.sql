-- Create posts table
create table if not exists posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table posts enable row level security;

-- Policies
create policy "Public posts are viewable by everyone"
  on posts for select
  using ( published = true );

create policy "Admins can do everything with posts"
  on posts for all
  using ( auth.role() = 'authenticated' );

-- Storage bucket for blog images (if not exists)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Public Access to Blog Images"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

create policy "Admins can upload blog images"
  on storage.objects for insert
  with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );
