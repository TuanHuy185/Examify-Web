FROM openjdk:21-jdk

WORKDIR /app

COPY . .

RUN ./mvnw clean package -DskipTests

ENTRYPOINT ["java", "-jar", "target/*.jar"]