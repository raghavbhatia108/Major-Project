const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    try {
        const allListing = await listing.find({});
        return res.render("listings/index.ejs", { allListing }); // Return added here
    } catch (err) {
        return next(err); // Return added here
    }
};

module.exports.renderNewForm = async (req, res) => {
    return res.render("listings/new.ejs"); // Return added here
};

module.exports.showListings = async (req, res, next) => {
    try {
        let { id } = req.params;
        const foundListing = await listing.findById(id).populate({
            path: "reviews",
            populate: { path: "author" },
        }).populate("owner");

        return res.render("listings/show.ejs", { foundListing }); // Return added here
    } catch (err) {
        return next(err); // Return added here
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
        return res.redirect("/listings"); // Return added here
    } catch (err) {
        return next(err); // Return added here
    }
};

module.exports.editRenderForm = async (req, res, next) => {
    try {
        let { id } = req.params;
        const foundListing = await listing.findById(id);
        let originalImageUrl = foundListing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        return res.render("listings/edit.ejs", { foundListing, originalImageUrl }); // Return added here
    } catch (err) {
        return next(err); // Return added here
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
        return res.redirect(`/listings/${id}`); // Return added here
    } catch (err) {
        return next(err); // Return added here
    }
};

module.exports.destroyListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        await listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted");
        return res.redirect("/listings"); // Return added here
    } catch (err) {
        return next(err); // Return added here
    }
};
