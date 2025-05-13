-- Insert fake restaurant owners
-- First, create the users if they don't exist
insert into auth.users (id, email, encrypted_password, email_confirmed_at, role)
select 
  id::uuid,
  email,
  crypt('password123', gen_salt('bf')),
  now(),
  'authenticated'
from (
  values
    ('11111111-1111-1111-1111-111111111111'::text, 'resto1@creole.com'),
    ('22222222-2222-2222-2222-222222222222'::text, 'resto2@creole.com'),
    ('33333333-3333-3333-3333-333333333333'::text, 'resto3@creole.com'),
    ('44444444-4444-4444-4444-444444444444'::text, 'resto4@creole.com'),
    ('55555555-5555-5555-5555-555555555555'::text, 'resto5@creole.com')
) as new_users(id, email)
where not exists (
  select 1 from auth.users where id = new_users.id::uuid
);

-- Then, create their profiles if they don't exist
insert into profiles (id, role, first_name, last_name, company_name)
select 
  id::uuid,
  'partner',
  first_name,
  last_name,
  company_name
from (
  values
    ('11111111-1111-1111-1111-111111111111'::text, 'Jean', 'Martin', 'Le Bistrot Créole'),
    ('22222222-2222-2222-2222-222222222222'::text, 'Marie', 'Dubois', 'La Table des Îles'),
    ('33333333-3333-3333-3333-333333333333'::text, 'Pierre', 'Bernard', 'Le Petit Restaurant'),
    ('44444444-4444-4444-4444-444444444444'::text, 'Sophie', 'Petit', 'Le Gourmet Antillais'),
    ('55555555-5555-5555-5555-555555555555'::text, 'Lucas', 'Robert', 'La Cuisine du Sud')
) as new_profiles(id, first_name, last_name, company_name)
where not exists (
  select 1 from profiles where id = new_profiles.id::uuid
);

-- Finally, link them to restaurants if not already linked
insert into restaurant_owners (user_id, restaurant_id)
select 
  case 
    when id = 1 then '11111111-1111-1111-1111-111111111111'::uuid
    when id = 2 then '22222222-2222-2222-2222-222222222222'::uuid
    when id = 3 then '33333333-3333-3333-3333-333333333333'::uuid
    when id = 4 then '44444444-4444-4444-4444-444444444444'::uuid
    when id = 5 then '55555555-5555-5555-5555-555555555555'::uuid
  end,
  id
from restaurants r
where id <= 5
and not exists (
  select 1 from restaurant_owners ro 
  where ro.restaurant_id = r.id
); 