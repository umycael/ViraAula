# Compila o projeto
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Roda o projeto
FROM eclipse-temurin:21-jre

# Versão do yt-dlp que foi testada com o projeto
ARG YTDLP_VERSION=2026.10.26

# Programas externos que o backend chama
RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg python3 curl ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
         -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]