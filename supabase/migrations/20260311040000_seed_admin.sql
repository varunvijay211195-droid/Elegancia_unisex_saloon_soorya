-- Insert into auth.users (simulate sign-up without email sending)
-- We'll use a specific UUID for this admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at
) VALUES (
  'a5e57ff7-7855-4f72-8d76-5311d3ee7a2a',
  '00000000-0000-0000-0000-000000000000',
  'admin@eleganciasalon.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator", "role": "admin"}',
  'authenticated',
  'authenticated',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert into public.profiles
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  avatar_url,
  loyalty_points,
  total_spent,
  created_at,
  updated_at
) VALUES (
  'a5e57ff7-7855-4f72-8d76-5311d3ee7a2a',
  'System Administrator',
  'admin@eleganciasalon.com',
  null,
  0,
  0,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;
