const express = require('express')
const router = express.Router({ mergeParams: true })
const ExpressError = require('../utils/ExpressError.js')
const wrapAsync = require('../utils/wrapAsync.js')

const { reviewSchema } = require('../schema.js')
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    console.log(error)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
};


router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listing.review.push(newReview)
    await newReview.save()
    await listing.save()

    console.log("new review saved")
    req.flash("success","New Review Added")

    res.redirect(`/listings/${listing._id}`)


})
)

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to the listing page
    req.flash("success","New Review Deleted")

    res.redirect(`/listings/${id}`);
}));



module.exports = router;