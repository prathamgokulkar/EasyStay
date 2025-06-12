const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render('./listings/index.ejs', { allListings })
};

module.exports.renderNewForm = (req, res) =>{
    return res.render('./listings/newForm');
};

module.exports.createNewListing = async (req, res, next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = {url, filename},
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    return res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) =>{
    let id = req.params.id;
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
        res.render('./listings/editForm.ejs', { listing });
};

module.exports.updateListing = async(req, res) => {
    let id  = req.params.id;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if (typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.images = {url, filename};
    await Listing.save();
    }
    req.flash('success', 'Successfully updated the listing!');
    return res.redirect(`/listings/${updatedListing._id}`);  // ✅ Corrected!
};

module.exports.destroyListings = async(req, res) =>{
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash('success', 'Successfully deleted the listing!');
    return res.redirect('/listings');
};

module.exports.showListing = async(req, res) =>{
    let id = req.params.id;
    const listing = await Listing.findById(id)
        .populate({path: "reviews", populate:{path: "author",}})
        .populate("owner");
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('./listings/show.ejs', { listing });
};