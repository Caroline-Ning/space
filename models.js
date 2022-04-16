const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./postDatabase.sqlite",
});

const Post = db.define("post", {
  postId: { type: Sequelize.STRING },
  category: { type: Sequelize.STRING },
  title: { type: Sequelize.STRING },
  body: { type: Sequelize.TEXT },
  authorId: { type: Sequelize.STRING },
  authorName: { type: Sequelize.STRING },
});

const dbc = new Sequelize({
  dialect: "sqlite",
  storage: "./commentDatabase.sqlite",
});

const Comment = dbc.define("comment", {
  category: { type: Sequelize.STRING },
  postId: { type: Sequelize.STRING },
  commentId: { type: Sequelize.STRING },
  body: { type: Sequelize.TEXT },
  authorId: { type: Sequelize.STRING },
  authorName: { type: Sequelize.STRING },
});

const dbu = new Sequelize({
  dialect: "sqlite",
  storage: "./userDatabase.sqlite",
});

const User = dbu.define("user", {
  userId: { type: Sequelize.STRING },
  displayName: { type: Sequelize.STRING },
  imgSrc: { type: Sequelize.STRING },
  joinDate: { type: Sequelize.STRING },
  mbti: { type: Sequelize.STRING },
  enne: { type: Sequelize.STRING },
  soci: { type: Sequelize.STRING },
  desc: { type: Sequelize.STRING },
  passed: { type: Sequelize.STRING },
});

const dbr = new Sequelize({
  dialect: "sqlite",
  storage: "./replyDatabase.sqlite",
});

const Reply = dbr.define("reply", {
  category: { type: Sequelize.STRING },
  postId: { type: Sequelize.STRING },
  commentId: { type: Sequelize.STRING },
  replyId: { type: Sequelize.STRING },
  body: { type: Sequelize.TEXT },
  authorId: { type: Sequelize.STRING },
  authorName: { type: Sequelize.STRING },
});

// delete all data in the db
// Comment.destroy({
//   truncate: true,
// });
// Post.destroy({
//   truncate: true,
// });
// Reply.destroy({
//   truncate: true,
// });

// User.destroy({
//   truncate: true,
// });

db.sync();
dbc.sync();
dbu.sync();
dbr.sync();

module.exports = { Post, Comment, User, Reply };
