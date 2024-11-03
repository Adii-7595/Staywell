const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js')

const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')






router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {

        let listing = await Listing.findById(req.params.id)
        let newReview = new Review(req.body.review)

        newReview.author = req.user._id
        listing.review.push(newReview)
        await newReview.save()
        await listing.save()

        console.log("new review saved")
        req.flash("success", "New Review Added")

        res.redirect(`/listings/${listing._id}`)


    })
)

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

        // Remove the review from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        // Delete the review document
        await Review.findByIdAndDelete(reviewId);

        // Redirect back to the listing page
        req.flash("success", "Review Deleted")

        res.redirect(`/listings/${id}`);
    }));



module.exports = router;