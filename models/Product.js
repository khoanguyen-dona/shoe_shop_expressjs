const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String , required: true, unique: false},
        productLine : { type: String},
        desc: { type: String},
        thumbnail: { type: String, required: true },
        imgGallery: { type: Array},
        categories: { type: Array},
        size: { type: Array},
        color: { type: Array},
        price: { type: Number, required: true},
        inStock: { type: Boolean, default: true}
    },
    { timestamp: true }
)

module.exports = mongoose.model('Product', ProductSchema)