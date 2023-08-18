import { Avatar, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Slide, Stack, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useState } from 'react'
import { Fragment } from 'react'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';

import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';

import moment from "moment";
import { useNavigate } from 'react-router-dom';
import Edit from '@mui/icons-material/Edit';

import EditCommentModal from "./EditBioModal.jsx"
import ArrowBack from '@mui/icons-material/ArrowBack.js';
import FriendCard from '../../Friends/FriendCard.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


const FriendListModal = ({open, setOpen, user})=>{
    const handleClose=()=>{
        setOpen(false);
    }
    return (
        <Fragment>
            <Dialog fullWidth maxWidth="sm" TransitionComponent={Transition} keepMounted open={open} onClose={handleClose}>
                <DialogTitle sx={{borderRadius:"17px"}}>
                    <Stack alignItems='center' direction='row'>
                        <IconButton onClick={handleClose}>
                            <ArrowBack sx={{fontSize:"1.5rem"}} />
                        </IconButton>
                        <Typography color="primary" component={'p'} variant="body1">
                            {`${user?.name}'s Friend List`} <Typography  sx={{pl:1.2}} variant="body1" component="span" color="primary.light">{user?.friendList?.length}</Typography>
                        </Typography>
                        <Box flexGrow={1} />
                    </Stack>
                </DialogTitle>           
                <DialogContent dividers>
                   {user?.friendList?.map(i=>(
                        <FriendCard f={i} iconType={"no_icon"} />
                   ))}
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

const Left = ({user, isMyAcc}) => {

    const loc = `${user?.address?.city}, ${user?.address?.state}, ${user?.address?.country}`;

    const dob= moment(user.dob).format("MMMM Do");
    const navigate = useNavigate();

    const fList =  user?.friendList?.slice(0,6);

    const [openEdit, setOpenEdit] = useState();

    const [openFriendList, setOpenFriendList] = useState(false)
    

    const joinnedAt = moment(user.joinedAt).format("MMMM Do YYYY");

    const handleFriendOpen = ()=>{
        if(isMyAcc){
            navigate("/profile/friends");
        }else{
            setOpenFriendList(true)
        }
    }

  return (
    <Fragment>
        <Container maxWidth={"sm"} sx={{pl:0, pr:0, m:'auto', alignItems:"flex-end", width:"100%", position:'sticky', top:15}}>
            <Stack spacing={2}>

                {/* bio */}
                <Card sx={{borderRadius:"1rem"}}>
                    <CardHeader 
                        title={<Typography color="primary" variant="h5" component="p">Bio</Typography>} 
                        avatar={<FormatQuoteIcon color="primary" sx={{fontSize:"1.8rem"}} />} 
                        action={isMyAcc && <IconButton onClick={()=>setOpenEdit(true)} ><Edit color="primary" sx={{fontSize:"1.5rem", cursor:"pointer"}} /></IconButton>}
                    />
                    <Divider />
                    <CardContent sx={{maxHeight:400, overflow:"auto"}}>
                        <Typography color="primary.light" sx={{pl:1.5}} variant="p" component="body1" >{user.bio}</Typography>
                    </CardContent>
                </Card>

                {/* info */}
                <Card sx={{borderRadius:"1rem"}}>
                    <CardHeader 
                        title={<Typography color="primary" variant="h5" component="p">Information</Typography>} 
                        avatar={<InfoIcon color="primary" sx={{fontSize:"1.8rem"}} />} 
                    />
                    <Divider />
                    <CardContent>
                        <Stack spacing={1}>
                            <Box pl={1.5} display="flex" alignItems={'center'} component="span">
                                <CakeIcon color="primary"  sx={{fontSize:"1.7rem"}} /> 
                                <Typography sx={{pl:1}} variant="p" color="primary.light" component="body1">{dob}</Typography>
                            </Box>
                            <Box pl={1.5} display="flex" alignItems={'center'} component="span">
                                <LocationOnIcon color="primary" sx={{fontSize:"1.7rem"}} /> 
                                <Typography sx={{pl:1}} variant="p" component="body1"  color="primary.light">{loc}</Typography>
                            </Box>
                            <Box pl={1.5} display="flex" alignItems={'center'} component="span">
                                <EventIcon color="primary" sx={{fontSize:"1.7rem"}} /> 
                                <Typography sx={{pl:1}} variant="p" component="body1"  color="primary.light">{joinnedAt}</Typography>
                            </Box>
                    
                        </Stack>
                    </CardContent>

                </Card>
                
                {/* Friends */}
                <Card sx={{borderRadius:"1rem"}}>
                    <CardHeader 
                        title={<Typography onClick={handleFriendOpen} sx={{cursor:'pointer'}} color="primary" variant="h5" component="p">Friends <Typography  sx={{pl:1.2}} variant="h6" component="span" color="primary.light">{user?.friendList?.length}</Typography></Typography>} 
                        avatar={<PeopleIcon onClick={handleFriendOpen} color="primary" sx={{fontSize:"1.8rem", cursor:'pointer'}} />} 
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={{xs:2, sm:3}} columns={{xs:3, md:3}}>
                            {fList?.map(f=>(
                                <Grid key={f._id} maxWidth={175} item xs={1} md={1}>
                                    <Stack onClick={()=>navigate(`/profile/${f._id}`)} alignItems={'center'}>
                                        <Avatar sx={{height:{sm:"6vw", xs:"20vw"}, width:{sm:"6vw", xs:"20vw"}, flexShrink:0.5, cursor:"pointer" }} variant='rounded' src={f?.profileImg?.url} alt={f?.name} />
                                        <Typography sx={{pl:1}} variant="p" component="body1"  color="primary">{f.name}</Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
        <EditCommentModal open={openEdit} setOpen={setOpenEdit} user={user} />
        <FriendListModal open={openFriendList} setOpen={setOpenFriendList} user={user} />
    </Fragment>
  )
}

export default Left