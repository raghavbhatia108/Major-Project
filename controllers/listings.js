const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    try {
        const allListing = await listing.find({});
        res.render("listings/index.ejs", { allListing });
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res, next) => {
    try {
        let { id } = req.params;
        const foundListing = await listing.findById(id).populate({
            path: "reviews",
            populate: { path: "author" },
        }).populate("owner");

        res.render("listings/show.ejs", { foundListing });
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};

module.exports.createListings = async (req, res, next) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        await newListing.save();

        req.flash("success", "New Listing Created");
        return res.redirect("/listings"); // Ensure single response
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};

module.exports.editRenderForm = async (req, res, next) => {
    try {
        let { id } = req.params;
        const foundListing = await listing.findById(id);
        let originalImageUrl = foundListing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { foundListing, originalImageUrl });
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};

module.exports.updateListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        let foundListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            foundListing.image = { url, filename };
            await foundListing.save();
        }

        req.flash("success", "Listing updated");
        return res.redirect(`/listings/${id}`); // Ensure single response
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};

module.exports.destroyListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        await listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted");
        return res.redirect("/listings"); // Ensure single response
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
};