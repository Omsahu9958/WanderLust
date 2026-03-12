const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const user = require("../models/user.js");
const passport=require("passport");
const { saveRedireectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {email,username,password}=req.body;
    let user=new User({username,email});
    let registerduser =await User.register(user,password);
    req.login(registerduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To WanderLust");
            res.redirect("/listing");
    })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post("/login",saveRedireectUrl,
    passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),
    async(req,res)=>{
    req.flash("success","welocome To WanderLust");
    redirectUrl=res.locals.redirectUrl||"/listing";
    res.redirect(redirectUrl);
}) 

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    })
})

module.exports=router;