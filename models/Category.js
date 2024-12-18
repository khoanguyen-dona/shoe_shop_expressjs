const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        attributes: { type: Array  } ,
    },
    { timestamps: true}
    
)

module.exports = mongoose.model('Category', CategorySchema)