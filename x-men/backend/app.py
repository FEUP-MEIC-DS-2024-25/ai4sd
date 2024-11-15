import http.server

# Set the port
PORT = 8080

# Create a basic request handler that always returns "Hello, World!"
class SimpleHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Hello, World!")

# Run the server
if __name__ == "__main__":
    server = http.server.HTTPServer(('0.0.0.0', PORT), SimpleHandler)
    print(f"Serving on port {PORT}")
    server.serve_forever()

