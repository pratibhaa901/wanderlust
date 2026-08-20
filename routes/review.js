const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../util/wrapAsync.js");
const expressError=require("../util/expressError.js");
const{listingSchema,reviewSchema}=require("../schema.js")
const Review=require("../models/review.js");
const Listing =require("../models/listing.js");
// const { reviewSchema }=require("../schema.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const { createReview } = require("../controllers/reviews.js");
const reviewController=require("../controllers/reviews.js");




//review route
//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))
module.exports=router;
