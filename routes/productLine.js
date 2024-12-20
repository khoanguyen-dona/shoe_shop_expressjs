
const router = require('express').Router()
const ProductLine = require('../models/ProductLine')

// create product line
router.post('', async(req, res) => {
    const name = req.body.name
    try {
        const newProductLine = new ProductLine({
            name: name
        })
        const savedProductLine = await newProductLine.save()
        res.status(200).json({message:'create product line successfully', productLine: savedProductLine})
    } catch(err) {
        res.status(500).json(err)
    }
})

// get all product line
router.get('', async(req, res) => {
    try {   
        const productLines = await ProductLine.find()
        res.status(200).json({message:'Get product lines successfully', productLines: productLines})

    } catch(err) {
        res.status(500).json(err)
    }
})

// delete product line by id
router.delete('/:productLineId', async(req, res) => {
    try {
        await ProductLine.findByIdAndDelete(req.params.productLineId) 
        res.status(200).json('Delete product line successfully')
    } catch(err) {
        res.status(500).json(err)
    }
})

//update product line by id
router.put('/:productLineId', async(req, res) => {
    try {
        const updatedProductLine = await ProductLine.findByIdAndUpdate(
            req.params.productLineId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:'update product line successfully', productLine: updatedProductLine})
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router