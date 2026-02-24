CREATE TABLE review (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),

    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),

    rating INT NOT NULL,
    comment TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT unique_user_product UNIQUE (product_id, user_id)
);
