const router = require('express').Router()

const ReportComment = require('../models/ReportComment')
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('./verifyToken')


//create report comment 
router.post("/", async (req, res) => {

    try {
        const reportComment = await ReportComment.find({
            $and: [
                {commentId: req.body.commentId},
                {productId: req.body.productId},
                {userId: req.body.userId}
            ]
        })
 
        if (reportComment.length>0) {
            const result =  await ReportComment.findByIdAndDelete(reportComment[0]._id)
            res.status(200).json({message:'delete successfully', data: result})

        } else {
            const newReportComment = new ReportComment(
                req.body
            ) 
            const savedComment = await newReportComment.save()
            
            res.status(200).json({message:"Report comment successfully",comment: savedComment})
        }

    } catch(err) {
        res.status(500).json(err)
    }
} );

//get all report comment base on userId and productId
router.get('/:userId',  async (req, res) => {
    try{
        const reportComments = await ReportComment.find({
            $and: [
                {userId: req.params.userId},
                {productId: req.query.productId}
            ]
        })
        res.status(200).json({message:'query successfully', reportComments: reportComments})
    } catch(err) {
        res.status(500).json(err)
    }
} )


// delete comment


module.exports = router