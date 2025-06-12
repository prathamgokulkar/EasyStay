const Review = require('../models/review.js');
const Listing = require('../models/listing.js')

module.exports.addReviews = async(req, res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author to the current user
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReviews = async(req, res) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
};