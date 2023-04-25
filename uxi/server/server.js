const express = require("express");
const multer = require("multer");
const socketIO = require("socket.io");
const http = require("http");
const fs = require("fs");
const cors = require("cors"); // Import the cors library
const { Buffer } = require("buffer"); // Import the Buffer class from the buffer module

const app = express();
const port = 3000; // Use any available port

// Enable CORS for all origins
app.use(cors());

// Set up Multer middleware to handle file uploads
const upload = multer({
  dest: "uploads/", // Destination directory to store uploaded files
});

// Create a server instance
const server = http.createServer(app);

// Create a Socket.io instance with cors options
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3001", // Set the allowed origin
    methods: ["GET", "POST"], // Set the allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

// Route to handle file upload
app.post("/upload", upload.single("document"), (req, res) => {
  // Access the uploaded file using req.file
  console.log("Received file:", req.file);
  // Add logic to process the file as needed
  // Send a response back to the client
  res.send("File received!");

  // Read the file from disk
  const fileData = fs.readFileSync(req.file.path);

  // Emit the file data to all connected clients
  io.emit("receiveDocument", {
    name: req.file.originalname,
    type: req.file.mimetype,
    data: Buffer.from(fileData).toString("base64"), // Use Buffer.from() to create a Buffer instance
  });

  // Delete the uploaded file from disk
  fs.unlinkSync(req.file.path);
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
