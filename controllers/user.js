const User = require("../Models/user");

module.exports.signup = async (req, res) => {
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
  };

  module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
  };

  module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login = async (req, res) => {
    try {
      req.flash("success", "Welcome back to Wanderlust! You're logged in!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error during login:", error);
      res.redirect("/login");
    }
  };

  module.exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
      }
    });
  };