"use strict";

const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();

const MONGODB_CONNECTION_STRING =
  "mongodb+srv://Incomple_:Overspleen@trainingcluster.s2foa.mongodb.net/shorturlDB?retryWrites=true&w=majority";
mongoose.connect(MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const Books = mongoose.model(
  "Books",
  new Schema({
    title: String,
    commentcount: { type: Number, default: 0 },
    comments: [String],
  })
);

router.get("/library", function (req, res) {
  res.sendFile("/views/library.html", { root: "./" });
});

router
  .route("/api/books")
  .get(function (req, res) {
    //response will be array of book objects
    //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    Books.find({})
      .select("-comment")
      .then(function (result) {
        //.select("-comment") not working as intended
        return res.json(result);
      });
  })

  .post(function (req, res) {
    let inputTitle = req.body.title;
    //response will contain new book object including atleast _id and title
    if (!inputTitle) return res.json("missing title");
    Books.findOne({ title: inputTitle }).then(function (result) {
      if (!result) {
        let newBook = new Books({
          title: inputTitle,
          commentcount: 0,
          comments: [],
        });
        newBook.save(function (err, data) {
          if (err) return console.log(err);
          console.log("Saved " + data + " to MongoDB");
          return res.json(data);
        });
      } else {
        return res.json("title already exists");
      }
    });
  })

  .delete(function (req, res) {
    //if successful response will be 'complete delete successful'
    Books.deleteMany({}).then(function (result) {
      console.log("deleted everything :(");
      return res.send("complete delete successful");
    });
  });

router
  .route("/api/books/:id")
  .get(function (req, res) {
    let bookid = req.params.id;
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    if (!ObjectId.isValid(bookid)) {
      console.log("invalid id for get req");
      return res.json("no book exists");
    }
    Books.findById(bookid).then(function (result) {
      if (!result) {
        return res.json("no book exists");
      }
      console.log("Book found");
      return res.json(result);
    });
  })

  .post(function (req, res) {
    let bookid = req.params.id;
    let comment = req.body.comment;
    //json res format same as .get
    if (!ObjectId.isValid(bookid)) {
      console.log("invalid id");
      return res.json("invalid id");
    }
    Books.findById(bookid).then(function (result) {
      if (!result) {
        return res.json("no book exists");
      }
      result.comments.push(comment);
      result.commentcount = result.comments.length;
      result.save((err, data) => {
        if (err) return console.log(err);
        return res.json(data);
      });
    });
  })

  .delete(function (req, res) {
    let bookid = req.params.id;
    //if successful response will be 'delete successful'
    if (!ObjectId.isValid(bookid)) {
      console.log("invalid id for delete req");
      return res.json("invalid id");
    }
    Books.findOneAndDelete({ _id: bookid }, function (err, result) {
      if (err) return console.log(err);
      console.log("Deleted " + result + " from MongoDB");
    });
  });

module.exports = router;
