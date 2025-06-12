// index.js
const mongoose = require("mongoose");
const Listing = require("../models/listing"); // Adjust path if needed
const {sampleListings} = require("./data");

async function seedDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/easystay");
    console.log("✅ Database connected successfully");
    
    await Listing.deleteMany({});
    console.log("✅ All listings deleted");

    const modifiedListings = sampleListings.map((obj) => ({ ...obj, owner: '6846860aef12b48a0daafb4f' }));
    const insertedListings = await Listing.insertMany(modifiedListings);

    console.log(`✅ Inserted ${insertedListings.length} listings`);
    
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}

seedDB();
