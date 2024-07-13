const listing = require("../models/listing.js");


module.exports.index =  async (req,res)=>{
    const allListing = await listing.find({})
          res.render("listings/index.ejs", {allListing});
     };

module.exports.rennderNewForm = async (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id}=req.params;
 const foundListing =   await listing.findById(id).populate({path: "reviews", populate:{path:"author"},}).populate("owner");
 res.render("listings/show.ejs", {foundListing});
 console.log(foundListing);
};

module.exports.createListings = async(req,res, next)=>{
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.editRenderForm = async(req,res)=>{
    let {id}=req.params;
    const foundListing =   await listing.findById(id);
    res.render("listings/edit.ejs", {foundListing})
};

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
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