const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const review=require("./review.js");

const listingSchema = new Schema({
    title:{
     type:String,
     required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1796&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>
            v===""
            ?"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1796&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v,
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
         type:Schema.Types.ObjectId,
         ref:"user",
    }
   
});

listingSchema.post("findOneAndDelete", async(req, res)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports=listing;