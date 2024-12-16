
const Product = require('../models/Product')
const router = require('express').Router()

// get product with id
router.get('/:id', async (req, res) => {

    try{
        const productId = req.params.id    
        const product = await Product.findById(productId)
        res.status(200).json(product) 
    
    }catch(err){
        res.status(500).json(err)
    }
})

// get products base on category
// router.get('', async (req, res) => {
    
//     try {
//         qCategory = req.query.category
//         if(qCategory){
//             const products = await Product.find({ categories: {
//                 $in: [qCategory]
//             } })          
//             res.status(201).json(products);
//         } else {
//             const products = await Product.find()           
//             res.status(201).json(products);
//         }      
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })

// get products base on category with pagination
router.get('', async (req, res) => {
    const page = parseInt(req.query.page) 
    const limit = parseInt(req.query.limit) 

    const startIndex = (page - 1) * limit 
    const endIndex = (startIndex + limit) 
    try {
        qCategory = req.query.category
        if (qCategory) {
            console.log(qCategory)
            qCategory=qCategory.split(',')
            const products = await Product.find({
                categories: { $in: qCategory}
            })   
            const paginated_products = products.slice(startIndex,endIndex) 
            const totalPage = Math.ceil(products.length / limit)
            const totalProducts = products.length
            res.status(200).json({message:'get products successfully', totalProducts: totalProducts, page: page,
                totalPage: totalPage, limit: limit, startIndex: startIndex, endIndex: endIndex, products: paginated_products});
        } 
        else {
            const products = await Product.find()     
            const paginated_products = products.slice(startIndex,endIndex) 
            const totalPage = Math.ceil(products.length / limit)
            const totalProducts = products.length
            res.status(200).json({message:'get products successfully', totalProducts: totalProducts, page: page,
                totalPage: totalPage, limit: limit, startIndex: startIndex, endIndex: endIndex, products: paginated_products});
        }      
    } catch (err) {
        res.status(500).json(err);
    }
})

//update product
router.put('/:productId', async (req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:"update product successfully", product: updatedProduct})
    }catch(err) {
        res.status(500).json(err)
    }
})

//add new product
router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);
  
    try {
      const savedProduct = await newProduct.save();
      res.status(200).json({message:'add product successfully', product: savedProduct});
    } catch (err) {
      res.status(500).json(err);
    }
  });

//delete product
router.delete('/:productId', async (req, res) => {
    const product_id = req.params.productId
    try{
        await Product.findByIdAndDelete(product_id)
        res.status(200).json("Product deleted successfully")
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router