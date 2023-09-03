import { Grid, Skeleton, Stack } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Top from "./Top.jsx";
import Left from "./Left.jsx"
import Right from "./Right.jsx"
import {useDispatch, useSelector} from "react-redux"
import { viewProfile } from '../../../Redux/Slice/userSlice.js';
import { Box, Container } from '@mui/system';
import { clearPostMsg, getProfilePostsfun } from '../../../Redux/Slice/postSlice.js';
import Loader from '../../Layout/Loader/Loader.jsx';
import LockIcon from '@mui/icons-material/Lock';


const LockedProfile = () => {
  return (
    <Fragment>
      <Box sx={{width:{xs:"90vw", sm:'75vw'}, height:'50vh', display:"flex", justifyContent:"center", alignContent:"flex-start", maxWidth:"100%", magin:'auto', maxHeight:"100%", position:"relative"}}>
        <Grid container maxWidth={'xl'} width="100%" sx={{pr:"16px", filter:"blur(6px)"}} m="auto" spacing={2} >
          <Grid item xs={12} sx={{pl:0}} sm={6}>
            <Box  width={{xs:"100%", sm:"95%"}} height={"40vh"} bgcolor={'#78797a24'} />
          </Grid>
          <Grid item xs={12} sx={{pl:0}} sm={6}>
            <Stack spacing={3}>
              <Box  width="100%" height={"10vh"} bgcolor={'#78797a24'} />
              <Box  width="100%" height={"30vh"} bgcolor={'#78797a24'} />
            </Stack>
          </Grid>
        </Grid>
        <LockIcon sx={{fontSize:"10rem", color:"#426d8e", top:"17%", position:"absolute"}} />
      </Box>
    </Fragment>
  )
}

const ProfilePage = () => {
  const dispatch = useDispatch();
  const {id} = useParams();

  
  useEffect(() => {
    dispatch(viewProfile(id))
    dispatch(getProfilePostsfun(id));
  }, [dispatch, id]);
  
  const {getProfilePosts:proPosts} = useSelector(s=>s.post)

  const [posts, setPosts] = useState([]);


  useEffect(()=>{
    if(proPosts?.success){
      setPosts(proPosts?.posts);
    }
  },[proPosts?.success, proPosts?.posts]);
  
  


  
  // useEffect(() => {
  //   dispatch(clearPostMsg("CLEAR_POST_STATE"));
  // }, []);

  const [showFIcon, setShowFIcon] = useState();
  const [isFriend, setIsFriend] = useState();

  const {user, loading} = useSelector(s=>s.user.profile);

  const {user:loggedInUser} = useSelector(s=>s.user)

  const currUserID= user?._id
  const isPrivate = user.accountType==="private" ? true:false;

  var isProLocked = false;

  if(isPrivate){
    if(!isFriend && showFIcon) isProLocked=true;
  }

  const currentUserObj = {
    name:user?.name,
    profileImg:user?.profileImg,
    _id:user._id
  }

  console.log(currentUserObj);

  console.log(loggedInUser?.friendList)
  console.log(`isFriend: ${loggedInUser?.friendList?.includes(currentUserObj)}`)

  const checkForFriend=(currUserId, friendsList)=>{
    return (friendsList.some(friend=>friend._id===currUserID));
  }

  useEffect(() => {
    if( loggedInUser?._id!==currUserID && checkForFriend(currUserID, loggedInUser?.friendList) ){
      setIsFriend(true)
    }else setIsFriend(false)
  }, [loggedInUser, currUserID, loggedInUser?._id, loggedInUser?.friendList])
  

  useEffect(() => {
    if(loggedInUser?._id===currUserID) setShowFIcon(false)
    else setShowFIcon(true);
  }, [currUserID, loggedInUser?._id])

  console.log(posts)



  return (
    <Fragment>
        {loading===true?(
        <Loader />
      ):(
        <Fragment>
        <Container maxWidth="xl" sx={{pl:'0', pr:'0'}}>
          <Stack alignItems={'center'} spacing={2}>
              <Top user={user} showFIcon={showFIcon} isFriend={isFriend} currId={currUserID} />
                  {isProLocked?(
                    <LockedProfile />
                  ):(
                    <Grid container maxWidth={'xl'} width="100%" sx={{pr:"16px"}} m="auto"  spacing={2} >
                      <Grid item xs={12} sx={{pl:0}} sm={6}>
                        <Left user={user} isMyAcc={!showFIcon} />
                      </Grid>
                      <Grid item xs={12} sx={{pl:0}} sm={6}>
                        <Right />
                      </Grid>
                    </Grid>
                  )}
            </Stack>
        </Container>
      </Fragment>
      )}
    </Fragment>
  )
}


export default ProfilePage