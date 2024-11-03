const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js')

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')
const reviewController = require('../controllers/review.js')




//reviewPost
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.reviewPost)
)

//reviewDelete

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.reviewDelete));



module.exports = router;