import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostMsg, getMyPost } from '../../../../Redux/Slice/postSlice'
import CreatePost from '../../../Posts/CreatePost'
import PostCard from '../../../Posts/Post/PostCard'
import moment from "moment"
import { Stack } from '@mui/material'


const MidPart = () => {

  const {getMyPosts:myPost} = useSelector(s=>s.post)
  const {createPost} = useSelector(s=>s.post)
  const {posts} = myPost;
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getMyPost());
    dispatch(clearPostMsg("GP"))
  }, [dispatch]);
  

  useEffect(() => {
      if(createPost.success){
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