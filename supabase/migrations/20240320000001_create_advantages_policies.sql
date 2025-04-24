-- Enable RLS
alter table advantages enable row level security;

-- Policies for advantages table
create policy "Advantages are viewable by everyone"
  on advantages for select
  using ( true );

create policy "Only admins can create advantages"
  on advantages for insert
  with check (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

create policy "Only admins can update advantages"
  on advantages for update
  using (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

create policy "Only admins can delete advantages"
  on advantages for delete
  using (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

-- Storage policies for images bucket
create policy "Images are viewable by everyone"
  on storage.objects for select
  using ( bucket_id = 'images' );

create policy "Only admins can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' 
    and auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

create policy "Only admins can update images"
  on storage.objects for update
  using (
    bucket_id = 'images'
    and auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );

create policy "Only admins can delete images"
  on storage.objects for delete
  using (
    bucket_id = 'images'
    and auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );