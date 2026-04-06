const { model } = require("mongoose");
const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

module.exports.validateListing = (req, res, next) => {
    console.log("Request body received:", req.body);
    let { error } = listingSchema.validate({ listing: req.body.listing });
    // If no nested, try flat body
    if (error && !req.body.listing) {
        ({ error } = listingSchema.validate(req.body));
    }
    if (error) {
        console.log("Validation error details:", error.details);
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        // normalize downstream to req.body.listing
        req.body.listing = req.body.listing || req.body;
        console.log("Validation passed successfully");
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

module.exports.isOwner = async (req, res, next) => {
     let { id } = req.params;
    let listing = await Listing.findById(id);
    const ownerId = listing?.owner?._id || listing?.owner;
    if (!ownerId || !ownerId.equals(req.user._id)) {
        req.flash("error","you not owner of the listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
     let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    const authorId = review?.author?._id || review?.author;
    if (!authorId || !authorId.equals(req.user._id)) {
        req.flash("error","you not author of the review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
