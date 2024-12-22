# Use an official Python runtime as a parent image
FROM python:3.12.6-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
    git

# Copy the entire project into the container
COPY . .
# Create the results directory
RUN mkdir -p backend/results

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

#Load the Secret
RUN --mount=type=secret,id=superhero-01-01-secret

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]