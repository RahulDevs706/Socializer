import { Avatar, Box, IconButton, Paper, Typography, Card, CardHeader, Stack, Menu, MenuItem, Dialog, Slide, useMediaQuery, DialogContent, DialogTitle, Badge, Tooltip, CircularProgress } from '@mui/material'
// import { Container, styled } from '@mui/system'
import styled from "@emotion/styled/macro";
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditModal from './EditProPicModal';
import { useTheme } from '@mui/system';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { friendReqAction, sendFriendReq } from '../../../Redux/Slice/userSlice';
import {RiUserReceived2Fill as GotIcon, RiUserFollowFill as AddedFriend, RiUserAddFill as AddFriend, RiUserShared2Fill as SentIcon, } from "react-icons/ri"



const PaperMod = styled(Box)(({theme})=>({
    // height:"55vh",
    background: "linear-gradient(180deg, rgba(31,80,119,1) 10%, rgba(31,80,119,0.61) 90%)",
    borderRadius:"53% 0% 51% 75% / 0% 82% 100% 100% ",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column"
}))

const StyledAvatar = styled(Avatar)`
${({ theme }) => `
cursor:pointer;
border:2px solid #fff;
transition: ${theme.transitions.create(['transform', 'border'], {
  duration: theme.transitions.duration.short,
})};
&:hover{
  transform: scale(1.1);
  border:none;  
}
`}`




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewProfilePicModal = ({ open, setOpen, image})=>{

  const theme = useTheme();


  const handleClose=()=>{
    setOpen(false)
  }

  return(
    <Fragment>
      <Dialog fullWidth maxWidth={'sm'} TransitionComponent={Transition} keepMounted open={open} onClose={handleClose}>
        <DialogTitle sx={{p:1}}>
          <Stack alignItems='center' direction='row'>
              <IconButton onClick={()=>setOpen(false)}>
                <ArrowBack sx={{fontSize:"1.5rem"}} />
              </IconButton>
              <Typography component="p" variant="body1">
                  Profile Picture
              </Typography>
            </Stack>
        </DialogTitle>
        <DialogContent  sx={{p:0}}>
            <Box padding="2" maxWidth={'xl'} display={'flex'} justifyContent={"center"} alignItems={'center'}>
              <Avatar src={image} sx={ { objectFit: 'contain', width: "100%", height:{sm:500, xs:400} }} size={100} variant={"square"} />
            </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

const FIconOptions = ({ open, optionFor, anchorEl, setAnchorEl, id, setLoading})=>{

  const dispatch = useDispatch();

  const handleClose=()=>{
    setAnchorEl(null)
  }
  
  function handleAction(type){
    setLoading(true);
    if(type==="accept"){
      dispatch(friendReqAction({f_id:id, type:"accept"})).then(()=>setLoading(false)).catch(()=>setLoading(false))
    }else if(type==="cancel"){
      dispatch(friendReqAction({f_id:id, type:"remove_req"})).then(()=>setLoading(false)).catch(()=>setLoading(false))
    }
    else if(type==="remove"){
      dispatch(friendReqAction({f_id:id, type:"remove_fri"})).then(()=>setLoading(false)).catch(()=>setLoading(false))
    }
    handleClose();
  }

  return(
    <Fragment>
      <Menu
        id="profile-option"
        aria-labelledby="profile-options"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
          {optionFor==="got_icon" &&(
            <>
              <MenuItem onClick={()=>handleAction("accept")}   >Accept</MenuItem>
              <MenuItem onClick={()=>handleAction("cancel")}  >Cancel</MenuItem>
            </>
          )}

          {optionFor==="friend_icon" &&(
            <>
              <MenuItem onClick={()=>handleAction("remove")}  >Remove</MenuItem>
            </>
          )}

      </Menu>
    </Fragment>
  )
}





const Top = ({user, showFIcon, isFriend, currId}) => {


  const [openEdit, setOpenEdit] = useState();
  const dispatch = useDispatch();

  const {user:loggedInUser} = useSelector(s=>s.user)

  const isFriend_ = loggedInUser?.friendList.some(fid=> fid._id===currId) // show friends icon; user is friend; redirect on user profile page; give option to remove friend
  const isOnSent = loggedInUser?.friendReq.sent.some(fid=>fid._id===currId) // show sent icon; user sent a f req
  const isOnGot = loggedInUser?.friendReq.got.some(fid=>fid._id===currId) // show gotIcon; user has recieved a f req; send the user on the profile page; then there give options to cancel teh req or accept
  const [isLoading, setLoading] = useState(false);

  const handleAddFriend = ()=>{
    setLoading(true)
    dispatch(sendFriendReq({req_to:user._id})).then(()=>setLoading(false)).catch(()=>setLoading(false))
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fIconAction, setFIconAction] = React.useState(null);
  const open = Boolean(anchorEl);
  const openFOptions = Boolean(fIconAction);


  const handleProfileOptionOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFIconOptionOpen = (event) => {
    setFIconAction(event.currentTarget);
  };

  const [openProPic, setOpenProPic] = useState(false);


    console.log(showFIcon, isFriend)


  const handleClose = ()=>{
    setAnchorEl(null);
  }

  const removeFriend=(f_id)=>{
    setLoading(true)
    dispatch(friendReqAction({f_id:f_id, type:'cancel'})).then(r=>setLoading(false)).catch(()=>setLoading(false))
  }


  const  [fIcon, setFIcon] = useState();

  useEffect(() => {
    if(isFriend_){
      setFIcon(<AddedFriend  fontSize="2rem" color="#fff"  />)
    }else if(isOnSent){
      setFIcon(<SentIcon onClick={()=>removeFriend(currId)} fontSize={"2rem"} color="#fff"  />);
    }
    else if(isOnGot){
      setFIcon(<GotIcon fontSize={"2rem"} color="#fff"/>)
    }
    else{
      setFIcon(<AddFriend onClick={handleAddFriend} fontSize="2rem" color="#fff"  />)
    }
    if(isLoading){
      setFIcon(<CircularProgress  sx={{ color:"#fff", disabled:true}}/>)
    }
  }, [isFriend_, isOnGot, isOnSent, isLoading]);
  
  return (
    <Fragment>
            <PaperMod sx={{height:{sm:"55vh", xs:"75vh"}, width:"100%", borderRadius:{xs:"0% 0% 100% 48% / 55% 38% 40% 100% ", sm:"0% 0% 82% 63% / 70% 0% 54% 100% "}}} >                

                    <StyledAvatar onClick={handleProfileOptionOpen} sx={{height:250, width:250, flexShrink:0.5,   objectFit:"cover"}} src={user?.profileImg?.url} />

                  {(!showFIcon || isFriend_) && 
                     <Menu
                     id="profile-option"
                     aria-labelledby="profile-options"
                     anchorEl={anchorEl}
                     open={open}
                     onClose={handleClose}
                     anchorOrigin={{
                       vertical: 'bottom',
                       horizontal: 'center',
                     }}
                     transformOrigin={{
                       vertical: 'bottom',
                       horizontal: 'center',
                     }}
                   >
                      {(!showFIcon || isFriend_) && <MenuItem  onClick={()=>{setOpenProPic(true); handleClose()}}>View Profile Picture</MenuItem>}
                      {!showFIcon && <MenuItem  onClick={()=>{setOpenEdit(true); handleClose()}}>Update Profile Picture</MenuItem>}
                     
                   </Menu>
                  }
                      
                  <Box flexGrow={0.1} flexItem />
                  <Box display='flex' alignItems="flex-start" justifyContent="space-evenly">
                    <Typography gutterBottom textAlign={'center'} variant="h4" ml={2.5} mr={2} component="h2" color="white.main"> {user.name}</Typography>
                    {showFIcon &&
                    <Tooltip title='Options'>
                      <IconButton onClick={handleFIconOptionOpen}>
                      {fIcon}
                    </IconButton>
                    </Tooltip>
                    }
                  </Box>
            </PaperMod>
            <ViewProfilePicModal open={openProPic} setOpen={setOpenProPic} image={user?.profileImg?.url} />
            <EditModal open={openEdit} setOpen={setOpenEdit} user={user} />
            {(isFriend_ || isOnGot ) &&  <FIconOptions id={currId} open={openFOptions} anchorEl={fIconAction} setAnchorEl={setFIconAction} optionFor={isOnGot?'got_icon':"friend_icon"} setLoading={setLoading} />}
    </Fragment>
  )
}

export default Top

