const express = require("express");
const router = express.Router();

router.get("/productLandingPage", function (req, res) {
  res.sendFile("/views/productLandingPage.html", { root: "./" });
});

module.exports = router;
