
const router = require('express').Router()
const Attribute = require('../models/Attribute')

//create attribute
router.post('', async(req, res) => {
    try {
        const newAttribute = new Attribute({
            name: req.body.name
        })
        const savedAttribute = await newAttribute.save()
        res.status(200).json({message:'Create attribute successfully', attribute: savedAttribute})
    } catch(err){
        res.status(500).json(err)
    }
})

//get all attribute
router.get('', async(req, res) => {
    try {
        const attributes = await Attribute.find()
        res.status(200).json({message:'get attributes successfully', attributes: attributes})
    } catch(err) {
        res.status(500).json(err)
    }
})

//delete attribute
router.delete('/:attributeId', async(req, res) => {
    try {
        await Attribute.findByIdAndDelete(req.params.attributeId)
        res.status(200).json({message:'attribute deleted successfully'})
    } catch(err){
        res.status(500).json(err)
    }

})

//update attribute
router.put('/:attributeId', async (req, res) => {
    try{
        const updatedAttribute = await Attribute.findByIdAndUpdate(
            req.params.attributeId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:"update product successfully", attribute: updatedAttribute})
    }catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router