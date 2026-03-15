-- Fix: order_id column was UUID NOT NULL but the Review entity maps orderId as String.
-- In PostgreSQL, UUID must be cast to TEXT first before converting to VARCHAR.
ALTER TABLE review ALTER COLUMN order_id TYPE TEXT USING order_id::TEXT;
ALTER TABLE review ALTER COLUMN order_id DROP NOT NULL;
