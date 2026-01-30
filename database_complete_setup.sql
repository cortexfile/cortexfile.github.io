-- ╔══════════════════════════════════════════════════════════════════════════════╗
-- ║                    CortexFile - Database Complete Setup                       ║
-- ║                          إعداد قاعدة البيانات الكامل                          ║
-- ╚══════════════════════════════════════════════════════════════════════════════╝
--
-- الإصدار: 1.0
-- التاريخ: 2026-01-30
-- الوصف: ملف شامل لإعداد قاعدة بيانات CortexFile
--
-- ⚠️ تعليمات الاستخدام:
-- 1. افتح Supabase SQL Editor
-- 2. انسخ هذا الملف بالكامل
-- 3. اضغط Run
-- 4. تأكد من عدم وجود أخطاء
--
-- ═══════════════════════════════════════════════════════════════════════════════



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 1: جدول المنتجات (Products)                                          │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 1.1 إنشاء جدول المنتجات (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    category TEXT DEFAULT 'Utility',
    description TEXT,
    shortDescription TEXT,
    rating DECIMAL(2,1) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    image TEXT DEFAULT 'https://picsum.photos/400/400',
    version TEXT DEFAULT '1.0.0',
    downloadSize TEXT DEFAULT '100 MB',
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 سياسات الأمان للمنتجات
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" ON products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert products" ON products;
CREATE POLICY "Allow authenticated insert products" ON products
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update products" ON products;
CREATE POLICY "Allow authenticated update products" ON products
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete products" ON products;
CREATE POLICY "Allow authenticated delete products" ON products
    FOR DELETE TO authenticated USING (true);



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 2: إعدادات الموقع (Site Settings)                                     │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 2.1 إنشاء جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_name TEXT DEFAULT 'CortexFile',
    logo_url TEXT DEFAULT '',
    primary_color TEXT DEFAULT '#6366f1',
    accent_color TEXT DEFAULT '#d946ef',
    hero_title TEXT DEFAULT 'Execute Your Potential',
    hero_subtitle TEXT DEFAULT 'The world''s most advanced marketplace for high-performance EXE tools.',
    hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    hero_button_text TEXT DEFAULT 'Explore Store',
    footer_text TEXT DEFAULT '© 2026 CortexFile Inc. All rights reserved.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 إدراج الإعدادات الافتراضية
INSERT INTO site_settings (site_name) 
SELECT 'CortexFile' 
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 2.3 سياسات الأمان للإعدادات
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read site_settings" ON site_settings;
CREATE POLICY "Allow public read site_settings" ON site_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated update site_settings" ON site_settings;
CREATE POLICY "Allow authenticated update site_settings" ON site_settings
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert site_settings" ON site_settings;
CREATE POLICY "Allow authenticated insert site_settings" ON site_settings
    FOR INSERT TO authenticated WITH CHECK (true);



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 3: التقييمات (Testimonials)                                          │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 3.1 إنشاء جدول التقييمات
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

-- 3.2 سياسات الأمان للتقييمات
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read testimonials" ON testimonials;
CREATE POLICY "Allow public read testimonials" ON testimonials
    FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Allow authenticated all testimonials" ON testimonials;
CREATE POLICY "Allow authenticated all testimonials" ON testimonials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3.3 تقييمات افتراضية
INSERT INTO testimonials (name, role, content, avatar) 
SELECT 'Sarah Jenkins', 'Full Stack Developer', 
       'CortexFile software library is unmatched. Changed how I work daily.', 
       'https://picsum.photos/100/100?random=10'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Sarah Jenkins');

INSERT INTO testimonials (name, role, content, avatar) 
SELECT 'Marcus Chen', 'Cybersecurity Analyst', 
       'The security tools here are enterprise-grade. Highly recommended.', 
       'https://picsum.photos/100/100?random=11'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Marcus Chen');



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 4: المميزات (Features)                                               │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 4.1 إنشاء جدول المميزات
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

-- 4.2 سياسات الأمان للمميزات
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read features" ON features;
CREATE POLICY "Allow public read features" ON features
    FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Allow authenticated all features" ON features;
CREATE POLICY "Allow authenticated all features" ON features
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4.3 مميزات افتراضية
INSERT INTO features (title, description, icon, sort_order) 
SELECT 'Global CDN', 'Downloads served from 120+ edge locations.', 'Globe', 1
WHERE NOT EXISTS (SELECT 1 FROM features WHERE title = 'Global CDN');

INSERT INTO features (title, description, icon, sort_order) 
SELECT 'Auto-Updates', 'Software stays current automatically.', 'Download', 2
WHERE NOT EXISTS (SELECT 1 FROM features WHERE title = 'Auto-Updates');

INSERT INTO features (title, description, icon, sort_order) 
SELECT 'Cloud Sync', 'Settings sync across all devices.', 'Monitor', 3
WHERE NOT EXISTS (SELECT 1 FROM features WHERE title = 'Cloud Sync');



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 5: الفئات (Categories)                                               │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 5.1 إنشاء جدول الفئات
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Package',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 سياسات الأمان للفئات
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories
    FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Allow authenticated all categories" ON categories;
CREATE POLICY "Allow authenticated all categories" ON categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5.3 فئات افتراضية
INSERT INTO categories (name, icon, sort_order) VALUES
    ('Utility', 'Wrench', 1),
    ('Security', 'Shield', 2),
    ('Design', 'Palette', 3),
    ('Gaming', 'Gamepad2', 4)
ON CONFLICT (name) DO NOTHING;



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 6: سياسات التخزين (Storage Policies)                                 │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 6.1 التأكد من أن bucket عام
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-files';

-- 6.2 سياسات رفع الملفات
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-files');

-- 6.3 سياسات تحديث الملفات
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-files');

-- 6.4 سياسات حذف الملفات
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-files');

-- 6.5 سياسات قراءة الملفات (عامة)
DROP POLICY IF EXISTS "Allow public read storage" ON storage.objects;
CREATE POLICY "Allow public read storage" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-files');



-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ القسم 7: دوال مساعدة (Helper Functions)                                    │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 7.1 دالة تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7.2 تطبيق الدالة على الجداول
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- ═══════════════════════════════════════════════════════════════════════════════
-- ✅ تم الإعداد بنجاح!
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- الجداول المنشأة:
-- ✓ products      - المنتجات
-- ✓ site_settings - إعدادات الموقع
-- ✓ testimonials  - التقييمات
-- ✓ features      - المميزات
-- ✓ categories    - الفئات
--
-- ═══════════════════════════════════════════════════════════════════════════════
