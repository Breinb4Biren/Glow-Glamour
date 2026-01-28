# 1. Build the App using Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
# Keep the memory limit to prevent crashing on Render Free Tier
ENV MAVEN_OPTS="-Xmx300m"
RUN mvn clean package -DskipTests

# 2. Run the App using Java 21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]