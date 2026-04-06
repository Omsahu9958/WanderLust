process.noDeprecation = false;

if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// Avoid printing secrets to console


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const _connectMongo = require('connect-mongo');
const createMongoStore = _connectMongo.create || (_connectMongo.default && _connectMongo.default.create) || (_connectMongo.MongoStore && _connectMongo.MongoStore.create);
if (!createMongoStore) {
  throw new Error('connect-mongo.create() not found. Install a compatible version: npm i connect-mongo@4');
}
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl = process.env.DB_URL;

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = createMongoStore({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET || "mySecreate",
  },
  touchAfter: 24 * 3600,
});
 
store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});
const sesionOption={
        store,
        secret: process.env.SESSION_SECRET || "mySecreate",
        resave:false,
        saveUninitialized:true,
        cookie:{
        expires: new Date(Date.now()+7*24*60*60*1000),
         maxAge:7*24*60*60*1000,
         httpOnly:true,
     }
 }




app.use(session(sesionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;   
    next();
})

//listing
app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})
const port = parseInt(process.env.PORT, 10) || 8080;
 app.listen(port,()=>{
     console.log(`Listening at ${port}`);
 })        

