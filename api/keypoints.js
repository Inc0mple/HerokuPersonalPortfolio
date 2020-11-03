const mongo = require('mongodb');
const path = require("path");
const express = require("express");
const router = express.Router();
const multer  = require('multer'); 
const fs = require('fs'); 

const upload = multer({ dest: 'uploads/' });

router.get("/keypoints", function (req, res) {
  res.sendFile('/views/keypoints.html',{ root: "./" });
});

router.post("/keypoints/upload",upload.single("upfile"), (req, res) => {
    console.log(__dirname)
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "../uploads/rawImage.png");
      console.log("tempPath: ", tempPath, "targetPath: ", targetPath)
  
      if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg") {
        fs.rename(tempPath, targetPath, err => {
          if (err) throw err;
  
          res
            .status(200)
            .json("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) throw err;
          res
          .status(403)
          .json("Only .png and .jpg files are allowed!");
      });
    }
    
  }

);

router.get("/keypoints/upload/rawImage.png", (req, res) => {
    targetPath = path.join(__dirname, "../uploads/rawImage.png");
    res.sendFile(targetPath);
});

router.get("/keypoints/process", (req, res) => {
    console.log("route received")
    let spawn = require('child_process').spawn;
    let process = spawn('python', ['./pythonCV/detectPoints.py','./uploads/rawImage.png']  
    );
    //console.log("process: ", process)
    process.stdout.on('data', (data) => {
        console.log("now on stout")
        console.log(data)
        console.log(data.toString())
        if (data.toString() == "No person detected") {
          console.log("server acknowledged lack of person detection from python script")
          return res.json("No person detected")
        }
        return res.json(data.toString())
    });

    process.stderr.on('data', function(data) {
      console.log("stderr: "+ data.toString())
    });
    /*
    process.on('exit', function(code) {
      console.log('exit code: ' + code);
    });
    */
});

router.get("/keypoints/upload/processedImage.png", (req, res) => {
  targetPath = path.join(__dirname, "../uploads/processedImage.png");
  res.sendFile(targetPath);
});

  


module.exports = router;