const mongoose = require("mongoose");
const initData = require("./data");
const listing = require("../models/listing.js");

const mongoURL = 'mongodb://127.0.0.1:27017/travelbnb';

main().then(()=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoURL);

};


const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"66860ef5235e0c09649411da"}));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();