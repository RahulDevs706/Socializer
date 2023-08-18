import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Menu, MenuItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Fragment } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { clearPostMsg, deletePost, getMyPost, getPost, likeAPost } from '../../../Redux/Slice/postSlice';
import { useState } from 'react';
import CommentModal from './commentPart/CommentModal';
import EditPostModal from './EditPostModal';
import { useLocation } from 'react-router-dom';
import { viewProfile } from '../../../Redux/Slice/userSlice';

const PostLoader = ()=>{
    return(
      <Fragment>
        <Card elevation="5" sx={{  width:{xs:"100%", sm:"100%"}}}>
                <CardHeader
                    avatar={
                        <Avatar><Skeleton variant="circle"/></Avatar>
                    }
                    title={<Typography variant='body1' color="primary"><Skeleton variant='text' /></Typography> }
                    subheader={<Typography variant="subtitle2" color="primary.light"><Skeleton width={50} variant='text' /></Typography>}
                />
                
                <Skeleton variant="rectangular" width={'100%'} height={700} />

    
                <CardContent>
                    <Typography variant="caption" color="primary.light">
                        <Skeleton variant='text' />
                    </Typography>
                </CardContent>
                
            </Card>
      </Fragment>
    )
  }

const PostCard = ({ loading, id,avatarImg, name, postImg, postText, createdAt, likedBy, comments, createdBy}) => {
    const dispatch = useDispatch();
    const {user} = useSelector(s=>s.user);
    const {postLike, deletePostState} = useSelector(s=>s.post);

    const [openComment, setOpenComment] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const location = useLocation();
    const {user:proUser} = useSelector(s=>s.user.profile)

    const like = ()=>{
        dispatch(likeAPost(id));
    }

    // useEffect(() => {
    //     dispatch(getPost(id))
    // }, [dispatch, id]);

    const [isLiked, setIsLiked] = useState(likedBy?.includes(user?._id));
    const [isUserPost, setIsUserPost] = useState(false)

    useEffect(() => {
        if(likedBy?.includes(user?._id)){
            setIsLiked(true)
        }else{
            setIsLiked(false)
        }
    }, [likedBy, user._id, id]);

    useEffect(() => {
        if(user?._id === createdBy){
            setIsUserPost(true)
        }else{
            setIsUserPost(false)
        }
    }, []);

    if( (location.pathname==="/") && (postLike.success || postLike.error)){
        dispatch(getMyPost())
        dispatch(clearPostMsg("PL"))
    }



    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null)
    };
  
    useEffect(() => {
      if(deletePostState.success){
        dispatch(getMyPost())
      }
    }, [deletePostState, dispatch]);


    useEffect(() => {
      if((location.pathname===`/profile/${proUser?._id}` || location.pathname===`/profile/${proUser?._id}/${id}`)){
          if(postLike.success || postLike.error){
            // dispatch(getMyPost())
            dispatch(viewProfile(proUser._id))
            dispatch(getPost(id))
            dispatch(clearPostMsg("PL"))
        }    
      }
    }, [dispatch, location,proUser, deletePostState, postLike, id]);

    // console.log(proUser._id, location);

    

    const handlePostDelete = ()=>{
      dispatch(deletePost(id))
      handleClose();
    }
  




    let likesText ="";
    let commentText = "";

    
    if(likedBy?.length===0){
        likesText = "No likes yet"
    }else if(likedBy?.length===1){
        likesText = `${likedBy?.length} Like`
    }else{
        likesText = `${likedBy?.length} Likes`
    }
    if(comments?.length===0){
        commentText = "No Comments yet"
    }else if(comments?.length===1){
        commentText = `${comments?.length} Comments`
    }else{
        commentText = `${comments?.length} Comments`
    }
    
    let subBody = `${likesText} & ${commentText}`

  return (
   <Fragment>
    {loading===true?(
        <PostLoader />
    ):
    (
        <Fragment>
        {/* <Box m="0 3%" width="100%"> */}
            <Card elevation="5" sx={{  width:{xs:"100%", sm:"100%"}}}>
                <CardHeader
                    avatar={
                        <Avatar src={avatarImg} alt={name} size="large" aria-label="avatar" />
                    }
                    action={
                        isUserPost && (
                        <IconButton onClick={handleClick} aria-label="settings">
                            <MoreVertIcon color="primary" />
                        </IconButton>
                        )
                    }
                    title={<Typography variant='body1' color="primary">{name}</Typography> }
                    subheader={<Typography variant="subtitle2" color="primary.light">{createdAt}</Typography>}
                />
                
                <CardMedia
                    component="img"
                    image={postImg}
                    alt="demo img"
                    onDoubleClick={like}
                />
    
                <CardContent>
                    <Typography variant="caption" color="primary.light">
                        {postText}
                    </Typography>
                   
                </CardContent>
                
                <CardActions disableSpacing>
                    <Stack width="100%" spacing={0}>
                        <Typography gutterBottom ml={2} align='left' variant="subtitle2" color={likedBy?.length!==0?"text.primary":"#bbb"}>
                            {subBody}
                        </Typography>
                        <Divider flexItem />
                        <Box>
                            <IconButton onClick={like} size='large' aria-label="add to favorites">
                                {isLiked? (<FavoriteIcon fontSize='2.5rem' sx={{color:"tomato"}} />):(<FavoriteBorderIcon fontSize='2.5rem' />)}
                            </IconButton>
                            <IconButton onClick={()=>setOpenComment(true)} size='large' aria-label="Comment">
                                <CommentIcon fontSize='2.5rem' />
                            </IconButton>
                       </Box>
                    </Stack>
                </CardActions>
            </Card>
        {/* </Box> */}
        <CommentModal commentCreatedBy={createdBy} open={openComment} setOpen={setOpenComment} id={id} />
        <Menu
            id="Comment Option"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem disabled={deletePost.loading} onClick={handlePostDelete}>Delete</MenuItem>
            <MenuItem onClick={()=>{setOpenEdit(true); handleClose()}}  >Edit</MenuItem>
        </Menu>
        <EditPostModal open={openEdit} setOpen={setOpenEdit} postId={id} />
    </Fragment>
    )}
   </Fragment>
  )
}

export default PostCard