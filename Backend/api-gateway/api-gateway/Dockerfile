# Use Node to build the React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
ARG VITE_GOOGLE_CLIENT_ID
RUN echo "VITE_API_BASE_URL=https://gomunchz.com" > .env
RUN echo "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" >> .env
RUN npm run build

# Use Maven to build the Spring Boot API Gateway
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /build

# Copy Gateway source and pom
COPY Backend/api-gateway/api-gateway/pom.xml .
COPY Backend/api-gateway/api-gateway/src ./src

# Create static directory if missing and Copy built frontend into it
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /frontend/dist src/main/resources/static/

RUN mvn clean package -DskipTests

# Final Stage: Create the runnable JAR image
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=backend-build /build/target/*.jar app.jar

# Optimized Java memory settings for VPS
ENTRYPOINT ["java","-Xmx256m","-Xms64m","-jar","app.jar"]
