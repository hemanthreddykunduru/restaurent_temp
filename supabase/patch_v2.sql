-- =============================================
-- SANGEM HOTELS: PATCH v2 — Run this in Supabase SQL editor
-- Fixes orders/delivery_partners RLS + adds delivery staff role
-- =============================================

-- 1. FIX ORDERS: Add UPDATE policy (was missing — caused "not showing" in dashboards)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_update'
  ) THEN
    CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_delete'
  ) THEN
    CREATE POLICY "orders_delete" ON orders FOR DELETE USING (true);
  END IF;
END $$;

-- 2. FIX DELIVERY PARTNERS: Enable RLS + policies
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='delivery_partners' AND policyname='dp_select') THEN
    CREATE POLICY "dp_select" ON delivery_partners FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='delivery_partners' AND policyname='dp_insert') THEN
    CREATE POLICY "dp_insert" ON delivery_partners FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='delivery_partners' AND policyname='dp_update') THEN
    CREATE POLICY "dp_update" ON delivery_partners FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='delivery_partners' AND policyname='dp_delete') THEN
    CREATE POLICY "dp_delete" ON delivery_partners FOR DELETE USING (true);
  END IF;
END $$;

-- 3. FIX DISHES: Add missing policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dishes' AND policyname='dishes_insert') THEN
    CREATE POLICY "dishes_insert" ON dishes FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dishes' AND policyname='dishes_update') THEN
    CREATE POLICY "dishes_update" ON dishes FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dishes' AND policyname='dishes_delete') THEN
    CREATE POLICY "dishes_delete" ON dishes FOR DELETE USING (true);
  END IF;
END $$;

-- 4. FIX PROFILES: Enable RLS + all policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_select') THEN
    CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_insert') THEN
    CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_update') THEN
    CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_delete') THEN
    CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (true);
  END IF;
END $$;

-- 5. FIX FEEDBACK: Add missing policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='feedback' AND policyname='feedback_update') THEN
    CREATE POLICY "feedback_update" ON feedback FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6. ADD profile_id column to delivery_partners (links delivery staff login to a partner)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='delivery_partners' AND column_name='profile_id'
  ) THEN
    ALTER TABLE delivery_partners ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 7. ADD delivery_partner_id to orders (if not already there)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='orders' AND column_name='delivery_partner_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_partner_id UUID;
  END IF;
END $$;

-- 8. Ensure branch profiles exist for all 5 branches
-- Only inserts if they don't already exist (by email)
INSERT INTO profiles (email, password, role, branch_id)
SELECT v.email, v.pass, 'branch', v.bid
FROM (VALUES
  ('branch1@sangem.com', 'branch@1123', 'br1'),
  ('branch2@sangem.com', 'branch@2123', 'br2'),
  ('branch3@sangem.com', 'branch@3123', 'br3'),
  ('branch4@sangem.com', 'branch@4123', 'br4'),
  ('branch5@sangem.com', 'branch@5123', 'br5')
) AS v(email, pass, bid)
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = v.email);

-- Also ensure admin profile exists
INSERT INTO profiles (email, password, role, branch_id)
VALUES ('admin@sangem.com', 'admin@123', 'admin', NULL)
ON CONFLICT DO NOTHING;

-- (Relies on a unique constraint on email) — add it if it doesn't exist:
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
END $$;
