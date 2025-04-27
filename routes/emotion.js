const router = require('express').Router()

const Emotion = require('../models/Emotion');
const { findByIdAndDelete } = require('../models/Wishlist');
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('./verifyToken')


//create Emotion 
router.post("/",verifyTokenAndAuthorization, async (req, res) => {
    try {          
        const emotion = await Emotion.findOne({
            $and:[
                {commentId: req.body.commentId},
                {userId: req.body.userId},
            ]
        })
        if (emotion){          
            if(req.body.type===emotion.type ){
                const result = await Emotion.findByIdAndDelete(emotion._id)
                return res.status(200).json({message:"liked successfully",data: result})
            } else {
                const result = await Emotion.findByIdAndUpdate(emotion._id,{
                    commentId: req.body.commentId,
                    userId: req.body.userId,
                    type: req.body.type,

                },{new: true})
                return res.status(200).json({message:'updated successfully', data: result})
            }
        } else {
            const newEmotion = new Emotion(req.body) 
            const savedEmotion = await newEmotion.save()            
            return res.status(200).json({message:"liked successfully",data: savedEmotion})
        }

    } catch(err) {
        res.status(500).json(err)
    }
} );

// //get emotions by commentId and userId

router.get('/:commentId', async (req, res) => {
    try {
        const q_userId = String(req.query.userId) 

        const emotions = await Emotion.find({
            $and: [
                {commentId: req.params.commentId},
                q_userId ? { userId: { $in: q_userId} }  : {},
            ]
        }).populate({path:'userId', select: 'username img'})
        res.status(200).json({message:'query successfully',data: emotions})

    }catch(err) {
        res.status(500).json(err)
    }
})




module.exports = router