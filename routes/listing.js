const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn } = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });


router.route('/')
.get( listingController.index ) // Index Route
.post( isLoggedIn, wrapAsync(listingController.create )); //Create Route
// .post(upload.single("listing[image]"), (req, res) =>{
//     res.send(req.file);
// });

//new Route
router.get('/new', isLoggedIn, listingController.newListing);

router.route('/:id')
.get(wrapAsync(listingController.showRoute))  //Show Route
.put(isLoggedIn, wrapAsync(listingController.update))  //Update Route
.delete(isLoggedIn, wrapAsync(listingController.delete));  //Delete Route

//Edit Route
router.get('/:id/edit', isLoggedIn, wrapAsync(listingController.edit));


module.exports = router;
