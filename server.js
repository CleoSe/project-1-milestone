const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const dataPath = path.join(__dirname, 'data.json');

const app = express();
dotenv.config();

// set HTTP_PORT
const HTTP_PORT = process.env.PORT || 8080;

// set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/resources", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "resources.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "services.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});


// 404 error handler for undefined routes
/*
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
*/
// setup server


app.post('/submit-form', (req, res) => {
    const newEntry = req.body; 

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Server Error");
        }

        const entries = JSON.parse(data);

        entries.push(newEntry);

        fs.writeFile(dataPath, JSON.stringify(entries, null, 2), (err) => {
            if (err) return res.status(500).send("Error saving data");
            
            res.redirect('/view-data');
        });
    });
});

app.get('/view-data', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        const entries = JSON.parse(data);
        
        res.render('display', { entries: entries });
    });
});

app.listen(HTTP_PORT, () => {
  console.log(`App listening on port: ${HTTP_PORT}`);
});
