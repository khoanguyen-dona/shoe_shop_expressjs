
const User = require('../models/User')
const Wishlist = require ('../models/Wishlist')
const Cart = require('../models/Cart')
const router = require('express').Router()
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

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

        res.status(201).json(savedUser);
       
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/login', async(req, res) => {
    try{

        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(400).json('Sai email hoặc mật khẩu')
        }
        
        if( user.password!== req.body.password ){
            return res.status(400).json('Sai email hoặc mật khẩu')
        }
        const accessToken = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn:"1d"}
          );

        const cart = await Cart.findOne({userId: user._id})
        const wishlist= await Wishlist.findOne({userId: user._id})


        const { password, ...others} = user._doc
        res.status(200).json({...others, accessToken,cart: cart, wishlist: wishlist})
   

    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router