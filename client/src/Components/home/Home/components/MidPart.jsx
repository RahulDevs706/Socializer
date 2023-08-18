import { CircularProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostMsg, getMyPost } from '../../../../Redux/Slice/postSlice'
import CreatePost from '../../../Posts/CreatePost'
import Post from '../../../Posts/Post'
import PostCard from '../../../Posts/Post/PostCard'
import moment from "moment"
import { useSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';


const MidPart = () => {

  const {user} = useSelector(s=>s.user)
  const {getMyPosts:myPost, success, loading, postLike, deletePostState, updatePostState} = useSelector(s=>s.post)
  const {createPost} = useSelector(s=>s.post)
  const {posts} = myPost;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {delete:commentDelete} = useSelector(s=>s.post.postComments)
  
  
  

  
  const [skip, setSkip] = useState(0)


  // const handleScroll = (e)=>{
  //   const { scrollTop, scrollHeight} = e.target.documentElement
      
  //   const winHeight = window.innerHeight

  //   console.log(scrollTop, scrollHeight, winHeight);

  // }

  useEffect(() => {
    dispatch(getMyPost(skip));
    dispatch(clearPostMsg("GP"))
  }, [skip, dispatch]);
  
  // useEffect(()=>{
  //   window.addEventListener('scroll', handleScroll)
  // })

  // console.log(posts.length);

  // console.log(skip);

  useEffect(() => {
    const option = {
      anchorOrigin:{
        vertical:"top",
        horizontal:"center",
      },
      variant:"info",
      autoHideDuration: 1000
    }
    if(postLike.success || postLike.error){
      enqueueSnackbar(postLike.message, option)
      dispatch(getMyPost());
    }
  }, [enqueueSnackbar, postLike]);

  useEffect(() => {
    if(commentDelete.success || commentDelete.error){
      enqueueSnackbar(commentDelete.message, {variant:commentDelete.success? "success": "error", anchorOrigin:{horizontal:"center", vertical:"top"}})
      dispatch(getMyPost());
      dispatch(clearPostMsg("DC"))
    }
  }, [dispatch ,commentDelete, enqueueSnackbar]);



  // useEffect(() => {
  //   if(postComments.create.success || postComments.create.error){
  //     enqueueSnackbar(postComments.create.message, {variant:postComments.success? "success": "error", anchorOrigin:{horizontal:"center", vertical:"top"}})
  //     dispatch(clearPostMsg("CC"))
  //   }
  // }, [dispatch ,postComments, enqueueSnackbar]);

  useEffect(() => {
    if(deletePostState.success || deletePostState.error){
      enqueueSnackbar(deletePostState.message, {variant:deletePostState.success? "success": "error", anchorOrigin:{horizontal:"center", vertical:"top"}})
      dispatch(getMyPost());
      dispatch(clearPostMsg("PD"));
    }
  }, [dispatch ,deletePostState, enqueueSnackbar]);

  useEffect(() => {
    if(updatePostState.success || updatePostState.error){
      enqueueSnackbar(updatePostState.message, {variant:updatePostState.success? "success": "error", anchorOrigin:{horizontal:"center", vertical:"top"}})
      dispatch(getMyPost());
      dispatch(clearPostMsg("UP"));
    }
  }, [dispatch ,updatePostState, enqueueSnackbar]);



  useEffect(() => {
      if(createPost.success){
        dispatch(getMyPost());
        dispatch(clearPostMsg("PC"))
      }
  }, [dispatch, createPost.success]);



  return (
    <Fragment>
      <Stack alignItems="center" spacing={5}>
        <CreatePost />
          <Stack spacing={3} width={{xs:"100%", sm:"65%"}} display="flex" justifyContent="center" alignItems="center" >
              {posts?.map((item)=>{
                const createdAt = moment(item?.createdAt).calendar();
                return <PostCard createdBy={item.createdBy._id} likedBy={item.likedBy} key={item._id} id={item._id} avatarImg={item.createdBy.profileImg.url} name={item.createdBy.name} createdAt={createdAt} postImg={item?.postImg?.url} postText={item?.postText} comments={item.comments}   />
              })}
          </Stack>
        </Stack>
    </Fragment>
  )
}


export default MidPart