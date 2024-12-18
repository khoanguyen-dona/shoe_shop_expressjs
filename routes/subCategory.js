const router = require('express').Router()
const SubCategory = require('../models/SubCategory')

//create subCategory
router.post('', async(req, res) => {
    const name = req.body.name
    const categoryId = req.body.categoryId
    try {
        const newSubCategory = new SubCategory({
            categoryId: categoryId,
            name: name
        })
        const savedSubCategory = await newSubCategory.save()
        res.status(200).json({message:'create subcategory successfully', subCategory: savedSubCategory})
    } catch(err) {
        res.status(500).json(err)
    }
})

// get subCategory by fatherCategoryId
router.get('/:categoryId', async(req, res) => {
    try {
        const subCategory = await SubCategory.find({categoryId: req.params.categoryId})
        res.status(200).json({message:'get subCategory successfully', subCategory: subCategory})
    } catch(err) {
        res.status(500).json(err)
    }
})

// delete subCategory
router.delete('/:categoryId', async(req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.categoryId)
        res.status(200).json('Delete sub-category successfully')
    } catch(err){
        res.status(500).json(err)
    }

})
// update subCat

router.put('/:categoryId', async(req, res) => {
    try {
        const updatedSubCat = await SubCategory.findByIdAndUpdate(
            req.params.categoryId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:'update sub-category successfully', subCategory: updatedSubCat})
    } catch(err){
        res.status(500).json(err)
    }
})
module.exports = router