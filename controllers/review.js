const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","New Review Is Added");
    res.redirect(`/listing/${listing._id}`);
    
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Is Deleted");
    res.redirect(`/listing/${id}`);
}