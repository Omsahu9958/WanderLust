const express=require("express");
const router=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {validatereview, isLoggedin, isReviewAuthor}=require("../middleware.js");

//Reviews-> post route 
router.post("/",isLoggedin,validatereview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","New Review Is Added");
    res.redirect(`/listing/${listing._id}`);
    
}));

//review->Delete route
router.delete("/:reviewid",isReviewAuthor,isLoggedin,wrapAsync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Is Deleted");
    res.redirect(`/listing/${id}`);
}));

module.exports=router;