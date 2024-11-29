const Cart = require('../models/Cart')
const Product = require('../models/Product')
const router = require('express').Router()


// add to cart , increase number of item
router.post('/:userId', async (req, res) => {
    const user_id = req.params.userId ;
    const product_id = req.body.productId ;
    const quantity = req.body.quantity ;
    const size = req.body.size;
    const color = req.body.color;

    try{

        const product = await Product.findById(product_id)
        const cart = await Cart.findOne({userId: user_id})

        const itemExist = cart.products.find((item) => item.productId.toString() === product_id 
    && item.size.toString() === size && item.color.toString() === color )
        
        if (itemExist  ) {
            itemExist.quantity +=1
            await cart.save()
            res.status(200).json({message:'added successfully', cart: cart})
        } else {

            cart.products.push({
                productId: product_id,
                thumbnail: product.thumbnail,
                price: product.price,
                quantity: quantity,
                size: size,
                color: color
            })
            await cart.save()
            res.status(200).json({message:'added successfully', cart: cart})
        }
    }catch (err) {
        res.status(500).json(err)
    }

} )

// decrease number of item
router.post('/:userId/decrease-item', async (req, res) => {
    const user_id = req.params.userId ;
    const product_id = req.body.productId ;
    const size = req.body.size;
    const color = req.body.color;
    try{
        const cart = await Cart.findOne({userId: user_id})

        const itemExist = cart.products.find((item) => item.productId.toString() === product_id 
    && item.size.toString() === size && item.color.toString() === color )

        

        if (itemExist ) {
            itemExist.quantity = itemExist.quantity - 1
            console.log('itemexist ----->',itemExist)
            if ( itemExist.quantity >=1 ){
                await cart.save()
                return res.status(200).json({message:'decrease successfully', cart: cart})
            } else if ( itemExist.quantity <= 0 ){
                cart.products.remove(itemExist)            
                await cart.save()
                return res.status(200).json({message:'already deleted', cart: cart})
            }
        } else {
            return res.status(200).json({message:'already deleted', cart: cart})
        }
        
    }catch (err) {
        res.status(500).json(err)
    }

} )

// delete item in cart
router.post('/:userId/delete-item', async (req, res) => {
    const user_id = req.params.userId ;
    const product_id = req.body.productId ;
    const size = req.body.size;
    const color = req.body.color;
    try{
        const cart = await Cart.findOne({userId: user_id})

        const itemExist = cart.products.find((item) => item.productId.toString() === product_id 
    && item.size.toString() === size && item.color.toString() === color )
    
        if (itemExist ) {
            console.log('itemexist--->',itemExist)
            cart.products.remove(itemExist)
            await cart.save()
            return res.status(200).json({message:'delete successfully', cart: cart})       
        } else {
            return res.status(200).json({message:'already deleted', cart: cart})
        }
        
    }catch (err) {
        res.status(500).json(err)
    }

} )


module.exports = router
