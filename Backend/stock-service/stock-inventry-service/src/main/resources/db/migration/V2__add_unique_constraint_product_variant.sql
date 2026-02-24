ALTER TABLE stock_inventory
ADD CONSTRAINT uq_product_variant
UNIQUE (product_id, variant_label);
