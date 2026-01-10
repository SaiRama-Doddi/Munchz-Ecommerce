ALTER TABLE order_items
ADD COLUMN variant_label VARCHAR(100);


CREATE INDEX idx_order_items_variant_label
ON order_items(variant_label);
