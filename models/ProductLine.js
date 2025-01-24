const mongoose = require('mongoose')

const ProductLineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},

    },
    { timestamps: true}
    
)

module.exports = mongoose.model('ProductLine', ProductLineSchema)