const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signUp } = require("../controllers/user.js");
const userController = require("../controllers/user.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
      isLoggedIn,
      validateListing,
      upload.single("listing[image]"),
      wrapAsync(listingController.createListing)
    );
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );

router.get("/logout", userController.logout);

module.exports = router;
