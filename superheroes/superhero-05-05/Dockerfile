# Stage 1: Build the Go application
FROM golang:1.23.0-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download Go modules
RUN go mod download

# Copy the gemini key from google environment variable
RUN echo 'GEMINI_API_KEY=$(T05_G04_GEMINI_API_KEY)' > .env

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o server ./cmd/server

# Stage 2: Run the application
FROM alpine:latest

# Set the Current Working Directory inside the container
WORKDIR /root/

# Install SSL certificates
RUN apk --no-cache add ca-certificates

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/server .

# Copy the .env file
COPY --from=builder /app/.env .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./server"]
