const router = require('express').Router()
const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')

router.post("/:userId", async (req, res) => {
    try {
        const user_id = req.params.userId
        const product_id = req.body.productId

        const product = await Product.findById(product_id)
        
        let wishlist = await Wishlist.findOne({ userId: user_id })
        
        const products = wishlist.products
        let favoriteProduct = products.find((item) => item._id.toString() === product_id )

        if (favoriteProduct){
            wishlist.products = products.filter((item) => item._id.toString() !== product_id  )
            await wishlist.save()
            res.status(200).json({ message: 'item is removed from wish list', wishlist: wishlist})
        } else {
            wishlist.products.push(product)
            await wishlist.save()
            res.status(200).json({ message: 'item added to wishlist', wishlist: wishlist})
        }
        
       

    } catch(err) {
        res.status(500).json(err)
    }
} );



module.exports = router