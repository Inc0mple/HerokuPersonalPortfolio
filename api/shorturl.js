const mongo = require('mongodb');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //for shorturl
const shortid = require('shortid'); //for shorturl

const Schema  = mongoose.Schema;

const db_uri = "mongodb+srv://Incomple_:Overspleen@trainingcluster.s2foa.mongodb.net/shorturlDB?retryWrites=true&w=majority"



const ShortUrl = mongoose.model('ShortUrl', new Schema({ 
    original_url: String,
    short_url: String,
    suffix: String
   }));
  
  router.get("/shorturl", function (req, res) {
    res.sendFile( '/views/shorturl.html',{ root: "./" });
  });
  
  // from "https://www.geeksforgeeks.org/": The req.body property contains key-value 
  // pairs of data submitted in the request body.
  // By default, it is undefined and is populated when you use a body-parser middleware
  // such as app.use(bodyParser.urlencoded({ extended: false })) or app.use(bodyParser.json()).
  
  router.post("/api/shorturl/new", function (req, res) {
    let userInput = req.body.inputURL;
    ShortUrl.findOne({original_url: userInput}).then(function(result) {
      if (result == null) {
        let newShortId = shortid.generate();
        console.log(newShortId);
        // "newUrl" is a document created from the model "ShortUrl", which is created from a schema written several lines above
        let newUrl = new ShortUrl({
          original_url: userInput,
          short_url: "/api/shorturl/"+newShortId,
          suffix: newShortId
        })
        newUrl.save(function (err, data) {
          if (err) return console.log(err);
          console.log("Saved " + data + " to MongoDB")
        });
        //console.log("shorturl post request called. req.body: ");
        //console.log(req.body); "inputURL" is the value of the "name" attribute from the input element in shorturl.html
        return res.json({"original_url" : userInput ,"short_url": req.protocol + '://' + req.get('host') + req.originalUrl.slice(0,-3) + newShortId,"suffix": newShortId});
      }
      else{
        return res.json({"original_url" : result.original_url ,"short_url": req.protocol + '://' + req.get('host') + req.originalUrl.slice(0,-3) + result.suffix,"suffix": result.suffix});
      }
    });
  });
  
  router.get("/api/shorturl/:shortid", function(req, res) { //async required for await to work
    let idReq = req.params.shortid; 
    //console.log("idReq = " + idReq)
    ShortUrl.findOne({suffix: idReq}).then(function(result) {
      //console.log("result = " + result)
      if (result == null) {
        return res.json({"error":"No short URL found for the given input"});
      }
      else{
        res.redirect(result.original_url);
      }
    });
  });

module.exports = router;