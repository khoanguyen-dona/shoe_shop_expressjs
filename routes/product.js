
const Product = require('../models/Product')
const router = require('express').Router()


router.get('/:id', async (req, res) => {
    try{
        const productId = req.params.id
        const product = await Product.findById(productId)
        res.status(200).json(product) 

    }catch(err){
        res.status(500).json(err)
    }
})


router.get('', async (req, res) => {
    
    try {
        qCategory = req.query.category

        const products = await Product.find({ categories: {
            $in: [qCategory]
        } })
        
        res.status(201).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})




module.exports = router