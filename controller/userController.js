const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken.js');
const cloudinary = require('cloudinary');
const ApiFeatures = require('../utils/apiFeatures')
const mongoose = require('mongoose');
const Notification = require('../models/notificationModel');
const getRecommendedUsers = require('../utils/recommendations');


exports.loginUser= catchAsyncError( async(req, res, next)=>{
    const {email, password}= req.body;

    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid credentials", 401));
    }


    sendToken(user, 200, res);
})

exports.registerUser=catchAsyncError( async(req, res, next)=>{


    const user = await User.create(req.body);

    sendToken(user, 201, res);
});



exports.getUser = catchAsyncError(async(req, res, next)=>{
    const user = await User.findById(req.user.id).populate({
        path:"friendList",
        select:['name', 'profileImg']
    }).populate({
        path:"friendReq",
        populate:{
            path:"sent",
            select:['name', 'profileImg']
        }
    }).populate({
        path:"friendReq",
        populate:{
            path:"got",
            select:['name', 'profileImg']
        }
    })

    res.status(200).json({
        success:true,
        user
    })
})
exports.viewProfile = catchAsyncError(async(req, res, next)=>{
    const user = await User.findById(req.params.id).populate({
        path:"friendList",
        select:['name', 'profileImg']
    })
    // .populate("createdPost")
    .populate({
            path:'createdPost',
            populate:{
                path:"createdBy"
                // select: ['name', "profileImg"]
            }
    })


    res.status(200).json({
        success:true,
        user
    })
})

exports.logoutUser = catchAsyncError(async(req, res, next)=>{


    res.cookie('token', null, {
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Successfuly logged out"
    })


})

exports.completeUser = catchAsyncError(async(req, res, next)=>{

    const { profileImgUrl, address, bio} = req.body;

    // clodinary work
    let myCloud
    
    const data={
        address: address,
        bio:bio,
        isProfileCompleted:true
    }

    if(profileImgUrl!==""){
        myCloud = await cloudinary.v2.uploader.upload(profileImgUrl,  [
            {height: 100, width: 100, crop: "mpad", folder:"profileImg"},
            // {radius: "max"},
            {dpr: "2.0"}
            ]);

        data.profileImg = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }else{
        const user = await User.findById(req.user.id);
        if(user.gender==='male'){
            data.profileImg = {
                public_id:"profileImg/Default/ManAvatar_nheo8c",
                url:"https://res.cloudinary.com/dvrop3kvo/image/upload/v1656318351/profileImgs/Default/ManAvatar_nheo8c.png"
            }
        }else if(user.gender==="female"){
            data.profileImg = {
                public_id:"profileImg/Default/WomanAvatar_djgahh",
                url:"https://res.cloudinary.com/dvrop3kvo/image/upload/v1656318351/profileImgs/Default/WomanAvatar_djgahh.png"
            }
        }
    }


    await User.findByIdAndUpdate(req.user.id, data, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        message:"Profile completion done. You may now enjoy Socializer"
    })
})

exports.searchUser = catchAsyncError(async(req, res, next)=>{
    
    const results = new ApiFeatures(User.find(), req.query).search()

    let temp = await results.user.clone();

    const searchRes= temp.filter(i=>{
        return i._id.toString() !== req.user.id
    })

    res.status(200).json({
        success:true,
        data:searchRes
    })
})

exports.friendReq = catchAsyncError(async(req,res,next)=>{

    const {req_to} = req.body;

    const to = await User.findById(req_to);
    const by = await User.findById(req.user.id);


    
    if(!(to.friendReq.got.includes(req.user.id) && by.friendReq.sent.includes(req_to))){
        to.friendReq.got.push(req.user.id);
        by.friendReq.sent.push(req_to);
    }else{
        res.status(200).json({
            success:false,
            message:"Already sent"
        })
    }

    
    await by.save();

    let notification ;

    notification = new Notification({
        user: req.user.id,
        message: `sent you a friend request`,
        recipientUsers:[req_to],
        type:"friendReq"
    })

    await notification.save();

    to.notification?.push(notification._id.toString())

    await to.save();

    const populatedNotification = await Notification.findById(notification._id)
    .populate({
        path: "user",
        select: ["name", "profileImg", "_id"]
    })

    notification = populatedNotification;

    res.status(200).json({
        success:true,
        message:"Request sent",
        notification:notification?notification : null
    })

})

// accept/ remove friend request
exports.freindAcc_Rem = catchAsyncError(async(req,res,next)=>{

    const {f_id, type} = req.body;

    const fri = await User.findById(f_id);
    const user = await User.findById(req.user.id);


    const data = {
        success:false,
        message:"Internal server error",
        notification:null
    }


    if(type==="accept"){
        const ind_fri = fri.friendReq.sent.indexOf(req.user.id);
        const ind_user = user.friendReq.got.indexOf(f_id);

    
        if (ind_fri>-1){
            fri.friendReq.sent.splice(ind_fri);
        }
        if(ind_user>-1){
            user.friendReq.got.splice(ind_user);
        }
        fri.friendList.push(req.user.id);
        user.friendList.push(f_id);
        await fri.save();
        await user.save();


        let notification ;

        notification = new Notification({
            user: req.user.id,
            message: `accepted your friend request`,
            recipientUsers:[f_id],
            type:"friendReq_Acc"
        })

        await notification.save();

        fri.notification?.push(notification._id.toString())

        await fri.save();

        const populatedNotification = await Notification.findById(notification._id)
        .populate({
            path: "user",
            select: ["name", "profileImg", "_id"]
        })

        notification = populatedNotification;

        data.success=true;
        data.notification = notification;
        data.message="Request accepted";

    }


    else if (type === "remove_req") {
        const ind_fri = fri.friendReq.sent.indexOf(req.user.id);
        const ind_user = user.friendReq.got.indexOf(f_id);
        
        console.log(`${req.user.id}->${ind_fri}`);
        console.log(`${f_id}->${ind_user}`);

        if (ind_fri > -1) {
            fri.friendReq.sent.splice(ind_fri, 1); // Remove one element from fri.friendReq.sent
        }
        if (ind_user > -1) {
            user.friendReq.got.splice(ind_user, 1); // Remove one element from user.friendReq.got
        }
    
        await fri.save();
        await user.save();
    
        data.success = true;
        data.message = "Request removed";
    }
    
    else if(type==="remove_fri"){
        const ind_fri = fri.friendList.indexOf(req.user.id);
        const ind_user = user.friendList.indexOf(f_id);


        if (ind_fri>-1){
            fri.friendList.splice(ind_fri);
        }
        if(ind_user>-1){
            user.friendList.splice(ind_user);
        }

        await fri.save();
        await user.save();

        

        data.success=true,
        data.message="Friend removed"


    }

    else if(type==="cancel"){

        const ind_fri = fri.friendReq.got.indexOf(req.user.id);
        const ind_user = user.friendReq.sent.indexOf(f_id);
    
        if (ind_fri>-1){
            fri.friendReq.got.splice(ind_fri);
        }
        if(ind_user>-1){
            user.friendReq.sent.splice(ind_user);
        }


        await fri.save();
        await user.save();

        data.success=true,
        data.message="Request canceled"

    }



    res.status(200).json(data)
    
})

exports.clearNotification= catchAsyncError(async(req, res,next)=>{
    const {id, type} = req.body;
    const user = await User.findById(req.user.id)

    if(type==="clear_all"){
        await User.findByIdAndUpdate(req.user.id, {notification:[]});
        res.status(200).json({
            success:true,
            message:"Cleared notification"
        })
    }else if(type==="clear_one"){
       const newNotific =  user?.notification?.filter(i=>(i._id!==id));
       await User.findByIdAndUpdate(req.user.id, {notification:newNotific});
       res.status(200).json({
        success:true,
        message:"Deleted a notification"
    })
    }

    res.status(200).json({
        success:false,
        message:"Internal server error"
    })
    
})

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const {data, type} = req.body;


    const newData={};
    const user = await User.findById(req.user._id).select("+password");

    if(type==="profile_pic"){


        const imageId = user.profileImg.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(data,  [
            {height: 100, width: 100, crop: "mpad", folder:"profileImg"},
            {dpr: "2.0"}
            ]
        );
        newData.profileImg = {
            public_id: myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    if(type==="bio"){
        newData.bio = data; 
    }

    if(type==="name"){
        newData.name = data;
    }

    if(type==="email"){
        newData.email = data;
    }

    if(type==="password"){
        user.password = data;
        await user.save();
        sendToken(user, 200, res, "Password changed successfully");
    }

    if(type==="accType"){
        newData.accountType = data;
    }

    if(type!=="password"){
        newData && await User.findByIdAndUpdate(req.user.id, newData,{
            new:true,
            useFindAndModify:false
        })
    
        res.status(200).json({
            success:true,
            message:"Successfully updated profile",
            type:type
        })
    }

})

exports.verifyPass = catchAsyncError(async(req, res,next)=>{
    const {password} = req.body;
    const email = req.user.email;

    const user = await User.findOne({email}).select("+password");

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Wrong password entered", 401));
    }

    res.status(200).json({
        success:true,
        error:false,
        message:"Correct Password"
    })

})


exports.suggestFriends = catchAsyncError(async(req, res,next)=>{
    
// console.log(req.user);

    const currAddress = req.body;
    console.log(currAddress);
    const recommendedUsers = await getRecommendedUsers(req.user, currAddress);



    // console.log(recommendedUsers);
    res.status(200).json({
        success:true,
        users:recommendedUsers 
    })
})

exports.getNotificationsForUser = catchAsyncError(async(req, res,next)=>{

    const userId = req.user._id

    

    const user = await User.findById(userId).populate({
        path:"notification",
        populate:{
            path: "user",
            select: ["name", "profileImg", "_id"]
        },
    }).populate({
        path:"notification",
        
        populate:{
            path: "payload",
            populate: {
            path: "post",
            select: ["_id", "postImg"]
            }
        }
    })

    const notifications = user.notification;

    notifications.sort(function(a, b) {
        if (a.createdAt < b.createdAt) return 1;
        else if (a.createdAt > b.createdAt) return -1;
        return 0;
    });

    res.status(200).json({
        success:true,
        notifications:notifications,
    })

    
})

exports.readNotification = catchAsyncError(async(req, res,next)=>{

    const notificationId = req.body.notificationId;

    await Notification.findByIdAndUpdate(notificationId, {seen:true});

    res.status(200).json({
        success:true,
        seen:true,
    })
    
    
})

exports.clearAllNotifications = catchAsyncError(async(req,res,next)=>{
    const userId = req.user._id;
    
    await Notification.updateMany(
        { recipientIds: userId },
        { $pull: { recipientIds: userId } }
    ).then(() => {
        // Remove notifications with empty recipientIds array
        return Notification.deleteMany({ recipientIds: { $size: 0 } });
    });

    await User.updateOne(
        { _id: userId },
        { $set: { notification: [] } }
      );

    res.status(200).json({
        success:true,
    })

})