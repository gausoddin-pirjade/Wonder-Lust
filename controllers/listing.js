const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError.js');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings});
};

module.exports.newListing = (req,res) => {
    res.render('./listings/new.ejs');
};

module.exports.create = async (req, res, next) => {
    if (!req.body.Listing) {
        throw new ExpressError(404, "Send valid data for listing");
    }
    console.log(req.body.Listing);
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("sucess", "New Listing is Created");
    res.redirect('/listings');
};

module.exports.showRoute = async (req, res) => {
    let {id} = req.params;
    //console.log(id);
    const listItem = await Listing.findById(id).populate({path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!Listing){
        req.flash("error", "Listing Not Exist");
        res.redirect('/listings');
    }
    console.log(listItem);
    res.render('./listings/show.ejs', {listItem});
};

module.exports.edit = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', {listing});
};

module.exports.update = async (req, res) => {
    let {id} = req.params;
    if (!req.body.Listing) {
        throw new ExpressError(404, "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    req.flash("sucess", "Listing Updated!");
    res.redirect('/listings');
};

module.exports.delete = async (req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("sucess", "Listing Deleted!");
    res.redirect('/listings');
};