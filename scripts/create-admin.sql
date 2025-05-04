-- Vérifier si l'utilisateur existe déjà
DO $$
DECLARE
  user_id uuid;
  user_exists boolean;
BEGIN
  -- Vérifier si l'utilisateur existe
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@clubcreole.com'
  ) INTO user_exists;

  IF NOT user_exists THEN
    -- Créer un nouvel utilisateur dans auth.users
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      gen_random_uuid(), -- Génère un UUID unique
      'admin@clubcreole.com', -- Email de l'administrateur
      crypt('Admin123!', gen_salt('bf')), -- Mot de passe crypté
      now(), -- Email confirmé immédiatement
      now(), -- Date de création
      now(), -- Date de mise à jour
      '{"provider":"email","providers":["email"]}', -- Métadonnées de l'application
      '{}', -- Métadonnées utilisateur
      false, -- Pas un super admin
      'authenticated' -- Rôle de base
    );
  END IF;

  -- Récupérer l'ID de l'utilisateur
  SELECT id INTO user_id FROM auth.users WHERE email = 'admin@clubcreole.com';
  
  -- Vérifier si le profil existe
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
    -- Créer le profil administrateur
    INSERT INTO public.profiles (
      id,
      role,
      first_name,
      last_name,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      'admin',
      'Admin',
      'Club Créole',
      now(),
      now()
    );
  ELSE
    -- Mettre à jour le profil existant
    UPDATE public.profiles
    SET 
      role = 'admin',
      first_name = 'Admin',
      last_name = 'Club Créole',
      updated_at = now()
    WHERE id = user_id;
  END IF;
END $$; 