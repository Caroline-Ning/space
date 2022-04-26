const express = require("express");
const router = express.Router();
const models = require("../models");
const sequelize = require("sequelize");
const async = require("async");

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthen");
  }

  next();
}

// prettier-ignore
const months=['January','February','March','April','May','June','July','August','September','October','November','December']

function showDate(rawTime) {
  return `${months[rawTime.getMonth()]} ${rawTime.getDate()}, ${
    rawTime.getYear() + 1900
  }`;
}

router.get("/profile", ensureAuthenticated, (req, res, next) => {
  models.User.findOne({
    where: {
      userId: req.user.id,
    },
  })
    .then((user) => {
      const mbti = user.mbti ? user.mbti : "mbti";
      const enne = user.enne ? user.enne : "ennegram";
      const soci = user.soci ? user.soci : "socinic";
      const desc = user.desc ? user.desc : "Introduce yourself...";

      const userData = {
        displayName: user.displayName,
        imgSrc: user.imgSrc,
        joinDate: showDate(user.createdAt),
        mbti: mbti,
        enne: enne,
        soci: soci,
        desc: desc,
        passed: user.passed,
      };
      return userData;
    })
    .then((userData) => {
      models.Post.findAll({
        where: {
          authorId: req.user.id,
        },
        order: sequelize.literal("createdAt DESC"),
      }).then((posts) => {
        let postData = [];

        async.eachSeries(
          posts,
          (post, callback) => {
            post = post.get({ plain: true });

            models.Comment.count({
              where: {
                postId: post.postId,
              },
            }).then((count) => {
              commentCount = count;
              postData.push({
                postId: post.postId,
                category: post.category,
                title: post.title,
                createdAt: showDate(post.createdAt),
                authorName: userData.displayName,
                commentCount: commentCount,
              });
              callback();
            });
          },
          (err) => {
            return res.render("profile", { user: userData, posts: postData });
          }
        );
      });
    });
});

//------------------ see other user profile page -------------------------
router.get("/:userid", (req, res, next) => {
  if (req.params.userid === req.user.id) {
    res.redirect("/users/profile");
  }

  models.User.findOne({
    where: {
      userId: req.params.userid,
    },
  })
    .then((user) => {
      const mbti = user.mbti ? user.mbti : "mbti";
      const enne = user.enne ? user.enne : "ennegram";
      const soci = user.soci ? user.soci : "socinic";
      const desc = user.desc ? user.desc : "Introduce yourself...";

      const userData = {
        displayName: user.displayName,
        imgSrc: user.imgSrc,
        joinDate: showDate(user.createdAt),
        mbti: mbti,
        enne: enne,
        soci: soci,
        desc: desc,
        passed: user.passed,
        me: false,
      };
      return userData;
    })
    .then((userData) => {
      models.Post.findAll({
        where: {
          authorId: req.params.userid,
        },
        order: sequelize.literal("createdAt DESC"),
      }).then((posts) => {
        let postData = [];
        let commentCount;

        async.eachSeries(
          posts,
          (post, callback) => {
            post = post.get({ plain: true });

            models.Comment.count({
              where: {
                postId: post.postId,
              },
            }).then((count) => {
              commentCount = count;
              postData.push({
                postId: post.postId,
                category: post.category,
                title: post.title,
                createdAt: showDate(post.createdAt),
                authorName: userData.displayName,
                commentCount: commentCount,
              });
              callback();
            });
          },
          (err) => {
            console.log(postData);
            return res.render("profile", { user: userData, posts: postData });
          }
        );
      });
    });
});

router.get("/profile/edit", ensureAuthenticated, (req, res) => {
  models.User.findOne({
    where: {
      userId: req.user.id,
    },
  })
    .then((user) => {
      const userData = {
        displayName: user.displayName,
        imgSrc: user.imgSrc,
        joinDate: showDate(user.createdAt),
        passed: user.passed,
      };
      return userData;
    })
    .then((userData) => {
      models.Post.findAll({
        where: {
          authorId: req.user.id,
        },
        order: sequelize.literal("createdAt DESC"),
      }).then((posts) => {
        let postData = [];

        async.eachSeries(
          posts,
          (post, callback) => {
            post = post.get({ plain: true });

            models.Comment.count({
              where: {
                postId: post.postId,
              },
            }).then((count) => {
              commentCount = count;
              postData.push({
                postId: post.postId,
                category: post.category,
                title: post.title,
                createdAt: showDate(post.createdAt),
                authorName: userData.displayName,
                commentCount: commentCount,
              });
              callback();
            });
          },
          (err) => {
            const edit = true;
            return res.render("profile", {
              edit,
              user: userData,
              posts: postData,
            });
          }
        );
      });

      // res.render("profile", { user: userData });
    });
});

router.post("/profile/edit", ensureAuthenticated, (req, res) => {
  models.User.findOne({
    where: {
      userId: req.user.id,
    },
  })
    .then((user) => {
      let mbti, enne, soci, desc;
      mbti = req.body.mbti ? req.body.mbti : "";
      enne = req.body.enne ? req.body.enne : "";
      soci = req.body.soci ? req.body.soci : "";
      desc = req.body.desc ? req.body.desc : "";

      user.update({
        mbti: mbti,
        enne: enne,
        soci: soci,
        desc: desc,
      });
      return user;
    })
    .then((user) => {
      res.redirect("/users/profile");
    });
});

module.exports = router;
