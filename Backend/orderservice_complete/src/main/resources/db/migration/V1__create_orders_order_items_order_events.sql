-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID,
    user_name VARCHAR(255),
    user_email VARCHAR(255),

    order_status VARCHAR(50),
    total_amount NUMERIC(18,2),

    total_tax NUMERIC(18,2),
    total_discount NUMERIC(18,2),

    payment_id UUID,
    coupon_code VARCHAR(50),
    currency VARCHAR(10),

    shipping_address JSONB,
    billing_address JSONB,

    placed_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    product_id BIGINT,
    sku_id VARCHAR(100),
    product_name VARCHAR(255),

    unit_price NUMERIC(18,2),
    quantity NUMERIC(18,2),
    line_total NUMERIC(18,2),

    tax_amount NUMERIC(18,2),
    discount_amount NUMERIC(18,2),

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

-- =====================================================
-- ORDER EVENTS TABLE
-- =====================================================
CREATE TABLE order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    event_type VARCHAR(50) NOT NULL,
    payload JSONB,

    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_order_events_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_events_order_id ON order_events(order_id);
