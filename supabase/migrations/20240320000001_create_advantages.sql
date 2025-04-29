-- Create a table for advantages
create table advantages (
  id uuid default uuid_generate_v4() primary key,
  icon_name text not null,
  title text not null,
  description text not null,
  badge text,
  image_url text not null,
  is_event boolean default false,
  event_date timestamp with time zone,
  discount text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a trigger to set updated_at on update
create trigger on_advantages_updated
  before update on advantages
  for each row
  execute procedure handle_updated_at(); 