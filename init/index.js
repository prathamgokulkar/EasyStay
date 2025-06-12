require("dotenv").config(); 
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { sampleListings } = require("./data");

const dbUrl = process.env.ATLASDB_URL;

async function seedDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log(" Connected to Atlas DB");

    await Listing.deleteMany({});
    console.log("Deleted old listings");

    const modifiedListings = sampleListings.map(obj => ({
      ...obj,
      owner: "6846860aef12b48a0daafb4f", 
    }));

    const inserted = await Listing.insertMany(modifiedListings);
    console.log(` Inserted ${inserted.length} listings`);
  } catch (err) {
    console.error(" Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
