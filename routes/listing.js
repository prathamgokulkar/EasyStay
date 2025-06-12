const express = require('express');
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const Listing = require('../models/listing.js');
const {listingSchema} = require("../schema.js");
const expressError = require("../utilis/expressError.js");
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');

const listingControllers = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");

const upload = multer({storage});

//Index Route
router.get('/', wrapAsync(listingControllers.index));

//create new listing(hotel)
router.get('/new',isLoggedIn,listingControllers.renderNewForm);

router.post('/', isLoggedIn,validateListing,upload.single('listing[images]'),wrapAsync(listingControllers.createNewListing));


//edit and update hotel
router.get('/:id/edit',isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));

router.put('/:id',isLoggedIn,isOwner,validateListing,upload.single('listing[images]'),wrapAsync(listingControllers.updateListing));


//delete hotel
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(listingControllers.destroyListings));

//show hotel
router.get('/:id', wrapAsync(listingControllers.showListing));


module.exports = router;