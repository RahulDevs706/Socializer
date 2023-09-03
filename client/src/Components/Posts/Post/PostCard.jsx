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
import { useNavigate, useLocation } from 'react-router-dom';
import { viewProfile } from '../../../Redux/Slice/userSlice';
import { useSnackbar } from 'notistack';

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
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
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

    // if( (location.pathname==="/") && (postLike.success || postLike.error)){
    //     dispatch(clearPostMsg("PL"))
    //     dispatch(clearPostMsg("GP_PRO"));
    // }



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
        if(location.pathname===`/profile/${proUser?._id}/${id}`){
            navigate(-1);
        }
        dispatch(clearPostMsg("PD"));
      }
    }, [deletePostState, dispatch, location.pathname, navigate, proUser?._id, id]);


    // useEffect(() => {
    //   if((location.pathname===`/profile/${proUser?._id}` || location.pathname===`/profile/${proUser?._id}/${id}`)){
    //       if(postLike.success || postLike.error){

    //         dispatch(clearPostMsg("PL"))
    //         dispatch(clearPostMsg("GP_PRO"));

    //     }    
    //   }
    // }, [dispatch, location,proUser, deletePostState, postLike, id]);

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

    const handleEditClick=()=>{
        setOpenEdit(true);
        handleClose();
    }

    const handleProfile=(id)=>{
            navigate(`/profile/${id}`)
    }

    // init the notistack

    


    

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
                        <Avatar sx={{cursor:"pointer"}} onClick={()=>handleProfile(createdBy)} src={avatarImg} alt={name} size="large" aria-label="avatar" />
                    }
                    action={
                        isUserPost && (
                        <IconButton onClick={handleClick} aria-label="settings">
                            <MoreVertIcon color="primary" />
                        </IconButton>
                        )
                    }
                    title={<Typography sx={{cursor:"pointer"}} onClick={()=>handleProfile(createdBy)} variant='body1' color="primary">{name}</Typography> }
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
                        {/* <Stack direction="row" spacing={1}  >
                            <Typography gutterBottom ml={2} align='left' variant="subtitle2" color={likedBy?.length!==0?"text.primary":"#bbb"}>{likesText}</Typography>
                            <Typography gutterBottom ml={2} align='left' variant="subtitle2" color={comments?.length!==0?"text.primary":"#bbb"}>{commentText}</Typography>
                        </Stack> */}
                        <Divider flexItem />
                        <Stack direction='row' spacing={3} alignItems={'center'}>
                            <Stack direction='row' spacing={0.2} alignItems={'center'}>
                                <IconButton onClick={like} size='large' aria-label="add to favorites">
                                    {isLiked? (<FavoriteIcon fontSize='2.5rem' sx={{color:"tomato"}} />):(<FavoriteBorderIcon fontSize='2.5rem' />)}
                                </IconButton>
                                <Typography sx={{cursor:likedBy?.length!==0&&"pointer"}} ml={2} align='left' variant="subtitle2" fontSize="1rem" color={likedBy?.length!==0?"text.primary":"#bbb"}>{likesText}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={0.2} alignItems={'center'}>
                                <IconButton onClick={()=>setOpenComment(true)} size='large' aria-label="Comment">
                                    <CommentIcon fontSize='2.5rem' />
                                </IconButton>
                                <Typography ml={2} align='left' variant="subtitle2" fontSize="1rem" color={comments?.length!==0?"text.primary":"#bbb"}>{commentText}</Typography>
                            </Stack>
                       </Stack>
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
            <MenuItem onClick={()=>handleEditClick()}  >Edit</MenuItem>
        </Menu>
    </Fragment>
    )}
    <EditPostModal open={openEdit} setOpen={setOpenEdit} postId={id} />
   </Fragment>
  )
}

export default PostCard