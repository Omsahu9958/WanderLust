const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review");
const user = require("./user");

const listSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: {
            type: String,
            default:"listingimage",
        },
        url: {
            type: String,
            default:"https://imgs.search.brave.com/a2LGJAEeMCl61p7leQIwnQS3C2RkGQ6TCHs5GCSg0vA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI5/NzM0OTc0Ny9waG90/by9ob3QtYWlyLWJh/bGxvb25zLWZseWlu/Zy1vdmVyLXRoZS1i/b3Rhbi1jYW55b24t/aW4tdHVya2V5Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1r/dDgtUlJ6Q0R1bnB4/Z0tGTUJCalo2alN0/ZWV0TmhoU3hIWkZ2/SFEwaE5VPQ",
            set: (v) =>
            v === ""
            ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            : v,
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:user,
    },
    geometry:{
         type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    }
})

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listSchema);
module.exports=Listing;
