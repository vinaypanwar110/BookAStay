const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const { listingSchema } = require("./schema.js");
const Review =require("./models/review.js");



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // data parse ho sake//
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));




const validateListing = (res,req,next)=> {
        let {error} = listingSchema.validate(req.body);
        if(error){
          let errMsg = error.details.map((el)=>el.message).join(",");

          throw new expressError(400,errMsg);
        }
        else{
          next();
        }
}



app.get("/", (req, res) => {
  res.send("this is root");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "beach",
    price: 1800,
    location: "calangute, Goa",
    country: "India",
  });
  await sampleListing.save();
  console.log("sample was saved ");
  res.send("Successful testing");
});



// index routes
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);



// new route

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs"); // Correct path
});



// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);




// create route
app.post(
  "/listings",validateListing,  
  wrapAsync(async (req, res, next) => {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
  })
);




// edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);



// update route
app.put(
  "/listings/:id",validateListing,  
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);



// delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);


// review route 

app.post("/listings/:id/reviews",async(req,res)=>{
   let listing  = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();


   res.redirect(`/listings/${listing._id}`);
});





app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});




app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
