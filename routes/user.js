const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { saveRedirectUrl } = require("../middleware.js")

const userController = require('../controllers/user.js')




router
    .route('/signup')
    .get(userController.getSignUp)
    .post(wrapAsync(userController.postSignUp))


router
    .route("/login")
    .get(userController.getLogIn)
    .post(saveRedirectUrl, passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userController.postLogIn)

router.get('/logout', userController.logout)


module.exports = router
