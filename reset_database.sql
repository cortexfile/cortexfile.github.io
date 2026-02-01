-- ========================================
-- Reset CortexFile Database
-- Run this in Supabase SQL Editor
-- ========================================

-- Clear all data from tables (keeps table structure)
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE wishlist CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE testimonials CASCADE;
TRUNCATE TABLE features CASCADE;
TRUNCATE TABLE contact_messages CASCADE;
TRUNCATE TABLE blog_posts CASCADE;

-- Reset any sequences if needed
-- (UUIDs don't need reset)

-- Confirm reset
SELECT 'Database reset complete!' as status;
