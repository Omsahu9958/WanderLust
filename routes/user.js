const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const user = require("../models/user.js");
const passport=require("passport");
const { saveRedireectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

router
.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup))

router
.route("/login")
.get(userController.loginForm)
.post(saveRedireectUrl,
    passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),
    userController.login)

router.get("/logout",userController.logout);

module.exports=router;