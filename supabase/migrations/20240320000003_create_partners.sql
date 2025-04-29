-- Create a table for partners
create table partners (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  commercial_name text not null,
  city text not null,
  address text not null,
  phone text not null,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table partners enable row level security;

-- Create policies
create policy "Partners can view their own data"
  on partners for select
  using ( auth.uid() = user_id );

create policy "Partners can update their own data"
  on partners for update
  using ( auth.uid() = user_id );

create policy "Admins can view all partners"
  on partners for select
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update all partners"
  on partners for update
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create a trigger to set updated_at on update
create trigger on_partners_updated
  before update on partners
  for each row
  execute procedure handle_updated_at(); 