const express=require("express");
const router=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {validatereview, isLoggedin, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//Reviews-> post route 
router.post("/",isLoggedin,validatereview,wrapAsync(reviewController.createReview));

//review->Delete route
router.delete("/:reviewid",isReviewAuthor,isLoggedin,wrapAsync(reviewController.deleteReview));

module.exports=router;