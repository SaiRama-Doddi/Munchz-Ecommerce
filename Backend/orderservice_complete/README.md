# orderservice (Complete CRUD microservice)

## Features
- Spring Boot 3.3.0 (Java 21)
- PostgreSQL (configurable in application.yml)
- Flyway migrations (db/migration/V1__create_order_tables.sql)
- Entities: Order, OrderItem
- CRUD endpoints for orders (create, get, list, update, delete)
- Request validation
- Simple event published on order creation
- Global exception handler
- Dockerfile for containerization

## Run locally
1. Update `src/main/resources/application.yml` with your DB settings.
2. Build:
   mvn clean package
3. Run:
   java -jar target/orderservice-0.0.1-SNAPSHOT.jar
   or
   mvn spring-boot:run

## API
POST /api/orders
GET /api/orders/{id}
GET /api/orders?page=0&size=10
PUT /api/orders/{id}
DELETE /api/orders/{id}

Example POST body:
{
  "userId": 1,
  "userName": "Prasanna",
  "address": "Some address",
  "items": [
    {
      "productId": 28,
      "productCustomId": "pragenpra007",
      "productName": "Cashew Premium",
      "categoryId": 3,
      "categoryName": "Dry Fruits",
      "variantWeightInGrams": 250,
      "quantityKg": 1.0,
      "unitPrice": 240.00
    }
  ]
}

