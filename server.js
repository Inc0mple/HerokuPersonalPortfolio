// server.js
// where your node app starts
//IMPROVABLE: USE ASYNC AWAIT INSTEAD OF "THEN" TO HANDLE PROMISES

// init project
const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //for shorturl
const shortid = require("shortid"); //for shorturl
const multer = require("multer"); //for file metadata
const fs = require("fs"); //for file metadata

const timestamp = require("./api/timestamp");
const requestheaderparser = require("./api/requestheaderparser");
const shorturl = require("./api/shorturl");
const fileanalyse = require("./api/fileanalyse");
const exercise = require("./api/exercise");
const sudoku = require("./api/sudoku");
const library = require("./api/library");

const Schema = mongoose.Schema;

const app = express();
const db_uri =
  "mongodb+srv://Incomple_:Overspleen@trainingcluster.s2foa.mongodb.net/shorturlDB?retryWrites=true&w=majority";

let port = process.env.PORT || 3000; //Good convention, since "process.env.PORT" will run correctly on heroku

/* Database */
mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true });

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require("cors");
const { generate } = require("shortid");
const { json } = require("body-parser");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//logger middleware code from https://codesource.io/creating-a-logging-middleware-in-expressjs/
app.use(function (req, res, next) {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    (current_datetime.getHours() > 10 ? current_datetime.getHours() : "0" + current_datetime.getHours()) +
    ":" +
    (current_datetime.getMinutes() > 10 ? current_datetime.getMinutes() : "0" + current_datetime.getMinutes()) +
    ":" +
    (current_datetime.getSeconds() > 10 ? current_datetime.getSeconds() : "0" + current_datetime.getSeconds());
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  let log = `[${method}:${url}] request received on ${formatted_date}. Status: ${status}`;
  console.log(log);
  next();
});
// The following 2 middleware is used if you want the form data to be available in req.body.
// I first started using this for the shorturl project. I think it is specific to POST requests.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/portfolio.html");
});


app.get("/index", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});
//**********Start of Timestamp API**********

app.get("/timestamp", timestamp);
app.get("/api/timestamp/:date_string?", timestamp);


//**********Start of Request Header Parser API**********
app.get("/requestheaderparser", requestheaderparser);
app.get("/api/whoami", requestheaderparser);


//**********Start of URL Shortener API**********

app.get("/shorturl", shorturl);
app.post("/api/shorturl/new", shorturl);
app.get("/api/shorturl/:shortid", shorturl);


//**********Start of File Metadata Microservice API**********

app.get("/fileanalyse", fileanalyse);
app.post("/fileanalyse/api/fileanalyse", fileanalyse);


//**********Start of Exercise Tracker API**********

app.get("/exercise", exercise);
app.get("/exercise/api/exercise/users", exercise);
app.post("/exercise/api/exercise/new-user", exercise);
app.post("/exercise/api/exercise/add", exercise);
app.get("/exercise/api/exercise/log", exercise);

//**********Start of Sudoku**********

app.get("/sudoku",sudoku);

//**********Start of Library**********

app.get("/library",library);
app.get("/api/books", library);
app.get("/api/books/:id", library);
app.post("/api/books", library);
app.post("/api/books/:id", library);
app.delete("/api/books", library);
app.delete("/api/books/:id", library);


// listen for requests :)
let listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
