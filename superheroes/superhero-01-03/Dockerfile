# Use an official Python runtime as the base image
FROM python:3.10-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install required Python packages
RUN pip install fastapi uvicorn

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]
