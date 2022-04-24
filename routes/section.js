const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/forum", (req, res, next) => {
  res.render("forum");
});

router.get("/teaparty", (req, res, next) => {
  res.render("teaparty");
});

module.exports = router;
