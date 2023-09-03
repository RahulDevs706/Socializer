import { Avatar, Button, Card, CardHeader, Container, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useSearchParams, useParams, useNavigate} from 'react-router-dom'
import { clearPostMsg, getPost } from '../../../Redux/Slice/postSlice';
import { viewProfile } from '../../../Redux/Slice/userSlice';
import PostCard from '../../Posts/Post/PostCard';
import Loader from '../../Layout/Loader/Loader';


const PostPage = () => {

    const params = useParams();
    const [query] = useSearchParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    
    console.log(query)
    useEffect(() => {
        dispatch(viewProfile(params?.uid));
        dispatch(getPost(params?.pid))
        
    }, [params.uid, params.pid, dispatch]);
    
    const {user} = useSelector(s=>s.user.profile)
    const {post, loading, error} = useSelector(s=>s.post.getSinglePost)
      const createdAt = moment(post?.createdAt).calendar();

      const [errorText, setErrorText] = useState();

    useEffect(()=>{
        if(error){
            setErrorText("404 | The resource you are trying to access may have been deleted by the owner or does not exist.")
        }
    },[error, dispatch, navigate]);

console.log(error);
  return (
    <Fragment>
            <Container maxWidth={'xl'} sx={{pr:0, pl:0}}>
                <Stack alignItems="center" justifyContent={'center'} spacing={4}>
                    <Card sx={{width:"100%", bgcolor:"#1F5077"}}>
                        <CardHeader 
                            title={<Typography variant="h4" color="#fff" >{user?.name}</Typography>} 
                            avatar={<Avatar src={user?.profileImg?.url} />}
                            action={
                                <Button>Add Friend</Button>
                            }
                        />
                    </Card>
                   {error? 
                   <Box width="100%" height="75vh" display='flex' alignItems="center" justifyContent="center">
                        <Typography fontSize="1.5rem" color='primary.main' >{errorText}</Typography>
                   </Box> : <Box width={{xs:'100%', sm:"55%"}}>
                            {post && <PostCard loading={loading} createdBy={post?.createdBy?._id} likedBy={post?.likedBy} id={post?._id} avatarImg={post?.createdBy?.profileImg?.url} name={post?.createdBy?.name} createdAt={createdAt} postImg={post?.postImg?.url} postText={post?.postText} comments={post?.comments}   />}
                    </Box>}
                </Stack>
        </Container>
    </Fragment>
  )
}

export default PostPage