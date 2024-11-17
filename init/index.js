const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
});

async function main() {
    const db_url = process.env.MANGO_URL;
    mongoose.connect(db_url);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67397b9c0a0cd17a2bd22723"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();