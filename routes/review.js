const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");


const { reviewSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");



const validateReview = (res, req, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
  
      throw new expressError(400, errMsg);
    } else {
      next();
    }
  };


// review route
  
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success","New Review Created!");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  // delete review route
  
  router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {
      let { id, reviewId } = req.params;
  
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review Deleted!");
      res.redirect(`/listings/${id}`);
    })
  );

  module.exports = router;