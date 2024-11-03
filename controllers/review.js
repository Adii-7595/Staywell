const Review = require("../models/review.js")
const Listing = require("../models/listing.js");

//reviewPost
module.exports.reviewPost = async (req, res) => {

    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    newReview.author = req.user._id
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()

    console.log("new review saved")
    req.flash("success", "New Review Added")

    res.redirect(`/listings/${listing._id}`)


}

//reviewDelete
module.exports.reviewDelete = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to the listing page
    req.flash("success", "Review Deleted")

    res.redirect(`/listings/${id}`);
}