const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi I Am Root");
})



//listing
app.use("/listing",listing);
app.use("/listing/:id/reviews",review);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("Listening at 8080");
})  

// app.get("/testing",async(req,res)=>{
//     let sampleList=new Listing({
//         title:"My New Villa",
//         description:"by the Beatch",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     });
//     await sampleList.save();
//     console.log("Saved sample");
//     res.send("Successful Test");
// })