-- Fix security issue: Restrict profile visibility and prevent email exposure

-- 1. Drop the existing public policy that allows everyone to view profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. Create a new policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- 3. Update the handle_new_user function to never store email addresses in display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, handle)
  VALUES (
    NEW.id, 
    -- Only use name/full_name from metadata, never fall back to email
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
      NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
      'User'  -- Default to 'User' instead of email
    ),
    -- Generate handle from name or create a random one, never use email
    LOWER(REPLACE(
      COALESCE(
        NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
        NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
        'user_' || substr(NEW.id::text, 1, 8)  -- Generate from user ID
      ), 
      ' ', '_'
    ))
  );
  RETURN NEW;
END;
$$;

-- 4. Update any existing profiles that might have email addresses in display_name
-- This is a safety measure to clean up any existing data
UPDATE public.profiles 
SET display_name = 'User'
WHERE display_name LIKE '%@%';

-- 5. Create a trigger to ensure the updated function is used
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();