const router = require('express').Router()

const Order = require('../models/Order')



//create order
router.post("/order/:userId", async (req, res) => {

    try {
        const user_id = req.params.userId
   
        const {clientName, products, phoneNumber, address, email, paymentMethod, message  } = req.body

        const itemTotals = products.map((item) => {
            const { price, quantity } = item;
            return price * quantity;
          });

        const totalPrice = itemTotals.reduce((total, itemTotal) => total + itemTotal, 0);
    

        const newOrder = new Order({
            userId: user_id,
            clientName: clientName,
            products: products,
            phoneNumber: phoneNumber,
            address: address,
            email: email,
            paymentMethod: paymentMethod,
            message: message,
            total: totalPrice,
        }) 
        const savedOrder = await newOrder.save()

        res.status(200).json({message:"Ordered successfully",order: savedOrder})

    } catch(err) {
        res.status(500).json(err)
    }
} );

//get order

router.get('/order/:orderId', async (req, res) => {
    try {
        const order_id = req.params.orderId
        const order = await Order.findById(order_id)
        res.status(200).json(order)

    }catch(err) {
        res.status(500).json(err)
    }
})

//get user orders 
router.get('/orders/:userId', async (req, res) => {
    try{
        const user_id = req.params.userId
        const orders = await Order.find({userId: user_id})
        res.status(200).json({message:'get orders successfully', orders: orders})
    } catch(err) {
        res.status(500).json(err)
    }
})

//get all orders
router.get('/admin/orders', async (req, res) => {
    try{
        const orders = await Order.find()
        res.status(200).json({message:'query successfully', orders:orders})
    } catch(err) {
        res.status(500).json(err)
    }
} )

// update order
router.put('/admin/order/:orderId', async (req, res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:"update order successfully", order: updatedOrder})
    }catch(err) {
        res.status(500).json(err)
    }
})

// delete order
//delete product
router.delete('/admin/order/:orderId', async (req, res) => {
    const order_id = req.params.orderId
    try{
        await Order.findByIdAndDelete(order_id)
        res.status(200).json("order deleted successfully")
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router