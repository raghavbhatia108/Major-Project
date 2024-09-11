const { model } = require("mongoose");
const listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;
    
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();
    
    req.flash("success", "New Review Created");
    res.redirect(/listings/${Listing._id})
    
    };


module.exports.destroyReview = async(req, res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id, {pull:{reviews:reviewId}});
    res.redirect(/listings/${id});
};

