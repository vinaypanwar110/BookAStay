  const express = require("express");
  const router = express.Router();
  const wrapAsync = require("../utils/wrapAsync.js");
  const ExpressError = require("../utils/expressError.js");
  const {listingSchema} = require("../schema.js");
  const Listing = require("../Models/listing.js");
  const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
  const listingController = require("../controllers/listings.js");
  const multer = require("multer");
  const { storage } = require("../cloudConfig.js");
  const upload = multer({ storage });
  router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
      isLoggedIn,
      validateListing,
      upload.single("listing[image]"),
      wrapAsync(listingController.createListing)
    );

  router.get("/new", isLoggedIn, listingController.renderNewForm);

  router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
      isLoggedIn,
      isOwner,
      upload.single("listing[image]"),
      wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

  router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
  );

  module.exports = router;
