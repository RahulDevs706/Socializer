const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }],
    message: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },payload:{
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    },
    type:String
});
  
module.exports = mongoose.model('Notification', notificationSchema);