const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema}= require('../schema.js')
const Listing = require("../models/listing.js");




const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body)
    console.log(error)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",") 
        throw new ExpressError(400,errMsg)
    }else{
        next(); 
    }
};
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
router.get("/new", (req, res) => {
    res.render("listings/form.ejs")
});


//show route for individual post
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('review')

    res.render("listings/show.ejs", { listing })
})
)




//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    
    console.log(newListing);
    await newListing.save()
    res.redirect("/listings");
})

);

router.get('/:id/edit', wrapAsync(async (req, res) => {

    
    let { id } = req.params;

    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}) 
)

//update
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
)


//delete route
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect('/listings');
})
)


module.exports = router

