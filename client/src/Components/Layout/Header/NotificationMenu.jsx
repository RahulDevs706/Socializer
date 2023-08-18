import { Avatar, Box, Button, Card, CardContent, Divider, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { clearMsg, markNotificationRead, setNotificationCount } from '../../../Redux/Slice/userSlice';
import {addNotificationFromDB} from "../../../Redux/Slice/userSlice"
import moment from "moment";
import { useNavigate } from 'react-router-dom';


const NotificationCard = ({id,text, type, sentBy, post, createdAt, seen })=>{

  const {read} = useSelector(s=>s.user.notification)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSeen = read?.seen|| seen;

  console.log(isSeen);
  React.useEffect(()=>{
    if(read.success||read.error){
      dispatch(clearMsg("NR"));
    }
  },[dispatch, read.success, read.error]);


  
  const creationTime = moment(createdAt).calendar();

  const notiText=  (
    <>
      <b>{sentBy?.name}</b> {text}
    </>
  )

  const {user} = useSelector(s=>s.user);

  const userId = user?._id;
  const postId = post?._id

  const handleClick = async(type)=>{
    let url=""
    if(type==="post"){
      url = `/profile/${userId}/${postId}`
    }
    if(type=="friendReq" || type=="friendReq_Acc"){
     url = `/profile/${sentBy._id}` 
    }
    console.log(id);
    dispatch(markNotificationRead({notificationId:id}));

    navigate(url);
  }


  

  return(
    <Fragment>
        <Card sx={{bgcolor:isSeen?"#f5f5f5":"fffff", width:"100%"}} onClick={()=>handleClick(type)}  elevation={0}>
          <CardContent>
            <Stack  sx={{pl:1 ,pr:1, width:"auto"}} alignItems={'flex-start'} justifyContent={'flex-start'} direction={'row'} spacing={2}  >
              <Avatar src={sentBy?.profileImg?.url}  sx={{width:{xs:60, sm:70}, height:{xs:60, sm:70}}} />
              <Stack sx={{width:"100%"}} spacing={1.5}>
                <Stack sx={{width:"100%"}} direction={'column'} spacing={0}>
                  <Typography textAlign={'left'} component={'div'} sx={{fontSize:{sm:"1.1rem", xs:"0.7rem"}, wordBreak:"break-word", whiteSpace:"pre-wrap", lineHeight:"1.1"}} variant='body1'>{notiText}</Typography>
                  <Typography component={'p'} color="primary" variant='subtitle2'  >{creationTime}</Typography>
                </Stack>
                {type==="friendReq" &&<Box width={"70%"} display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
                  <Button variant='contained' color='primary' > Confirm </Button>
                  <Box flexGrow={0.5} />
                  <Button color="error" variant="outlined">Delete</Button>
                </Box>}
              </Stack>
              <Box flexGrow={1} />
              {type==='post' && <Avatar src={post?.postImg?.url} variant="square"  sx={{width:{xs:45, sm:60}, height:{xs:45, sm:60}}} />}
            </Stack>
          </CardContent>
        </Card>
    </Fragment>
  )
}

const NotificationModal = ({anchor, open, setAnchor }) => {
  console.log(anchor, open);
  const handleClose = () => {
    setAnchor(null);
  };

  const {read} = useSelector(s=>s.user.notification)
  const navigate = useNavigate();
  const dispatch = useDispatch();

 

  const {notification} = useSelector(s=>s.user)

  const [notificationArray, setNotificationArray] = useState([]);
  
  useEffect(()=>{
    if(notification.notifications){
      setNotificationArray(notification.notifications);
    }
  }, [notification.notifications]);
  

  const [count, setCount] = useState(0);
     
  
  useEffect(() => {
    let newCount = 0;
    notificationArray.forEach((i) => {
      if (i.seen === false) {
        newCount++;
      }
    });
    setCount(newCount);
  }, [notificationArray]);


  useEffect(() => {
    dispatch(setNotificationCount(count));
  }, [dispatch, count ])
  
  
    const notificationArray_N = notificationArray.slice(0,5);

    const openAll=()=>{
      navigate("/notifications");
    }
  return (
    <Fragment>
      <Menu
        id="NotificationMenu"
        aria-labelledby="NotificationMenuButton"
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        sx={{maxWidth:"100%",  '$ul':{pt:0}}}
      >
        <Box sx={{p:"0.5rem 1rem"}}>
            <Typography sx={{typography:{xs:'h5', sm:"h4"}, fontWeight:"bold"}} > Notifications </Typography>
        </Box>
        <Divider />
        {notificationArray_N.length>0? notificationArray_N?.map(not=>{
          const isSeen = read.seen || not?.seen
          return(
            <MenuItem key={not?._id} sx={{bgcolor:isSeen?"#f5f5f5":"fffff"}} >
              <NotificationCard id={not?._id} sentBy={not?.user} post={not?.payload?.post&& not?.payload?.post} text={not?.message} createdAt={not.createdAt}  type={not?.type} seen={not?.seen}/>
            </MenuItem>
        )
        }):
            <Box width={450} height={'50vh'} maxHeight={'100%'} justifyContent={'center'} display={'flex'} alignItems="center">
                <Typography color={"#aaa"}>No new notification avaialable</Typography>
            </Box>
          }
            <Divider />
          <MenuItem onClick={openAll}>
            <Typography width="100%" textAlign="center" sx={{typography:"body2"}} > See all </Typography>
          </MenuItem>  
      </Menu>
    </Fragment>
  );
}

export default NotificationModal
export {NotificationCard}
