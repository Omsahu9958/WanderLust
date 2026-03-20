const User=require("../models/user.js");

module.exports.signupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=async(req,res)=>{
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
    
}

module.exports.loginForm=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welocome To WanderLust");
    redirectUrl=res.locals.redirectUrl||"/listing";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    })
}