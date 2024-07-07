const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const listing = require("../models/listing")
const {listingSchema}=require("../schema.js");
const{isLoggedIn}=require("../middleware.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};


// router.get("/", (req, res)=>{
//     res.send("Hello I am root");
// });

//get route
router.get("/",wrapAsync( async (req,res)=>{
  const allListing = await listing.find({})
        res.render("listings/index.ejs", {allListing});
    }));

     //New Route
     router.get("/new",isLoggedIn, wrapAsync( async (req,res)=>{
        console.log(req.user);
        res.render("listings/new.ejs");
    }));


    //creat Route
    router.post("/",isLoggedIn, validateListing,
        wrapAsync(async(req,res, next)=>{
        let result = listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400, result.error);
        }
        const newListing = new listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    })
);



    //show route
    router.get("/:id" ,wrapAsync(async (req,res)=>{
        let {id}=req.params;
     const foundListing =   await listing.findById(id).populate("reviews").populate("owner").exec();
     res.render("listings/show.ejs", {foundListing});
     console.log(foundListing);
    }));


    //edit route
    router.get("/:id/edit",isLoggedIn, wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const foundListing =   await listing.findById(id);
        res.render("listings/edit.ejs", {foundListing})
    }));
 
    //update route
    router.put("/:id",isLoggedIn,validateListing, wrapAsync(async(req,res)=>{
        let {id}=req.params;
        await listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect("/listings");
    }));

//Delete route
router.delete("/:id",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}));

module.exports = router;