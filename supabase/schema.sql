-- Drop existing table to update schema
DROP TABLE IF EXISTS dishes;

-- Create the enhanced dishes table (Price in INR)
CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Values now represent INR
    image_url TEXT,
    description TEXT,
    category TEXT,
    cuisine TEXT,
    dietary_type TEXT,
    prep_method TEXT,
    flavor_profile TEXT,
    meal_type TEXT,
    texture TEXT,
    health_attributes TEXT,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    prep_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert 100+ sample dishes with INR prices (Approx 200-1200 INR)
INSERT INTO dishes (name, price, image_url, description, category, cuisine, dietary_type, prep_method, flavor_profile, meal_type, texture, health_attributes, rating, prep_time) VALUES
-- Indian (INR Prices)
('Paneer Butter Masala', 450.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2000&auto=format&fit=crop', 'Rich creamy tomato gravy with paneer blocks.', 'Lunch', 'Indian', 'Vegetarian', 'Sautéed', 'Savory', 'Main Course', 'Creamy', 'Nut-Free', 4.8, 30),
('Chicken Tikka Masala', 650.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000&auto=format&fit=crop', 'Grilled chicken in spicy tomato sauce.', 'Dinner', 'Indian', 'Non-Vegetarian', 'Grilled', 'Spicy', 'Main Course', 'Saucy', 'High-Protein', 4.9, 45),
('Vegetable Biryani', 380.00, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=2000&auto=format&fit=crop', 'Fragrant basmati rice with seasonal veggies.', 'Dinner', 'Indian', 'Vegetarian', 'Steamed', 'Spicy', 'Main Course', 'Grains', 'Gluten-Free', 4.7, 40),
('Masala Dosa', 180.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2000&auto=format&fit=crop', 'Crispy fermented rice pancake with potato filling.', 'Breakfast', 'South Indian', 'Vegetarian', 'Pan-Fried', 'Savory', 'Breakfast', 'Crispy', 'Lactose-Free', 4.8, 20),
('Mutton Rogan Josh', 850.00, 'https://images.unsplash.com/photo-1626777553732-48995a18f59d?q=80&w=2000&auto=format&fit=crop', 'Kashmiri mutton curry with intense spices.', 'Dinner', 'North Indian', 'Non-Vegetarian', 'Stewed', 'Spicy', 'Main Course', 'Saucy', 'Halal', 4.9, 60),
('Palak Paneer', 420.00, 'https://images.unsplash.com/photo-1601050633647-81a357597335?q=80&w=2000&auto=format&fit=crop', 'Cottage cheese in silky spinach puree.', 'Lunch', 'Indian', 'Vegetarian', 'Sautéed', 'Savory', 'Main Course', 'Creamy', 'Gluten-Free', 4.6, 25),
('Dal Makhani', 350.00, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop', 'Slow-cooked black lentils with cream.', 'Dinner', 'Indian', 'Vegetarian', 'Boiled', 'Creamy', 'Side Dish', 'Creamy', 'Organic', 4.7, 120),
('Gulab Jamun', 150.00, 'https://images.unsplash.com/photo-1589119908995-c6800ffca83c?q=80&w=2000&auto=format&fit=crop', 'Deep-fried milk solids in sugar syrup.', 'Dessert', 'Indian', 'Vegetarian', 'Deep-Fried', 'Sweet', 'Dessert', 'Soft', 'Traditional', 4.9, 30),
('Samosa (2pcs)', 120.00, 'https://images.unsplash.com/photo-1601050633647-81a357597335?q=80&w=2000&auto=format&fit=crop', 'Crispy pastry filled with spiced potatoes.', 'Appetizer', 'Indian', 'Vegetarian', 'Deep-Fried', 'Savory', 'Snack', 'Crispy', 'Vegan', 4.5, 15),
('Mango Lassi', 160.00, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2000&auto=format&fit=crop', 'Refreshing yogurt-based mango drink.', 'Beverage', 'Indian', 'Vegetarian', 'Chilled', 'Sweet', 'Beverage', 'Creamy', 'Lactose-Free', 4.8, 5),

-- Italian (Converted to INR)
('Margherita Pizza', 650.00, 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=2000&auto=format&fit=crop', 'Classic pizza with tomato, mozzarella, and basil.', 'Lunch', 'Italian', 'Vegetarian', 'Baked', 'Savory', 'Main Course', 'Chewy', 'Organic', 4.7, 15),
('Pasta Carbonara', 720.00, 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=2000&auto=format&fit=crop', 'Spaghetti with egg, guanciale, and pecorino romano.', 'Dinner', 'Italian', 'Non-Vegetarian', 'Boiled', 'Umami', 'Main Course', 'Creamy', 'High-Protein', 4.6, 20),
('Lasagna Bolognese', 850.00, 'https://images.unsplash.com/photo-1619895092538-128341783023?q=80&w=2000&auto=format&fit=crop', 'Layered pasta with beef ragu and bechamel.', 'Dinner', 'Italian', 'Non-Vegetarian', 'Baked', 'Savory', 'Main Course', 'Melted', 'Traditional', 4.8, 55),
('Tiramisu', 450.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2000&auto=format&fit=crop', 'Coffee-flavored Italian dessert.', 'Dessert', 'Italian', 'Vegetarian', 'Chilled', 'Sweet', 'Dessert', 'Creamy', 'Contains-Egg', 4.9, 30),
('Bruschetta', 380.00, 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=2000&auto=format&fit=crop', 'Toasted bread with tomato and garlic.', 'Appetizer', 'Italian', 'Vegan', 'Roasted', 'Tangy', 'Starter', 'Crunchy', 'Lactose-Free', 4.5, 10),
('Risotto ai Funghi', 780.00, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=2000&auto=format&fit=crop', 'Creamy arborio rice with woodland mushrooms.', 'Dinner', 'Italian', 'Vegetarian', 'Sautéed', 'Umami', 'Main Course', 'Creamy', 'Gluten-Free', 4.7, 35),

-- Chinese (INR)
('Kung Pao Chicken', 520.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2000&auto=format&fit=crop', 'Spicy stir-fry with chicken and peanuts.', 'Lunch', 'Chinese', 'Non-Vegetarian', 'Stir-Fried', 'Spicy', 'Main Course', 'Crunchy', 'High-Protein', 4.6, 20),
('Mapo Tofu', 450.00, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=2000&auto=format&fit=crop', 'Silken tofu in spicy fermented bean sauce.', 'Lunch', 'Sichuan', 'Non-Vegetarian', 'Boiled', 'Spicy', 'Main Course', 'Soft', 'High-Protein', 4.5, 15),
('Dim Sum Basket', 480.00, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=2000&auto=format&fit=crop', 'Assorted steamed dumplings.', 'Appetizer', 'Chinese', 'Non-Vegetarian', 'Steamed', 'Savory', 'Starter', 'Soft', 'Child-Friendly', 4.7, 20),
('Vegetable Fried Rice', 380.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=2000&auto=format&fit=crop', 'Wok-tossed rice with colorful vegetables.', 'Dinner', 'Chinese', 'Vegetarian', 'Stir-Fried', 'Savory', 'Main Course', 'Grains', 'Vegan', 4.4, 15),
('Hot and Sour Soup', 250.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2000&auto=format&fit=crop', 'Spicy and tangy soup with mushrooms.', 'Appetizer', 'Chinese', 'Vegetarian', 'Boiled', 'Sour', 'Soup', 'Saucy', 'Low-Calorie', 4.3, 15),

-- Mexican (INR)
('Guacamole & Chips', 320.00, 'https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?q=80&w=2000&auto=format&fit=crop', 'Fresh avocado dip with crispy tortilla chips.', 'Appetizer', 'Mexican', 'Vegan', 'Raw', 'Tangy', 'Starter', 'Crunchy', 'Keto', 4.8, 10),
('Chicken Tacos (3pcs)', 550.00, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2000&auto=format&fit=crop', 'Soft corn tortillas with grilled chicken.', 'Lunch', 'Mexican', 'Non-Vegetarian', 'Grilled', 'Savory', 'Main Course', 'Soft', 'Gluten-Free', 4.7, 15),
('Beef Burrito', 620.00, 'https://images.unsplash.com/photo-1584034300355-f120c02978ff?q=80&w=2000&auto=format&fit=crop', 'Large flour tortilla filled with beef and rice.', 'Lunch', 'Mexican', 'Non-Vegetarian', 'Stir-Fried', 'Savory', 'Main Course', 'Chewy', 'High-Protein', 4.6, 20),
('Enchiladas Verdes', 580.00, 'https://images.unsplash.com/photo-1534352956279-b4238ad724af?q=80&w=2000&auto=format&fit=crop', 'Rolled tortillas in green tomatillo sauce.', 'Dinner', 'Mexican', 'Vegetarian', 'Baked', 'Tangy', 'Main Course', 'Saucy', 'Gluten-Free', 4.5, 30),
('Churros with Chocolate', 350.00, 'https://images.unsplash.com/photo-1594911771141-86377677943c?q=80&w=2000&auto=format&fit=crop', 'Fried dough pastry with chocolate dipping sauce.', 'Dessert', 'Mexican', 'Vegetarian', 'Deep-Fried', 'Sweet', 'Dessert', 'Crispy', 'Modern', 4.9, 20),

-- Japanese (INR)
('Sushi Platter', 1800.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000&auto=format&fit=crop', 'Variety of fresh nigiri and maki rolls.', 'Dinner', 'Japanese', 'Pescatarian', 'Raw', 'Savory', 'Main Course', 'Soft', 'Low-Fat', 4.9, 45),
('Chicken Teriyaki', 750.00, 'https://images.unsplash.com/photo-1532347921448-338425178631?q=80&w=2000&auto=format&fit=crop', 'Charbroiled chicken with sweet glaze.', 'Lunch', 'Japanese', 'Non-Vegetarian', 'Grilled', 'Sweet', 'Main Course', 'Saucy', 'High-Protein', 4.7, 25),
('Vegetable Tempura', 480.00, 'https://images.unsplash.com/photo-1558957434-633013d509af?q=80&w=2000&auto=format&fit=crop', 'Lightly battered and fried vegetables.', 'Appetizer', 'Japanese', 'Vegetarian', 'Deep-Fried', 'Savory', 'Starter', 'Crispy', 'Lactose-Free', 4.6, 20),
('Miso Soup', 320.00, 'https://images.unsplash.com/photo-1553163147-622ab70be1c7?q=80&w=2000&auto=format&fit=crop', 'Traditional fermented soybean soup.', 'Appetizer', 'Japanese', 'Vegan', 'Boiled', 'Umami', 'Soup', 'Liquid', 'Low-Calorie', 4.4, 10),
('Ramen (Shoyu)', 950.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2000&auto=format&fit=crop', 'Noodle soup with soy-based broth and pork.', 'Dinner', 'Japanese', 'Non-Vegetarian', 'Boiled', 'Savory', 'Main Course', 'Noodles', 'High-Protein', 4.8, 30),

-- Add 50+ more varieties
('Avocado Toast', 420.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2000&auto=format&fit=crop', 'Smashed avocado on sourdough with egg.', 'Breakfast', 'Modern', 'Vegetarian', 'Fresh', 'Savory', 'Breakfast', 'Creamy', 'Nutritious', 4.6, 10),
('Eggs Benedict', 480.00, 'https://images.unsplash.com/photo-1608039829572-7852bf5c7c10?q=80&w=2000&auto=format&fit=crop', 'Poached eggs on English muffin with hollandaise.', 'Brunch', 'American', 'Vegetarian', 'Poached', 'Savory', 'Breakfast', 'Creamy', 'Contains-Egg', 4.7, 20),
('French Onion Soup', 350.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2000&auto=format&fit=crop', 'Caramelized onion soup with crusty cheese.', 'Dinner', 'French', 'Vegetarian', 'Boiled', 'Savory', 'Soup', 'Saucy', 'Traditional', 4.5, 45),
('Ratatouille', 520.00, 'https://images.unsplash.com/photo-1572453860999-1ad12419a4e2?q=80&w=2000&auto=format&fit=crop', 'Stewed vegetable dish from Provence.', 'Dinner', 'French', 'Vegan', 'Stewed', 'Savory', 'Main Course', 'Soft', 'Gluten-Free', 4.4, 60),
('Beef Stew', 650.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2000&auto=format&fit=crop', 'Slow-cooked beef with root vegetables.', 'Dinner', 'British', 'Non-Vegetarian', 'Stewed', 'Savory', 'Main Course', 'Chunky', 'High-Protein', 4.7, 120),
('Fish and Chips', 580.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2000&auto=format&fit=crop', 'Battered fish served with potato fries.', 'Lunch', 'British', 'Pescatarian', 'Deep-Fried', 'Savory', 'Main Course', 'Crispy', 'Lactose-Free', 4.6, 20),
('Shepherds Pie', 600.00, 'https://images.unsplash.com/photo-1629115913089-7550e84bc391?q=80&w=2000&auto=format&fit=crop', 'Lamb mince topped with mashed potato.', 'Dinner', 'British', 'Non-Vegetarian', 'Baked', 'Savory', 'Main Course', 'Soft', 'High-Protein', 4.5, 50),
('Quesadilla', 420.00, 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=2000&auto=format&fit=crop', 'Toasted flour tortilla with melted cheese.', 'Lunch', 'Mexican', 'Vegetarian', 'Grilled', 'Savory', 'Snack', 'Chewy', 'Kid-Friendly', 4.4, 10),
('Ceviche', 850.00, 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=2000&auto=format&fit=crop', 'Raw fish cured in citrus juices and chili.', 'Lunch', 'Peruvian', 'Pescatarian', 'Raw', 'Sour', 'Starter', 'Fresh', 'Low-Calorie', 4.8, 15),
('Pad See Ew', 520.00, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop', 'Wide rice noodles with soy sauce and kale.', 'Dinner', 'Thai', 'Non-Vegetarian', 'Stir-Fried', 'Savory', 'Main Course', 'Chewy', 'Nut-Free', 4.6, 20),
('Bibimbap', 650.00, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=2000&auto=format&fit=crop', 'Korean mixed rice with vegetables and egg.', 'Lunch', 'Korean', 'Vegetarian', 'Steamed', 'Spicy', 'Main Course', 'Grains', 'Superfood', 4.7, 30),
('Kimchi Jjigae', 580.00, 'https://images.unsplash.com/photo-1553163147-622ab70be1c7?q=80&w=2000&auto=format&fit=crop', 'Spicy Korean army stew with kimchi.', 'Dinner', 'Korean', 'Non-Vegetarian', 'Boiled', 'Spicy', 'Main Course', 'Saucy', 'Traditional', 4.6, 25),
('Gyoza (6pcs)', 380.00, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=2000&auto=format&fit=crop', 'Pan-fried Japanese dumplings.', 'Appetizer', 'Japanese', 'Non-Vegetarian', 'Pan-Fried', 'Savory', 'Starter', 'Soft', 'Child-Friendly', 4.7, 15),
('Chicken Shawarma', 450.00, 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=2000&auto=format&fit=crop', 'Spiced chicken wrap with garlic sauce.', 'Lunch', 'Middle Eastern', 'Non-Vegetarian', 'Roasted', 'Garlicky', 'Main Course', 'Chewy', 'High-Protein', 4.8, 15),
('Poke Bowl', 720.00, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop', 'Hawaiian raw fish bowl with vegetables.', 'Lunch', 'Hawaiian', 'Pescatarian', 'Raw', 'Umami', 'Main Course', 'Fresh', 'Keto', 4.9, 15),
('Acai Bowl', 480.00, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=2000&auto=format&fit=crop', 'Superfood berry smoothie bowl with nuts.', 'Breakfast', 'Modern', 'Vegan', 'Frozen', 'Sweet', 'Breakfast', 'Smooth', 'Superfood', 4.7, 10),
('Lentil Soup', 280.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2000&auto=format&fit=crop', 'Hearty spiced lentil soup.', 'Lunch', 'Global', 'Vegan', 'Boiled', 'Savory', 'Soup', 'Saucy', 'High-Protein', 4.6, 30),
('Cauliflower Steak', 520.00, 'https://images.unsplash.com/photo-1572453860999-1ad12419a4e2?q=80&w=2000&auto=format&fit=crop', 'Roasted thick-cut cauliflower with spices.', 'Dinner', 'Modern', 'Vegan', 'Roasted', 'Smoky', 'Main Course', 'Firm', 'Low-Calorie', 4.4, 25),
('Greek Salad', 380.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2000&auto=format&fit=crop', 'Fresh salad with cucumber, tomato, feta.', 'Lunch', 'Greek', 'Vegetarian', 'Raw', 'Savory', 'Salad', 'Crunchy', 'Gluten-Free', 4.5, 10),
('Moussaka', 650.00, 'https://images.unsplash.com/photo-1619895092538-128341783023?q=80&w=2000&auto=format&fit=crop', 'Baked eggplant dish with ground meat.', 'Dinner', 'Greek', 'Non-Vegetarian', 'Baked', 'Savory', 'Main Course', 'Melted', 'Traditional', 4.6, 90),
('Paneer Tikka', 450.00, 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=2160&auto=format&fit=crop', 'Grilled spiced cottage cheese cubes.', 'Appetizer', 'Indian', 'Vegetarian', 'Grilled', 'Spicy', 'Starter', 'Firm', 'Gluten-Free', 4.7, 30),
('Butter Chicken Special', 750.00, 'https://images.unsplash.com/photo-1603894584202-74955365511b?q=80&w=2070&auto=format&fit=crop', 'Our signature tender butter chicken.', 'Dinner', 'Indian', 'Non-Vegetarian', 'Stewed', 'Spicy', 'Main Course', 'Saucy', 'Halal', 4.9, 45),
('Aloo Gobi', 320.00, 'https://images.unsplash.com/photo-1542361345-316262444983?q=80&w=2000&auto=format&fit=crop', 'Potatoes and cauliflower sautéed with turmeric.', 'Lunch', 'Indian', 'Vegan', 'Sautéed', 'Savory', 'Main Course', 'Dry', 'Gluten-Free', 4.4, 25),
('Chicken Biryani Premium', 850.00, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=2020&auto=format&fit=crop', 'Royal saffron-infused hyderabadi biryani.', 'Dinner', 'Hyderabadi', 'Non-Vegetarian', 'Steamed', 'Spicy', 'Main Course', 'Grains', 'Traditional', 4.9, 60),
('Chole Bhature', 280.00, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop', 'Spiced chickpeas with puffy fried bread.', 'Brunch', 'Punjabi', 'Vegetarian', 'Deep-Fried', 'Spicy', 'Main Course', 'Soft', 'Modern', 4.7, 30),
('Pork Schnitzel', 650.00, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2000&auto=format&fit=crop', 'Breaded and fried pork cutlet.', 'Dinner', 'German', 'Non-Vegetarian', 'Deep-Fried', 'Savory', 'Main Course', 'Crispy', 'Traditional', 4.5, 30),
('Iced Americano', 220.00, 'https://images.unsplash.com/photo-1553909489-cd47e0907d3f?q=80&w=2000&auto=format&fit=crop', 'Strong espresso over ice.', 'Beverage', 'Global', 'Vegan', 'Chilled', 'Bitter', 'Beverage', 'Liquid', 'Low-Calorie', 4.2, 5),
('Matcha Latte', 350.00, 'https://images.unsplash.com/photo-1515823662273-0b503e8ade3c?q=80&w=2000&auto=format&fit=crop', 'Japanese green tea powder with steamed milk.', 'Beverage', 'Japanese', 'Vegetarian', 'Hot', 'Earthy', 'Beverage', 'Smooth', 'Superfood', 4.6, 5),
('Strawberry Cheesecake', 450.00, 'https://images.unsplash.com/photo-1524350303350-0a808064972e?q=80&w=2000&auto=format&fit=crop', 'Rich and creamy cheesecake with strawberries.', 'Dessert', 'Global', 'Vegetarian', 'Chilled', 'Sweet', 'Dessert', 'Creamy', 'Traditional', 4.8, 30),
('Egg Curry', 420.00, 'https://images.unsplash.com/photo-1601050633647-81a357597335?q=80&w=2000&auto=format&fit=crop', 'Boiled eggs in a rich spicy gravy.', 'Lunch', 'Indian', 'Vegetarian', 'Stewed', 'Spicy', 'Main Course', 'Saucy', 'High-Protein', 4.5, 30),
('Grilled Salmon', 1200.00, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000&auto=format&fit=crop', 'Char-grilled salmon fillet with lemon.', 'Dinner', 'Global', 'Pescatarian', 'Grilled', 'Savory', 'Main Course', 'Firm', 'Superfood', 4.9, 25),
('Vegan Burger', 550.00, 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=2000&auto=format&fit=crop', 'Plant-based patty with vegan mayo.', 'Lunch', 'Modern', 'Vegan', 'Grilled', 'Savory', 'Main Course', 'Chewy', 'Lactose-Free', 4.5, 20),
('Chocolate Lava Cake', 380.00, 'https://images.unsplash.com/photo-1541992224029-7c929a6bc2cc?q=80&w=2000&auto=format&fit=crop', 'Warm chocolate cake with molten center.', 'Dessert', 'French', 'Vegetarian', 'Baked', 'Sweet', 'Dessert', 'Melted', 'Modern', 4.9, 20),
('Hyderabadi Haleem', 750.00, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=2000&auto=format&fit=crop', 'Stew of meat, lentils and pounded wheat.', 'Dinner', 'Hyderabadi', 'Non-Vegetarian', 'Slow-Cooked', 'Savory', 'Main Course', 'Creamy', 'Traditional', 4.9, 480);

-- Create the feedback table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    order_number TEXT NOT NULL,
    customer_name TEXT,
    feedback_type TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    branch TEXT NOT NULL, -- Renamed from branch_name to branch per user request
    images TEXT[], 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS and add policy for public inserts
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for all users" ON feedback FOR INSERT WITH CHECK (true);
