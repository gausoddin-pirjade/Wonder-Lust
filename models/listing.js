const mongoose = require('mongoose');
const Review = require('./review.js');

const listingSchema = mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description : String,
    image : {
        default:"https://unsplash.com/photos/a-white-house-with-a-red-tiled-roof-o-nn2Mn4Jlg",
        type : String,
        set: (v) => v === ""
         ? "https://unsplash.com/photos/a-white-house-with-a-red-tiled-roof-o-nn2Mn4Jlg"
          : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;