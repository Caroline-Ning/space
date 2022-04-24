const models = require("./models");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "855512301778-cs2nql1c469ft8v7u7ta4p6lcp6qat2k.apps.googleusercontent.com",
      clientSecret: "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",
      // callbackURL: "https://space-unfinished.herokuapp.com/google/callback",
      callbackURL: "http://localhost:3000/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      models.User.findOne({
        where: {
          userId: profile.id,
        },
      }).then((user) => {
        if (user) {
          user.update({
            displayName: profile.displayName,
            imgSrc: profile.photos[0]["value"],
          });
        }
        models.User.create({
          userId: profile.id,
          displayName: profile.displayName,
          imgSrc: profile.photos[0]["value"],
          passed: 0,
        });
      });
      return done(null, profile);
    }
  )
);
