const express = require("express");
const models = require("../models");
const router = express.Router();

router.get("/:slug", (req, res, next) => {
  res.render("quiz", { userId: req.params.slug });
});

router.post("/:slug", (req, res) => {
  console.log(req.params.slug);
  models.User.findOne({
    where: {
      userId: req.params.slug,
    },
  })
    .then((user) => {
      user.update({
        passed: 1,
      });
      console.log(user);
    })
    .then(() => {
      res.render("congrats");
    });
});

module.exports = router;
