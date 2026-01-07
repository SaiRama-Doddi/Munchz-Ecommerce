CREATE TABLE stock_inventory (
    id SERIAL PRIMARY KEY,

    category_id BIGINT,
    category_name VARCHAR(150),

    sub_category_id BIGINT,
    sub_category_name VARCHAR(150),

    product_id BIGINT NOT NULL,   -- ✅ FIXED
    product_name VARCHAR(150) NOT NULL,

    variant_label VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,

    min_threshold INT DEFAULT 10
);
CREATE TABLE offline_stock_inventory (
    id SERIAL PRIMARY KEY,

    category_id BIGINT,
    category_name VARCHAR(150),

    sub_category_id BIGINT,
    sub_category_name VARCHAR(150),

    product_id BIGINT NOT NULL,   -- ✅ FIXED
    product_name VARCHAR(150) NOT NULL,

    variant_label VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,

    min_threshold INT DEFAULT 10
);
CREATE TABLE stock_transactions (
    id SERIAL PRIMARY KEY,

    product_id BIGINT NOT NULL,
    product_name VARCHAR(150),

    variant_label VARCHAR(50),
    quantity INT NOT NULL,
    transaction_type VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE stock_entries (
    id SERIAL PRIMARY KEY,

    category_id BIGINT,
    category_name VARCHAR(150),

    sub_category_id BIGINT,
    sub_category_name VARCHAR(150),

    product_id BIGINT NOT NULL,
    product_name VARCHAR(150),

    supplier_name VARCHAR(150),
    supplier_gst VARCHAR(50),

    quantity INT NOT NULL,

    purchase_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),

    stock_in_date DATE,
    expiry_date DATE,

    remarks VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE VIEW vw_total_stock AS
SELECT
    ROW_NUMBER() OVER (ORDER BY product_name, variant_label) AS id,  -- ✅ STABLE ID

    product_id,
    product_name,
    variant_label,

    SUM(quantity) AS total_quantity,

    MAX(category_id) AS category_id,
    MAX(category_name) AS category_name,

    MAX(sub_category_id) AS sub_category_id,
    MAX(sub_category_name) AS sub_category_name
FROM (
    SELECT
        product_id,
        product_name,
        variant_label,
        quantity,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name
    FROM stock_inventory

    UNION ALL

    SELECT
        product_id,
        product_name,
        variant_label,
        quantity,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name
    FROM offline_stock_inventory
) s
GROUP BY product_id, product_name, variant_label;
