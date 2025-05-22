-- Create a table for restaurant owners
create table if not exists restaurant_owners (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  restaurant_id integer references restaurants on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, restaurant_id)
);

-- Enable RLS
alter table restaurant_owners enable row level security;

-- Create policies
create policy "Restaurant owners can view their own data"
  on restaurant_owners for select
  using ( auth.uid() = user_id );

create policy "Admins can view all restaurant owners"
  on restaurant_owners for select
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can insert restaurant owners"
  on restaurant_owners for insert
  with check ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update restaurant owners"
  on restaurant_owners for update
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete restaurant owners"
  on restaurant_owners for delete
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create a trigger to set updated_at on update
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_restaurant_owners_updated
  before update on restaurant_owners
  for each row
  execute procedure handle_updated_at(); 