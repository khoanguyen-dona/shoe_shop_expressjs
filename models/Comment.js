const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
    {
        productId: { type:String , required: true},
        content: { type: String , required: true, unique: false},
        userId: { type: String},
        userName: { type: String},
        avatarUrl: { type: String },
        imgGallery: { type: Array},
        type: { 
            type: String,
            enum: ['thread','comment'],
            required: true,
        },
        refCommentId: { type: String},
        refCommentUserId: { type: String },
        refCommentUsername: { type: String },
        approved: { type: Boolean, default: true},
        isReplied: { type: Boolean, default: false},
    },
    { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)