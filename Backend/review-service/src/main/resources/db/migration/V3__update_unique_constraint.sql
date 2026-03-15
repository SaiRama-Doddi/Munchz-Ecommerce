-- Drop the old constraint that only allowed one review per product per user
ALTER TABLE review_schema.review DROP CONSTRAINT IF EXISTS unique_user_product;

-- Add a new constraint that allows one review per order item (order_id + product_id + user_id)
ALTER TABLE review_schema.review ADD CONSTRAINT unique_order_item_review UNIQUE (order_id, product_id, user_id);
