const Listing = require("./Models/listing");
const expressError = require("./utils/expressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{ 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }next();
}

module.exports.isOwner = async(req,res,next) =>{
    let { id } = req.params;
      let listing  = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
      }
      next();
}


module.exports.validateListing = (res, req, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.validateReview = (res, req, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    } else {
      next();
    }
  };