const mongoose = require('mongoose')
const { Schema } = mongoose;

const EmotionSchema = new mongoose.Schema(
    {
        type: { 
            type: String , 
            enum: ['like','love','fun','sad','wow'],
            required: true ,
        },
        commentId : { type: String, required: true},
        userId: { type: Schema.Types.ObjectId, ref: 'User'},
    },
    { timestamps: true }
)

module.exports = mongoose.model('Emotion', EmotionSchema)