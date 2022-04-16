const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/forum", (req, res, next) => {
  res.render("forum");
});

module.exports = router;
