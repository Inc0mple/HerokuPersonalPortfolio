const mongo = require('mongodb');
const express = require("express");
const router = express.Router();
const multer  = require('multer'); //for file metadata
const fs = require('fs'); //for file metadata 


const upload = multer({ dest: 'uploads/' });

router.get("/fileanalyse", function (req, res) {
  res.sendFile('/views/fileanalyse.html',{ root: "./" });
});

// variable in upload.single('') must have the same value as the 'name' attribute in the file input element in the html file
router.post("/fileanalyse/api/fileanalyse", upload.single('upfile'),function (req, res) {
  fs.unlink(__dirname + '/uploads/' + req.file.filename, function(err) { //deletes uploaded file to save space
    if (err) throw err;
    console.log('deleted ' + req.file.filename );
  });
  return res.json({"name":req.file.originalname,"type":req.file.mimetype,"size":req.file.size})
});

module.exports = router;