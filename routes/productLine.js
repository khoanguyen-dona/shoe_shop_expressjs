
const router = require('express').Router()
const ProductLine = require('../models/ProductLine')

router.post('', async(req, res) => {
    const name = req.body.name
    try {
        const newProductLine = new ProductLine({
            name: name
        })
        const savedProductLine = await newProductLine.save()
        res.status(200).json({message:'create category successfully', productLine: savedProductLine})
    } catch(err) {
        res.status(500).json(err)
    }
})



module.exports = router