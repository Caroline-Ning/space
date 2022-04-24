"use strict";
// routes for blog functionality
const async = require("async");
const express = require("express");
const auth = require("../auth");
const okta = require("@okta/okta-sdk-nodejs");
const sequelize = require("sequelize");
const slugify = require("slugify");
const models = require("../models");
const { render } = require("pug");

const router = express.Router();

// prettier-ignore
const months=['January','February','March','April','May','June','July','August','September','October','November','December']

function showDate(rawTime) {
  return `${months[rawTime.getMonth()]} ${rawTime.getDate()}, ${
    rawTime.getYear() + 1900
  }`;
}

// only logged in users can access certain pages of the site (for instance, the page that allows a user to create a new blog post)
function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthen");
  }

  next();
}

function ensurePassed(req, res, next) {
  models.User.findOne({
    where: {
      userId: req.user.id,
    },
  }).then((user) => {
    if (user.passed == 0) {
      return res.status(401).render("unpassed", { userId: user.userId });
    }
    next();
  });
}

// Render cate page and list all blog posts
router.get("/:cate", (req, res) => {
  models.Post.findAll({
    where: {
      category: req.params.cate,
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
        });

        models.User.findOne({
          where: {
            userId: post.authorId,
          },
        }).then((user) => {
          postData.push({
            authorId: post.authorId,
            postId: post.postId,
            category: post.category,
            title: post.title,
            body: post.body,
            createdAt: post.createdAt,
            authorName: user.displayName,
            commentCount: commentCount,
          });
          callback();
        });
        // .catch((err) => {
        //   postData.push({
        //     postId: post.postId,
        //     category: post.category,
        //     title: post.title,
        //     body: post.body,
        //     createdAt: post.createdAt,
        //   });
        //   callback();
        // });
      },
      (err) => {
        console.log(req.params.cate);
        return res.render(req.params.cate, { posts: postData });
      }
    );
  });
});

// Render the user createThread (ensure user has authenticated)
router.get(
  "/:cate/createnew",
  ensureAuthenticated,
  ensurePassed,
  (req, res, next) => {
    const cate = req.params.cate[0].toUpperCase() + req.params.cate.slice(1);
    return res.render("createNew", { category: cate });
  }
);

/////////////////////////////  Create a new post
router.post("/:cate/createnew", ensureAuthenticated, (req, res, next) => {
  models.Post.create({
    postId: req.user.id + Date.now(),
    category: req.params.cate,
    title: req.body.title,
    body: req.body.body,
    authorId: req.user.id,
    authorName: req.user.displayName,
  }).then((newPost) => {
    // this new post
    res.redirect("/forum/" + newPost.category + "/" + newPost.postId);
    // res.render("createNew", { post: newPost });
  });
});

///////////////////////// create comment ///////////
router.post("/:cate/:slug", ensureAuthenticated, (req, res, next) => {
  // res.redirect("/forum/" + req.params.cate + "/" + req.params.slug);
  models.Comment.create({
    category: req.params.cate,
    postId: req.params.slug,
    commentId: req.params.slug + req.user.id + Date.now(),
    body: req.body.body,
    authorId: req.user.id,
    authorName: req.user.displayName,
  }).then((newComment) => {
    res.redirect("/forum/" + req.params.cate + "/" + newComment.postId);
  });
});

///////////////////////// create reply ///////////
router.post(
  "/:cate/:post/:comment/reply",
  ensureAuthenticated,
  ensurePassed,
  (req, res, next) => {
    // res.redirect("/forum/" + req.params.cate + "/" + req.params.slug);
    models.Reply.create({
      category: req.params.cate,
      postId: req.params.post,
      commentId: req.params.comment,
      replyId: req.params.post + req.params.comment + req.user.id + Date.now(),
      body: req.body.reply,
      authorId: req.user.id,
      authorName: req.user.displayName,
    }).then((newReply) => {
      // console.log(newReply);
      res.redirect("/forum/" + req.params.cate + "/" + newReply.postId);
    });
  }
);

///////////////////////// delete comment ///////////
router.post("/:cate/:slug/deleteComment/:commentId", (req, res, next) => {
  models.Comment.findOne({
    where: {
      commentId: req.params.commentId,
      authorId: req.user.id,
    },
  }).then((comment) => {
    if (!comment) {
      return res.render("error", {
        message: "Comment not found.",
        error: {
          status: 404,
        },
      });
    }

    comment.destroy();
    res.redirect(`/forum/${req.params.cate}/${req.params.slug}`);
  });
});

///////////////////////// delete reply ///////////
router.post("/:cate/:post/:comment/:reply/deleteReply", (req, res, next) => {
  models.Reply.findOne({
    where: {
      replyId: req.params.reply,
    },
  }).then((reply) => {
    if (!reply) {
      return res.render("error", {
        message: "Reply not found.",
        error: {
          status: 404,
        },
      });
    }

    reply.destroy();
    res.redirect(`/forum/${req.params.cate}/${req.params.post}`);
  });
});

///////////////////////// edit post //////////////////////////
router.get("/:cate/:slug/edit", ensureAuthenticated, (req, res, next) => {
  models.Post.findOne({
    where: {
      // category: req.params.cate,
      postId: req.params.slug,
      authorId: req.user.id,
    },
  }).then((post) => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        },
      });
    }

    post = post.get({ plain: true });

    models.User.findOne({
      where: {
        userId: post.authorId,
      },
    }).then((user) => {
      post.authorName = user.displayName;
      res.render("edit", { post });
    });
  });
});

// Update a post
// If the user visits a URL that looks like /<something>/edit, then the edit route will run.
router.post("/:cate/:slug/edit", ensureAuthenticated, (req, res, next) => {
  models.Post.findOne({
    where: {
      postId: req.params.slug,
      authorId: req.user.id,
    },
  }).then((post) => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        },
      });
    }

    post
      .update({
        title: req.body.title,
        body: req.body.body,
      })
      .then(() => {
        post = post.get({ plain: true });

        models.User.findOne({
          where: {
            userId: post.authorId,
          },
        }).then((user) => {
          post.authorName = user.displayName;
          res.redirect("/forum/" + post.category + "/" + post.postId);
        });
      });
  });
});

/////////////////////////// Delete a post
// if a user sends a POST request to the URL /<post-url>/delete, then Sequelize.js will destroy the post from the database.
router.post("/:cate/:slug/delete", (req, res, next) => {
  models.Post.findOne({
    where: {
      postId: req.params.slug,
      authorId: req.user.id,
    },
  }).then((post) => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        },
      });
    }

    post.destroy();
    res.redirect(`/forum/${req.params.cate}`);
  });
});

//////////////////// view post ////////////////////////

function renderPost(req, res, pug, isAuthor = false) {
  let postData;
  let commentsData = [];
  let replysData = [];
  let replyCount;

  models.Post.findOne({
    where: {
      postId: req.params.slug,
    },
  })
    .then((post) => {
      if (!post) {
        return res.render("error", {
          message: "Page not found.",
          error: {
            status: 404,
          },
        });
      }
      postData = post.get({ plain: true });
      postData.isAuthor = isAuthor ? true : false;
      postData.date = showDate(postData.createdAt);

      // count of reply
      models.Reply.count({
        where: {
          postId: post.postId,
        },
      }).then((count) => {
        replyCount = count;
      });

      return postData;
    })
    .then((postData) => {
      // collect comments
      models.Comment.findAll({
        where: {
          postId: req.params.slug,
        },
        order: sequelize.literal("createdAt"),
      }).then((comments) => {
        if (comments.length === 0) {
          console.log("only post");
          return res.render(pug, { post: postData });
        }

        async.eachSeries(
          comments,
          (comment, callback) => {
            comment = comment.get({ plain: true });

            let temp = false;
            if (req.user && req.user.id == comment.authorId) {
              temp = true;
            }

            commentsData.push({
              category: comment.category,
              commentId: comment.commentId,
              postId: comment.postId,
              body: comment.body,
              createdAt: comment.createdAt,
              authorName: comment.authorName,
              authorId: comment.authorId,
              myComment: temp,
              date: showDate(comment.createdAt),
            });

            if (replyCount !== 0 && replyCount !== null) {
              models.Reply.findAll({
                where: {
                  commentId: comment.commentId,
                  postId: req.params.slug,
                },
                order: sequelize.literal("createdAt"),
              }).then((replys) => {
                //本comment可能就是没有reply，所以以下不行
                // if (replys.length === 0) {
                //   console.log("post and comments");
                //   return res.render(pug, {
                //     post: postData,
                //     comments: commentsData,
                //   });
                // }

                async.eachSeries(
                  replys,
                  (reply, callback) => {
                    // console.log("341", replys);
                    reply = reply.get({ plain: true });
                    let temp2 = false;
                    if (req.user && req.user.id == reply.authorId) {
                      temp2 = true;
                    }

                    replysData.push({
                      category: reply.category,
                      replyId: reply.replyId,
                      commentId: reply.commentId,
                      postId: reply.postId,
                      body: reply.body,
                      date: showDate(reply.createdAt),
                      authorName: reply.authorName,
                      authorId: reply.authorId,
                      myReply: temp2,
                    });
                    callback();
                    // return replysData;
                  },
                  () => {
                    // 重复 comment遍，对每个comment get all replys
                    // 会重复set header，假设评论数=3:
                    // 如果只有第一个评论有reply,则会set header次数=comment个数=3
                    // 如果第1、2评论有reply，comment走到第二个，data.length=count=2,set header=走到第2和第3个评论时=2
                    console.log(replyCount);
                    if (
                      replyCount !== null &&
                      replyCount !== 0 &&
                      replysData.length === replyCount &&
                      replysData.length !== 0
                    ) {
                      console.log("post,comments,reply");
                      return res.render(pug, {
                        post: postData,
                        comments: commentsData,
                        replys: replysData,
                      });
                    }
                    if (replyCount === 0) {
                      console.log("post and comments in up callback");
                      return res.render(pug, {
                        post: postData,
                        comments: commentsData,
                      });
                    }
                  }
                );
                // 做 comment的次数
              });
            }
            // 做 comment的次数
            callback();
          },
          () => {
            if (replyCount === 0 && commentsData.length !== 0) {
              console.log("post and comments");
              return res.render(pug, {
                post: postData,
                comments: commentsData,
              });
            }
          }
        );
      });
    });
}

function seeIfLogin(req, res, next) {
  //not login
  if (!req.user) {
    return renderPost(req, res, "post");
  }

  //login
  next();
}

//login
function seeIfAuthor(req, res) {
  models.Post.findOne({
    where: {
      postId: req.params.slug,
      authorId: req.user.id,
    },
  }).then((post) => {
    // not author
    if (!post) {
      return renderPost(req, res, "post");
    }

    // isAuthor=true
    return renderPost(req, res, "post", true);
  });
}

// 必须要login才能检验authorId: req.user.id
router.get("/:cate/:slug", seeIfLogin, seeIfAuthor);

module.exports = router;
