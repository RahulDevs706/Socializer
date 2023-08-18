import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState={
    createPost:{
        loading:false,
        success:false,
        error:false,
        message:"",
        notification:{}
    },
    getMyPosts:{
        loading:false,
        success:false,
        error:false,
        message:"",
        posts:[]
    },
    postLike:{
        success:false,
        error:false,
        message:"",
        notification:{},
        type:"",
    },
    getSinglePost:{
        success:false,
        error:false,
        loading:true,
        message:"",
        post:{},
    },
    postComments:{
        create:{
            loading:false,
            success:false,
            error:false,
            message:"",
            notification:{},
        },
        delete:{
            loading:false,
            success:false,
            error:false,
            message:"",
        },
        get:{
            loading:true,
            success:false,
            error:false,
            message:"",
            comments:[]
        }
    },

    deletePostState:{
        loading:false,
        success:false,
        error:false,
        message:"",
    },
    updatePostState:{
        loading:false,
        success:false,
        error:false,
        message:"",
    }
}



export const createPost = createAsyncThunk('post/create', async(action)=>{
    try {
        let response ;
        await axios.post("/api/v1/post/create", action).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})

export const getMyPost = createAsyncThunk('post/getMine', async()=>{
    try {
        let response ;
        await axios.get(`/api/v1/post/getPost/Home`).then(res=>{
            if(res.status!==304)
                response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})
export const likeAPost = createAsyncThunk('post/likePost', async(action)=>{
    try {
        let response ;
        await axios.put(`/api/v1/post/like/${action}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})

export const getCommentsPostSingle = createAsyncThunk('post/getComment', async(action)=>{
    try {
        let response ;
        await axios.get(`/api/v1/post/comment/${action}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})

export const createComment = createAsyncThunk('post/createComment', async(action)=>{
    try {
        let response ;
        await axios.put(`/api/v1/post/comment/${action.id}`, {txt:action.txt} ).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})
export const deleteComment = createAsyncThunk('post/deleteComment', async(action)=>{
    try {
        let response ;
        await axios.delete(`/api/v1/post/comment/${action.id}/${action.commentId}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})
export const deletePost = createAsyncThunk('post/deletePost', async(action)=>{
    try {
        let response ;
        await axios.delete(`/api/v1/post/${action}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})
export const updatedPost = createAsyncThunk('post/updatePost', async(action)=>{
    try {
        let response ;
        await axios.put(`/api/v1/post/${action.id}`, {txt:action.txt}).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})

export const getPost = createAsyncThunk('post/getPost', async(action)=>{
    try {
        let response ;
        await axios.get(`/api/v1/post/${action}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.error(err)   
    }
})

const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        clearPostMsg:(state, action)=>{
            let {createPost, postLike, postComments, deletePostState, updatePostState, getMyPosts, getSinglePost} = state;

            if(action.payload==="PL"){
                postLike.error = false
                postLike.success= false
                postLike.message=""
                postLike.notification={}
                postLike.type=""
            }
            if(action.payload==="CC"){
                postComments.create.error = false
                postComments.create.success= false
                postComments.create.message=""
            }
            if(action.payload==="DC"){
                postComments.delete.error = false
                postComments.delete.success= false
                postComments.delete.message=""
            }
            if(action.payload==="PD"){
                deletePostState.error = false
                deletePostState.success= false
                deletePostState.message=""
            }
            
            if(action.payload==="PC"){
                createPost.error = false
                createPost.success= false
                createPost.message=""
            }
            if(action.payload==="UP"){
                updatePostState.error = false
                updatePostState.success= false
                updatePostState.message=""
            }
            if(action.payload==="GP"){
                getMyPosts.error = false
                getMyPosts.success= false
                getMyPosts.message=""
            }
            if(action.payload==="CLEAR_POST_STATE"){
                getSinglePost.error= false;
                getSinglePost.success=false;
                getSinglePost.loading=true;
                getSinglePost.message="";
                getSinglePost.post={};
            }
        }
    },

    extraReducers:{
        [createPost.pending]: (state)=>{
            state.createPost.loading = true;
        },
        [createPost.fulfilled]: (state, action)=>{
            state.createPost.loading = false;
            
            if(action.payload.success===false){
                state.createPost.message = action.payload.message;
                state.createPost.error = true
            }else{
                state.createPost.success = true;
                state.createPost.message = action.payload.message
                state.createPost.notification = action.payload.notification
            }
        },
        [getMyPost.pending]: (state)=>{
            state.getMyPosts.loading = true;
        },
        [getMyPost.fulfilled]: (state, action)=>{
            state.getMyPosts.loading = false;
            
            if(action.payload.success===false){
                state.getMyPosts.message = action.payload.message;
                state.getMyPosts.error = true
            }else{
                state.getMyPosts.success = true;
                state.getMyPosts.message = action.payload.message
                state.getMyPosts.posts = action.payload.posts
                // action.payload.posts.forEach(post=>{
                //     if((state.getMyPosts.posts.includes(post))){
                //         return;
                //     }else{
                //         state.getMyPosts.posts.push(post)
                //     }
                // })
            }
        },
        [getPost.pending]: (state)=>{
            state.getSinglePost.loading = true;
        },
        [getPost.fulfilled]: (state, action)=>{
            state.getSinglePost.loading = false;
            
            if(action.payload.success===false){
                state.getSinglePost.message = action.payload.message;
                state.getSinglePost.error = true
            }else{
                state.getSinglePost.success = true;
                state.getSinglePost.message = action.payload.message
                state.getSinglePost.post = action.payload.post
            }
        },
        [likeAPost.fulfilled]: (state, action)=>{
            
            if(action.payload.success===false){
                state.postLike.message = action.payload.message;
                state.postLike.error = true
            }else{
                state.postLike.success = true;
                state.postLike.message = action.payload.message;
                state.postLike.notification = action.payload.notification
                state.postLike.type = action.payload.type
            }
        },
        [getCommentsPostSingle.pending]: (state)=>{
            state.postComments.get.loading = true;
        },
        [getCommentsPostSingle.fulfilled]: (state, action)=>{
            state.postComments.get.loading = false;
            
            if(action.payload.success===false){
                state.postComments.get.message = action.payload.message;
                state.postComments.get.error = true
            }else{
                state.postComments.get.success = true;
                state.postComments.get.comments = action.payload.comments
            }
        },
        [createComment.pending]: (state)=>{
            state.postComments.create.loading = true;
        },
        [createComment.fulfilled]: (state, action)=>{
            state.postComments.create.loading = false;
            
            if(action.payload.success===false){
                state.postComments.create.message = action.payload.message;
                state.postComments.create.error = true
            }else{
                state.postComments.create.success = true;
                state.postComments.create.message = action.payload.message;
                state.postComments.create.notification = action.payload.notification;
            }
        },
        [deleteComment.pending]: (state)=>{
            state.postComments.delete.loading = true;
        },
        [deleteComment.fulfilled]: (state, action)=>{
            state.postComments.delete.loading = false;
            
            if(action.payload.success===false){
                state.postComments.delete.message = action.payload.message;
                state.postComments.delete.error = true
            }else{
                state.postComments.delete.success = true;
                state.postComments.delete.message = action.payload.message;
            }
        },
        [deletePost.pending]: (state)=>{
            state.deletePostState.loading = true;
        },
        [deletePost.fulfilled]: (state, action)=>{
            state.deletePostState.loading = false;
            
            if(action.payload.success===false){
                state.deletePostState.message = action.payload.message;
                state.deldeletePostStateetePost.error = true
            }else{
                state.deletePostState.success = true;
                state.deletePostState.message = action.payload.message;
            }
        },
        [updatedPost.pending]: (state)=>{
            state.updatePostState.loading = true;
        },
        [updatedPost.fulfilled]: (state, action)=>{
            state.updatePostState.loading = false;
            
            if(action.payload.success===false){
                state.updatePostState.message = action.payload.message;
                state.updatePostState.error = true
            }else{
                state.updatePostState.success = true;
                state.updatePostState.message = action.payload.message;
            }
        },

    }
})

export const {clearPostMsg} = postSlice.actions;
export default postSlice.reducer;
