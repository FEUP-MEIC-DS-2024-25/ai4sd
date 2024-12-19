# Variables
IMAGE_NAME = plantuml-server-java
CONTAINER_NAME = plantuml-server-java
PORT = 8080

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the container
run:
	docker run -d -p $(PORT):8080 --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Stop and remove the container
down:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Remove the Docker image
remove-image:
	docker rmi -f $(IMAGE_NAME) || true

# Clean everything (container + image)
clean: down remove-image

# logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Open a shell in the container
shell:
	docker run -it --entrypoint /bin/bash ${IMAGE_NAME}

# compile
compile:
	javac PlantUMLServer.java