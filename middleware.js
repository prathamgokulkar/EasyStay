const Listing = require('./models/listing');
const {listingSchema, reviewSchema} = require("./schema.js");
const expressError = require("./utilis/expressError.js");
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // Store the original URL to redirect after login
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in templates
        delete req.session.redirectUrl; // Clear the redirect URL after saving it
    } else {
        res.locals.redirectUrl = '/listings'; // Default redirect URL if none is set
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    if (!listing.owner.equals(res.locals.currentUser._id)) {
      req.flash('error', 'You are not the owner of this listing');
      return res.redirect(`/listings/${id}`);
    }
      next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error.details[0].message);
  } else {
    next();
  }
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error.details[0].message);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
if (!review) {
    req.flash('error', 'Review not found');
    return res.redirect(`/listings/${id}`);
}
if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash('error', 'You are not the author of this review');
    return res.redirect(`/listings/${id}`);
}
next();
};
