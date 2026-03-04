const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");



let validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}
//indec route
router.get("/",wrapAsync(async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}))

//create new listing

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    let newlisting =new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
}))

//delete route
router.delete("/:id" ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listing");
}))



module.exports=router;