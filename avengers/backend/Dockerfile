FROM alpine:latest

# Install a simple HTTP server (busybox)
RUN apk --no-cache add busybox

# Expose port 8080
EXPOSE 8080

# Start the server to listen on port 8080
CMD httpd -f -p 8080 -h /var/www
