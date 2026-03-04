const express=require("express");
const router=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");


let validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}
//Reviews-> post route 
router.post("/",validatereview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    console.log("new Review Saved");
    res.redirect(`/listing/${listing._id}`);
    
}));

//review->Delete route
router.delete("/:reviewid",wrapAsync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listing/${id}`);
}));

module.exports=router;