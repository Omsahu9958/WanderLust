const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

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
//indec route
app.get("/listing",async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
})

//create new listing

app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listing",async(req,res)=>{
    let newlisting =new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
})

//show route
app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//edit route
app.get("/listing/:id/edit",async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
app.put("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
})

//delete route
app.delete("/listing/:id" ,async(req,res)=>{
    let {id}=req.params;
    let deletelist=await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listing");
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

app.listen(8080,()=>{
    console.log("Listening at 8080");
})