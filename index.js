const User = require('./models/User')
const Cart = require('./models/Cart')
const Wishlist = require('./models/Wishlist')

const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const password_generator = require('password-generator');
const express = require('express')
const passport = require("passport");
const session = require("express-session");
const cors = require('cors')
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const mongoose = require('mongoose')

const sendEmailRoute = require('./routes/sendEmail')
const orderRoute = require('./routes/order')
const cartRoute = require('./routes/cart')
const productRoute = require('./routes/product')
const authRoute = require('./routes/auth')
const wishlistRoute = require('./routes/wishlist')
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/category')
const subCategoryRoute = require('./routes/subCategory')
const productLineRoute = require('./routes/productLine')
const attributeRoute = require('./routes/attribute')
const verifyAdminRoute = require('./routes/verifyAdmin')

mongoose.connect(process.env.MONGO_DB)
        .then(() => console.log("DB connect successfully"))
        .catch((err) => console.log(err))

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json()); 

app.use('/api/auth', authRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/', orderRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/sub-category', subCategoryRoute);
app.use('/api/product-line', productLineRoute)
app.use('/api/attribute', attributeRoute)
app.use('/api/verifyAdmin', verifyAdminRoute)
app.use('/send-email', sendEmailRoute);
// Session setup
app.use(
    session({
      secret: process.env.SESSION_SECRET ,
      resave: false,
      saveUninitialized: true,
    })
  );

  // Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Google Strategy
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback"
        // callbackURL: "http://localhost:3000",

      },
      (accessToken, refreshToken, profile, done) => {
       
        return done(null, profile, accessToken, refreshToken);
      }
    )
  );

  // Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Auth Route
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
// Google Auth Callback
app.get(
"/auth/google/callback",
passport.authenticate("google", { failureRedirect: "/" }),
(req, res) => {
    res.redirect('http://localhost:3000');
}
);
  
// User Info Route
app.get("/auth/user", async (req, res) => {
    if (req.user) {
        const existedUser = await User.findOne({email: req.user.emails[0].value})
        if(existedUser){
            const cart = await Cart.findOne({userId: existedUser._id})
            const wishlist = await Wishlist.findOne({userId: existedUser._id})
            const accessToken = jwt.sign(
                        {
                            id: existedUser._id,
                            isAdmin: existedUser.isAdmin,
                        },
                        process.env.JWT_SECRET_KEY,
                        // {expiresIn:"1m"}
                        );
            const { password, ...others} = existedUser._doc
            res.status(200).json({...others, accessToken: accessToken, cart: cart, wishlist: wishlist})
        } else {
                const password = password_generator( 12 ,false )
                const newUser = new User({
                    username: req.user.displayName,
                    email: req.user.emails[0].value,
                    password: password,
                    img: req.user.photos[0].value,
                    verified: true
                });
            // create new user
            try {
                        
                const savedUser = await newUser.save();
            
                // create wishlist
                const wishlist = new Wishlist({
                    userId: savedUser._id,
                    products: []
                })
                await wishlist.save()
        
                // create cart
                const cart = new Cart({
                    userId: savedUser._id
                })
                await cart.save()

                // generate accessToken
                const accessToken = jwt.sign(
                    {
                        id: savedUser._id,
                        isAdmin: savedUser.isAdmin,
                    },
                    process.env.JWT_SECRET_KEY,
                    // {expiresIn:"1m"}
                    );
                const { password, ...others} = savedUser._doc
                res.status(200).json({...others, accessToken: accessToken, cart: cart, wishlist: wishlist})
                    
                } catch (err) {
                    res.status(500).json(err);
                }
        }
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});


// Logout Route
app.get("/auth/logout", (req, res) => {
    req.logout(() => {
        res.redirect("http://localhost:3000");
    });
});

app.listen(process.env.PORT ,() => {
    console.log('backend is running on port:',process.env.PORT);
} )