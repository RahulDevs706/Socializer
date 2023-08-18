import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { sendMail } from "../../utils/sendMail";

const initialState={
    register:{
        loading:false,
        emailVerification:{
            code:"",
            sent:false,
            verification:{
                started:false,
                completed:false,
                error:false,
                message:"",
            },
            attemptsLeft:2,
            message:""
        },
        success:false,
        error:false,
        message:"",
    },
    user:{},
    isLoggedIn:false,
    login:{
        loading:false,
        success:false,
        error:false,
        message:""
    },

    loadUser:{
        loading:true,
        success:false,
        error:false,
        message:""
    },
    profile:{
        loading:false,
        success:false,
        error:false,
        message:"",
        user:{}
    },
    profileUpdate:{
        loading:false,
        success:false,
        error:false,
        message:"",
        type:""
    },
    passVerify:{
        loading:false,
        success:false,
        error:false,
        message:"",
    },
    logout:{
        loading:false,
        success:false,
        error:false,
        message:""
    },
    profileCompletion:{
        loading:false,
        success:false,
        error:false,
        message:""
    },
    friendReq:{
        send:{
            error:false,
            loading:false,
            success:false,
            message:"",
            notification:{},
        },
        accept_remove_cancel:{
            error:false,
            loading:false,
            success:false,
            message:"",
            notification:{}
        },
        suggestions:{
            error:false,
            loading:false,
            success:false,
            message:"",
            friends:[],
        }
    },
    isProfileCompleted:false,
    notification:{

        fromDb:{
            loading:false,
            success:false,
            error:false,
        },
        read:{
            loading:false,
            success:false,
            seen:false,
            error:false
        },
        filter:{
            filteredData:[],
            called:false
        },
        clear:{
            loading:false,
            success:false,
            error:false
        },
        count:0,
        notifications:[]
    }
}

export const registerUser = createAsyncThunk("user/register", async(action)=>{
    const data = action
    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.post("/api/v1/user/register", data, config).then(res=>{
            response = res
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const loginUser = createAsyncThunk("user/login", async(action)=>{
    const data = action
    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.post("/api/v1/user/login", data, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const logoutUser = createAsyncThunk("user/logout", async()=>{
    try {
        let response ;
        await axios.get("/api/v1/user/logout").then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const loadUser = createAsyncThunk("user/loadUser", async()=>{
    try {
        let response ;
        await axios.get("/api/v1/user/profile").then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const viewProfile = createAsyncThunk("user/viewProfile", async(id)=>{
    try {
        let response ;
        await axios.get(`/api/v1/user/profile/view/${id}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const completeProfile = createAsyncThunk("user/completeProfile", async(action)=>{

    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.put("/api/v1/user/profile/complete", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const profile_update = createAsyncThunk("user/updateProfile", async(action)=>{

    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.put("/api/v1/user/profile/update", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const passVerify = createAsyncThunk("user/verifypassword", async(action)=>{

    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.post("/api/v1/user/profile/update/password/verify", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const addNotificationFromDB = createAsyncThunk("user/notification_DB", async(action)=>{

    // const config = {
    //     headers:{"content-type":"application/json"}
    // }

    try {
        let response ;
        await axios.get("/api/v1/user/notification/get_all").then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const markNotificationRead = createAsyncThunk("user/markNotificationRead", async(action)=>{

    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.put("/api/v1/user/notification/read", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const clearAllNotificaiton = createAsyncThunk("user/clearAllNotificaiton", async(action)=>{

    try {
        let response ;
        await axios.put("/api/v1/user/notification/clearAll").then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})


export const sendFriendReq = createAsyncThunk("user/sendFriendReq", async(action)=>{

    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.put("/api/v1/user/friend/request", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const friendReqAction = createAsyncThunk("user/friendReqAction", async(action)=>{

    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.put("/api/v1/user/friend/request/action", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{ 
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const getSuggestions = createAsyncThunk("user/friend/suggestion", async(action)=>{
    const config = {
        headers:{"content-type":"application/json"}
    }

    try {
        let response ;
        await axios.post("/api/v1/user/friend/suggest", action, config).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        });

        return response;
    }catch(err){
     console.log(err)   
    }
})



const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        sendEmail:(state, action)=>{
            const {name, email, code} = action.payload;
            const {verification} = state.register.emailVerification
            const {emailVerification} =state.register
    
            emailVerification.code = code;
            
            if(emailVerification.attemptsLeft>0){
                sendMail(name, email, code);
                emailVerification.message=`We have sent a 5-digit verification code sent on email - ${email}`
                emailVerification.sent = true
                verification.started=true
                emailVerification.attemptsLeft--;
            }else{
                return;
            }
     
        },
    
        emailVerifiaction:(state, action)=>{
            let {verification} = state.register.emailVerification;
            const {enteredCode, sentCode} = action.payload;
            if(enteredCode===sentCode){
                verification.completed = true;
                verification.error=false;
                verification.message="successfully verified";
            }else{
                verification.error=true
                verification.message = "Entered wrong code"
            }
        },
    
        clearMsg:(state, action)=>{
            const {verification} = state.register.emailVerification;
            const {emailVerification} = state.register;

            if(action.payload==="V_Error"){
                verification.error=false
            }
            if(action.payload==="V_success"){
                verification.completed=false;
                verification.error=false;
                verification.message="";
                verification.started=false;
                emailVerification.code="";
                emailVerification.sent=false;
                emailVerification.attemptsLeft=2;
                emailVerification.message="";
            }
            if(action.payload==="R_Error"){
                state.register.error=false
            }
            if(action.payload==="R_success"){
                state.register.success=false
            }
            if(action.payload==="L_error"){
                state.login.error=false
            }
            if(action.payload==="L_success"){
                state.login.success=false
            }
            if(action.payload==="Lout"){
                state.logout.error=false
                state.logout.success=false
                state.logout.message=""
                state.logout.loading=false

            }
            if(action.payload==="PC_Error"){
                state.profileCompletion.error=false
            }
            
            if(action.payload==="PC_success"){
                state.profileCompletion.success=false
            }
            if(action.payload==="Pro_Up"){
                state.profileUpdate.error=false;
                state.profileUpdate.success=false;
                state.profileUpdate.message="";
                state.profileUpdate.loading=false;
                state.profileUpdate.type=""
            }
            if(action.payload==="Pass_Ver"){
                state.passVerify.error=false;
                state.passVerify.success=false;
                state.passVerify.message="";
                state.passVerify.loading=false;
            }
            if(action.payload==="FR_Canc"){
                state.friendReq.accept_remove_cancel.error=false;
                state.friendReq.accept_remove_cancel.success=false;
                state.friendReq.accept_remove_cancel.message="";
                state.friendReq.accept_remove_cancel.loading=false;
            }
            if(action.payload==="FR_send"){
                state.friendReq.send.error=false;
                state.friendReq.send.success=false;
                state.friendReq.send.message="";
                state.friendReq.send.loading=false;
            }
            if(action.payload==="load_user"){
                const {loadUser} = state;
                loadUser.error=false;
                loadUser.success=false;
                loadUser.loading=false;
                loadUser.message=""; 
            }
            if(action.payload==="NR"){
                state.notification.read.error=false;
                state.notification.read.success=false;
                state.notification.read.seen=false;
                state.notification.read.loading=false;
            }
            if(action.payload==="Fil_N"){
                state.notification.filter.called = false
            }
        },
        filterNotification: (state, action) => {
            const { notification } = state;
            const type = action.payload.type;
            const currNotification = action.payload.notifications;

            let updatedNotification;
            if(type==="read"){
                updatedNotification = currNotification.filter(i=>{
                    return i.seen===true;
                })
            }
            else if(type==="unread"){
                updatedNotification = currNotification.filter(i=>{
                    return i.seen===false;
                })
            }
            return {
              ...state,
              notification: {
                ...notification,
                filter:{
                    filteredData:updatedNotification,
                    called:true
                }
              },
            };
        },
        addNotification_socket:(state, action)=>{
            const { notification } = state;
            const newData = action.payload;
            const updatedNotification = [newData, ...notification.notifications];
            // console.log(updatedNotification, newData);
            return {
              ...state,
              notification: {
                ...notification,
                notifications: updatedNotification,
              },
            };
        },

        setNotificationCount:(state, action)=>{
            const { notification } = state;
            const count = action.payload;

            return {
              ...state,
              notification: {
                ...notification,
                count:count,
              },
            };
        },
    },
    extraReducers:{
        // Register User
        [registerUser.pending]: (state)=>{
            state.register.loading = true;
        },
        [registerUser.fulfilled]: (state, action)=>{
            state.register.loading = false;
            
            if(action.payload.success===false){
                state.register.message = action.payload.message;
                state.register.error = true
                state.isLoggedIn = false
            }else{
                state.register.success = true;
                state.register.message = "successfuly registered, redirecting you to profile completion stage";
                state.isLoggedIn = true
                state.isProfileCompleted=false;
            }
        },

        // Login User
        [loginUser.pending]: (state)=>{
            state.login.loading = true;
        },
        [loginUser.fulfilled]: (state, action)=>{
            state.login.loading = false;
            
            
            if(action.payload.success===false){
                state.login.message = action.payload.message;
                state.isLoggedIn = false
                state.login.error = true
            }else{
                state.login.success = true;
                state.login.message = "successfuly logged in";
                state.isLoggedIn = true
                state.user = action.payload
            }
        },

        // Load User
        [loadUser.pending]: (state)=>{
            state.loadUser.loading = true;
        },
        [loadUser.fulfilled]: (state, action)=>{
            state.loadUser.loading = false;
            
            if(action.payload.success===false){
                state.loadUser.message = action.payload.message;
                state.isLoggedIn = false
                state.loadUser.error = true
            }else{
                state.loadUser.success = true;
                state.isLoggedIn = true
                state.user = action.payload.user
                state.isProfileCompleted = action?.payload?.user?.isProfileCompleted
            }
        },

        [viewProfile.pending]: (state)=>{
            state.profile.loading = true;
        },
        [viewProfile.fulfilled]: (state, action)=>{
            state.profile.loading = false;
            
            if(action.payload.success===false){
                state.profile.message = action.payload.message;
                state.profile.error = true
            }else{
                state.profile.success = true;
                state.profile.user= action.payload.user
            }
        },

        // Logout User
        [logoutUser.pending]: (state)=>{
            state.logout.loading = true;
        },
        [logoutUser.fulfilled]: (state, action)=>{
            state.logout.loading = false;
            
            if(action.payload.success===false){
                state.logout.message = action.payload.message;
                state.isLoggedIn = true
                state.logout.error = true
            }else{
                state.logout.success = true;
                state.isLoggedIn = false;
                state.user = {};
                state.logout.message = action.payload.message;
            }
        },

        // Complete Profile
        [completeProfile.pending]: (state)=>{
            state.profileCompletion.loading = true;
        },
        [completeProfile.fulfilled]: (state, action)=>{
            state.profileCompletion.loading = false;
            
            if(action.payload.success===false){
                state.profileCompletion.message = action.payload.message;
                state.profileCompletion.error = true
            }else{
                state.profileCompletion.success = true;
                state.profileCompletion.message = action.payload.message;
                state.isProfileCompleted = true
            }
        },

        [profile_update.pending]: (state)=>{
            state.profileUpdate.loading = true;
        },
        [profile_update.fulfilled]: (state, action)=>{
            state.profileUpdate.loading = false;
            
            if(action.payload.success===false){
                state.profileUpdate.message = action.payload.message;
                state.profileUpdate.error = true
            }else{
                state.profileUpdate.success = true;
                state.profileUpdate.message = action.payload.message;
                state.profileUpdate.type = action.payload.type;
            }
        },

        [passVerify.pending]: (state)=>{
            state.passVerify.loading = true;
        },
        [passVerify.fulfilled]: (state, action)=>{
            state.passVerify.loading = false;
            
            if(action.payload.success===false){
                state.passVerify.message = action.payload.message;
                state.passVerify.error = true
            }else{
                state.passVerify.success = true;
                state.passVerify.message = action.payload.message;
            }
        },

        [sendFriendReq.pending]: (state)=>{
            state.friendReq.send.loading = true;
        },
        [sendFriendReq.fulfilled]: (state, action)=>{
            state.friendReq.send.loading = false;
            
            if(action.payload.success===false){
                state.friendReq.send.message = action.payload.message;
                state.friendReq.sent.error = true
            }else{
                state.friendReq.send.success = true;
                state.friendReq.send.message = action.payload.message;
                state.friendReq.send.notification = action.payload.notification;
            }
        },

        [friendReqAction.pending]: (state)=>{
            state.friendReq.accept_remove_cancel.loading = true;
        },
        [friendReqAction.fulfilled]: (state, action)=>{
            state.friendReq.accept_remove_cancel.loading = false;
            
            if(action.payload.success===false){
                state.friendReq.accept_remove_cancel.message = action.payload.message;
                state.friendReq.accept_remove_cancel.error = true
            }else{
                state.friendReq.accept_remove_cancel.success = true;
                state.friendReq.accept_remove_cancel.message = action.payload.message;
                state.friendReq.accept_remove_cancel.notification = action.payload.notification;

            }
        },

        [getSuggestions.pending]: (state)=>{
            state.friendReq.suggestions.loading = true;
        },
        [getSuggestions.fulfilled]: (state, action)=>{
            state.friendReq.suggestions.loading = false;
            
            if(action.payload.success===false){
                state.friendReq.suggestions.message = action.payload.message;
                state.friendReq.suggestions.error = true
            }else{
                state.friendReq.suggestions.success = true;
                state.friendReq.suggestions.message = action.payload.message;
                state.friendReq.suggestions.friends = action.payload.users;
            }
        },

        [addNotificationFromDB.pending]: (state)=>{
            state.notification.fromDb.loading = true;
        },
        [addNotificationFromDB.fulfilled]: (state, action)=>{
            state.notification.fromDb.loading = false;
            
            if(action.payload.success===false){
                state.notification.fromDb.error = true;
                state.notification.fromDb.success = action.payload.success;
            }else{
                const prevData = state?.notification?.notifications;
                state.notification.fromDb.success = action.payload.success;
                state.notification.fromDb.error = false;
                state.notification.notifications = [...action.payload.notifications];
            }
        },
        [markNotificationRead.pending]: (state)=>{
            state.notification.read.loading = true;
        },
        [markNotificationRead.fulfilled]: (state, action)=>{
            state.notification.read.loading = false;
            
            if(action.payload.success===false){
                state.notification.read.error = true;
                state.notification.read.success = action.payload.success;
            }else{
                state.notification.read.success = action.payload.success;
                state.notification.read.error = false;
                state.notification.read.seen = action.payload.seen;
            }
        },
        [clearAllNotificaiton.pending]: (state)=>{
            state.notification.clear.loading = true;
        },
        [clearAllNotificaiton.fulfilled]: (state, action)=>{
            state.notification.clear.loading = false;
            
            if(action.payload.success===false){
                state.notification.clear.error = true;
                state.notification.read.success = action.payload.success;
            }else{
                state.notification.clear.success = action.payload.success;
                state.notification.clear.error = false;
            }
        },

        
    }
})

export const {sendEmail, emailVerifiaction, clearMsg, addNotification_socket, filterNotification, setNotificationCount} = userSlice.actions;
export default userSlice.reducer;

