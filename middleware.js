const { model } = require("mongoose");
const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}
module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be login to create listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedireectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}   

module.exports.isOwner=async(req,res,next)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you not owner of the listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
     let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you not author of the review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
