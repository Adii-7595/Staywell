const express = require('express')
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const {saveRedirectUrl} = require("../middleware.js")




router.get('/signup', (req, res) => {
    res.render("users/signup.ejs")

})

router.post('/signup', wrapAsync(async (req, res) => {


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

})
)



router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})


router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true,
        }),
    async (req, res) => {
        console.log(res.locals.redirect)
        req.flash("success", "Welcom back to Hostel Hub!")
        let redirectUrl = res.locals.redirect || '/listings'
        res.redirect(redirectUrl)



    })


router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are Logged Out")
        res.redirect("/listings")
    })
})
module.exports = router
