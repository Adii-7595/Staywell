const Listing = require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN

const geocodingClient = mbxGeocoding({ accessToken: mapToken });





//index
module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});

        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
}

// new route
module.exports.route = (req, res) => {


    res.render("listings/form.ejs")
}

//single post
module.exports.singlePost = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: "author"
            }
        })
        .populate('owner')


    if (!listing) {
        req.flash("error", "Listing does not Exist")
        res.redirect("/listings")

    }
    res.render("listings/show.ejs", { listing })
}

//create

module.exports.create = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send()

    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id

    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry

    let savedListing = await newListing.save()
    console.log(savedListing)
    req.flash("success", "New Listing Created Successfully")
    res.redirect("/listings");
}

//edit
module.exports.edit = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not Exist");
        return res.redirect("/listings"); // Added return statement
    }

    // Modify the original image URL if it exists
    let originalImage = listing.image.url;
    if (originalImage) {
        originalImage = originalImage.replace("/upload", "/upload/h_200,w_200,");
    }

    res.render("listings/edit.ejs", { listing, originalImage });
}


// update
module.exports.update = async (req, res) => {
    let { id } = req.params

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });




    if (typeof req.file !== 'undefined') {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename }
        await listing.save()


    }


    req.flash("success", "Updated Successfully")

    res.redirect(`/listings/${id}`);
}

//update
// module.exports.update = async (req, res) => {
//     let { id } = req.params;


//     // Fetch the existing listing first
//     const existingListing = await Listing.findById(id);

//     // Check if an image file was uploaded
//     if (req.file) {
//         // If a new image was uploaded, update the image field
//         existingListing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }

//     // Update the other fields
//     existingListing.set(req.body.listing); // or you can merge the new fields like: { ...req.body.listing, image: existingListing.image }

//     await existingListing.save(); // Save the updated listing

//     req.flash("success", "Updated Successfully");
//     res.redirect(`/listings/${id}`);
// }




//delete
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted Successfully")

    res.redirect('/listings');
}