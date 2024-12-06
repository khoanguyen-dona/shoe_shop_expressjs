const router = require('express').Router()
const User = require('../models/User')

//update user
router.put('/:userId', async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json({message:"update successfully", user: updatedUser})
    }catch(err) {
        res.status(500).json(err)
    }
})

//update password
router.put('/:userId/update-password',async (req, res) => {
    try{
        const user = await User.findById(req.params.userId)

        if ( user.password === req.body.oldPassword ) {
            user.password = req.body.newPassword
            user.save()
        } else {
            return res.status(400).json({message:'wrong password'})
        }
  
        res.status(200).json({message:'password updated successfully', user: user})
    }catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router