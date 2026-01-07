CREATE TABLE coupon_usage (
    id SERIAL PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id UUID NOT NULL,
    used_at TIMESTAMP DEFAULT now(),
    UNIQUE (coupon_id, user_id)
);
