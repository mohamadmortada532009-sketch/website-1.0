create extension if not exists "uuid-ossp";

do $$ begin create type public.user_role as enum ('student', 'store_owner', 'admin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.store_status as enum ('pending', 'approved', 'suspended'); exception when duplicate_object then null; end $$;
do $$ begin create type public.inventory_condition as enum ('new', 'open_box', 'refurbished', 'used'); exception when duplicate_object then null; end $$;
do $$ begin create type public.request_status as enum ('submitted', 'reviewing', 'available', 'quoted', 'accepted', 'completed', 'cancelled'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  location text,
  phone text,
  website text,
  status public.store_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.store_research (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  region text,
  location text,
  phone text,
  website text,
  social text,
  notes text,
  source text not null default 'stores.csv',
  status text not null default 'research_only' check (status in ('research_only', 'contacted', 'claimed', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  university text,
  major text,
  study_path text,
  budget numeric,
  updated_at timestamptz not null default now()
);

create table if not exists public.laptops (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  brand text,
  description text,
  price numeric,
  currency text not null default 'USD',
  cpu text,
  ram_gb integer,
  storage_gb integer,
  gpu text,
  screen_size numeric,
  condition public.inventory_condition not null default 'new',
  stock_count integer not null default 0,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_laptops (
  user_id uuid not null references public.profiles(id) on delete cascade,
  laptop_id uuid not null references public.laptops(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, laptop_id)
);

create table if not exists public.laptop_requests (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  laptop_id uuid references public.laptops(id) on delete set null,
  requested_name text not null,
  university text,
  major text,
  study_path text,
  requirements jsonb not null default '{}'::jsonb,
  student_message text,
  status public.request_status not null default 'submitted',
  store_response text,
  quoted_price numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.laptop_requests(id) on delete cascade,
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.store_research enable row level security;
alter table public.student_profiles enable row level security;
alter table public.laptops enable row level security;
alter table public.saved_laptops enable row level security;
alter table public.laptop_requests enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Admins can manage research stores" on public.store_research;
create policy "Admins can manage research stores" on public.store_research for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Anyone can view approved stores" on public.stores;
create policy "Anyone can view approved stores" on public.stores for select using (status = 'approved');
drop policy if exists "Store owners can manage their store" on public.stores;
create policy "Store owners can manage their store" on public.stores for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "Students can manage their student profile" on public.student_profiles;
create policy "Students can manage their student profile" on public.student_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Anyone can view active approved laptops" on public.laptops;
create policy "Anyone can view active approved laptops" on public.laptops for select using (active = true and exists (select 1 from public.stores where stores.id = laptops.store_id and stores.status = 'approved'));
drop policy if exists "Store owners can manage their inventory" on public.laptops;
create policy "Store owners can manage their inventory" on public.laptops for all using (exists (select 1 from public.stores where stores.id = laptops.store_id and stores.owner_id = auth.uid())) with check (exists (select 1 from public.stores where stores.id = laptops.store_id and stores.owner_id = auth.uid()));

drop policy if exists "Students can manage saved laptops" on public.saved_laptops;
create policy "Students can manage saved laptops" on public.saved_laptops for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Students can view and create their requests" on public.laptop_requests;
create policy "Students can view and create their requests" on public.laptop_requests for select using (auth.uid() = student_id);
drop policy if exists "Students can create requests" on public.laptop_requests;
create policy "Students can create requests" on public.laptop_requests for insert with check (auth.uid() = student_id);
drop policy if exists "Store owners can view and update their requests" on public.laptop_requests;
create policy "Store owners can view and update their requests" on public.laptop_requests for select using (exists (select 1 from public.stores where stores.id = laptop_requests.store_id and stores.owner_id = auth.uid()));
drop policy if exists "Store owners can update their requests" on public.laptop_requests;
create policy "Store owners can update their requests" on public.laptop_requests for update using (exists (select 1 from public.stores where stores.id = laptop_requests.store_id and stores.owner_id = auth.uid()));

drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "Users can mark notifications read" on public.notifications;
create policy "Users can mark notifications read" on public.notifications for update using (auth.uid() = user_id);

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = public.current_user_role());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New user'), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
