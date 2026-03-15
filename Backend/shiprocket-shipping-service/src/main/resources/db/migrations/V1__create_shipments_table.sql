CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100),
    shipment_id VARCHAR(100),
    awb_code VARCHAR(100),
    courier VARCHAR(100),
    tracking_url TEXT,
    status VARCHAR(50)
);