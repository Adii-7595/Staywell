
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path")
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js')
const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

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

app.use('/listings', listings)
app.use('/listings/:id/reviews', reviews)



app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'))
})


app.use((err, req, res, next) => {

    let { statusCode = 500, message = 'Something went wroong!' } = err;
    res.status(statusCode).render("error.ejs", { err })
})

app.listen(port, () => {
    console.log(`port is listening on port: http://localhost:${port}/listings`);
});