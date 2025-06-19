
-- Fleet Management Database Schema

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  address TEXT,
  phone VARCHAR,
  email VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  address TEXT,
  phone VARCHAR,
  email VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User groups table for roles and permissions
CREATE TABLE IF NOT EXISTS user_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  color VARCHAR DEFAULT '#3b82f6'
);

-- Drop any existing foreign key constraints and dependent views
DROP VIEW IF EXISTS user_permissions_view CASCADE;
DROP INDEX IF EXISTS idx_users_group_id CASCADE;

-- Recreate users table with only role_id (no role or group_id columns)
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  phone VARCHAR NOT NULL,
  role_id INTEGER DEFAULT 3 REFERENCES user_groups(id),
  status VARCHAR NOT NULL DEFAULT 'Active',
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_image TEXT,
  total_trips INTEGER DEFAULT 0,
  last_trip VARCHAR,
  badge_number VARCHAR,
  date_of_birth DATE,
  place_of_birth VARCHAR,
  address TEXT,
  driver_license VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Vans table
CREATE TABLE IF NOT EXISTS vans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code VARCHAR NOT NULL UNIQUE,
  model VARCHAR NOT NULL,
  license_plate VARCHAR,
  driver_id UUID,
  status VARCHAR DEFAULT 'Active',
  insurer VARCHAR,
  insurance_date DATE,
  control_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  van UUID REFERENCES vans(id) NOT NULL,
  driver VARCHAR NOT NULL,
  company UUID REFERENCES companies(id) NOT NULL,
  branch UUID REFERENCES branches(id) NOT NULL,
  start_km INTEGER,
  end_km INTEGER,
  status VARCHAR DEFAULT 'active',
  planned_start_date TIMESTAMP WITH TIME ZONE,
  planned_end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  user_ids TEXT[] DEFAULT '{}',
  user_roles JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for authenticated users
CREATE POLICY "Users can view companies" ON companies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage companies" ON companies FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view branches" ON branches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage branches" ON branches FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view user_groups" ON user_groups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage user_groups" ON user_groups FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage users" ON users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view vans" ON vans FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage vans" ON vans FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view trips" ON trips FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage trips" ON trips FOR ALL USING (auth.role() = 'authenticated');

-- Insert default user groups
INSERT INTO user_groups (id, name, description, permissions, color) VALUES
  (1, 'Administrator', 'Accès complet au système', 
   ARRAY['users:read', 'users:create', 'users:update', 'users:delete', 'vans:read', 'vans:create', 'vans:update', 'vans:delete', 'trips:read', 'trips:create', 'trips:update', 'trips:delete', 'companies:read', 'companies:create', 'companies:update', 'companies:delete', 'groups:read', 'groups:manage', 'dashboard:read', 'settings:read', 'settings:update'], 
   '#dc2626'),
  (2, 'Supervisor', 'Accès superviseur', 
   ARRAY['users:read', 'users:update', 'vans:read', 'vans:update', 'trips:read', 'trips:create', 'trips:update', 'companies:read', 'groups:read', 'dashboard:read'], 
   '#ea580c'),
  (3, 'Employee', 'Accès employé standard', 
   ARRAY['dashboard:read', 'trips:read', 'trips:create', 'companies:read', 'vans:read'], 
   '#3b82f6')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions,
  color = EXCLUDED.color;

-- Function to get current user with RBAC info
CREATE OR REPLACE FUNCTION get_current_user_rbac()
RETURNS TABLE (
  id INTEGER,
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  role_id INTEGER,
  status VARCHAR,
  auth_user_id UUID,
  profile_image TEXT,
  total_trips INTEGER,
  last_trip VARCHAR,
  badge_number VARCHAR,
  date_of_birth DATE,
  place_of_birth VARCHAR,
  address TEXT,
  driver_license VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.email, u.phone, u.role_id, u.status, u.auth_user_id, u.profile_image, u.total_trips, u.last_trip, u.badge_number, u.date_of_birth, u.place_of_birth, u.address, u.driver_license, u.created_at
  FROM users u
  WHERE u.auth_user_id = auth.uid();
END;
$$;
