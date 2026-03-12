const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin, isOwner,validateListing}=require("../middleware.js");

//indec route
router.get("/",wrapAsync(async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}))

//create new listing

router.get("/new",isLoggedin,(req,res)=>{
    res.render("listings/new.ejs");
});
router.post("/",isLoggedin,validateListing,wrapAsync(async(req,res)=>{
    let newlisting =new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Is Added");
    res.redirect("/listing");
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
        .populate(
            {path:"reviews",
                populate:{path:"author"}})
        .populate("owner");
    if(!listing){
        req.flash("error","Listing Not Found");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
}))

//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))
router.put("/:id",isLoggedin,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Is Update");
    res.redirect(`/listing/${id}`);
}))

//delete route
router.delete("/:id", isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success","Listing Is Deleted");
    res.redirect("/listing");
}))



module.exports=router;