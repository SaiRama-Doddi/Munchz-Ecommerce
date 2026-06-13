#!/bin/bash

# Load environment variables from .env file
ENV_FILE="../.env"
if [ ! -f "$ENV_FILE" ]; then 
    ENV_FILE=".env"
fi

if [ -f "$ENV_FILE" ]; then
    echo "--- Loading environment variables from $ENV_FILE ---"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "WARNING: No .env file found!"
fi

# Determine Java command
JAVA_CMD=$(which java || echo "java")
echo "Using Java command: $JAVA_CMD"
$JAVA_CMD -version

echo "Starting Auth Service..."
nohup java -Xms64m -Xmx256m -jar auth-service/auth-service/target/auth-service-0.0.1-SNAPSHOT.jar > auth.log 2>&1 &

echo "Starting Product Service..."
nohup java -Xms64m -Xmx256m -jar product-service/target/product-details-service-0.0.1-SNAPSHOT.jar > product.log 2>&1 &

echo "Starting Order Service..."
nohup java -Xms64m -Xmx256m -jar order-service/target/orderservice-0.0.1-SNAPSHOT.jar > order.log 2>&1 &

echo "Starting Payment Service..."
nohup java -Xms64m -Xmx256m -jar payment-service/target/payment-service-0.0.1-SNAPSHOT.jar > payment.log 2>&1 &

echo "Starting Coupon Service..."
nohup java -Xms64m -Xmx256m -jar coupon-service/target/coupon-service-0.0.1-SNAPSHOT.jar > coupon.log 2>&1 &

echo "Starting Review Service..."
nohup java -Xms64m -Xmx256m -jar review-service/target/your-service-name-0.0.1-SNAPSHOT.jar > review.log 2>&1 &

echo "Starting Shipping Service..."
nohup java -Xms64m -Xmx256m -jar shiprocket-shipping-service/target/shipping-service-0.0.1-SNAPSHOT.jar > shipping.log 2>&1 &

echo "Starting Stock Service..."
nohup java -Xms64m -Xmx256m -jar stock-service/stock-inventry-service/target/stock-service-0.0.1-SNAPSHOT.jar > stock.log 2>&1 &

echo "Starting User Profile Service..."
nohup java -Xms64m -Xmx256m -jar user-profile-service/user-profile-service/target/user-profile-service-0.0.1-SNAPSHOT.jar > user.log 2>&1 &

echo "Starting Sub-Admin Service..."
nohup java -Xms64m -Xmx256m -jar subadmin-service/subadmin-service/target/subadmin-service-0.0.1-SNAPSHOT.jar > subadmin.log 2>&1 &

echo "Starting API Gateway..."
nohup java -Xms64m -Xmx256m -jar api-gateway/api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar > gateway.log 2>&1 &

echo "All services started!"
