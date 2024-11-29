const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String , required: true, unique: false},
        desc: { type: String},
        thumbnail: { type: String, required: true },
        categories: { type: Array},
        size: { type: Array},
        color: { type: Array},
        price: { type: Number, required: true},
        inStock: { type: Boolean, default: true}
    },
    { timestamp: true }
)

module.exports = mongoose.model('Product', ProductSchema)