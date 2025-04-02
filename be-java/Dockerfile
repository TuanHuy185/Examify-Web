FROM openjdk:21-jdk

WORKDIR /app

COPY target/examify.jar examify.jar

ENTRYPOINT ["java", "-jar", "examify.jar"]