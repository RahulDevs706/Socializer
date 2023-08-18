import React, { Fragment, useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import { Avatar, CardContent, CardHeader, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import imgIcon from "../../../Images/image.png"
import { Box } from '@mui/system';
import CreatePostModal from './CreatePostModal';
import { useSnackbar } from 'notistack';

const Main = () => {

    const {user} =useSelector(s=>s.user);

    const [open, setOpen] = useState(false);
    const {createPost} = useSelector(s=>s.post)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      const option = {
        anchorOrigin:{
          vertical:"bottom",
          horizontal:"left",
        },
        variant:"success",
        autoHideDuration: 3000
      }
      if(createPost.success || createPost.error){
        enqueueSnackbar(createPost.message, option)
      }
    }, [enqueueSnackbar, createPost]);
  

  return (
    <Fragment>
        <Box display="flex" justifyContent="center" alignItems="center" m="3%" width="100%">
            <Card sx={{ width:{xs:"95%", sm:"65%"}, borderRadius:"17px" }} elevation={5}>
                <Stack alignItems='center' direction={'row'}>
                  <CardHeader
                      avatar={
                      <Avatar src={user?.profileImg?.url} height="50" width="50" alt={user.fName} size="large" aria-label="avatar" />
                      }
                  />                    
                  <Box flexGrow={1} flexItem />
                    <CardContent>
                      <Typography variant="h5" color="#bbb">
                          Create a Post
                      </Typography>
                    </CardContent>
                    <Box flexGrow={1} flexItem />
                    <CardActions>
                      <IconButton onClick={()=>setOpen(true)}>
                        <CardMedia 
                            component="img"
                            alt="img"
                            height="50"
                            width="50"
                            image={imgIcon}
                            sx={{margin:"1%"}}
                        />
                      </IconButton>
                    </CardActions>
                </Stack>
            </Card>
        </Box>
        <CreatePostModal open={open} setOpen={setOpen} />
    </Fragment>
  )
}

export default Main