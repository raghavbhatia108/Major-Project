const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index =  async (req,res)=>{
    const allListing = await listing.find({})
          res.render("listings/index.ejs", {allListing});
     };

module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id}=req.params;
 const foundListing =   await listing.findById(id).populate({path: "reviews", populate:{path:"author"},}).populate("owner");
 res.render("listings/show.ejs", {foundListing});
 console.log(foundListing);
};

module.exports.createListings = async(req,res, next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();


    let url = req.file.path;
    let filename=req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.editRenderForm = async(req,res)=>{
    let {id}=req.params;
    const foundListing =   await listing.findById(id);
    let originalImageUrl=foundListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl)
    res.render("listings/edit.ejs", {foundListing, originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    let foundListing = await listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file!="undefined"){
        let url = req.file.path;
        let filename=req.file.filename;
        foundListing.image={url, filename};
        await foundListing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};