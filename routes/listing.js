const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage });

// Index & Create
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin, upload.single("image"), validateListing, wrapAsync(listingController.createNewListing));

// New form
router.get("/new", isLoggedin, listingController.renderNewForm);

// Show, Update, Delete
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.editListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing));

// Edit form
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.editForm));

module.exports = router;