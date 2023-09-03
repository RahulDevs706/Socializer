import { Avatar, Box, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button';
import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSuggestions, sendFriendReq, clearMsg } from '../../../../Redux/Slice/userSlice';
import _ from "lodash"

import {
  RiUserAddFill as AddIcon, 
} from 'react-icons/ri'


const CardLoader = ()=>{
    return(
      <Fragment>
        <Card elevation={0} sx={{ maxWidth: "100%" }}>
          <CardContent>
            <Stack direction={'row'} spacing={2}>
              <Skeleton variant="circular" width={75} height={60} />
              <Stack width="100%" spacing={1}>
                <Typography>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Typography>
                <Box>
                    <Skeleton variant="rectangular" width="50%" height={'2rem'} />
                </Box>
              </Stack>
            </Stack>
          </CardContent>
            <Divider />
        </Card>
      </Fragment>
    )
  }
  

const SuggestionCard = ({f, address}) => {
    const navigate = useNavigate();
    function handleProfileClick(id){
        const url = `/profile/${id}`
        navigate(url)
    }

    const {send} = useSelector(s=>s.user.friendReq);

    const dispatch = useDispatch();

    const {loading,friends} = useSelector(s=>s.user.friendReq.suggestions);

    const delayedGetSuggestions = _.debounce((dispatch, address) => {
      dispatch(getSuggestions(address));
    }, 1000); // Adjust the debounce interval as needed
    

    const onAddFriend = () => {
      dispatch(sendFriendReq({ req_to: f._id }));
    };
    




  return (
    <Fragment>
        {loading?<CardLoader />:
        
        <Card elevation={0} sx={{ maxWidth: "100%" }}>
          <CardContent>
            <Stack direction={'row'} spacing={2}>
              <Avatar  onClick={()=>handleProfileClick(f._id)} src={f.profileImg.url} sx={{width:{xs:60, sm:70}, height:{xs:60, sm:70}, cursor:'pointer'}} />
              <Stack width="100%" spacing={1}>
                <Typography color="primary" sx={{cursor:'pointer'}}  onClick={()=>handleProfileClick(f._id)}>{f.name}</Typography>
                <Box>
                    <Button onClick={()=>onAddFriend()} variant="contained" fullWidth>
                      <AddIcon fontSize={"1.5rem"} color='#fff' cursor='pointer'  />
                    </Button>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
            <Divider />
        </Card>
        }
    </Fragment>
  )
}

export default SuggestionCard