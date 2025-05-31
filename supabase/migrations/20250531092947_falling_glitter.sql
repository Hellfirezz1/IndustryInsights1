/*
  # Create users table with RLS policies

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.uid()
      - `email` (text)
      - `email_verified` (boolean)
      - `subscription_status` (text)
      - `trial_start_date` (timestamptz)
      - `niches` (text[])

  2. Security
    - Enable RLS on `users` table
    - Add policies for:
      - INSERT: Allow new users to create their profile
      - SELECT: Allow users to read their own profile
      - UPDATE: Allow users to update their own profile
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  email_verified boolean DEFAULT false,
  subscription_status text DEFAULT 'pending',
  trial_start_date timestamptz,
  niches text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for inserting new user profiles
CREATE POLICY "Users can create their own profile"
  ON public.users
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (auth.uid() = id);

-- Policy for reading user profiles
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for updating user profiles
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);