ALTER TABLE orders
ADD COLUMN coupon_id INT;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_coupon
FOREIGN KEY (coupon_id)
REFERENCES coupons(id);
