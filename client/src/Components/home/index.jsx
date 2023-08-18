import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Layout/Loader/Loader'
import Home from './Home/Home'
import LoginSignup from './LoginSignup/LoginSignup'
// import io from 'socket.io-client'
import { addNotification_socket, clearMsg } from '../../Redux/Slice/userSlice'


const Main = () => {
    const dispatch = useDispatch();

    const {loadUser, isLoggedIn, isProfileCompleted, user, friendReq} = useSelector(state=>state.user)
    // const {postLike, postComments} = useSelector(state=>state.post)



    // const socketRef = useRef(null);
    // const [isMounted, setIsMounted] = useState(true)

    // useEffect(() => {
    //     socketRef.current = io("http://192.168.1.6:3001/", {
    //        rs
    //       });
    
      
    //     return () => {
    //       setIsMounted(false);
    //       socketRef.current.disconnect();
    //     };
    //   }, []);

    // useEffect(() => {
  
    //   if(isMounted){
    //     if (isLoggedIn) {
    //     socketRef.current.emit("login", user._id);
    //     }
    
    //     socketRef.current.on("connect", () => {
    //     console.log("Socket client connected");
    //     });
    
    //     socketRef.current.on("disconnect", () => {
    //     console.log("Socket client disconnected");
    //     });
    //   }

    //   return () => {
    //     if (isLoggedIn) {
    //         socketRef.current.emit("logout", user._id);
    //     }
    //     socketRef.current.off();
    //   };
    // }, [isLoggedIn, user, isMounted]);


    // useEffect(() => {
    //   if(postLike && postLike.type === "like" && postLike.notification && postLike.success) {
    //     socketRef.current.emit("send_notification", { notification: postLike.notification });
    //   }

    //   if(postComments.create && postComments.create.success) {
    //     socketRef.current.emit("send_notification", { notification: postComments.create.notification });
    //   }

    //   if(friendReq.send && friendReq.send.success) {
    //     socketRef.current.emit("send_notification", { notification: friendReq.send.notification });
    //   }

    //   return()=>{
    //     socketRef.current.off("send_notification");
    //   }
    // }, [postLike.success, postComments.create.success, friendReq.send.success]);
    
    
    // useEffect(() => {
    //   if (postComments.create && postComments.create.success) {
    //     console.log(postComments.create.notification);
    //     socketRef.current.emit("send_notification", { notification: postComments.create.notification });
    //   }

    //   return()=>{
    //     socketRef.current.off("send_notification",  { notification: postComments.create.notification });
    //   }
    // }, [postComments.create.success]);
    

    
    // useEffect(() => {
      
    //   socketRef.current.on("rec_notify", (data)=>{
    //     dispatch(addNotification_socket(data));
    //   });
      
    //   return () => {
    //     socketRef.current.off("rec_notify");
    //   };
    // }, [dispatch]);
    
    
    useEffect(()=>{
        if(loadUser.success || loadUser.error){
            dispatch(clearMsg("load_user"))
        }
    }, [loadUser.success, loadUser.error, dispatch])
    

  return (
    <Fragment>
        {loadUser.loading? (<Loader />):(
            <Fragment>
                {user && isLoggedIn && isProfileCompleted  ? (
                    <Home />
                ):(
                    <LoginSignup />
                ) }
            </Fragment>
        )}
    </Fragment>
  )
}


export default Main


