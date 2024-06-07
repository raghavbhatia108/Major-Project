const express = require("express");
const app = express();
const mongoose = require("mongoose")
const listing = require("./models/listing")
const path = require("path");
const mongoURL = 'mongodb://127.0.0.1:27017/travelbnb';
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoURL);

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res)=>{
    res.send("Hello I am root");
});

//get route
app.get("/listings", async (req,res)=>{
  const allListing = await listing.find({})
        res.render("listings/index.ejs", {allListing});
    });

     //New Route
     app.get("/listings/new", async (req,res)=>{
        res.render("listings/new.ejs");
    })


    //creat Route
    app.post("/listings", async(req,res)=>{
        const newListing = new listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    });




    //show route
    app.get("/listings/:id" ,async (req,res)=>{
        let {id}=req.params;
     const foundListing =   await listing.findById(id);
     res.render("listings/show.ejs", {foundListing});
    });


    //edit route
    app.get("/listings/:id/edit", async(req,res)=>{
        let {id}=req.params;
        const foundListing =   await listing.findById(id);
        res.render("listings/edit.ejs", {foundListing})
    });
 
    //update route
    app.put("/listings/:id", async(req,res)=>{
        let {id}=req.params;
        await listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect("/listings");
    })

//Delete route
app.delete("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

app.use((err,req,res,next)=>{
    res.send("Something went Wrong");
});
   

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});
