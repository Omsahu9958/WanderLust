const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const storage=require("../cloudeConfig.js");
const upload = multer(storage);

router
.route("/")
.get(wrapAsync(listingController.index))  //indec route
.post(isLoggedin,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createNewListing)) //create new listing

//create new listing

router.get("/new",isLoggedin,listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListing))//edit route
.delete( isLoggedin,isOwner,wrapAsync(listingController.deleteListing))//delete route


//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editForm));

module.exports=router;