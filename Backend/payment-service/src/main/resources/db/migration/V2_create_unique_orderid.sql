ALTER TABLE payments
ADD CONSTRAINT uk_payments_order_id UNIQUE (order_id);