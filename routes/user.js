const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const registeredUser = await User.register(newuser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        } else {
          req.flash("success", "welcome to wanderlust");
          res.redirect("/listings");
        }
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   async (req, res) => {
//     req.flash("success", "Welcome back to Wanderlust you're Login!");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl); 
//   }
// );
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      req.flash("success", "Welcome back to Wanderlust! You're logged in!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error during login:", error);
      res.redirect("/login");
    }
  }
);

router.get("/logout",
   (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    }
  });
});
module.exports = router;
