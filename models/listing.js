const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const review=require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
     type:String,
     required:true,
    },
    description:String,
    image:{
      url:String,
      filename:String,
        
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
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required:true,
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
   
});

listingSchema.post("findOneAndDelete", async(req, res)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports=listing;