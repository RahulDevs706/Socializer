const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const mongoose = require("mongoose")
const Notification = require("../models/notificationModel");

const User = require('../models/userModel');
const Post = require('../models/postModel')
const cloudinary = require('cloudinary');


exports.createPost=catchAsyncError( async(req, res, next)=>{

    const user = await User.findById(req.user.id);

    const {postImg, postText} = req.body

    let data = {};

    if(postImg){
        // cloudinary 
        myCloud = await cloudinary.v2.uploader.upload(postImg, {
            folder: "postsImg",
            // aspect_ratio: "1",
            background: "auto", height: 400, width:400, crop: "lpad"
        });

        data.postImg = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    if(postText){
        data.postText = postText
    }

    data.createdBy= req.user.id
    let post;

    if(postText || postImg){
        post = await Post.create(data);
        user.createdPost.push(post);
        await user.save();
    }

    const fArr = [];

    user.friendList.forEach(f=>{
        fArr.push(f);
    })

    let notification;

    if(fArr.length>0){
        notification = new Notification({
            user: req.user._id,
            message: `added a new post`,
            recipientUsers:fArr,
            payload:{
                post:post._id,
            },
            type:"post"
        });
    
        await notification.save();
    
        await User.updateMany(
            { _id: { $in: fArr } }, // Match friends by their IDs
            { $push: { notification: notification._id } } // Push the notification to the 'notifications' array
          );
    
    
        const populatedNotification = await Notification.findById(notification._id)
            .populate({
                path: "user",
                select: ["name", "profileImg", "_id"]
            })
            .populate({
                path: "payload",
                populate: {
                path: "post",
                select: ["_id", "postImg"]
                }
        });
    
        notification = populatedNotification;
    }
    
    res.status(201).json({
        success:true,
        message:"Successfuly created post",
        notification:notification ? notification : null
    })

});

exports.getPostsForHome=catchAsyncError( async(req, res, next)=>{

    const idArray = [];


    idArray.push(req.user.id);

    req.user.friendList.forEach( id=>{
        idArray.push(id);
    })

    
    const post = await Post.find({createdBy:{$in:idArray} })
    .sort({createdAt:-1})
    .populate({
            path:"createdBy",
            select: ['name', "profileImg"]
    })

    // console.log(post)

    res.status(200).json({
        success:true,
        totalPosts:post.length,
        posts:post
    })

})



exports.likePost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id
    const userId = req.user.id


    const post = await Post.findById(postId);
    

    const likedBy = post.likedBy;
    const likeSet = new Set();

    likedBy.forEach(i=>likeSet.add(i.toHexString()))
        
    if(likeSet.has(userId)){
        likeSet.delete(userId)
        const liked =[]
        likeSet.forEach(i=>{
            liked.push(i);
        })
        await Post.findByIdAndUpdate(postId, {likedBy:liked})

        res.status(200).json({
            success:true,
            message:"You have unliked a post",
            type:"unlike"
        })
    }else{
        likeSet.add(userId);
        const liked =[]
        likeSet.forEach(i=>{
            liked.push(i);
        })

        await Post.findByIdAndUpdate(postId, {likedBy:liked})
        let notification;


        if(post.createdBy.toString()!==userId){
            notification = new Notification({
                user: userId,
                message: `liked your post`,
                recipientUsers:[post.createdBy],
                payload:{
                    post:postId,
                },
                type:"post"
            });
    
            await notification.save();
    
            const postOwner = await User.findById(post.createdBy.toString());
            // console.log(postOwner);
    
            postOwner?.notification?.push(notification._id.toString())

            await postOwner.save();

            const populatedNotification = await Notification.findById(notification._id)
                .populate({
                    path: "user",
                    select: ["name", "profileImg", "_id"]
                })
                .populate({
                    path: "payload",
                    populate: {
                    path: "post",
                    select: ["_id", "postImg"]
                    }
            });

            notification = populatedNotification;
        }

        



        res.status(200).json({
            success:true,
            message:"You have liked a post",
            notification:notification? notification: null,
            type:"like"
        })
    }
})

exports.commentPost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id
    const userId = req.user.id

    const {txt} = req.body;

    const post = await Post.findById(postId);

    const commentObj = {
        txt:txt,
        by:userId
    }

    post.comments.push(commentObj);
    
    await post.save()

    let notification;


    if(post.createdBy.toString()!==userId){
        notification = new Notification({
            user: userId,
            message: `commented on your post`,
            recipientUsers:[post.createdBy],
            payload:{
                post:postId,
            },
            type:"post"
        });

        await notification.save();

        const postOwner = await User.findById(post.createdBy.toString());
        // console.log(postOwner);

        postOwner?.notification?.push(notification._id.toString())

        await postOwner.save();

        const populatedNotification = await Notification.findById(notification._id)
            .populate({
                path: "user",
                select: ["name", "profileImg", "_id"]
            })
            .populate({
                path: "payload",
                populate: {
                path: "post",
                select: ["_id", "postImg"]
                }
        });

        notification = populatedNotification;
    }

    res.status(201).json({
        success:true,
        message:"You commented on a post",
        notification:notification? notification: null,
    })
})

exports.getCommentForAPost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id

    const post = await Post.findById(postId).populate({
        path:"comments",
        populate:{
            path:"by",
            select: [ 'name', "profileImg"]
        },
        
    })


    res.status(200).json({
        success:true,
        comments:post.comments
    })
});

exports.deleteComment = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId).populate({
        path:"comments",
        populate:{
            path:"by",
            select: ['fName', 'lName', "profileImg"]
        },
        
    })

    const commentArray=[]

    for(i in post.comments){
        if(post.comments[i]._id.toHexString()===commentId){
            continue;
        }
        commentArray.push(post.comments[i]);
    }

    post.comments = commentArray;


    await post.save();
    

    res.status(200).json({
        success:true,
        message:"You deleted a comment",
    })
})






exports.deleteAPost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id

    const post = await Post.findById(postId);
    const postImgID = post.postImg.public_id;

    await cloudinary.v2.uploader.destroy(postImgID);

    await Post.findByIdAndRemove(postId);

    const user  = await User.findById(req.user.id).populate("createdPost");

    let userPost = user.createdPost.filter(i=>{
        let id = i._id.toHexString();
        return id!==postId;
    })

    await User.findByIdAndUpdate(req.user.id, {createdPost:userPost});

    res.status(200).json({
        success:true,
        message:"You deleted a post",
    })
})

exports.updatePost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id

    await Post.findByIdAndUpdate(postId, {postText:req.body.txt});

    res.status(200).json({
        success:true,
        message: "You updated a post"
    })
})



exports.getAPost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id

    const post = await Post.findById(postId).populate({
        path:"createdBy",
        select: ['name', "profileImg"]
    })

    res.status(200).json({
        success:true,
        post
    })
})






