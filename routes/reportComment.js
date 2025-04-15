const router = require('express').Router()

const ReportComment = require('../models/ReportComment')
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('./verifyToken')


//create comment 
router.post("/", async (req, res) => {

    try {
        
        const newComment = new Comment(
            req.body
        ) 
        const savedComment = await newComment.save()

        res.status(200).json({message:"Commented successfully",comment: savedComment})

    } catch(err) {
        res.status(500).json(err)
    }
} );

//get more comment base on type thread

router.get('/order/:orderId', async (req, res) => {
    try {
        const order_id = req.params.orderId
        const order = await Order.findById(order_id)
        res.status(200).json(order)

    }catch(err) {
        res.status(500).json(err)
    }
})


//get all comment base on productId
router.get('/admin/orders', verifyTokenAndAdmin,  async (req, res) => {
    try{
        const orders = await Order.find()
        res.status(200).json({message:'query successfully', orders:orders})
    } catch(err) {
        res.status(500).json(err)
    }
} )


// delete comment


module.exports = router