# ProductDetails - Catalog Service

Spring Boot microservice for managing product catalog:

- Category (mandatory)
- Optional Subcategory
- Product with many weight variants (weight-wise MRP and offer price)

## Stack

- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Validation
- PostgreSQL (local dev)
- Neon DB (cloud, via `neon` profile)
- Flyway for DB migrations
- Dockerfile for container build

## Key REST endpoints

### Categories

- `POST /api/categories`
- `GET /api/categories`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Subcategories

- `POST /api/subcategories`
- `GET /api/subcategories/{id}`
- `PUT /api/subcategories/{id}`
- `DELETE /api/subcategories/{id}`
- `GET /api/subcategories/by-category/{categoryId}`

### Products

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `GET /api/products/by-category/{categoryId}`
- `GET /api/products/by-category/{categoryId}/subcategory/{subcategoryId}`

## How to run (local PostgreSQL)

1. Create DB:

   ```sql
   CREATE DATABASE productdetails;
   ```

2. Update `spring.datasource.username` and `spring.datasource.password` in `application.yml` if needed.

3. Build and run:

   ```bash
   mvn clean package
   java -jar target/product-details-service-0.0.1-SNAPSHOT.jar
   ```

Flyway will automatically create tables on startup.

## Run with Neon DB

Set environment variables:

- `NEON_DB_URL`
- `NEON_DB_USER`
- `NEON_DB_PASSWORD`

Then run with profile:

```bash
java -jar target/product-details-service-0.0.1-SNAPSHOT.jar --spring.profiles.active=neon
```
