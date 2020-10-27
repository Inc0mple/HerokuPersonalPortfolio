const express = require("express");
const router = express.Router();

router.get("/timestamp", function (req, res) {
  res.sendFile("/views/timestamp.html",{ root: "./" });
});

router.get("/api/timestamp/:date_string?", function (req, res) {
  if (req.params.date_string == undefined) {
    //console.log("scenario 1")
    return res.json({
      unix: Date.parse(new Date()),
      utc: new Date().toUTCString(),
    });
  }

  try {
    let dateInput = isNaN(Date.parse(req.params.date_string))
      ? parseInt(req.params.date_string)
      : req.params.date_string;
    //console.log(new Date(dateInput).getTime());
    if (isNaN(new Date(dateInput))) {
      return res.json({ error: "Invalid Date" });
    }
    return res.json({
      unix: new Date(dateInput).getTime(),
      utc: new Date(dateInput).toUTCString(),
    });
  } catch (err) {
    console.log("Caught an error: " + err.message);
    return res.json({ error: "Invalid Date" });
  }
});

module.exports = router;
