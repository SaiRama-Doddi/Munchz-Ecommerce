-- V1: Create orders and order_items tables
CREATE TABLE IF NOT EXISTS orders (
  order_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  user_name VARCHAR(255),
  address TEXT,
  total_amount NUMERIC(18,2),
  order_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS order_items (
  item_id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT,
  product_custom_id VARCHAR(255),
  product_name VARCHAR(255),
  category_id INT,
  category_name VARCHAR(255),
  variant_weight_in_grams INT,
  quantity_kg NUMERIC(18,3),
  unit_price NUMERIC(18,2),
  line_total NUMERIC(18,2),
  CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
