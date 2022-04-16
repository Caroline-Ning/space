const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const path = require("path");

const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");

const blogRouter = require("./routes/blog");
const usersRouter = require("./routes/users");
const sectionRouter = require("./routes/section");
const quizRouter = require("./routes/quiz");

const app = express();

// const fs = require("fs");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware !! before routes
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/data", express.static(__dirname + "/data"));

app.use(
  cookieSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
// !! put this at the top
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = true;
    return next();
  }

  res.locals.user = undefined;
  next();
});

app.use("/", sectionRouter);
app.use("/forum", blogRouter);
app.use("/users", usersRouter);
app.use("/quiz", quizRouter);

//quiz
// const quizFileDir = fs
//   .readdirSync("./data")
//   .filter((name) => name.endsWith(".js"));
// const quizzes = [];

// for (const file of quizFileDir) {
//   const quizFile = require(`./data/${file}`);
//   quizzes.push({
//     title: quizFile.quizData.title,
//     slug: file.replace(".js", ""),
//   });
// }

//google login
app.get("/failed", (req, res) => res.send("login failed"));
app.get("/success", (req, res) => res.send(`Hi ${req.user.displayName}`));
app.get("/out", (req, res) => res.send("You're logged out"));

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

// Error handlers
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
