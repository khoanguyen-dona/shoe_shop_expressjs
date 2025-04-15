const router = require('express').Router()

const Comment = require('../models/Comment')
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('./verifyToken')


//create comment 
router.post("/", async (req, res) => {
    try {
        const newComment = new Comment(
            req.body
        ) 
        const savedComment = await newComment.save()

        res.status(200).json({message:"Commented successfully",comment: savedComment})

    } catch(err) {
        res.status(500).json(err)
    }
} );

//get comments by commentId and type='comment'
router.get('/refCommentId/:commentId',  async (req, res) => {
    let type = req.query.type
    let limit = parseInt(req.query.limit) || 5
    let page = parseInt(req.query.page) || 1
    try{
        const comment_id = req.params.commentId
        const comments = await Comment.find({
            $and: [
                {refCommentId: comment_id},
                type ? {type: {$in: type }} : {}
            ]
        }).skip( limit*(page-1) ).limit(limit)

        const totalReplies = await Comment.countDocuments({
            $and: [
                {refCommentId: comment_id},
                type ? {type: {$in: type }} : {}
            ]
        })

        const hasNext = parseInt(limit*page) < totalReplies ? true : false
        console.log('total', totalReplies)
        console.log('',limit*page)

        res.status(200).json({message:'query successfully', replyData: comments, page: page, hasNext: hasNext})
    } catch(err) {
        res.status(500).json(err)
    }
} )

//get comments by productId and type='comment'
router.get('/:productId',  async (req, res) => {
    let type = req.query.type
    let limit = parseInt(req.query.limit) || 5
    let page = parseInt(req.query.page) || 1
    try{
        const product_id = req.params.productId
        const comments = await Comment.find({
            $and: [
                {productId: product_id},
                type ? {type: {$in: type }} : {}
            ]
        }).skip( limit*(page-1) ).limit(limit)
        
        const totalComments = await Comment.countDocuments({
            $and: [
                {productId: product_id},
                type ? {type: {$in: type }} : {}
            ]
        })

        const hasNext = parseInt(limit*page) < totalComments ? true : false

        res.status(200).json({message:'query successfully', replyData: comments, page: page, hasNext: hasNext })
    } catch(err) {
        res.status(500).json(err)
    }
} )

// delete comment


module.exports = router