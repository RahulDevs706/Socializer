import React, { useEffect, useState } from 'react'
import { Avatar, Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg, friendReqAction, sendFriendReq } from '../../Redux/Slice/userSlice';

import {
  RiUserReceived2Fill as GotIcon, 
  RiUserShared2Fill as SentIcon, 
  RiUserAddFill as AddIcon, 
  RiUserFollowFill as FriendIcon
} from 'react-icons/ri'


  const StyledAvatar = styled(Avatar)`
  ${({ theme }) => `
  cursor:pointer;
  border:2px solid #1F5077;
  transition: ${theme.transitions.create(['transform', 'border'], {
    duration: theme.transitions.duration.shorter,
  })};
  &:hover {
    transform: scale(1.1);
    border:none;
  }
  `}`


  

const ResultCard = ({name, location, img, bio,id, query}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {send, accept_remove_cancel} = useSelector(s=>s.user.friendReq)

    const {user} = useSelector(s=>s.user)


    const isFriend = user?.friendList.some(fid=> fid._id===id) // show friends icon; user is friend; redirect on user profile page; give option to remove friend
    const isOnSent = user?.friendReq.sent.some(fid=>fid._id===id) // show sent icon; user sent a f req
    const isOnGot = user?.friendReq.got.some(fid=>fid._id===id) // show gotIcon; user has recieved a f req; send the user on the profile page; then there give options to cancel teh req or accept
    const [isLoading, setIsLoading] = useState(false);

    const handleProfile=(id)=>{
      navigate(`/profile/${id}`)
    }

    useEffect(()=>{
      if(send.success ){
        dispatch(clearMsg("FR_send"));
      }
    },[send.success]) 

    useEffect(()=>{
      if(accept_remove_cancel.success ){
        dispatch(clearMsg("FR_Canc"));
      }
    },[accept_remove_cancel.success]) 

    const removeFriend=(f_id)=>{
      setIsLoading(true)
      dispatch(friendReqAction({f_id:f_id, type:'cancel'})).then(r=>setIsLoading(false)).catch(()=>setIsLoading(false))
    }


    const [actionIcon, setActionIcon] = useState(<AddIcon  onClick={()=>handleAdd(id)} />);

    useEffect(()=>{
      if(isFriend){
        setActionIcon(<FriendIcon fontSize={"1.75rem"} color='#fff' cursor='pointer' />)
      }else if(isOnSent){
        setActionIcon(<SentIcon fontSize={"1.75rem"} color='#fff' cursor='pointer' />);
      }else if(isOnGot){
        setActionIcon(<GotIcon fontSize={"1.75rem"} color='#fff' cursor='pointer' />);
      }
      else{
        setActionIcon(<AddIcon fontSize={"1.75rem"} color='#fff' cursor='pointer'  />)
      }
      if(isLoading ){
        setActionIcon(<CircularProgress  sx={{ color:"#fff", disabled:true}}/>)
      }
    
    }, [isFriend, isOnGot, isOnSent, isLoading]);

    

    const modBio = bio?.length>=50?`" ${bio?.substring(0, 50)}..."`:`" ${bio} "`;
    const modName = name?.length>12? `${name.substring(0,12)}...`:`${name}`;

  

    function handleAdd(f_id){
      setIsLoading(true)
      dispatch(sendFriendReq({req_to:f_id})).then(r=>setIsLoading(false)).catch(()=>setIsLoading(false))
    }


    function handleClick(f_id){
      if(isFriend || isOnGot){
        handleProfile(f_id);
      }else if(isOnSent){
        removeFriend(f_id);
      }else{
        handleAdd(f_id)
      }
    }

    console.log(isFriend, isOnGot, isOnSent, isLoading);

  return (
    <Card key={id} elevation={6} sx={{  borderRadius:"3rem", maxWidth:"19rem", margin:"auto"}}>
        <CardMedia>
            <Box  display="flex" justifyContent={"center"} p={3}>
                <Box flexShrink={0.75} flexItem />
                    <StyledAvatar onClick={()=>{handleProfile(id)}} sx={{height:190, width:190, flexShrink:0.5 }} src={img} alt={name}/>
                <Box flexShrink={0.75} flexItem/>
            </Box>
        </CardMedia>
        <CardContent>
            <Typography variant='heading1' component="h2" textAlign={"center"} color="primary">{modName}</Typography>
            <Typography gutterBottom variant='body1' component="h5"  textAlign={"center"} color="primary">{location}</Typography>
            <Typography gutterBottom variant='body2' component="p" color="primary.light"  textAlign={"center"}>{modBio}</Typography>
        </CardContent>
        <CardActions onClick={()=>handleClick(id)} sx={{bgcolor:"#1F5077", disabled:isLoading, cursor:"pointer", display: "flex", justifyContent:"center", alignItems:"center"}}>     
          {actionIcon}
        </CardActions>
    </Card>

  )
}

export default ResultCard