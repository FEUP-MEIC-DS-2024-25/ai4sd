# Variables
IMAGE_NAME = superhero-02-01
CONTAINER_NAME = superhero-02-01
PORT = 8080

# Build the Docker image
build:
	docker build --no-cache -t $(IMAGE_NAME) .

# Run the container (bottom option mounts volume for database file)
#run:
#	docker run -d -p $(PORT):8080 --name $(CONTAINER_NAME) $(IMAGE_NAME)
run:
	docker run -d -p $(PORT):8080 -v $(PWD)/data:/app/data --name $(CONTAINER_NAME) $(IMAGE_NAME)


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

# Run the context enhancing script inside the container (needs to create migrations for new designpattern model)
enhance-context:
	docker exec -it $(CONTAINER_NAME) python manage.py makemigrations
	docker exec -it $(CONTAINER_NAME) python manage.py migrate
	docker exec -it $(CONTAINER_NAME) python context_enhancing.py