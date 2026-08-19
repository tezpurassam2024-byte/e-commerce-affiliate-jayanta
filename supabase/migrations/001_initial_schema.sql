-- =========================================================
-- SmartPick Guide: Supabase Initial Database Schema & RLS
-- Migration: 001_initial_schema.sql
-- =========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(64) DEFAULT 'Layers',
  featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(191) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(128) NOT NULL,
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(128),
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  editor_score NUMERIC(3, 1) DEFAULT 9.0,
  verdict TEXT,
  best_for VARCHAR(255),
  asin VARCHAR(32),
  amazon_url TEXT NOT NULL,
  affiliate_url TEXT,
  image_url TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  price NUMERIC(10, 2),
  currency VARCHAR(8) DEFAULT 'USD',
  price_note TEXT DEFAULT 'Price information may change. Check Amazon for the latest price.',
  price_last_updated DATE DEFAULT CURRENT_DATE,
  rating NUMERIC(3, 1),
  review_count INTEGER DEFAULT 0,
  availability VARCHAR(32) DEFAULT 'in_stock',
  key_features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  who_should_buy JSONB DEFAULT '[]'::jsonb,
  who_should_avoid JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Buying Guides Table
CREATE TABLE IF NOT EXISTS buying_guides (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(191) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(128),
  author JSONB DEFAULT '{"name": "Editorial Team", "role": "Staff Reviewer", "avatar": ""}'::jsonb,
  recommended_product_ids JSONB DEFAULT '[]'::jsonb,
  top_pick_product_id VARCHAR(64),
  best_budget_product_id VARCHAR(64),
  best_premium_product_id VARCHAR(64),
  selection_criteria JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_time_minutes INTEGER DEFAULT 5
);

-- 5. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(191) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  category VARCHAR(128) NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  author JSONB DEFAULT '{"name": "Editorial Team", "role": "Staff Reviewer", "avatar": ""}'::jsonb,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_time_minutes INTEGER DEFAULT 5
);

-- 6. Affiliate Click Tracking Table (Internal Analytics)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  placement VARCHAR(64) DEFAULT 'button_cta',
  page_path VARCHAR(255) NOT NULL,
  asin VARCHAR(32),
  marketplace VARCHAR(32) DEFAULT 'amazon.com',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source_page VARCHAR(255),
  subscribed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON buying_guides(slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created ON affiliate_clicks(created_at);

-- 11. Row Level Security (RLS) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE buying_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (published = true);
CREATE POLICY "Public can view published guides" ON buying_guides FOR SELECT USING (published = true);
CREATE POLICY "Public can view published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Public Insert for Analytics & Inquiries
CREATE POLICY "Public can record affiliate clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit contact inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Admin Full Access (Authenticated users via Supabase Auth)
CREATE POLICY "Admin full access on categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on guides" ON buying_guides FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on posts" ON blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on clicks" ON affiliate_clicks FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on subscribers" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on inquiries" ON contact_inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on settings" ON site_settings FOR ALL TO authenticated USING (true);
