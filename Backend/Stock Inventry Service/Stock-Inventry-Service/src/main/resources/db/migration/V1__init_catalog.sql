CREATE TABLE stock_inventory (
    id SERIAL PRIMARY KEY,

    category_id BIGINT,
    category_name VARCHAR(150),

    sub_category_id BIGINT,
    sub_category_name VARCHAR(150),

    product_id BIGINT,
    product_name VARCHAR(150),

    variant_label VARCHAR(50),
    quantity INT,
    min_threshold INT DEFAULT 10
);
CREATE TABLE stock_transactions (
    id SERIAL PRIMARY KEY,

    product_id BIGINT,
    product_name VARCHAR(150),

    variant_label VARCHAR(50),
    quantity INT,
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


