const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique:false },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        img: { type: String },
        verified: { type: Boolean, default: false},
        createdAtt: { type: Date, default: Date.now(), expires: 86400} // 24 hours in seconds
    },
    { timestamp: true}
    
)

module.exports = mongoose.model('User', UserSchema)