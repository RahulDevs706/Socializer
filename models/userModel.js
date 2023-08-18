const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        reqired:true
    },
    role:{
        type:String,
        default:"user",
    },
    profileImg:{
        public_id:String,
        url:String
    },
    address:{
        city:String,
        state:String,
        country:String,
    },
    bio:{
        type:String
    },
    joinedAt:{
        type:Date,
        default:Date.now
    },
    isProfileCompleted:{
        type:Boolean,
        default:false,
    },
    createdPost:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'
    }],
    friendList:[{
        type:mongoose.Schema.Types.ObjectID,
        ref:"User"
    }],
    friendReq:{
        got:[{
            type:mongoose.Schema.Types.ObjectID,
            ref:"User"
        }],
        sent:[{
            type:mongoose.Schema.Types.ObjectID,
            ref:"User"
        }]
    },
    notification:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Notification"
    }],
    accountType:{
        type:String,
        default:"private"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 15)
})

// JWT token generating

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
}

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generating password reset token
userSchema.methods.getPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}

userSchema.plugin(deepPopulate, {
    rewrite: {
      author: 'user',
      approver: 'approved.user'
    }
  });
module.exports = mongoose.model("User", userSchema);