-- ==========================================
-- SANGEM HOTELS DATABASE SCHEMA (UNIQUE IDs)
-- ==========================================

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS dishes_br1 CASCADE;
DROP TABLE IF EXISTS dishes_br2 CASCADE;
DROP TABLE IF EXISTS dishes_br3 CASCADE;
DROP TABLE IF EXISTS dishes_br4 CASCADE;
DROP TABLE IF EXISTS dishes_br5 CASCADE;

CREATE TABLE dishes_br1 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br2 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br3 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br4 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE dishes_br5 (id SERIAL PRIMARY KEY, dish_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price DECIMAL(10, 2) NOT NULL, image_url TEXT, description TEXT, category TEXT, cuisine TEXT, dietary_type TEXT, rating DECIMAL(2, 1) DEFAULT 4.5, prep_time INTEGER, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), created_at TIMESTAMPTZ DEFAULT now(), customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, customer_email TEXT, delivery_address TEXT NOT NULL, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, branch_id TEXT NOT NULL, total_amount DECIMAL(10, 2) NOT NULL, payment_method TEXT DEFAULT 'Cash on Delivery', order_status TEXT DEFAULT 'pending', items JSONB NOT NULL);
CREATE TABLE feedback (id SERIAL PRIMARY KEY, order_number TEXT NOT NULL, customer_name TEXT, feedback_type TEXT NOT NULL, rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), message TEXT NOT NULL, branch TEXT NOT NULL, images TEXT[], created_at TIMESTAMPTZ DEFAULT now());
