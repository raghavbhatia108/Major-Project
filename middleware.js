const ExpressError = require("./utils/expressError.js");
const listing = require("./models/listing")
const {listingSchema, reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next)=>
    {
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error" , "You must be logged in to create a listing");
    return res.redirect("/login");
    }
    next();
    };

module.exports.saveRedirectUrl = (req,res, next)=>{
if(req.session.redirectUrl)
{
    res.locals.redirectUrl=req.session.redirectUrl;
}
next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let foundListing = await listing.findById(id);
    if(!foundListing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the auhtor of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
