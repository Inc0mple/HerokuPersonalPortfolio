const express = require("express");
const router = express.Router();

router.get("/sudoku", function (req, res) {
  res.sendFile("/views/sudoku.html", { root: "./" });
});

module.exports = router;
