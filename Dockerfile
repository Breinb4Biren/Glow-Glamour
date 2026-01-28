# 1. Build the App
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
# CRITICAL FIX: Limit Maven memory so Render Free Tier doesn't crash
ENV MAVEN_OPTS="-Xmx300m"
RUN mvn clean package -DskipTests

# 2. Run the App
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]