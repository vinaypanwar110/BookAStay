const express  = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../Models/listing.js");


const validateListing = (res, req, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    } else {
      next();
    }
  };
  
// index routes
router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    })
  );
  
  // new route
  
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs"); // Correct path
  });
  
  // show route
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
      }
      res.render("listings/show.ejs", { listing });
    })
  );
  
  // create route 
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
    })
  );
  
  // edit route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error","listing you requested does not exists!");
        res.redirect("/listings");
      }
      res.render("listings/edit.ejs", { listing });
    })
  );
  
  // update route
  router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success","Listing Updated!");
      res.redirect(`/listings/${id}`);
    })
  );
  
  // delete route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndDelete(id, { ...req.body.listing });
      req.flash("success","Listing Deleted!");
      res.redirect("/listings");
    })
  );
  
  
  module.exports = router;