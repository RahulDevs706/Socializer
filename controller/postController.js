const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const mongoose = require("mongoose")
const Notification = require("../models/notificationModel");

const User = require('../models/userModel');
const Post = require('../models/postModel')
const cloudinary = require('cloudinary');

async function getPostsForHomeFunc(user){
    const idArray = [];


    idArray.push(user.id.toString());

    user.friendList.forEach( id=>{
        idArray.push(id.toString());
    })

    console.log(idArray);

    
    const post = await Post.find({createdBy:{$in:idArray} })
    .sort({createdAt:-1})
    .populate({
            path:"createdBy",
            select: ['name', "profileImg"]
    });

    return post;
}

async function getPostsForProfilePage(userId){

    console.log(userId, userId.toString());

    const user = await User.findById(userId.toString()).populate({
        path: 'createdPost',
        populate: {
          path: 'createdBy',
          select: ['name', 'profileImg'],
        },
      });

      const posts = user.createdPost;

      // Sort the posts in ascending order of creation date
      posts?.sort((a, b) => a.createdAt - b.createdAt);
  
      return posts;
}


// exports.createPost=catchAsyncError( async(req, res, next)=>{

//     const user = await User.findById(req.user.id);

//     const {postImg, postText} = req.body

//     let data = {};

//     if(postImg){
//         // cloudinary 
//         myCloud = await cloudinary.v2.uploader.upload(postImg, {
//             folder: "postsImg",
//             // aspect_ratio: "1",
//             background: "auto", height: 400, width:400, crop: "lpad"
//         });

//         data.postImg = {
//             public_id:myCloud.public_id,
//             url:myCloud.secure_url
//         }
//     }

//     if(postText){
//         data.postText = postText
//     }

//     data.createdBy= req.user.id
//     let post;

//     if(postText || postImg){
//         post = await Post.create(data);
//         user.createdPost.push(post);
//         await user.save();
//     }

//     const fArr = [];

//     user.friendList.forEach(f=>{
//         fArr.push(f);
//     })

//     let notification;

//     if(fArr.length>0){
//         notification = new Notification({
//             user: req.user._id,
//             message: `added a new post`,
//             recipientUsers:fArr,
//             payload:{
//                 post:post._id,
//             },
//             type:"post"
//         });
    
//         await notification.save();
    
//         await User.updateMany(
//             { _id: { $in: fArr } }, // Match friends by their IDs
//             { $push: { notification: notification._id } } // Push the notification to the 'notifications' array
//           );
    
    
//         const populatedNotification = await Notification.findById(notification._id)
//             .populate({
//                 path: "user",
//                 select: ["name", "profileImg", "_id"]
//             })
//             .populate({
//                 path: "payload",
//                 populate: {
//                 path: "post",
//                 select: ["_id", "postImg"]
//                 }
//         });
    
//         notification = populatedNotification;
//     }

//     const updHomePosts = await getPostsForHomeFunc(req.user);
//     const updProPosts = await getPostsForProfilePage(req.user);
    
//     res.status(201).json({
//         success:true,
//         message:"Successfuly created post",
//         notification:notification ? notification : null,
//         homePosts: updHomePosts,
//         profilePosts:updProPosts
//     })

// });

exports.createPost = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { postImg, postText } = req.body;
    const data = { createdBy: req.user.id };
  
    if (postImg) {
      const myCloud = await cloudinary.v2.uploader.upload(postImg, {
        folder: "postsImg",
        background: "auto",
        height: 400,
        width: 400,
        crop: "lpad",
      });
  
      data.postImg = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
  
    if (postText) {
      data.postText = postText;
    }
  
    let post;
  
    if (postText || postImg) {
      post = await Post.create(data);
      user.createdPost.push(post);
      await user.save();
    }
  
    const friendIds = user.friendList.map((friend) => friend.toString());
  
    if (friendIds.length > 0) {
      const notification = new Notification({
        user: req.user._id,
        message: `added a new post`,
        recipientUsers: friendIds,
        payload: {
          post: post._id,
        },
        type: "post",
      });
  
      await notification.save();
  
      await User.updateMany(
        { _id: { $in: friendIds } },
        { $push: { notification: notification._id } }
      );
  
      const populatedNotification = await Notification.findById(notification._id)
        .populate({
          path: "user",
          select: ["name", "profileImg", "_id"],
        })
        .populate({
          path: "payload",
          populate: {
            path: "post",
            select: ["_id", "postImg"],
          },
        });
  
      res.status(201).json({
        success: true,
        message: "Successfully created post",
        notification: populatedNotification ? populatedNotification : null,
        homePosts: await getPostsForHomeFunc(req.user),
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Successfully created post",
        homePosts: await getPostsForHomeFunc(req.user),
      });
    }
  });
  

exports.getPostsForProPage=catchAsyncError( async(req, res, next)=>{

    const post = await getPostsForProfilePage(req.params.id);

    res.status(200).json({
        success:true,
        totalPosts:post.length,
        posts:post
    })

})


exports.getPostsForHome=catchAsyncError( async(req, res, next)=>{

    const post = await getPostsForHomeFunc(req.user);

    res.status(200).json({
        success:true,
        totalPosts:post.length,
        posts:post
    })

})


exports.likePost = catchAsyncError(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
  
    const post = await Post.findById(postId);
    const isLiked = post.likedBy.includes(userId);
  
    const updateOptions = isLiked
      ? { $pull: { likedBy: userId } }
      : { $addToSet: { likedBy: userId } };
  
    const uPost = await Post.findByIdAndUpdate(postId, updateOptions, {
      new: true,
    }).populate({
      path: 'createdBy',
      select: ['name', 'profileImg'],
    });
  
    const actions = isLiked
      ? {
          success: true,
          message: 'You have unliked a post',
          type: 'unlike',
        }
      : {
          success: true,
          message: 'You have liked a post',
          type: 'like',
        };
  
    const updHomePosts = await getPostsForHomeFunc(req.user);
    const updProPosts = await getPostsForProfilePage(post.createdBy);
  
    let notification = null;
  
    if (!isLiked && uPost.createdBy._id.toString() !== userId) {
      notification = new Notification({
        user: userId,
        message: 'liked your post',
        recipientUsers: [uPost.createdBy._id],
        payload: {
          post: postId,
        },
        type: 'post',
      });
  
      await notification.save();
  
      const postOwner = await User.findById(uPost.createdBy._id.toString());
      postOwner?.notification?.push(notification._id.toString());
      await postOwner.save();
  
      const populatedNotification = await Notification.findById(notification._id)
        .populate({
          path: 'user',
          select: ['name', 'profileImg', '_id'],
        })
        .populate({
          path: 'payload',
          populate: {
            path: 'post',
            select: ['_id', 'postImg'],
          },
        });
  
      notification = populatedNotification;
    }
  
    res.status(200).json({
      ...actions,
      notification,
      homePosts: updHomePosts,
      profilePosts: updProPosts,
      post: uPost,
    });
});
  

exports.commentPost = catchAsyncError(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { txt } = req.body;
  
    const post = await Post.findById(postId).populate({
      path: 'createdBy',
      select: ['name', 'profileImg'],
    });
  
    const commentObj = {
      txt: txt,
      by: userId,
    };
  
    post.comments.push(commentObj);
  
    await post.save();
  
    let notification;
  
    if (post.createdBy._id.toString() !== userId) {
      notification = new Notification({
        user: userId,
        message: 'commented on your post',
        recipientUsers: [post.createdBy._id],
        payload: {
          post: postId,
        },
        type: 'post',
      });
  
      await notification.save();
  
      const postOwner = await User.findById(post.createdBy._id.toString());
  
      postOwner?.notification?.push(notification._id.toString());
  
      await postOwner.save();
  
      const populatedNotification = await Notification.findById(notification._id)
        .populate({
          path: 'user',
          select: ['name', 'profileImg', '_id'],
        })
        .populate({
          path: 'payload',
          populate: {
            path: 'post',
            select: ['_id', 'postImg'],
          },
        });
  
      notification = populatedNotification;
    }
  
    const [updHomePost, updProPosts] = await Promise.all([
      getPostsForHomeFunc(req.user),
      getPostsForProfilePage(post.createdBy._id),
    ]);
  
    res.status(201).json({
      success: true,
      message: 'You commented on a post',
      notification: notification ? notification : null,
      homePosts: updHomePost,
      profilePosts: updProPosts,
      post,
    });
});
  

exports.getCommentForAPost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id

    const post = await Post.findById(postId).populate({
        path:"comments",
        populate:{
            path:"by",
            select: [ 'name', "profileImg"]
        },
        
    })

    const updHomePost = await getPostsForHomeFunc(req.user)
    const updProPosts = await getPostsForProfilePage(post.createdBy._id);


    res.status(200).json({
        success:true,
        comments:post.comments,
        homePosts: updHomePost,
        profilePosts: updProPosts
    })
});

exports.deleteComment = catchAsyncError(async (req, res, next) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
  
    const post = await Post.findById(postId).populate({
      path: 'comments',
      populate: {
        path: 'by',
        select: ['fName', 'lName', 'profileImg'],
      },
    }).populate({
      path: 'createdBy',
      select: ['name', 'profileImg'],
    });
  
    post.comments = post.comments.filter((comment) => {
      return comment._id.toString() !== commentId;
    });
  
    await post.save();
  
    const [updHomePost, updProPosts] = await Promise.all([
      getPostsForHomeFunc(req.user),
      getPostsForProfilePage(post.createdBy._id),
    ]);
  
    res.status(200).json({
      success: true,
      message: 'You deleted a comment',
      homePosts: updHomePost,
      profilePosts: updProPosts,
      post,
    });
  });
  

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

    const updHomePost = await getPostsForHomeFunc(req.user)
    const updProPosts = await getPostsForProfilePage(post.createdBy._id);
    

    res.status(200).json({
        success:true,
        message:"You deleted a post",
        homePosts: updHomePost,
        profilePosts: updProPosts
    })

    
})


exports.updatePost = catchAsyncError(async (req, res, next) => {
    const postId = req.params.id;
    const { txt: postText } = req.body;
  
    const post = await Post.findByIdAndUpdate(postId, { postText }, { new: true }).populate({
      path: 'createdBy',
      select: ['name', 'profileImg'],
    });
  
    const [updHomePost, updProPosts] = await Promise.all([
      getPostsForHomeFunc(req.user),
      getPostsForProfilePage(post.createdBy._id),
    ]);
  
    res.status(200).json({
      success: true,
      message: 'You updated a post',
      homePosts: updHomePost,
      profilePosts: updProPosts,
      post,
    });
  });
  
exports.getAPost = catchAsyncError( async(req, res, next)=>{
    const postId = req.params.id

    const post = await Post.findById(postId).populate({
        path:"createdBy",
        select: ['name', "profileImg"]
    })

    if(!post){
        res.status(404).json({
            success:false
        })
    }

    res.status(200).json({
        success:true,
        post
    })
})
