var GitHubStrategy = require("passport-github").Strategy;

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/cb",
        passReqToCallback: true,
      },
      function (req, token, refreshToken, profile, done) {
        // console.log("token",token,"profile",profile,"reftoken",refreshToken,"profile",profile);
        if (!req.user) {
          User.findOne(
            {
              "third_party_auth.provider_email": profile.emails[0].value,
              "third_party_auth.provider_name": "github",
            },
            function (err, user) {
              if (err) return done(err);

              if (user) {
                return done(null, user);
              } else {
                var newUser = new User();
                newUser.name = profile.displayName;
                newUser.email = profile.emails[0].value;

                newUser.third_party_auth.push({
                  provider_name: "github",
                  provider_id: profile.id,
                  provider_token: token,
                  provider_email: profile.emails[0].value,
                  provider_data: profile,
                });

                newUser.save(function (err) {
                  if (err) throw err;
                  return done(null, newUser);
                });
              }
            }
          );
        } else {
          // For users that are already authenticated through other methods
          var user = req.user;

          const doesUserExist = User.exists({
            "third_party.provider_email": profile.emails[0].value,
            "third_party.provider_name": "github",
          });

          if (doesUserExist) {
            return done(null, false, { message: "User already exists" });
          }

          user.third_party_auth.push({
            provider_name: "github",
            provider_id: profile.id,
            provider_token: token,
            provider_email: profile.emails[0].value,
            provider_data: profile,
          });

          if (!user.email) {
            user.email = profile.emails[0].value;
          }

          user.save(function (err) {
            if (err) throw err;
            return done(null, user);
          });
        }
      }
    )
  );
};
