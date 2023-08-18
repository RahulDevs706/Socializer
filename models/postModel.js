const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    postText:{
        type:String,
        min:[5, "Minimum 5 Characters"],
        max:[255, 'Maximum 255 Characters']
    },
    postImg:{
        public_id:String,
        url:String
    },
    likedBy:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments:[
        {
            txt:String,
            by:{
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            at:{type:Date, default:Date.now}
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    
})
module.exports = mongoose.model("Post", postSchema);