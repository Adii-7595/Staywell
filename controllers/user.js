
const User = require("../models/user.js")


//get sign up
module.exports.getSignUp = (req, res) => {
    res.render("users/signup.ejs")

}

//post Sign up
module.exports.postSignUp = async (req, res) => {


    try {
        let { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.flash("success", "Welcom to Hostel Hub!")
        res.redirect('/listings')
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup')
    }

}

//get log in
module.exports.getLogIn =  (req, res) => {
    res.render('users/login.ejs')
}

//post log in
module.exports.postLogIn = async (req, res) => {
    console.log(res.locals.redirect)
    req.flash("success", "Welcom back to Hostel Hub!")
    let redirectUrl = res.locals.redirect || '/listings'
    res.redirect(redirectUrl)



}

//logout
module.exports.logout =  (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are Logged Out")
        res.redirect("/listings")
    })
}