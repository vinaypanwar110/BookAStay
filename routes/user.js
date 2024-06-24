const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let {username,email,password} =req.body;
        const newuser = new User({email,username});
        const registeredUser = await User.register(newuser,password);
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    } catch (error) {
         req.flash("error",error.message);
         res.redirect("/signup");
    }
}))
module.exports = router;