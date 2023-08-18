import { Avatar, Box, IconButton, Paper, Typography, Card, CardHeader, Stack, Menu, MenuItem, Dialog, Slide, useMediaQuery, DialogContent, DialogTitle, Badge } from '@mui/material'
// import { Container, styled } from '@mui/system'
import styled from "@emotion/styled/macro";
import React, { Fragment, useState } from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleIcon from '@mui/icons-material/People';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import EditModal from './EditProPicModal';
import { useTheme } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CircleIcon from '@mui/icons-material/Circle';
import Circle from '@mui/icons-material/Circle';
import { sendFriendReq } from '../../../Redux/Slice/userSlice';
import { RiUserShared2Fill as SentIcon, RiUserFollowFill} from "react-icons/ri"
import {FaUserCheck as GotIcon, FaUserFriends as AddedFriend, FaUserPlus as AddFriend } from "react-icons/fa"


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



// const AddFriend = styled(PersonAddAlt1Icon)`
// ${({ theme }) => `
// cursor:pointer;
// transition: ${theme.transitions.create(['transform'], {
//   duration: theme.transitions.duration.shorter,
// })};
// &:hover {
//   transform: scale(1.2);
// }
// `}`

// const AddedFriend = styled(PeopleIcon)`
// ${({ theme }) => `
// cursor:pointer;
// transition: ${theme.transitions.create(['transform'], {
//   duration: theme.transitions.duration.shorter,
// })};
// &:hover {
//   transform: scale(1.2);
// }
// `}`

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    width: '1rem',
    height: '1rem',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));



const Top = ({user, showFIcon, isFriend, currId}) => {


  const [openEdit, setOpenEdit] = useState();
  const dispatch = useDispatch();

  const {send} = useSelector(s=>s.user.friendReq)
  const {user:loggedInUser} = useSelector(s=>s.user)

  const handleAddFriend = ()=>{
    dispatch(sendFriendReq({req_to:user._id}))
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handlePostOptionOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [openProPic, setOpenProPic] = useState(false);

  const handleUpdateProfilePic=()=>{
    
  }

    console.log(showFIcon, isFriend)


  const handleClose = ()=>{
    setAnchorEl(null)
  }

  const  [fIcon, setFIcon] = useState();

  useEffect(() => {
    if(isFriend){
      setFIcon(<AddedFriend  fontSize="2rem" color="#fff" />)
    }else if(!isFriend && (send?.success || loggedInUser?.friendReq?.sent?.some(i=>i?._id===currId))){
      setFIcon(<SentIcon fontSize={"2rem"} />);
    }
    else if(!isFriend && loggedInUser?.friendReq?.got?.some(i=>i?._id===currId)){
      setFIcon(<GotIcon fontSize={"2rem"} color="#fff" />)
    }
    else if(!isFriend){
      setFIcon(<AddFriend onClick={handleAddFriend} style={{fontSize:"2rem", cursor:"pointer", color:"#fff"}} />)
    }
  }, [isFriend, send, loggedInUser, currId])
  

  console.log(loggedInUser?.friendReq?.got?.some(i=>i?._id===currId))
  return (
    <Fragment>
            <PaperMod sx={{height:{sm:"55vh", xs:"75vh"}, width:"100%", borderRadius:{xs:"0% 0% 100% 48% / 55% 38% 40% 100% ", sm:"0% 0% 82% 63% / 70% 0% 54% 100% "}}} >                

                    <StyledAvatar onClick={handlePostOptionOpen} sx={{height:250, width:250, flexShrink:0.5,   objectFit:"cover"}} src={user?.profileImg?.url} />

                  {(!showFIcon || isFriend) && 
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
                      {(!showFIcon || isFriend) && <MenuItem  onClick={()=>{setOpenProPic(true); handleClose()}}>View Profile Picture</MenuItem>}
                      {!showFIcon && <MenuItem  onClick={()=>{setOpenEdit(true); handleClose()}}>Update Profile Picture</MenuItem>}
                     
                   </Menu>
                  }
                      
                  <Box flexGrow={0.1} flexItem />
                  <Box display='flex' alignItems="flex-start" justifyContent="space-evenly">
                    <Typography gutterBottom textAlign={'center'} variant="h4" ml={2.5} mr={2} component="h2" color="white"> {user.name}</Typography>
                    {showFIcon &&
                    <IconButton>
                      {fIcon}
                    </IconButton>
                    }
                  </Box>
            </PaperMod>
            <ViewProfilePicModal open={openProPic} setOpen={setOpenProPic} image={user?.profileImg?.url} />
            <EditModal open={openEdit} setOpen={setOpenEdit} user={user} />

    </Fragment>
  )
}

export default Top

