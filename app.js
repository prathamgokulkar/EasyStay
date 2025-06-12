if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
};

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/review.js');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingsRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

// const MONGO_URL = "mongodb://127.0.0.1:27017/easystay";

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(()=>{console.log("Connected to MongoDB")})
    .catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect(dbUrl);
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
});

store.on("error", ()=>{
    console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24, // 1 day
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to make flash messages available in all templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; // Make current user available in templates
    res.locals.redirectUrl = req.session.redirectUrl || '/listings'; // Default redirect URL if none is set
    next();
});

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });


//All routes for listings
app.use('/listings', listingsRouter);

//All routes for reviews
app.use("/listings/:id/reviews", reviewRouter);

//All routes for users
app.use('/', userRouter);
// app.all('*', (req, res, next) => {
//     next(new expressError(404, "Page not found!"));
// });

app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", {message})
    // res.status(statusCode).send(message);
});


app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});