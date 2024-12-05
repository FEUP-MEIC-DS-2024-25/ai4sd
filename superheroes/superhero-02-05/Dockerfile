# Use a lightweight Java runtime
FROM openjdk:11-jre-slim

# Install required runtime dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6 \
    fonts-dejavu-core \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

# Copy source files
COPY plantuml.jar /app/plantuml.jar
COPY PlantUMLServer.class /app/PlantUMLServer.class
COPY PlantUMLServer\$PlantUMLHandler.class /app/PlantUMLServer\$PlantUMLHandler.class
COPY PlantUMLServer\$ReadMeHandler.class /app/PlantUMLServer\$ReadMeHandler.class

WORKDIR /app

# Expose port 8080
EXPOSE 8080

# Run the Java server
CMD ["java", "-cp", ".", "PlantUMLServer"]
