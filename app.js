
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const MONGO_URL = "mongodb://127.0.0.1:27017/Staywell";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);

}


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("hi I'm root!");
});

//show all posts

app.get("/listings", wrapAsync(async (req, res, next) => {
    try {
        const allListings = await Listing.find({});

        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
}))

app.get("/listings/new", (req, res) => {
    res.render("listings/form.ejs")
});


//show route for individual post
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)

    res.render("listings/show.ejs", { listing })
})
)




//create route
app.post("/listings", wrapAsync(async (req, res, next) => {

    if(!req.body.listing){
        throw new ExpressError(400,'send valid data!')
    }


    const newListing = new Listing(req.body.listing)
    console.log(newListing);
    await newListing.save()
    res.redirect("/listings");
})

);

app.get('/listings/:id/edit', wrapAsync(async (req, res) => {

    // if(!req.body.listing){
    //     throw new ExpressError(400,'send valid data!')
    // }
    let { id } = req.params;

    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}) 
)

app.put("/listings/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
)


//delete route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect('/listings');
})
)

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'))
})


app.use((err, req, res, next) => {

    let { statusCode =500, message='Something went wroong!' } = err;
    res.status(statusCode).send(message);
})
app.listen(port, () => {
    console.log(`port is listening on port: http://localhost:${port}/listings`);
});