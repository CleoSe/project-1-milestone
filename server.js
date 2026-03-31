const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const dataPath = path.join(__dirname, 'data.json');
const mongoose = require("mongoose");
const expressHandlebars = require('express-handlebars');


const app = express();
dotenv.config();

// set HTTP_PORT
const HTTP_PORT = process.env.PORT || 8080;

// set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('.hbs', expressHandlebars.engine({extname: '.hbs', defaultLayout: false}));
app.set('view engine', '.hbs');

mongoose.connect(process.env.MONGO_URL);

const submissionSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    query: String,
    isCompleted: { type: Boolean, default: false } 
});

const submission = mongoose.model('submission', submissionSchema);


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


app.post('/submit-form', async (req, res) => {
    const { firstName, lastName, email, query } = req.body;
    if (!firstName?.trim() || !email?.trim() || !query?.trim()) {
        return res.status(400).send("Form submission failed: Required fields are missing.");
    }
    try {
        await new submission(req.body).save();
        res.redirect('/view-data');
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

app.get('/view-data', async (req, res) => {
    const data = await submission.find().lean();
    res.render('display', {entries: data});
});

app.post('/delete/:id', async (req, res) => {
    await submission.findByIdAndDelete(req.params.id);
    res.redirect('/view-data');
});

app.post('/update/:id', async (req, res) => {
    try {
        await submission.findByIdAndUpdate(req.params.id, { isCompleted: true });
        res.redirect('/view-data');
    } catch (err) {
        res.status(500).send("Update Failed");
    }
});

app.listen(HTTP_PORT, () => {
  console.log(`App listening on port: ${HTTP_PORT}`);
});
