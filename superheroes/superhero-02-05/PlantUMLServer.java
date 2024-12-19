import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.UUID;

public class PlantUMLServer {
    public static void main(String[] args) throws IOException {
        // Create an HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Create context for root path to serve the README content
        server.createContext("/", new ReadMeHandler());
        
        // Create context for '/generate' to handle PlantUML diagram generation
        server.createContext("/generate", new PlantUMLHandler());

        server.setExecutor(null); // Default executor
        System.out.println("Server started on port 8080");
        server.start();
    }

    // Handler for serving the README page
    static class ReadMeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Read the README file and serve as an HTML response
            String readmeContent = getReadmeContent();
            
            // Set the content type to HTML
            exchange.getResponseHeaders().set("Content-Type", "text/html");
            
            // Send response headers with content length
            exchange.sendResponseHeaders(200, readmeContent.getBytes().length);
            
            // Write the content to the response body
            OutputStream os = exchange.getResponseBody();
            os.write(readmeContent.getBytes());
            os.close();
        }

        private String getReadmeContent() {
            // The content can be hardcoded or read from a README file
            return "<html>" +
                   "<head><title>PlantUML Server Documentation</title></head>" +
                   "<body>" +
                   "<h1>Welcome to a simple PlantUML generator</h1>" +
                   "<p>This is a simple HTTP server written in Java that listens on port 8080 and provides an endpoint to generate PlantUML diagrams in PNG format. The server listens for POST requests at the /generate endpoint.</p>" +
                   "<h3>Authors:</h3>" +
                   "<p>Class 2 Team 1</p>" +
                   "<h2>Endpoint: POST /generate</h2>" +
                   "<p>This endpoint accepts PlantUML code as the request body and generates a diagram based on the code. The response is a PNG image of the diagram.</p>" +
                   "<h3>Request Format</h3>" +
                   "<pre>" +
                   "Method: POST\n" +
                   "Content-Type: text/plain\n" +
                   "Body: PlantUML code as a plain text string." +
                   "</pre>" +
                   "<h4>Example Request</h4>" +
                   "<pre>" +
                   "curl -X POST http://localhost:8080/generate \\\n" +
                   "    -H \"Content-Type: text/plain\" \\\n" +
                   "    -d \"@startuml\\nAlice -> Bob: Hello\\n@enduml\"" +
                   "</pre>" +
                   "<h3>Response Format</h3>" +
                   "<p>If the request is successful, the response will be a PNG image of the diagram.</p>" +
                   "<pre>" +
                   "HTTP/1.1 200 OK\n" +
                   "Content-Type: image/png\n" +
                   "<PNG Image Binary Data>" +
                   "</pre>" +
                   "<h3>Example Use Case</h3>" +
                   "<ol>" +
                   "<li>Start the server with: <code>java PlantUMLServer</code></li>" +
                   "<li>Generate a diagram using <code>curl</code>:</li>" +
                   "<pre>" +
                   "curl -X POST http://localhost:8080/generate \\\n" +
                   "    -H \"Content-Type: text/plain\" \\\n" +
                   "    -d \"@startuml\\nAlice -> Bob: Hello\\n@enduml\" \\\n" +
                   "    --output diagram.png" +
                   "</pre>" +
                   "</ol>" +
                   "<h3>Error Handling</h3>" +
                   "<ul>" +
                   "<li><strong>400 Bad Request</strong>: If no PlantUML code is provided or the code is invalid.</li>" +
                   "<li><strong>405 Method Not Allowed</strong>: If the request method is not POST.</li>" +
                   "<li><strong>500 Internal Server Error</strong>: If there is an issue generating the diagram.</li>" +
                   "<ul>" +
                   "<ul>" +
                   "</body>" +
                   "</html>";
        }
    }

    // Handler for generating PlantUML diagrams
    static class PlantUMLHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
                return;
            }

            // Read the request body (PlantUML code)
            InputStream inputStream = exchange.getRequestBody();
            String plantUMLCode = new String(inputStream.readAllBytes());
            inputStream.close();

            if (plantUMLCode.isEmpty()) {
                exchange.sendResponseHeaders(400, -1); // Bad Request
                return;
            }

            // Create temporary files for PlantUML
            File inputFile = new File("/tmp/" + UUID.randomUUID() + ".puml");
            File outputFile = new File(inputFile.getParent(), inputFile.getName().replace(".puml", ".png"));

            try (FileWriter writer = new FileWriter(inputFile)) {
                writer.write(plantUMLCode);
            }

            try {
                // Run PlantUML to generate the diagram
                Process process = new ProcessBuilder(
                        "java", "-jar", "plantuml.jar", inputFile.getAbsolutePath())
                        .redirectErrorStream(true)
                        .start();

                int exitCode = process.waitFor();
                if (exitCode != 0 || !outputFile.exists()) {
                    String errorMessage = new String(process.getInputStream().readAllBytes());
                    exchange.sendResponseHeaders(500, errorMessage.length());
                    OutputStream os = exchange.getResponseBody();
                    os.write(errorMessage.getBytes());
                    os.close();
                    inputFile.delete();
                    return;
                }

                // Send the generated image back to the client
                byte[] imageBytes = new FileInputStream(outputFile).readAllBytes();
                exchange.getResponseHeaders().set("Content-Type", "image/png");
                exchange.sendResponseHeaders(200, imageBytes.length);

                OutputStream os = exchange.getResponseBody();
                os.write(imageBytes);
                os.close();

            } catch (InterruptedException e) {
                exchange.sendResponseHeaders(500, -1);
                e.printStackTrace();
            } finally {
                // Clean up temporary files
                inputFile.delete();
                outputFile.delete();
            }
        }
    }
}
