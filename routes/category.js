
const router = require('express').Router()
const Category = require('../models/Category')

// create a category
router.post('', async(req, res) => {
    const name = req.body.name
    try {
        const newCategory = new Category({
            name: name
        })
        const savedCategory = await newCategory.save()
        res.status(200).json({message:'create category successfully', category: savedCategory})
    } catch(err) {
        res.status(500).json(err)
    }
})
// get all categories
router.get('', async(req, res) => {
    try {
        const category = await Category.find()
        res.status(200).json({message:'get categories successfully', categories: category})
    } catch(err) {
        res.status(500).json(err)
    }
})

// delete category by id
router.delete('/:categoryId', async(req, res) => {
    try {
         await Category.findByIdAndDelete(req.params.categoryId)
        res.status(200).json('Delete successfully' )
    } catch(err) {
        res.status(500).json(err)
    }
})

router.get('/:categoryId', async(req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId)
        res.status(200).json({message:'get category successfully', category: category})
    } catch(err){
        res.status(500).json(err)
    }

})

//update category
router.put('/:categoryId', async(req, res) => {
    try {
        const updatedCat = await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:'update category successfully', category: updatedCat})
    } catch(err) {
        res.status(500).json(err)
    }
})
module.exports = router