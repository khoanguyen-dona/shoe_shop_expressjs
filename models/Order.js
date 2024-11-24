const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true},
        clientName : { type: String, required: true},
        products:[ 
            {
                productId: { type: String}, 
                quantity: { type: Number}  
            }
        ],
        phoneNumber: { type: Number, required: true},
        address: { type: String, required: true },
        email: { type: String},
        total: { type: Number, required: true  },
        status: { type: String, default:'processing'},
        paymentMethod: { type: String, required: true},
        message: { type: String}
    },
    { timestamps: true}
    
)

module.exports = mongoose.model('Order', OrderSchema)