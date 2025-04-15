const mongoose = require('mongoose')

const ReportCommentSchema = new mongoose.Schema(
    {
        commentId: { type: String , required: true},
        userId: { type: String , required: true}
    },
    { timestamps: true }
)

module.exports = mongoose.model('ReportComment', ReportCommentSchema)