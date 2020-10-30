const mongo = require('mongodb');
const express = require("express");
const router = express.Router();
const multer  = require('multer'); //for file metadata
const fs = require('fs'); //for file metadata 



//
// FILE ANALYSER
//
const upload = multer({ dest: 'uploads/' });

router.get("/microservices", function (req, res) {
  res.sendFile('/views/microservices.html',{ root: "./" });
});

// variable in upload.single('') must have the same value as the 'name' attribute in the file input element in the html file
router.post("/fileanalyse/upload", upload.single('upfile'),function (req, res) {
  console.log(req.file)
  fs.unlink('./uploads/' + req.file.filename, function(err) { //deletes uploaded file to save space
    if (err) throw err;
    console.log('deleted ' + req.file.filename );
  });
  return res.json({"name":req.file.originalname,"type":req.file.mimetype,"size":req.file.size})
});

//
// METRIC IMPERIAL CONVERTER
//

var ConvertHandler = require('./convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/microservices/convert')
    .get(function (req, res){
      var input = req.query.input;
      var initNum = convertHandler.getNum(input);
      var initUnit = convertHandler.getUnit(input);
      if (initNum == "invalid number" && initUnit == "invalid unit") {
        res.json("invalid number and unit")
      }

      if (initNum == "invalid number") {
        res.json("invalid number")
      }
      
      if (initUnit == "invalid unit") {
        res.json("invalid unit")
      }
      var returnNum = eval(convertHandler.convert(initNum, initUnit).toFixed(5));
      var returnUnit = convertHandler.getReturnUnit(initUnit);
      var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      
      var resJson = {}
      resJson['initNum'] = initNum
      resJson['initUnit'] = initUnit
      resJson['returnNum'] = returnNum
      resJson['returnUnit'] = returnUnit
      resJson['string'] = toString

      //res.json
       res.json(resJson)
      
      //res.json
    });
    
};









module.exports = router;