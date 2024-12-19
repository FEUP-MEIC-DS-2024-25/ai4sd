# backend/Dockerfile
FROM python:3

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port
EXPOSE 8080

RUN --mount=type=secret,id=secret \
    cat /run/secrets/secret > /etc/gemini_token

# Command to run the gRPC server
CMD ["python", "server.py"]
