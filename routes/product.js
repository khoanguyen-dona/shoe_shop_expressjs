
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

// get products with multifield condition and pagination

router.get('', async (req, res) => {
    const page = parseInt(req.query.page) 
    const limit = parseInt(req.query.limit) 
    const startIndex = parseInt((page - 1) * limit) 
    const endIndex = parseInt((startIndex + limit)) 
    let color = req.query.color 
    let size = String(req.query.size)  
    let qCategory = req.query.category
    const minPrice = parseInt(req.query.minPrice) || 0
    const maxPrice = parseInt(req.query.maxPrice) || 1000000000
    try {
        if ( qCategory  ) {       
            qCategory= qCategory.split(',')
            
            const products = await Product.find({
                $and: [    
                    qCategory ? { categories: { $in: qCategory } } : {},
                    color ? { color: { $in: color} }  : {},
                    size ? { size:  { $in: size } }  : {},
                    { price: { $gte: minPrice , $lte: maxPrice } }
                ]
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