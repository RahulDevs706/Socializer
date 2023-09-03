import { Avatar, Box, Button, Card, CardHeader, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import MoreIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { friendReqAction } from '../../Redux/Slice/userSlice';
import { useNavigate } from 'react-router-dom';


const FriendCard = ({f, iconType}) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClose = ()=>{
        setAnchorEl(null)
    }

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const handleActions=(action)=>{
        if(action==="accept"){
            dispatch(friendReqAction({f_id:f._id, type:"accept"}))
        }else if(action==="remove_req"){
            dispatch(friendReqAction({f_id:f._id, type:"remove_req"}))
        }else if(action==="remove_fri"){
            dispatch(friendReqAction({f_id:f._id, type:"remove_fri"}))
        }else if(action==="cancel"){
            dispatch(friendReqAction({f_id:f._id, type:"cancel"}))
        }
        handleClose();
    }

    const handleClick=(to)=>{
        navigate(`/profile/${to}`)
    }

    const actionT=()=>{
        if(iconType==="no_icon"){
            return;
        }
        else if(iconType==="suggestion"){
            return <Fragment>
                <Box display="flex" justifyContent={'space-around'} alignItem={'center'}>
                    <Button >Send</Button>
                    <Button  >Remove</Button>
                </Box>
            </Fragment>
        }else{
            return <IconButton onClick={(e)=>setAnchorEl(e.currentTarget)} ><MoreIcon/></IconButton>
        }
    }
    
  return (
    <Fragment>
        <Card sx={{maxHeight:"75vh"}} >
            <CardHeader 
                title={<Typography sx={{cursor:"pointer"}} onClick={()=>handleClick(f._id)}>{f?.name}</Typography>}
                action={actionT()}
                avatar={<Avatar sx={{cursor:"pointer"}} onClick={()=>handleClick(f._id)} src={f?.profileImg?.url} size="large" />}
            />
        </Card>

        <Menu
            id="friend-action"
            aria-labelledby="friend-action-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            {iconType==="sent" && <MenuItem onClick={()=>handleActions("cancel")} >Cancel</MenuItem> }

           {iconType==="got" && <>
                <MenuItem onClick={()=>handleActions("accept")} >Accept</MenuItem>
                <MenuItem onClick={()=>handleActions("remove_req")} >Remove</MenuItem>
           </>}

            {iconType==="list" && <MenuItem onClick={()=>handleActions("remove_fri")} >Remove</MenuItem>}


        </Menu>
    </Fragment>
  )
}

export default FriendCard