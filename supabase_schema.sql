-- Monohall Supabase Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (Password is 'Reab@112' hashed with bcrypt)
-- You may want to generate a new hash or use Supabase Auth instead.
INSERT INTO users (username, password, role)
VALUES ('reabillaw', '$2b$10$wE1V..y6xLq0QoQ2NkV8/.QjYm.x0vGz7o/E0zMhFv6GfT0V5B.', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES ('hero_layout', 'TOP-R') ON CONFLICT DO NOTHING;
INSERT INTO settings (key, value) VALUES ('brand_size', '90') ON CONFLICT DO NOTHING;
INSERT INTO settings (key, value) VALUES ('brand_spacing', '24') ON CONFLICT DO NOTHING;

-- 4. Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    artist TEXT NOT NULL,
    subtitle TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    price TEXT,
    status TEXT,
    ticket_url TEXT,
    image_url TEXT,
    brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Event Gallery Table
CREATE TABLE IF NOT EXISTS event_gallery (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('monohall', 'monohall', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage Policies
-- Drop existing policies if they exist so we can recreate them
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anon Upload" ON storage.objects;
DROP POLICY IF EXISTS "Anon Update" ON storage.objects;
DROP POLICY IF EXISTS "Anon Delete" ON storage.objects;

-- Allow public read access to the monohall bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'monohall');

-- Allow uploads (since the app uses anon key)
CREATE POLICY "Anon Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'monohall');
CREATE POLICY "Anon Update" ON storage.objects FOR UPDATE USING (bucket_id = 'monohall');
CREATE POLICY "Anon Delete" ON storage.objects FOR DELETE USING (bucket_id = 'monohall');
