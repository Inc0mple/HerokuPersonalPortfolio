const express = require("express");
const router = express.Router(); 
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //for shorturl

const Schema  = mongoose.Schema;
const db_uri = "mongodb+srv://Incomple_:Overspleen@trainingcluster.s2foa.mongodb.net/shorturlDB?retryWrites=true&w=majority"

mongoose.connect(db_uri, {useNewUrlParser: true, useUnifiedTopology: true });


const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fr", "Sat"];

const Profile = mongoose.model(
  "Profile",
  new Schema({
    user_name: String,
    log: [
      {
        _id: false,
        description: String,
        duration: Number,
        date: { type: String, default: new Date().toDateString() },
      },
    ],
  })
);
//date: {type: String, default: `${days[new Date().getDay()]} ${months[new Date().getMonth()]} ${days[new Date().getDate()]} ${days[new Date().getFullYear()]}`}
router.get("/exercise", function (req, res) {
  res.sendFile("/views/exercise.html", { root: "./" });
});

//.lean() returns POJOs (plain old javascript objects)
router.get("/exercise/api/exercise/users", function (req, res) {
  Profile.find()
    .select("-log")
    .lean()
    .then((result) => {
      return res.send(result);
    });
});

router.post("/exercise/api/exercise/new-user", (req, res) => {
  let userInput = req.body.username;
  Profile.findOne({ user_name: userInput }).then((result) => {
    console.log("result = " + result);
    if (result == null) {
      let newUser = new Profile({
        user_name: userInput,
      });
      newUser.save((err, data) => {
        if (err) return console.log(err);
        console.log("Saved " + data + " to MongoDB");
      });
      //console.log("shorturl post request called. req.body: ");
      //console.log(req.body); "inputURL" is the value of the "name" attribute from the input element in shorturl.html
      return res.json({ username: newUser.user_name, _id: newUser._id });
    } else {
      return res.send("Username already taken");
    }
  });
});

router.post("/exercise/api/exercise/add", (req, res) => {
  let inputId = req.body.userId;
  let inputDescription = req.body.description;
  let inputDuration = parseFloat(req.body.duration);
  let inputDate;
  if (req.body.date) {
    inputDate = new Date(req.body.date);
  } else {
    inputDate = new Date();
  }
  console.log(inputDate);
  Profile.findOne({ _id: inputId }).then((result) => {
    //console.log("result = " + result)
    if (result == null) {
      return res.send("User not found");
    } else if (
      inputDescription == "" ||
      isNaN(inputDuration) ||
      isNaN(inputDate)
    ) {
      return res.send("Fields not completed properly");
    } else {
      let newLog = {
        description: inputDescription,
        duration: inputDuration,
        date: inputDate.toDateString(),
        //date: `${days[inputDate.getDay()]} ${months[inputDate.getMonth()]} ${inputDate.getDate()} ${inputDate.getFullYear()}`
      };
      result.log.push(newLog);
      result.save((err, data) => {
        if (err) return console.log(err);
        console.log("Saved " + data + " to MongoDB");
      });
      return res.json({
        _id: result._id,
        username: result.user_name,
        date: newLog.date,
        duration: newLog.duration,
        description: newLog.description,
      });
    }
  });
});

router.get("/exercise/api/exercise/log", function (req, res) {
  let inputId = req.query.userId;
  let fromDate = new Date(req.query.from);
  let toDate = new Date(req.query.to);
  let responseJson = {};

  if (mongoose.Types.ObjectId.isValid(inputId)) {
    Profile.findById(inputId).then((result) => {
      //bugs out if inputId is not in an mongoose id object format, hence requiring a (mongoose.Types.ObjectId.isValid(inputId)) check first
      //console.log("result = " + result)
      //console.log(fromDate)
      if (result == null) {
        return res.send("Unknown userId");
      } else {
        responseJson._id = result._id;
        responseJson.username = result.user_name;
        //let filteredResult = result;
        //console.log(result);
        let resultLog = result.log;
        if (isNaN(fromDate) == false && isNaN(toDate) == false) {
          responseJson.from = fromDate.toDateString();
          responseJson.to = toDate.toDateString();
          resultLog = result.log.filter((entry) => {
            //console.log(entry);
            return (
              new Date(entry.date) >= fromDate && new Date(entry.date) <= toDate
            );
          });
        } else if (isNaN(fromDate) == false && isNaN(toDate) == true) {
          responseJson.from = fromDate.toDateString();
          resultLog = result.log.filter((entry) => {
            //console.log(entry.date >= fromDate);
            return new Date(entry.date) >= fromDate;
          });
        } else if (isNaN(fromDate) == true && isNaN(toDate) == false) {
          responseJson.to = toDate.toDateString();
          resultLog = result.log.filter((entry) => {
            //console.log(entry.date >= fromDate);
            //console.log(entry);
            return new Date(entry.date) <= toDate;
          });
        }
        console.log(result.log);
        let reorderedLog = []; //Re-ordered the position of keys in the log for formatting purposes
        for (i in resultLog) {
          let newEntry = {};
          newEntry.description = resultLog[i].description;
          newEntry.duration = resultLog[i].duration;
          newEntry.date = resultLog[i].date;
          reorderedLog.push(newEntry);
        }
        console.log(reorderedLog);
        let limit =
          req.query.limit == "" ? reorderedLog.length : req.query.limit; //If limit is empty, limit = length of log
        reorderedLog.splice(0, reorderedLog.length - limit); //if limit empty, removes nothing, else remove everything - limit
        responseJson.count = reorderedLog.length;
        responseJson.log = reorderedLog;
        return res.send(responseJson);
      }
    });
  } else {
    return res.send("Unknown userId");
  }
});

module.exports = router;
