const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true},
        clientName : { type: String, required: true},
        products:[ 
            {
                productId: { type: String}, 
                name: {type: String},
                thumbnail: { type: String},
                price: { type: Number},
                color: { type: String},
                size: { type: String},
                quantity: { type: Number}  
            }
        ],
        phoneNumber: { type: String, required: true},
        address: { type: String, required: true },
        email: { type: String},
        total: { type: Number },
        status: { type: String , default: 'processing'},
        paymentMethod: { type: String, required: true},
        message: { type: String}
    },
    { timestamps: true}
    
)

module.exports = mongoose.model('Order', OrderSchema)