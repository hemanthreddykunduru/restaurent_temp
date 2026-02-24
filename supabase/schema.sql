-- ==========================================
-- SANGEM HOTELS - UNIFIED DISHES TABLE
-- Single table, branch_id column, numeric dish_id
-- Branch ranges: br1=10000s, br2=20000s, br3=30000s, br4=40000s, br5=50000s
-- ==========================================

-- SET TIMEZONE TO IST (INDIA)
ALTER DATABASE postgres SET timezone TO 'Asia/Kolkata';
ALTER ROLE authenticator SET timezone TO 'Asia/Kolkata';
SET TIMEZONE TO 'Asia/Kolkata';

-- Drop old branch-specific tables (if they still exist from previous schema)
DROP TABLE IF EXISTS dishes_br1 CASCADE;
DROP TABLE IF EXISTS dishes_br2 CASCADE;
DROP TABLE IF EXISTS dishes_br3 CASCADE;
DROP TABLE IF EXISTS dishes_br4 CASCADE;
DROP TABLE IF EXISTS dishes_br5 CASCADE;

-- Drop unified table to allow clean recreation
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- UNIFIED DISHES TABLE
-- dish_id: 5-digit numeric, globally unique across all branches
-- branch_id: 'br1' | 'br2' | 'br3' | 'br4' | 'br5'
-- ==========================================
CREATE TABLE dishes (
    id          SERIAL PRIMARY KEY,
    dish_id     INTEGER UNIQUE NOT NULL,
    branch_id   TEXT NOT NULL,
    name        TEXT NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    image_url   TEXT,
    description TEXT,
    category    TEXT,
    cuisine     TEXT,
    dietary_type TEXT,
    rating      DECIMAL(2, 1) DEFAULT 4.5,
    prep_time   INTEGER DEFAULT 20,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at       TIMESTAMPTZ DEFAULT now(),
    customer_name    TEXT NOT NULL,
    customer_phone   TEXT NOT NULL,
    customer_email   TEXT,
    delivery_address TEXT NOT NULL,
    latitude         DOUBLE PRECISION,
    longitude        DOUBLE PRECISION,
    branch_id        TEXT NOT NULL,
    total_amount     DECIMAL(10, 2) NOT NULL,
    payment_method   TEXT DEFAULT 'Cash on Delivery',
    order_status     TEXT DEFAULT 'pending',
    items            JSONB NOT NULL
);

CREATE TABLE feedback (
    id            SERIAL PRIMARY KEY,
    order_number  TEXT NOT NULL,
    customer_name TEXT,
    feedback_type TEXT NOT NULL,
    rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message       TEXT NOT NULL,
    branch_id     TEXT NOT NULL,
    images        TEXT[],
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE dishes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dishes_select"  ON dishes  FOR SELECT USING (true);
CREATE POLICY "orders_insert"  ON orders  FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select"  ON orders  FOR SELECT USING (true);
CREATE POLICY "feedback_insert" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "feedback_select" ON feedback FOR SELECT USING (true);

-- ==========================================
-- BR1: BANJARA HILLS (ROYAL MUGHLAI)  dish_id 10001–10100
-- ==========================================
INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
(10001, 'br1', 'Banjara Shahi Paneer',      450, 'Main Course', 'Mughlai',       'Veg',     'Rich creamy tomato gravy with paneer blocks.',          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
(10002, 'br1', 'Nizami Chicken Biryani',    550, 'Biryani',     'Hyderabadi',    'Non-Veg', 'Signature dum biryani with saffron.',                   'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
(10003, 'br1', 'Mutton Rogan Josh Royal',   750, 'Main Course', 'Mughlai',       'Non-Veg', 'Slow cooked lamb with intense spices.',                 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'),
(10004, 'br1', 'Dal Sangam Special',        350, 'Main Course', 'Indian',        'Veg',     'Overnight cooked black lentils.',                       'https://images.unsplash.com/photo-1585937421612-71a008356fbe?q=80&w=800'),
(10005, 'br1', 'Tandoori Murgh Full',       850, 'Starters',   'Indian',        'Non-Veg', 'Whole clay oven roasted chicken.',                      'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'),
(10006, 'br1', 'Zafrani Seekh Kabab',       520, 'Starters',   'Mughlai',       'Non-Veg', 'Minced mutton with herbs and spices.',                  'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
(10007, 'br1', 'Butter Chicken Classic',    620, 'Main Course', 'North Indian',  'Non-Veg', 'Chicken in tomato butter gravy.',                       'https://images.unsplash.com/photo-1603894584202-74955365511b?q=80&w=800'),
(10008, 'br1', 'Paneer Lababdar',           420, 'Main Course', 'North Indian',  'Veg',     'Luscious paneer in chunky gravy.',                      'https://images.unsplash.com/photo-1631451095765-2c9111619e41?q=80&w=800'),
(10009, 'br1', 'Murgh Malai Tikka',         480, 'Starters',   'Mughlai',       'Non-Veg', 'Creamy charcoal grilled chicken.',                      'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
(10010, 'br1', 'Royal Veg Galouti Kabab',   380, 'Starters',   'Lucknowi',      'Veg',     'Melt-in-mouth vegetable patties.',                      'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
(10011, 'br1', 'Shahi Tukda',               320, 'Desserts',   'Mughlai',       'Veg',     'Fried bread with rabri and saffron.',                   'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800'),
(10012, 'br1', 'Kesari Phirni',             280, 'Desserts',   'Mughlai',       'Veg',     'Ground rice pudding with rose water.',                  'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800'),
(10013, 'br1', 'Nalli Nihari',              820, 'Main Course', 'Mughlai',       'Non-Veg', 'Slow stew of lamb shanks overnight.',                   'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'),
(10014, 'br1', 'Roomali Roti (3pcs)',        90, 'Breads',      'Indian',        'Veg',     'Handkerchief thin bread cooked on inverted tawa.',      'https://images.unsplash.com/photo-1633945274405-b6c80a203bc3?q=80&w=800'),
(10015, 'br1', 'Peshwari Naan',             110, 'Breads',      'Mughlai',       'Veg',     'Sweet bread stuffed with coconut and almond.',          'https://images.unsplash.com/photo-1633945274405-b6c80a203bc3?q=80&w=800'),
(10016, 'br1', 'Lucknowi Dum Biryani',      620, 'Biryani',    'Lucknowi',      'Non-Veg', 'Delicate aromatic rice with whole spices.',             'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
(10017, 'br1', 'Shahi Korma',               580, 'Main Course', 'Mughlai',       'Non-Veg', 'Chicken in rich nut and cream gravy.',                  'https://images.unsplash.com/photo-1603894584202-74955365511b?q=80&w=800'),
(10018, 'br1', 'Saffron Lassi',             180, 'Beverages',  'Indian',        'Veg',     'Chilled yogurt drink with Kashmiri saffron.',           'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800'),
(10019, 'br1', 'Kakori Kabab',              540, 'Starters',   'Lucknowi',      'Non-Veg', 'Melt-in-mouth minced lamb skewers.',                    'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
(10020, 'br1', 'Dal Makhani Royal',         400, 'Main Course', 'North Indian',  'Veg',     'Slow cooked lentils in butter and cream.',              'https://images.unsplash.com/photo-1585937421612-71a008356fbe?q=80&w=800');

INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url)
SELECT 10020 + s.i, 'br1',
       'Mughlai Delicacy #' || s.i,
       400 + (s.i % 200),
       'Main Course',
       'Mughlai',
       CASE WHEN s.i % 2 = 0 THEN 'Non-Veg' ELSE 'Veg' END,
       'Authentic heritage recipe variant #' || s.i,
       CASE WHEN s.i % 3 = 0 THEN 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'
            WHEN s.i % 3 = 1 THEN 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800'
            ELSE 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800' END
FROM generate_series(1, 79) s(i);

-- ==========================================
-- BR2: JUBILEE HILLS (INDOCHINESE FUSION)  dish_id 20001–20100
-- ==========================================
INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
(20001, 'br2', 'Dragon Chicken Jubilee',       480, 'Starters',   'Indo-Chinese', 'Non-Veg', 'Spicy stir-fry with cashew nut crunch.',               'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
(20002, 'br2', 'Crispy Chili Baby Corn',       320, 'Starters',   'Chinese',      'Veg',     'Sweet corn in spicy schezwan sauce.',                  'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
(20003, 'br2', 'Hakka Noodles Premium',        380, 'Main Course', 'Chinese',      'Veg',     'Classic thin noodles with fresh veggies.',             'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800'),
(20004, 'br2', 'Burnt Garlic Fried Rice',      420, 'Main Course', 'Chinese',      'Non-Veg', 'Wok tossed rice with intense garlic.',                 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800'),
(20005, 'br2', 'Dim Sum Basket Deluxe',        550, 'Starters',   'Chinese',      'Non-Veg', 'Assorted meat and veg dumplings.',                     'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800'),
(20006, 'br2', 'Manchurian Gravy Hot',         350, 'Main Course', 'Indo-Chinese', 'Veg',     'Vegetable bites in soya garlic sauce.',                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
(20007, 'br2', 'Kung Pao Prawns',              680, 'Main Course', 'Chinese',      'Non-Veg', 'Tiger prawns with peanuts and chili.',                 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(20008, 'br2', 'American Chopsuey Jubilee',    450, 'Main Course', 'Fusion',       'Non-Veg', 'Crispy noodles with sweet n sour sauce.',              'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
(20009, 'br2', 'Hot and Sour Soup',            220, 'Starters',   'Chinese',      'Veg',     'Spicy tangy soup with mushrooms.',                     'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800'),
(20010, 'br2', 'Date Pancake with Icecream',   280, 'Desserts',   'Chinese',      'Veg',     'Warm pancakes with caramelized dates.',                'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800'),
(20011, 'br2', 'Schezwan Paneer',              380, 'Main Course', 'Indo-Chinese', 'Veg',     'Cottage cheese in fiery schezwan sauce.',              'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
(20012, 'br2', 'Honey Chili Potato',           280, 'Starters',   'Indo-Chinese', 'Veg',     'Crispy potato strips with honey chili glaze.',         'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
(20013, 'br2', 'Chicken Lollipop (6pcs)',       520, 'Starters',   'Indo-Chinese', 'Non-Veg', 'Frenched chicken wings in schezwan glaze.',            'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
(20014, 'br2', 'Veg Spring Rolls (4pcs)',       240, 'Starters',   'Chinese',      'Veg',     'Crispy rolls stuffed with cabbage and carrot.',        'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800'),
(20015, 'br2', 'Cantonese Style Fish',         620, 'Main Course', 'Chinese',      'Non-Veg', 'Steamed fish with ginger and scallion sauce.',         'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(20016, 'br2', 'Jasmine Green Tea',            120, 'Beverages',  'Chinese',      'Veg',     'Delicate floral green tea pot.',                       'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800'),
(20017, 'br2', 'Black Bean Chicken',           480, 'Main Course', 'Chinese',      'Non-Veg', 'Wok fried chicken with fermented black beans.',        'https://images.unsplash.com/photo-1603894584202-74955365511b?q=80&w=800'),
(20018, 'br2', 'Crispy Corn Chaat',            260, 'Starters',   'Fusion',       'Veg',     'Deep fried corn with masala and lime.',                'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
(20019, 'br2', 'Wonton Soup Bowl',             280, 'Starters',   'Chinese',      'Non-Veg', 'Pork filled wontons in clear broth.',                  'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800'),
(20020, 'br2', 'Lychee Gelato',                220, 'Desserts',   'Fusion',       'Veg',     'Smooth lychee gelato with mint.',                      'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800');

INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url)
SELECT 20020 + s.i, 'br2',
       'Fusion Special #' || s.i,
       300 + (s.i % 300),
       'Main Course',
       'Chinese',
       CASE WHEN s.i % 2 = 0 THEN 'Veg' ELSE 'Non-Veg' END,
       'Wok-tossed perfection variant #' || s.i,
       CASE WHEN s.i % 3 = 0 THEN 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'
            WHEN s.i % 3 = 1 THEN 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800'
            ELSE 'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800' END
FROM generate_series(1, 79) s(i);

-- ==========================================
-- BR3: GACHIBOWLI (COASTAL SOUTH)  dish_id 30001–30100
-- ==========================================
INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
(30001, 'br3', 'Mangalore Chicken Ghee Roast', 520, 'Main Course', 'Coastal',  'Non-Veg', 'Original Kundapur recipe with pure ghee.',             'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
(30002, 'br3', 'Karwari Fish Fry',              650, 'Starters',   'Coastal',  'Non-Veg', 'Spice crusted sea bass fried.',                        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800'),
(30003, 'br3', 'Appam with Veg Stew',           350, 'Main Course', 'Kerala',   'Veg',     'Fermented rice hoppers and coconut stew.',             'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800'),
(30004, 'br3', 'Prawns Balchao',                720, 'Main Course', 'Goan',     'Non-Veg', 'Spicy sour pickle style prawn curry.',                 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(30005, 'br3', 'Kerala Paratha (2pcs)',          120, 'Breads',      'Indian',   'Veg',     'Layered flaky bread fried in ghee.',                   'https://images.unsplash.com/photo-1633945274405-b6c80a203bc3?q=80&w=800'),
(30006, 'br3', 'Malabar Fish Curry',             580, 'Main Course', 'Kerala',   'Non-Veg', 'Fish in coconut and tamarind base.',                   'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800'),
(30007, 'br3', 'Alleppey Chicken Curry',         480, 'Main Course', 'Kerala',   'Non-Veg', 'Chicken with raw mango and coconut.',                  'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800'),
(30008, 'br3', 'Neer Dosa with Chutney',         180, 'Starters',   'Coastal',  'Veg',     'Soft lacy thin rice pancakes.',                        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800'),
(30009, 'br3', 'Squid Butter Garlic',            550, 'Starters',   'Coastal',  'Non-Veg', 'Tender calamari with golden garlic.',                  'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(30010, 'br3', 'Elaneer Payasam',                220, 'Desserts',   'Kerala',   'Veg',     'Tender coconut and milk pudding.',                     'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800'),
(30011, 'br3', 'Crab Masala Goan',               780, 'Main Course', 'Goan',     'Non-Veg', 'Whole crab cooked in spicy Goan masala.',              'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(30012, 'br3', 'Puttu and Kadala Curry',         250, 'Main Course', 'Kerala',   'Veg',     'Steamed rice rolls with black chickpea curry.',        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800'),
(30013, 'br3', 'Thalassery Biryani',             580, 'Biryani',    'Kerala',   'Non-Veg', 'Fragrant Malabar rice with chicken.',                  'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
(30014, 'br3', 'Coconut Prawn Curry',            620, 'Main Course', 'Coastal',  'Non-Veg', 'Prawns in thick coconut milk gravy.',                  'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(30015, 'br3', 'Sol Kadhi',                      150, 'Beverages',  'Coastal',  'Veg',     'Kokum and coconut milk digestive drink.',               'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800'),
(30016, 'br3', 'Kori Rotti',                     450, 'Main Course', 'Coastal',  'Non-Veg', 'Chicken curry with crisp rice wafers.',                'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800'),
(30017, 'br3', 'Bebinca Goan Dessert',            280, 'Desserts',   'Goan',     'Veg',     'Layered coconut and egg pudding.',                     'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800'),
(30018, 'br3', 'Banana Leaf Meal',                350, 'Main Course', 'Kerala',   'Veg',     'Full south Indian thali on banana leaf.',              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800'),
(30019, 'br3', 'Pomfret Recheado',                680, 'Starters',   'Goan',     'Non-Veg', 'Pomfret stuffed with red masala and grilled.',         'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800'),
(30020, 'br3', 'Kerala Banana Fritters',          160, 'Desserts',   'Kerala',   'Veg',     'Ripe plantain fritters with jaggery dip.',             'https://images.unsplash.com/photo-1589113824040-fb974f179c6b?q=80&w=800');

INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url)
SELECT 30020 + s.i, 'br3',
       'Coastal Treat #' || s.i,
       350 + (s.i % 400),
       'Main Course',
       'Coastal',
       CASE WHEN s.i % 2 = 0 THEN 'Non-Veg' ELSE 'Veg' END,
       'Fresh catch specialty variant #' || s.i,
       CASE WHEN s.i % 3 = 0 THEN 'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800'
            WHEN s.i % 3 = 1 THEN 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800'
            ELSE 'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800' END
FROM generate_series(1, 79) s(i);

-- ==========================================
-- BR4: MADHAPUR (QUICK BITES)  dish_id 40001–40100
-- ==========================================
INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
(40001, 'br4', 'Ghee Roast Dosa Platinum',     150, 'Main Course', 'South Indian', 'Veg',     'Thin crispy dosa with local ghee.',                    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800'),
(40002, 'br4', 'Paneer Cheese Wrap Extreme',    250, 'Main Course', 'Fusion',       'Veg',     'Loads of paneer and cheese in a tortilla.',            'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=800'),
(40003, 'br4', 'Chicken Tikka Pizza',           450, 'Main Course', 'Fusion',       'Non-Veg', 'Indian spiced chicken on thin crust.',                 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800'),
(40004, 'br4', 'Peri Peri Fries Bucket',        180, 'Starters',   'Global',       'Veg',     'Crispy fries with African spice dust.',                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
(40005, 'br4', 'Cold Coffee Frappe Gold',       220, 'Beverages',  'Global',       'Veg',     'Blended chilled coffee with icecream.',                'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800'),
(40006, 'br4', 'Madhapur Thali Express',        350, 'Main Course', 'Indian',       'Veg',     'Quick lunch set with roti and sabzi.',                 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800'),
(40007, 'br4', 'Chicken Shawarma Roll',         250, 'Main Course', 'Arabic',       'Non-Veg', 'Authentic wrap with garlic mayo.',                     'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800'),
(40008, 'br4', 'Pasta Arrabbiata Lite',         380, 'Main Course', 'Italian',      'Veg',     'Spicy tomato sauce with penne.',                       'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800'),
(40009, 'br4', 'Brownie with Hot Fudge',        240, 'Desserts',   'Global',       'Veg',     'Warm dark chocolate brownie.',                         'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800'),
(40010, 'br4', 'Signature Filter Coffee',        80, 'Beverages',  'South Indian', 'Veg',     'Frothy milk coffee with decoction.',                   'https://images.unsplash.com/photo-1553909489-cd47e0907d3f?q=80&w=800'),
(40011, 'br4', 'Masala Maggi Bowl',             180, 'Main Course', 'Fusion',       'Veg',     'Upgraded instant noodles with Indian spices.',         'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800'),
(40012, 'br4', 'Vada Pav Slider',               120, 'Starters',   'Indian',       'Veg',     'Mumbai street classic spiced potato slider.',          'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
(40013, 'br4', 'BBQ Chicken Wings (6pcs)',       380, 'Starters',   'Global',       'Non-Veg', 'Smoky BBQ glazed chicken wings.',                      'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
(40014, 'br4', 'Mango Shake',                   160, 'Beverages',  'Indian',       'Veg',     'Thick Alphonso mango milkshake.',                      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800'),
(40015, 'br4', 'Double Patty Burger',           350, 'Main Course', 'Global',       'Non-Veg', 'Juicy beef patties with special sauce.',               'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800'),
(40016, 'br4', 'Cheese Garlic Bread',           180, 'Starters',   'Italian',      'Veg',     'Toasted baguette with herbed cheese.',                 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
(40017, 'br4', 'Loaded Nachos',                 280, 'Starters',   'Global',       'Veg',     'Tortilla chips with salsa, cheese and jalapeño.',     'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
(40018, 'br4', 'Korean Fried Chicken',          420, 'Starters',   'Asian',        'Non-Veg', 'Double fried crispy chicken with gochujang.',          'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800'),
(40019, 'br4', 'Oreo Cheesecake Slice',         280, 'Desserts',   'Global',       'Veg',     'No-bake cheesecake on Oreo base.',                     'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800'),
(40020, 'br4', 'Watermelon Lemonade',           120, 'Beverages',  'Global',       'Veg',     'Fresh watermelon blended with lemon.',                 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800');

INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url)
SELECT 40020 + s.i, 'br4',
       'Quick Pickup #' || s.i,
       100 + (s.i % 200),
       'Main Course',
       'Global',
       CASE WHEN s.i % 2 = 0 THEN 'Veg' ELSE 'Non-Veg' END,
       'Fast and flavorful variant #' || s.i,
       CASE WHEN s.i % 3 = 0 THEN 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800'
            WHEN s.i % 3 = 1 THEN 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=800'
            ELSE 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800' END
FROM generate_series(1, 79) s(i);

-- ==========================================
-- BR5: KONDAPUR (TELANGANA TRADITIONAL)  dish_id 50001–50100
-- ==========================================
INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url) VALUES
(50001, 'br5', 'Golichina Mamsam Kondapur',    580, 'Starters',   'Telangana',    'Non-Veg', 'Signature lamb fry with local spices.',                'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'),
(50002, 'br5', 'Natukodi Pulusu Original',      520, 'Main Course', 'Telangana',    'Non-Veg', 'Country chicken in spicy tamarind gravy.',             'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'),
(50003, 'br5', 'Jonna Rotte with Pickle',       120, 'Breads',      'Telangana',    'Veg',     'Traditional sorghum flatbread.',                       'https://images.unsplash.com/photo-1633945274405-b6c80a203bc3?q=80&w=800'),
(50004, 'br5', 'Bagara Annam Classic',          250, 'Main Course', 'Hyderabadi',   'Veg',     'Fragrant rice tempered with dry masalas.',             'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
(50005, 'br5', 'Telangana Fish Pulusu',         480, 'Main Course', 'Telangana',    'Non-Veg', 'River fish in traditional spicy gravy.',               'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800'),
(50006, 'br5', 'Sarva Pindi (2pcs)',            180, 'Starters',   'Telangana',    'Veg',     'Savory rice flour pancake with pulses.',               'https://images.unsplash.com/photo-1512058560374-140fa3d8fc42?q=80&w=800'),
(50007, 'br5', 'Pot Mutton Biryani',            650, 'Biryani',    'Telangana',    'Non-Veg', 'Clay pot cooked lamb biryani.',                        'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
(50008, 'br5', 'Malidalu Sweets',               220, 'Desserts',   'Telangana',    'Veg',     'Healthy rotte and jaggery balls.',                     'https://images.unsplash.com/photo-1589119908995-c6800ffca83c?q=80&w=800'),
(50009, 'br5', 'Double Ka Meetha',              200, 'Desserts',   'Hyderabadi',   'Veg',     'Luxury bread pudding with dry fruits.',                'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=800'),
(50010, 'br5', 'Sugar-Cane Juice Fresh',        120, 'Beverages',  'Indian',       'Veg',     'Naturally sweet pressed juice.',                       'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800'),
(50011, 'br5', 'Gongura Mutton',                620, 'Main Course', 'Telangana',    'Non-Veg', 'Lamb cooked with sorrel leaves.',                      'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'),
(50012, 'br5', 'Pesarattu Dosa',                180, 'Main Course', 'Telangana',    'Veg',     'Green moong crepe served with upma.',                  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800'),
(50013, 'br5', 'Kodi Vepudu',                   480, 'Main Course', 'Telangana',    'Non-Veg', 'Dry chicken fry Telangana style.',                     'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'),
(50014, 'br5', 'Aavakaya Biryani',              420, 'Biryani',    'Telangana',    'Veg',     'Raw mango pickle rice cooked in dum style.',           'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
(50015, 'br5', 'Mamidikaya Pulihora',           200, 'Main Course', 'Telangana',    'Veg',     'Tamarind and green mango rice.',                       'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'),
(50016, 'br5', 'Royyala Vepudu',                560, 'Starters',   'Telangana',    'Non-Veg', 'Dry masala fried prawns.',                             'https://images.unsplash.com/photo-1551529834-523abc4f99db?q=80&w=800'),
(50017, 'br5', 'Bobbatlu (2pcs)',               160, 'Desserts',   'Telangana',    'Veg',     'Sweet stuffed flatbread with coconut and jaggery.',   'https://images.unsplash.com/photo-1589119908995-c6800ffca83c?q=80&w=800'),
(50018, 'br5', 'Pachi Pulusu',                  180, 'Starters',   'Telangana',    'Veg',     'Cold raw tamarind soup.',                              'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800'),
(50019, 'br5', 'Natu Kodi Biryani',             580, 'Biryani',    'Telangana',    'Non-Veg', 'Country chicken dum biryani Kondapur style.',          'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=800'),
(50020, 'br5', 'Buttermilk (Majjiga)',           80,  'Beverages',  'Telangana',    'Veg',     'Spiced chilled thin yogurt drink.',                    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800');

INSERT INTO dishes (dish_id, branch_id, name, price, category, cuisine, dietary_type, description, image_url)
SELECT 50020 + s.i, 'br5',
       'Village Specialty #' || s.i,
       200 + (s.i % 300),
       'Main Course',
       'Telangana',
       CASE WHEN s.i % 2 = 0 THEN 'Non-Veg' ELSE 'Veg' END,
       'Hearty traditional recipe variant #' || s.i,
       CASE WHEN s.i % 3 = 0 THEN 'https://images.unsplash.com/photo-1626074353765-517a681e406e?q=80&w=800'
            WHEN s.i % 3 = 1 THEN 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800'
            ELSE 'https://images.unsplash.com/photo-1626777558305-b84e03f1eb81?q=80&w=800' END
FROM generate_series(1, 79) s(i);
