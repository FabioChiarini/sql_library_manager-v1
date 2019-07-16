const express = require("express");
var router = express.Router();

//redirect users to /books route
router.get("/", (req, res) => {
  res.redirect("books");
});

module.exports = router;
