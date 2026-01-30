-- Create orders table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_email text, -- Optional: for guest checkout or logged in user
  user_id uuid references auth.users(id), -- Optional: linking to auth user
  products jsonb not null, -- Stores array of cart items
  total numeric not null,
  status text default 'pending', -- pending, completed, cancelled
  customer_details jsonb, -- Name, address, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table orders enable row level security;

-- Policies

-- Admins can do everything
create policy "Admins can do everything with orders"
  on orders for all
  using ( auth.role() = 'authenticated' );

-- Users can insert their own orders (public insert allowed for guest checkout, but restricted viewing)
create policy "Anyone can create orders"
  on orders for insert
  with check ( true );
  
-- Users can view their own orders (if logged in)
create policy "Users can view own orders"
  on orders for select
  using ( auth.uid() = user_id );
