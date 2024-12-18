# Use the official Python image
FROM python:3.9-slim

# Set the working directory 
WORKDIR /app

# Install any needed packages specified in requirements.txt
# COPY requirements.txt /app/   
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080 8080

ENV PYTHONUNBUFFERED=1

# Run app.py when the container launches
CMD ["python", "-u", "app.py"]