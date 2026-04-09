#!/bin/bash

# Load environment variables from .env file
if [ -f "../.env" ]; then
    echo "Loading environment variables from ../.env"
    export $(grep -v '^#' ../.env | xargs)
elif [ -f ".env" ]; then
    echo "Loading environment variables from .env"
    export $(grep -v '^#' .env | xargs)
else
    echo "WARNING: No .env file found! Service startup might fail due to missing keys."
fi


echo "Starting Auth Service..."
nohup java -jar auth-service/auth-service/target/auth-service-0.0.1-SNAPSHOT.jar > auth.log 2>&1 &

echo "Starting Product Service..."
nohup java -jar product-service/target/product-details-service-0.0.1-SNAPSHOT.jar > product.log 2>&1 &

echo "Starting Order Service..."
nohup java -jar order-service/target/orderservice-0.0.1-SNAPSHOT.jar > order.log 2>&1 &

echo "Starting Payment Service..."
nohup java -jar payment-service/target/payment-service-0.0.1-SNAPSHOT.jar > payment.log 2>&1 &

echo "Starting Coupon Service..."
nohup java -jar coupon-service/target/coupon-service-0.0.1-SNAPSHOT.jar > coupon.log 2>&1 &

echo "Starting Review Service..."
nohup java -jar review-service/target/your-service-name-0.0.1-SNAPSHOT.jar > review.log 2>&1 &

echo "Starting Shipping Service..."
nohup java -jar shiprocket-shipping-service/target/shipping-service-0.0.1-SNAPSHOT.jar > shipping.log 2>&1 &

echo "Starting Stock Service..."
nohup java -jar stock-service/stock-inventry-service/target/stock-service-0.0.1-SNAPSHOT.jar > stock.log 2>&1 &

echo "Starting User Profile Service..."
nohup java -jar user-profile-service/user-profile-service/target/user-profile-service-0.0.1-SNAPSHOT.jar > user.log 2>&1 &

echo "Starting Sub-Admin Service..."
nohup java -jar subadmin-service/subadmin-service/target/subadmin-service-0.0.1-SNAPSHOT.jar > subadmin.log 2>&1 &

echo "Starting API Gateway..."
nohup java -jar api-gateway/api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar > gateway.log 2>&1 &

echo "All services started!"
