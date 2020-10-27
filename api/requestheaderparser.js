const express = require("express");
const router = express.Router();

router.get("/requestheaderparser", function (req, res) {
  res.sendFile("/views/requestheaderparser.html",{ root: "./" });
});

router.get("/api/whoami", function (req, res) {
  return res.json({
    ipaddress: req.ip,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

module.exports = router;
