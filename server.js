const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

// Render provides the PORT via environment variable
const PORT = process.env.PORT || 8080;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/contact", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "contact.html"));
})

app.get("/resources", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "resources.html"));
})

app.get("/services", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "services.html"));
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});