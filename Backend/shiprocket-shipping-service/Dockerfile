FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java","-Xmx256m","-Xms64m","-jar","app.jar"]
