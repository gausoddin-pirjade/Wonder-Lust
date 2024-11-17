const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const Listings = require('./routes/listing.js');
const Reviews = require('./routes/reviews.js');
const UserRoute = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const user = require('./models/user.js');
require('dotenv').config();


main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
});



async function main() {
    const db_url = process.env.MANGO_URL;
    mongoose.connect(db_url);
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

// app.get('/', (req, res) => {
//     res.send("this is root path");
// })

const store = MongoStore.create({
    mongoUrl: process.env.MANGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mango session store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate())); 

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.sucess = req.flash("sucess"); 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use('/listings', Listings);
app.use('/listings/:id/reviews', Reviews);
app.use('/', UserRoute);


app.all('*', (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
})

// app.use((req, res, err, next) => {
//     let{statusCode = 500, message = "Something went wrong"} = err;
//     res.status(statusCode).send(message);
// });

app.listen(8080, () => {
    console.log("app listening on port 8080");
});