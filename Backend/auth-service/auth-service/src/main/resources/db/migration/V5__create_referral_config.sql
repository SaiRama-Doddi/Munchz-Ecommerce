CREATE TABLE referral_configs (
    id SERIAL PRIMARY KEY,
    reward_percentage DOUBLE PRECISION DEFAULT 0.0,
    fixed_amount DOUBLE PRECISION DEFAULT 0.0,
    minimum_order_amount DOUBLE PRECISION DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial configuration
INSERT INTO referral_configs (reward_percentage, fixed_amount, minimum_order_amount, is_active)
VALUES (5.0, 50.0, 500.0, TRUE);
