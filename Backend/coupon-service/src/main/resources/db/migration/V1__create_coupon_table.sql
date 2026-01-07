
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    min_amount DOUBLE PRECISION NOT NULL,
    discount_amount DOUBLE PRECISION NOT NULL,
    expiry_date DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE
);
