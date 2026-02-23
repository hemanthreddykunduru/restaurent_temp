-- ==========================================
-- SANGEM HOTELS - ULTIMATE BRANCH DATA (500+ DISHES)
-- UNIQUE DISH_IDs | CURATED IMAGES | IST TIME
-- ==========================================

-- SET TIMEZONE TO IST (INDIA)
ALTER DATABASE postgres SET timezone TO 'Asia/Kolkata';
ALTER ROLE authenticator SET timezone TO 'Asia/Kolkata';
SET TIMEZONE TO 'Asia/Kolkata';

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS dishes_br1 CASCADE;
DROP TABLE IF EXISTS dishes_br2 CASCADE;
DROP TABLE IF EXISTS dishes_br3 CASCADE;
DROP TABLE IF EXISTS dishes_br4 CASCADE;
DROP TABLE IF EXISTS dishes_br5 CASCADE;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- COMMON TABLE STRUCTURE
-- Added dish_id for explicit unique identification across branches.
CREATE TABLE dishes_br1 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br2 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br3 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br4 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br5 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), created_at TIMESTAMPTZ DEFAULT now(), customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, customer_email TEXT, delivery_address TEXT NOT NULL, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, branch_id TEXT NOT NULL, total_amount DECIMAL(10, 2) NOT NULL, payment_method TEXT DEFAULT 'Cash on Delivery', order_status TEXT DEFAULT 'pending', items JSONB NOT NULL);
CREATE TABLE feedback (id SERIAL PRIMARY KEY, order_number TEXT NOT NULL, customer_name TEXT, feedback_type TEXT NOT NULL, rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), message TEXT NOT NULL, branch TEXT NOT NULL, images TEXT[], created_at TIMESTAMPTZ DEFAULT now());

-- RLS
ALTER TABLE dishes_br1 ENABLE ROW LEVEL SECURITY; ALTER TABLE dishes_br2 ENABLE ROW LEVEL SECURITY; ALTER TABLE dishes_br3 ENABLE ROW LEVEL SECURITY; ALTER TABLE dishes_br4 ENABLE ROW LEVEL SECURITY; ALTER TABLE dishes_br5 ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY; ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "P1" ON dishes_br1 FOR SELECT USING (true); CREATE POLICY "P2" ON dishes_br2 FOR SELECT USING (true); CREATE POLICY "P3" ON dishes_br3 FOR SELECT USING (true); CREATE POLICY "P4" ON dishes_br4 FOR SELECT USING (true); CREATE POLICY "P5" ON dishes_br5 FOR SELECT USING (true);
CREATE POLICY "O1" ON orders FOR INSERT WITH CHECK (true); CREATE POLICY "O2" ON orders FOR SELECT USING (true);
CREATE POLICY "F1" ON feedback FOR INSERT WITH CHECK (true); CREATE POLICY "F2" ON feedback FOR SELECT USING (true);

-- IMAGE ROTATION POOL (HIGH QUALITY)
-- 1. North Indian/Mughlai: https://images.unsplash.com/photo-1546833999-b9f581a1996d
-- 2. Biryani: https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8
-- 3. Coastal/Fish: https://images.unsplash.com/photo-1626777558305-b84e03f1eb81
-- 4. Indochinese: https://images.unsplash.com/photo-1525755662778-989d0524087e
-- 5. Desserts: https://images.unsplash.com/photo-1589113824040-fb974f179c6b
-- 6. Beverages: https://images.unsplash.com/photo-1571091718767-18b5b1457add

-- ==========================================
-- DATA INJECTION - BR1: BANJARA HILLS (ROYAL MUGHLAI)
-- ==========================================
INSERT INTO dishes_br1 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
('BR1_DISH_101', 'Banjara Shahi Paneer', 450, 'Main Course', 'Mughlai', 'Veg', 'Rich creamy tomato gravy with paneer blocks.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
('BR1_DISH_102', 'Nizami Chicken Biryani', 550, 'Biryani', 'Hyderabadi', 'Non-Veg', 'Signature dum biryani with saffron.', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
('BR1_DISH_103', 'Mutton Rogan Josh Royal', 750, 'Main Course', 'Mughlai', 'Non-Veg', 'Slow cooked lamb with intense spices.', 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'),
('BR1_DISH_104', 'Dal Sangam Special', 350, 'Main Course', 'Indian', 'Veg', 'Overnight cooked black lentils.', 'https://images.unsplash.com/photo-1585937421612-71a008356fbe?q=80&w=800'),
('BR1_DISH_105', 'Tandoori Murgh Full', 850, 'Starters', 'Indian', 'Non-Veg', 'Whole clay oven roasted chicken.', 'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'),
('BR1_DISH_106', 'Zafrani Seekh Kabab', 520, 'Starters', 'Mughlai', 'Non-Veg', 'Minced mutton with herbs and spices.', 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
('BR1_DISH_107', 'Butter Chicken Classic', 620, 'Main Course', 'North Indian', 'Non-Veg', 'Chicken in tomato butter gravy.', 'https://images.unsplash.com/photo-1603894584202-74955365511b?q=80&w=800'),
('BR1_DISH_108', 'Paneer Lababdar', 420, 'Main Course', 'North Indian', 'Veg', 'Luscious paneer in chunky gravy.', 'https://images.unsplash.com/photo-1631451095765-2c9111619e41?q=80&w=800'),
('BR1_DISH_109', 'Murgh Malai Tikka', 480, 'Starters', 'Mughlai', 'Non-Veg', 'Creamy charcoal grilled chicken.', 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
('BR1_DISH_110', 'Royal Veg Galouti Kabab', 380, 'Starters', 'Lucknowi', 'Veg', 'Melt-in-mouth vegetable patties.', 'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800');

INSERT INTO dishes_br1 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) 
SELECT 'BR1_AUTOGEN_' || i, 'Mughlai Delicacy #' || i, 400 + (i % 200), 'Main Course', 'Mughlai', 
CASE WHEN i % 2 = 0 THEN 'Non-Veg' ELSE 'Veg' END, 
'Authentic heritage recipe version #' || i,
CASE WHEN i % 3 = 0 THEN 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'
     WHEN i % 3 = 1 THEN 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800'
     ELSE 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800' END
FROM generate_series(1, 90) s(i);

-- ==========================================
-- DATA INJECTION - BR2: JUBILEE HILLS (INDOCHINESE FUSION)
-- ==========================================
INSERT INTO dishes_br2 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
('BR2_DISH_201', 'Dragon Chicken Jubilee', 480, 'Starters', 'Indo-Chinese', 'Non-Veg', 'Spicy stir-fry with cashew nut crunch.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
('BR2_DISH_202', 'Crispy Chili Baby Corn', 320, 'Starters', 'Chinese', 'Veg', 'Sweet corn in spicy schezwan sauce.', 'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
('BR2_DISH_203', 'Hakka Noodles Premium', 380, 'Main Course', 'Chinese', 'Veg', 'Classic thin noodles with fresh veggies.', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800'),
('BR2_DISH_204', 'Burnt Garlic Fried Rice', 420, 'Main Course', 'Chinese', 'Non-Veg', 'Wok tossed rice with intense garlic.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800'),
('BR2_DISH_205', 'Dim Sum Basket Deluxe', 550, 'Starters', 'Chinese', 'Non-Veg', 'Assorted meat and veg dumplings.', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800'),
('BR2_DISH_206', 'Manchurian Gravy Hot', 350, 'Main Course', 'Indo-Chinese', 'Veg', 'Vegetable bites in soya garlic sauce.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
('BR2_DISH_207', 'Kung Pao Prawns', 680, 'Main Course', 'Chinese', 'Non-Veg', 'Tiger prawns with peanuts and chili.', 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
('BR2_DISH_208', 'American Chopsuey Jubilee', 450, 'Main Course', 'Fusion', 'Non-Veg', 'Crispy noodles with sweet n sour sauce.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
('BR2_DISH_209', 'Hot and Sour Soup', 220, 'Starters', 'Chinese', 'Veg', 'Spicy tangy soup with mushrooms.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800'),
('BR2_DISH_210', 'Date Pancake with Icecream', 280, 'Desserts', 'Chinese', 'Veg', 'Warm pancakes with caramelized dates.', 'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800');

INSERT INTO dishes_br2 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) 
SELECT 'BR2_AUTOGEN_' || i, 'Fusion Special #' || i, 300 + (i % 300), 'Main Course', 'Chinese', 
CASE WHEN i % 2 = 0 THEN 'Veg' ELSE 'Non-Veg' END, 
'Wok-tossed perfection version #' || i,
CASE WHEN i % 3 = 0 THEN 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'
     WHEN i % 3 = 1 THEN 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800'
     ELSE 'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800' END
FROM generate_series(1, 90) s(i);

-- ==========================================
-- DATA INJECTION - BR3: GACHIBOWLI (COASTAL SOUTH)
-- ==========================================
INSERT INTO dishes_br3 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
('BR3_DISH_301', 'Mangalore Chicken Ghee Roast', 520, 'Main Course', 'Coastal', 'Non-Veg', 'Original Kundapur recipe with pure ghee.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
('BR3_DISH_302', 'Karwari Fish Fry', 650, 'Starters', 'Coastal', 'Non-Veg', 'Spice crusted sea bass fried.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800'),
('BR3_DISH_303', 'Appam with Veg Stew', 350, 'Main Course', 'Kerala', 'Veg', 'Fermented rice hoppers and coconut stew.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800'),
('BR3_DISH_304', 'Prawns Balchao', 720, 'Main Course', 'Goan', 'Non-Veg', 'Spicy sour pickle style prawn curry.', 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
('BR3_DISH_305', 'Kerala Paratha (2pcs)', 120, 'Breads', 'Indian', 'Veg', 'Layered flaky bread fried in ghee.', 'https://images.unsplash.com/photo-1633945274405-b6c80a203bc3?q=80&w=800'),
('BR3_DISH_306', 'Malabar Fish Curry', 580, 'Main Course', 'Kerala', 'Non-Veg', 'Fish in coconut and tamarind base.', 'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800'),
('BR3_DISH_307', 'Alleppey Chicken Curry', 480, 'Main Course', 'Kerala', 'Non-Veg', 'Chicken with raw mango and coconut.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
('BR3_DISH_308', 'Neer Dosa with Chutney', 180, 'Starters', 'Coastal', 'Veg', 'Soft lacy thin rice pancakes.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800'),
('BR3_DISH_309', 'Squid Butter Garlic', 550, 'Starters', 'Coastal', 'Non-Veg', 'Tender calamari with golden garlic.', 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
('BR3_DISH_310', 'Elaneer Payasam', 220, 'Desserts', 'Kerala', 'Veg', 'Tender coconut and milk pudding.', 'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800');

INSERT INTO dishes_br3 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) 
SELECT 'BR3_AUTOGEN_' || i, 'Coastal Treat #' || i, 350 + (i % 400), 'Main Course', 'Coastal', 
CASE WHEN i % 2 = 0 THEN 'Non-Veg' ELSE 'Veg' END, 
'Fresh catch specialty version #' || i,
CASE WHEN i % 3 = 0 THEN 'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800'
     WHEN i % 3 = 1 THEN 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800'
     ELSE 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800' END
FROM generate_series(1, 90) s(i);

-- ==========================================
-- DATA INJECTION - BR4: MADHAPUR (QUICK BITES)
-- ==========================================
INSERT INTO dishes_br4 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
('BR4_DISH_401', 'Ghee Roast Dosa Platinum', 150, 'Main Course', 'South Indian', 'Veg', 'Thin crispy dosa with local ghee.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800'),
('BR4_DISH_402', 'Paneer Cheese Wrap Extreme', 250, 'Main Course', 'Fusion', 'Veg', 'Loads of paneer and cheese in a tortilla.', 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=800'),
('BR4_DISH_403', 'Chicken Tikka Pizza', 450, 'Main Course', 'Fusion', 'Non-Veg', 'Indian spiced chicken on thin crust.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800'),
('BR4_DISH_404', 'Peri Peri Fries Bucket', 180, 'Starters', 'Global', 'Veg', 'Crispy fries with African spice dust.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
('BR4_DISH_405', 'Cold Coffee Frappe Gold', 220, 'Beverages', 'Global', 'Veg', 'Blended chilled coffee with icecream.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800'),
('BR4_DISH_406', 'Madhapur Thali Express', 350, 'Main Course', 'Indian', 'Veg', 'Quick lunch set with roti and sabzi.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
('BR4_DISH_407', 'Chicken Shawarma Roll', 250, 'Main Course', 'Arabic', 'Non-Veg', 'Authentic wrap with garlic mayo.', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800'),
('BR4_DISH_408', 'Pasta Arrabbiata Lite', 380, 'Main Course', 'Italian', 'Veg', 'Spicy tomato sauce with penne.', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800'),
('BR4_DISH_409', 'Brownie with Hot Fudge', 240, 'Desserts', 'Global', 'Veg', 'Warm dark chocolate brownie.', 'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800'),
('BR4_DISH_410', 'Signature Filter Coffee', 80, 'Beverages', 'South Indian', 'Veg', 'Frothy milk coffee with decoction.', 'https://images.unsplash.com/photo-1553909489-cd47e0907d3f?q=80&w=800');

INSERT INTO dishes_br4 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) 
SELECT 'BR4_AUTOGEN_' || i, 'Quick Pickup #' || i, 100 + (i % 200), 'Main Course', 'Global', 
CASE WHEN i % 2 = 0 THEN 'Veg' ELSE 'Non-Veg' END, 
'Fast and flavorful version #' || i,
CASE WHEN i % 3 = 0 THEN 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800'
     WHEN i % 3 = 1 THEN 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=800'
     ELSE 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800' END
FROM generate_series(1, 90) s(i);

-- ==========================================
-- DATA INJECTION - BR5: KONDAPUR (TELANGANA TRADITIONAL)
-- ==========================================
INSERT INTO dishes_br5 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
('BR5_DISH_501', 'Golichina Mamsam Kondapur', 580, 'Starters', 'Telangana', 'Non-Veg', 'Signature lamb fry with local spices.', 'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'),
('BR5_DISH_502', 'Natukodi Pulusu Original', 520, 'Main Course', 'Telangana', 'Non-Veg', 'Country chicken in spicy tamarind gravy.', 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'),
('BR5_DISH_503', 'Jonna Rotte with Pickle', 120, 'Breads', 'Telangana', 'Veg', 'Traditional sorghum flatbread.', 'https://images.unsplash.com/photo-1633945274405-b6c80a203bc3?q=80&w=800'),
('BR5_DISH_504', 'Bagara Annam Classic', 250, 'Main Course', 'Hyderabadi', 'Veg', 'Fragrant rice tempered with dry masalas.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
('BR5_DISH_505', 'Telangana Fish Pulusu', 480, 'Main Course', 'Telangana', 'Non-Veg', 'River fish in traditional spicy gravy.', 'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800'),
('BR5_DISH_506', 'Sarva Pindi (2pcs)', 180, 'Starters', 'Telangana', 'Veg', 'Savory rice flour pancake with pulses.', 'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
('BR5_DISH_507', 'Pot Mutton Biryani', 650, 'Biryani', 'Telangana', 'Non-Veg', 'Clay pot cooked lamb biryani.', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
('BR5_DISH_508', 'Malidalu Sweets', 220, 'Desserts', 'Telangana', 'Veg', 'Healthy rotte and jaggery balls.', 'https://images.unsplash.com/photo-1589119908995-c6800ffca83c?q=80&w=800'),
('BR5_DISH_509', 'Double Ka Meetha', 200, 'Desserts', 'Hyderabadi', 'Veg', 'Luxury bread pudding with dry fruits.', 'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800'),
('BR5_DISH_510', 'Sugar-Cane Juice Fresh', 120, 'Beverages', 'Indian', 'Veg', 'Naturally sweet pressed juice.', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800');

INSERT INTO dishes_br5 (dish_id, name, price, category, cuisine, dietary_type, description, image_url) 
SELECT 'BR5_AUTOGEN_' || i, 'Village Specialty #' || i, 200 + (i % 300), 'Main Course', 'Telangana', 
CASE WHEN i % 2 = 0 THEN 'Non-Veg' ELSE 'Veg' END, 
'Hearty traditional recipe version #' || i,
CASE WHEN i % 3 = 0 THEN 'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'
     WHEN i % 3 = 1 THEN 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'
     ELSE 'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800' END
FROM generate_series(1, 90) s(i);
