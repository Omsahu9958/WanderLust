const Listing =require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createNewListing=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
  
    let url=req.file.path;
    let filename=req.filename;
    let newlisting =new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};

    newlisting.geometry= response.body.features[0].geometry;

    let savedlisting=await newlisting.save();
    console.log(savedlisting);
    req.flash("success","New Listing Is Added");
    res.redirect("/listing");
}

module.exports.showListing=async (req,res)=>{
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
}

module.exports.editForm=async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalUrl});
}

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
    let filename=req.filename;
    listing.image={url,filename};
    await listing.save();
    }
    
    req.flash("success","Listing Is Update");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success","Listing Is Deleted");
    res.redirect("/listing");
}