// require('dotenv').config();



// const GoogleStrategy = require('passport-google-oauth2').Strategy;

// module.exports = (passport) => {
//   passport.serializeUser((user, done) => {
//     done(null, user);
//   });

//   passport.deserializeUser((user, done) => {
//     done(null, user);
//   });

//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/auth/google/callback",
//         passReqToCallback: true,
// 		scope: ["email", "profile"]
//       },
//       (request, accessToken, refreshToken, profile, done) => {
//         return done(null, profile);
//       }
//     )
//   );
// // passport.use(
// // 	new GoogleStrategy(
// // 	  {
// // 		clientID: process.env.CLIENT_ID,
// // 		clientSecret: process.env.CLIENT_SECRET,
// // 		callbackURL: "http://localhost:3000/login/sociallogin/callback",
// // 		passReqToCallback: true,
// // 	  },
// // 	  (request, accessToken, refreshToken, profile, done) => {
// // 		console.log("User Profile:", profile);
// // 		return done(null, profile);
// // 	  }
// // 	)
// //   );
// };