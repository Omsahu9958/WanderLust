const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req, res, next) => {
    try {
        const address = req.body.listing?.location;
        if (!address) {
            req.flash("error", "Location is required");
            return res.redirect("/listing/new");
        }

        // Geocode address
        const geoRes = await geocodingClient.forwardGeocode({
            query: address,
            limit: 1
        }).send();

        if (!geoRes.body?.features || geoRes.body.features.length === 0) {
            req.flash("error", "Location not found. Please try another address.");
            return res.redirect("/listing/new");
        }

        const feature = geoRes.body.features[0];
        const geometry = {
            type: "Point",
            coordinates: feature.center
        };

        const newListing = new Listing({
            ...req.body.listing,
            owner: req.user._id,
            geometry: geometry
        });

        // Add image if uploaded
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await newListing.save();
        req.flash("success", "New Listing Added Successfully!");
        res.redirect(`/listing/${newListing._id}`);
    } catch (err) {
        console.error("Error creating listing:", err);
        next(err);
    }
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing");
    }

    res.render("listings/show.ejs", { 
        listing, 
        maptoken: process.env.MAP_TOKEN 
    });
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}