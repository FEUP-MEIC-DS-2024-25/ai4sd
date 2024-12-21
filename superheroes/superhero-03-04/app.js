const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");
const wireframeController = require("./wireframeController");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Support JSON body parsing

// Serve static files (e.g., wireframe images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the "uploads" directory for temporary PDF file uploads
const upload = multer({ dest: "uploads/" });

// Route for generating the wireframe
app.post("/generate-wireframe", upload.single("requirementsPdf"), wireframeController.generateWireframe);

// Route for regenerating the wireframe
app.post("/regenerate-wireframe", wireframeController.regenerateWireframe);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
