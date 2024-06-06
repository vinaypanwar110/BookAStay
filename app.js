    const express = require("express");
    const app = express();
    const mongoose =  require("mongoose");

    const Listing = require("../Models/listing.js");

    const MONGO_URL = "mongodb://localhost:27017/wanderlust";
    main()
    .then(
        ()=>{
            console.log("connected to DB");
        }
    )
    .catch(
        (err)=>{
            console.log(err);
        }
    )

        async function main() {
            await mongoose.connect(MONGO_URL);
        }

    app.listen(8080,()=>{
        console.log("server is listening on port 8080");
    })

    app.get("/",(req,res)=>{
        res.send("this is root");   
    })

    app.get("/testListing", async (req,res)=>{

        let sampleListing = new Listing({
            title : "My New Villa",
            description:"beach",
            price : 1800,
            location:"calangute, Goa",
            country:"India"
        });

        await sampleListing.save();
        console.log("sample was saved ");
        res.send("Successfull");
    
    });

