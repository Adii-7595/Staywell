const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js");

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')





//index route
router.get("/", wrapAsync(async (req, res, next) => {
    try {
        const allListings = await Listing.find({});

        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
}))


//New Route
router.get("/new", isLoggedIn, (req, res) => {

    console.log(req.user)

    res.render("listings/form.ejs")
});


//show route for individual post
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: 'review',
            populate: {
                path: "author"
            }
        })
        .populate('owner')


    if (!listing) {
        req.flash("error", "Listing does not Exist")
        res.redirect("/listings")

    }
    console.log(listing)
    res.render("listings/show.ejs", { listing })
})
)




//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    await newListing.save()
    req.flash("success", "New Listing Created Successfully")
    res.redirect("/listings");
})

);


//edit route
router.get('/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {


        let { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not Exist")
            res.redirect("/listings")

        }
        res.render("listings/edit.ejs", { listing })
    })
)

//update
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Updated Successfully")

        res.redirect(`/listings/${id}`);
    })
)


//delete route
router.delete('/:id',
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedList = await Listing.findByIdAndDelete(id);
        console.log(deletedList);
        req.flash("success", "Listing Deleted Successfully")

        res.redirect('/listings');
    })
)


module.exports = router

