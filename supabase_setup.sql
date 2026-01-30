-- ==========================================
-- CortexFile Admin Dashboard - Database Setup
-- Run this SQL in Supabase SQL Editor
-- ==========================================

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_name TEXT DEFAULT 'CortexFile',
    logo_url TEXT DEFAULT '',
    primary_color TEXT DEFAULT '#6366f1',
    accent_color TEXT DEFAULT '#d946ef',
    hero_title TEXT DEFAULT 'Execute Your Potential',
    hero_subtitle TEXT DEFAULT 'The world''s most advanced marketplace for high-performance EXE tools, System utilities, and developer assets.',
    hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    hero_button_text TEXT DEFAULT 'Explore Store',
    footer_text TEXT DEFAULT '© 2026 CortexFile Inc. All systems operational.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (site_name) VALUES ('CortexFile') ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read site_settings" ON site_settings
    FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update site_settings" ON site_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ==========================================

-- 2. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    content TEXT NOT NULL,
    avatar TEXT DEFAULT 'https://picsum.photos/100/100',
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read for visible testimonials
CREATE POLICY "Allow public read testimonials" ON testimonials
    FOR SELECT USING (is_visible = true);

-- Allow authenticated full access
CREATE POLICY "Allow authenticated all testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample testimonials
INSERT INTO testimonials (name, role, content, avatar) VALUES
    ('Sarah Jenkins', 'Full Stack Dev', 'CortexFile''s software library is unmatched. CodeFlow IDE changed how I work daily.', 'https://picsum.photos/100/100?random=10'),
    ('Marcus Chen', 'Cybersecurity Analyst', 'CyberGuard VPN is the only tool I trust for my sensitive client communications.', 'https://picsum.photos/100/100?random=11'),
    ('Elena Rodriguez', 'Digital Artist', 'PixelWeaver is incredibly fast. I replaced my subscription software with this one-time purchase.', 'https://picsum.photos/100/100?random=12')
ON CONFLICT DO NOTHING;

-- ==========================================

-- 3. FEATURES TABLE
CREATE TABLE IF NOT EXISTS features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'Globe',
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Allow public read for visible features
CREATE POLICY "Allow public read features" ON features
    FOR SELECT USING (is_visible = true);

-- Allow authenticated full access
CREATE POLICY "Allow authenticated all features" ON features
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample features
INSERT INTO features (title, description, icon, sort_order) VALUES
    ('Global CDN', 'Downloads served from 120+ edge locations for max speed.', 'Globe', 1),
    ('Auto-Updates', 'Software stays current with silent background patching.', 'Download', 2),
    ('Cloud Sync', 'Your settings and licenses sync across all your devices.', 'Monitor', 3)
ON CONFLICT DO NOTHING;

-- ==========================================

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Package',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read categories" ON categories
    FOR SELECT USING (is_visible = true);

-- Allow authenticated full access
CREATE POLICY "Allow authenticated all categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name, icon, sort_order) VALUES
    ('Utility', 'Wrench', 1),
    ('Security', 'Shield', 2),
    ('Design', 'Palette', 3),
    ('Gaming', 'Gamepad2', 4)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SUCCESS! All tables created.
-- ==========================================
