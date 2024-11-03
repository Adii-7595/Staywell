const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js");

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')

const listingController = require('../controllers/listing.js')


const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage: storage })



//index route

router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.create))

    // .post(
    //     upload.single('listing[image]'),
    //     (req, res) => {
    //         try {
    //               // This will show the form data
    //             res.send(req.file);
    //         } catch (err) {
    //             console.error("Upload error:", err);  // This will log any errors
    //             res.status(500).json({ error: err.message });
    //         }
    //     }
    // )



//New Route
router.get("/new",
    isLoggedIn,
    listingController.route);




router
    .route("/:id")
    .get(wrapAsync(listingController.singlePost))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),

        validateListing,

        wrapAsync(listingController.update))
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.delete)
    )

//edit route
router.get('/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.edit))


module.exports = router

