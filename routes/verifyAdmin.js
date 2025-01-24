const router = require('express').Router()
const User = require('../models/User')

const {
    verifyTokenAndAdmin
} = require('./verifyToken')

// add to wishlist
router.post("", verifyTokenAndAdmin, async (req, res) => {
    try {
        res.status(200).json({message:'You are admin'})
        
       

    } catch(err) {
        res.status(500).json(err)
    }
} );



module.exports = router