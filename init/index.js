const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'69ae86639614a4e28c4f8fff'}));
    await Listing.insertMany(initData.data);
    console.log("data Was initialized");
};
initDB();