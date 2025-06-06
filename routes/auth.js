
const User = require('../models/User')
const Wishlist = require ('../models/Wishlist')
const Cart = require('../models/Cart')
const router = require('express').Router()
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const resend = require('../resend')

router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        img: 'https://firebasestorage.googleapis.com/v0/b/adidas-shop-d0636.appspot.com/o/upload%2Favatar%2F1739627652315Giay_Ultraboost_5_trang_ID8810_HM5.avif?alt=media&token=b7642697-4818-489e-b5b5-3dd853044ffe',
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

        //verifyToken
        const verifyToken =  jwt.sign({
            userId: savedUser._id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY, { expiresIn: '24h'})
       
        //send verification email
        try {
            // Create HTML content for email
        const emailHtmlContent = `
        <h2>Xác thực Email của bạn:</h2>
        <p>Vui lòng bấm vào đường link dưới đây để hoàn tất việc xác thực email(email verification)</p>
        <a href='${process.env.BACK_END_URL}/api/auth/email-verification?verifyToken=${verifyToken}' >Xác thực email(email verification)</a>
        `;

        // Send email
        const emailResponse = await resend.emails.send({
            from: 'ShoeShop@donawebs.com',
            to: req.body.email,
            subject: 'Email Verification - Xác thực email!',
            html: emailHtmlContent
          })

        res.status(201).json({savedUser,verifyToken: verifyToken,emailResponse: emailResponse});
        } catch(err) {
            console.log('error while sending email',err)
        }
     
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
            // {expiresIn:"1m"}
          );

        const cart = await Cart.findOne({userId: user._id})
        const wishlist= await Wishlist.findOne({userId: user._id})


        const { password, ...others} = user._doc
        res.status(200).json({...others, accessToken: accessToken,cart: cart, wishlist: wishlist})
   

    } catch(err) {
        res.status(500).json(err)
    }
})

//admin login 

router.post('/admin-login', async(req, res) => {
    try{

        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(400).json('Sai email hoặc mật khẩu')
        }
        if( user.isAdmin===false){
            return res.status(400).json('You are not admin')
        }
        
        if( user.password!== req.body.password  ){
            return res.status(400).json('Sai email hoặc mật khẩu')
        }
        const accessToken = jwt.sign(
            {
              userId: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_KEY,
            // {expiresIn:"1m"}
          );

        const cart = await Cart.findOne({userId: user._id})
        const wishlist= await Wishlist.findOne({userId: user._id})


        const { password, ...others} = user._doc
        res.status(200).json({...others, accessToken: accessToken,cart: cart, wishlist: wishlist})
   

    } catch(err) {
        res.status(500).json(err)
    }
})


  // email verification
  router.get('/email-verification', async (req, res) => {
    const verifyToken = req.query.verifyToken
   

    try {
        const decodedToken = jwt.verify(verifyToken, process.env.JWT_SECRET_KEY)
        // remove field createdAtt in models User
        const user = await User.findByIdAndUpdate(decodedToken.userId,{ 
            verified: true,
            $unset: { createdAtt: 1 },
        });
             
        if (user){      
            res.send(`<h1>Email Verified sucessfully</h1>.Click here to <a href='${process.env.FRONT_END_URL}/login' > Login </a> `)
        }
    } catch(err){
        console.log('err while decode Token',err)
    }
  })

module.exports = router