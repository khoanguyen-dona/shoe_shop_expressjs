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

//get users
router.get('/', async(req, res) => {
    try{
        const users = await User.find()
        res.status(200).json({message:'get users successfully', users: users})
    } catch(err){
        console.log(err)
    }
})
//get user
router.get('/:userId', async(req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        res.status(200).json({message:'Get user successfully', user: user})
    } catch(err) {
        console.log(err)
    }
})

//delete user
router.delete('/:userId', async (req, res) => {
    const user_id = req.params.userId
    try{
        await User.findByIdAndDelete(user_id)
        res.status(200).json("User deleted successfully")
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router