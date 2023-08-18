import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Header from './Components/Layout/Header'
import CompleteProfile from "./Components/Profile/CompleteProfile/CompleteProfile"
import { addNotificationFromDB, addNotification_socket, getSuggestions, loadUser } from './Redux/Slice/userSlice'
import AuthorizedRoutes from './Routes/AuthoeizedRoutes'
import Main from './Components/home'
import Loader from "./Components/Layout/Loader/Loader"
import { Alert, Snackbar } from '@mui/material'
import { clearPostMsg } from './Redux/Slice/postSlice'
import SearchPage from './Components/SearchPage/SearchPage'
import ProfilePage from './Components/Profile/MyProfile/ProfilePage'
import PostPage from './Components/Profile/MyProfile/PostPage'
import FriendsPage from './Components/Friends/FriendsPage'
import SettingsPage from './Components/Profile/SettingsPage'
import NotificationPage from "./Components/Notificaiton/NotficationPage.jsx"
import io from 'socket.io-client'
import axios from 'axios'
import _ from "lodash"


const App = () => {
  const {isLoggedIn,loadUser:load} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(loadUser());
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const handleContextmenu = e => {
        e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
    }
}, [ ])




const {read, clear} = useSelector(s=>s.user.notification)

React.useEffect(()=>{
  dispatch(addNotificationFromDB());
},[read.success, clear.success]);


const {user, friendReq} = useSelector(state=>state.user)
const {postLike, postComments, createPost} = useSelector(state=>state.post)


const socketRef = useRef(null);

useEffect(() => {
    socketRef.current = io("http://192.168.1.6:3001/", {
        transports:['websocket']
      });

  
    return () => {
      // setIsMounted(false);
      // socketRef.current.disconnect();
    };
  }, []);

useEffect(() => {

  // if(isMounted){
    if (isLoggedIn) {
    socketRef.current.emit("login", user._id);
    }

    socketRef.current.on("connect", () => {
    console.log("Socket client connected");
    });

    socketRef.current.on("disconnect", () => {
    console.log("Socket client disconnected");
    });
  // }

  return () => {
    if (isLoggedIn) {
        socketRef.current.emit("logout", user._id);
    }
    socketRef.current.off();
  };
}, [isLoggedIn, user]);


useEffect(() => {
  if(postLike && postLike.type === "like" && postLike.notification && postLike.success) {
    console.log('working')
    socketRef.current.emit("send_notification", { notification: postLike.notification });
  }

  if(createPost && Boolean(createPost.notification) && createPost.success) {
    console.log('working')
    socketRef.current.emit("send_notification", { notification: createPost.notification });
  }


  if(postComments.create && postComments.create.success) {
    socketRef.current.emit("send_notification", { notification: postComments.create.notification });
  }

  if(friendReq.send && friendReq.send.success) {
    socketRef.current.emit("send_notification", { notification: friendReq.send.notification });
  }

  if(friendReq.accept_remove_cancel && friendReq.accept_remove_cancel.success && Boolean(friendReq.accept_remove_cancel.notification)){
    console.log("i got triggrerd");
    socketRef.current.emit("send_notification", { notification: friendReq.accept_remove_cancel.notification });
  }

  return()=>{
    socketRef.current.off("send_notification");
  }
}, [postLike.success, postComments.create.success, friendReq.send.success, friendReq.accept_remove_cancel.success, createPost.success]);



useEffect(() => {
    socketRef.current.on("rec_notify", (data)=>{
      console.log("from socket is called");
      dispatch(addNotification_socket(data));
    });  

  return () => {
    socketRef.current.off("rec_notify");
  };
});



// useEffect(() => {
//   dispatch(connectToSocketServer());

//   return () => {
//     dispatch(setIsMounted(false));
//     dispatch(disconnectFromSocketServer());
//   };
// }, [dispatch]);

// useEffect(() => {
//   if (isMounted) {
//     if (isLoggedIn) {
//       socketRef.emit('login', user._id);
//     }

//     socketRef.on('connect', () => {
//       console.log('Socket client connected');
//     });

//     socketRef.on('disconnect', () => {
//       console.log('Socket client disconnected');
//     });
//   }

//   return () => {
//     if (isLoggedIn) {
//       socketRef.emit('logout', user._id);
//     }
//   };
// }, [isLoggedIn, user, isMounted, socketRef]);

// useEffect(() => {
//   if (postLike && postLike.type === 'like' && postLike.notification && postLike.success) {
//     dispatch(sendNotification(postLike.notification));
//   }

//   if (postComments.create && postComments.create.success) {
//     dispatch(sendNotification(postComments.create.notification));
//   }

//   if (friendReq.send && friendReq.send.success) {
//     dispatch(sendNotification(friendReq.send.notification));
//   }

//   return () => {
//     // Clean up if needed
//   };
// }, [postLike.success, postComments.create.success, friendReq.send.success, dispatch]);


// useEffect(() => {
//   dispatch(receiveNotification());

//   return () => {
//     // Clean up if needed
//   };
// }, [dispatch]);


  return (
    <Fragment>
      {load.loading?<Loader />:(
        <Fragment>
        {isLoggedIn && <Header />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route exact path="/profile/complete" element={
              <AuthorizedRoutes>
                <CompleteProfile />
              </AuthorizedRoutes>
            } 
          />
          <Route exact path="/explore" element={
              <AuthorizedRoutes>
                <SearchPage />
              </AuthorizedRoutes>
            } 
          />
          <Route exact path="/profile/:id" element={
              <AuthorizedRoutes>
                <ProfilePage />
              </AuthorizedRoutes>
            } 
          />
          <Route exact path="/profile/:uid/:pid" element={
              <AuthorizedRoutes>
                <PostPage />
              </AuthorizedRoutes>
            } 
          />
          <Route exact path="/profile/friends" element={
              <AuthorizedRoutes>
                <FriendsPage />
              </AuthorizedRoutes>
            } 
          />
          <Route exact path="/profile/settings" element={
              <AuthorizedRoutes>
                <SettingsPage />
              </AuthorizedRoutes>
            } 
          />
          <Route exact path="/notifications" element={
            <AuthorizedRoutes>
              <NotificationPage />
            </AuthorizedRoutes>
          } 
        />
        </Routes>
    </Fragment>
      )}

      {/* <Snackbar open={cpError} autoHideDuration={3000} onClose={()=>handleClose("cpError")}>
        <Alert variant='filled' severity="error" onClose={()=>handleClose("cpError")} sx={{ width: '100%' }}>
            {cpMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={cpSucess} autoHideDuration={3000} onClose={()=>handleClose("cpSuccess")}>
        <Alert variant='filled' severity="success" onClose={()=>handleClose("cpSuccess")} sx={{ width: '100%' }}>
            {cpMessage}
        </Alert>
      </Snackbar> */}
    </Fragment>
  )
}

export default App