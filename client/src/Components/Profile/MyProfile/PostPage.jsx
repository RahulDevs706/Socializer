import { Avatar, Button, Card, CardHeader, Container, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useEffect } from 'react'
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useSearchParams, useParams} from 'react-router-dom'
import { getPost } from '../../../Redux/Slice/postSlice';
import { viewProfile } from '../../../Redux/Slice/userSlice';
import PostCard from '../../Posts/Post/PostCard';
import Loader from '../../Layout/Loader/Loader';


const PostPage = () => {

    const params = useParams();
    const [query] = useSearchParams();
    const dispatch = useDispatch()
    
    console.log(query)
    useEffect(() => {
        dispatch(viewProfile(params?.uid));
        dispatch(getPost(params?.pid))
        
    }, [params.uid, params.pid, dispatch]);
    
    const {user} = useSelector(s=>s.user.profile)
    const {post, loading} = useSelector(s=>s.post.getSinglePost)
      const createdAt = moment(post?.createdAt).calendar();


  return (
    <Fragment>
            <Container maxWidth={'xl'} sx={{pr:0, pl:0}}>
                <Stack alignItems="center" justifyContent={'center'} spacing={4}>
                    <Card sx={{width:"100%", bgcolor:"#1F5077"}}>
                        <CardHeader 
                            title={<Typography variant="h4" color="white" >{user?.name}</Typography>} 
                            avatar={<Avatar src={user?.profileImg?.url} />}
                            action={
                                <Button>Add Friend</Button>
                            }
                        />
                    </Card>
                    <Box width={{xs:'100%', sm:"55%"}}>
                            {post && <PostCard loading={loading} createdBy={post?.createdBy?._id} likedBy={post?.likedBy} id={post?._id} avatarImg={post?.createdBy?.profileImg?.url} name={post?.createdBy?.name} createdAt={createdAt} postImg={post?.postImg?.url} postText={post?.postText} comments={post?.comments}   />}
                    </Box>
                </Stack>
        </Container>
    </Fragment>
  )
}

export default PostPage