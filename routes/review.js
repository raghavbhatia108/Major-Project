const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



router.post("/", validateReview,isLoggedIn,  wrapAsync(reviewController.createReview));


router.delete("/:reviewId",isLoggedIn,isReviewAuthor,  wrapAsync(reviewController.destroyReview));


module.exports = router;

