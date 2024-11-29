const router = require('express').Router()

const Order = require('../models/Order')



//create order
router.post("/:userId", async (req, res) => {

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



module.exports = router