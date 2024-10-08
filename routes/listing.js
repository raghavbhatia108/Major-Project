const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')

const {storage} = require("../cloudConfig.js");

const upload = multer({storage});

const listingController = require("../controllers/listings.js");
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListings)
  );

//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.editRenderForm)
);

module.exports = router;
