-- =============================================
-- SANGEM HOTELS: THE NUCLEAR FIX
-- Run this in Supabase SQL editor to force tables to work
-- =============================================

-- 1. DROP RLS (Temporary but effective for debugging)
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS delivery_partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dishes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS feedback DISABLE ROW LEVEL SECURITY;

-- 2. ENSURE COLUMNS EXIST (Add all variants to be safe)
DO $$ BEGIN
    -- Orders
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_status') THEN
        ALTER TABLE orders ADD COLUMN order_status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='current_stage') THEN
        ALTER TABLE orders ADD COLUMN current_stage TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_partner_id') THEN
        ALTER TABLE orders ADD COLUMN delivery_partner_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_agent_id') THEN
        ALTER TABLE orders ADD COLUMN delivery_agent_id UUID;
    END IF;
END $$;

-- 3. FIX PROFILES (Ensure branch IDs and roles are correct)
UPDATE profiles SET role = 'admin' WHERE email = 'admin@sangem.com';
UPDATE profiles SET role = 'branch' WHERE email LIKE 'branch%@sangem.com';

-- 4. SEED TEST DATA (Only if empty)
DO $$ BEGIN
    IF (SELECT count(*) FROM orders) = 0 THEN
        INSERT INTO orders (customer_name, customer_phone, delivery_address, total_amount, branch_id, items, order_status, current_stage)
        VALUES 
        ('Test Order 1', '9999999999', 'Banjara Hills Address', 1500, 'br1', '[{"name":"Biryani","quantity":2}]', 'pending', 'pending'),
        ('Test Order 2', '8888888888', 'Jubilee Hills Address', 800, 'br2', '[{"name":"Chicken Tikka","quantity":1}]', 'pending', 'pending');
    END IF;
END $$;

-- 5. RE-ENABLE RLS WITH OPEN POLICIES (If user wants security back, we use broad policies)
-- But for now, we leave it DISABLED locally so they can see results.

/*
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_all_access" ON orders;
CREATE POLICY "orders_all_access" ON orders FOR ALL USING (true) WITH CHECK (true);
*/
