-- ================================
-- CATEGORIES TABLE
-- ================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    thumbnail_image VARCHAR(500),
    custom_id VARCHAR(20) UNIQUE,            -- moved comma instead of semicolon
    description VARCHAR(500)
);

-- ================================
-- SUBCATEGORIES TABLE
-- ================================
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    custom_id VARCHAR(20) UNIQUE,            -- custom id added
    description VARCHAR(500),
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

-- ================================
-- PRODUCTS TABLE
-- ================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    custom_id VARCHAR(30) UNIQUE,            -- product custom id added
    description VARCHAR(2000),
    image_url VARCHAR(500),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    subcategory_id BIGINT REFERENCES subcategories(id)
);

-- ================================
-- INDEXES FOR PRODUCT FILTERING
-- ================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);

-- ================================
-- PRODUCT VARIANTS TABLE
-- ================================
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    weight_label VARCHAR(50) NOT NULL,
    weight_in_grams INTEGER,
    mrp NUMERIC(10,2) NOT NULL,
    offer_price NUMERIC(10,2)
);

-- ================================
-- PRODUCT IMAGES TABLE
-- ================================
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE TABLE product_stock (
    id SERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    subcategory_id BIGINT,
    product_id BIGINT NOT NULL,
    stock_in_kg DECIMAL(10,3) NOT NULL DEFAULT 0, -- ALWAYS KG
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_product_stock_product ON product_stock(product_id);
