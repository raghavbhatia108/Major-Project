const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const listing = require("../models/listing");


const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
};

router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();
    
    res.redirect(`/listings/${Listing._id}`)
    
    }));


router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id, {pull:{reviews:reviewId}});
    res.redirect(`/listings/${id}`);
}));


module.exports = router;

