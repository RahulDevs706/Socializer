import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Stack, Typography, Zoom } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPost, updatedPost } from '../../../Redux/Slice/postSlice';
import ArrowBack from '@mui/icons-material/ArrowBack';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const EditPostModal = ({open, setOpen, postId}) => {

    const {updatePostState, getSinglePost} = useSelector(s=>s.post)
    const dispatch = useDispatch();

    useEffect(() => {
        if(open){
            dispatch(getPost(postId))
        }
    }, [open, dispatch, postId]);



    const [postTxt, setPostTxt] = useState();

    useEffect(() => {
        if(getSinglePost.success){
            setPostTxt(getSinglePost.post.postText)
        }
    }, [getSinglePost]);

    const inputStyle = {
        width: "100%",
        backgroundColor:"#fff",
        border:'none',
    }

    if(updatePostState.success){
        setOpen(false);
    }

    const update = ()=>{
        let data = {}

        data.txt= postTxt
        data.id= postId

        dispatch(updatedPost({
            txt:postTxt,
            id:postId
        }));
    }

  return (
    <Fragment>
        <Dialog TransitionComponent={Transition} fullWidth maxWidth='md' open={open} >
            <DialogTitle>
                <Stack alignItems='center' direction='row'>
                    <IconButton onClick={()=>setOpen(false)}>
                        <ArrowBack sx={{fontSize:"1.5rem"}} />
                    </IconButton>
                    <Typography variant="body1" component={'p'}>
                        Edit Post
                    </Typography>
                    <Box flexGrow={1} />
                    <LoadingButton loading={updatePostState?.loading} loadingPosition="start"  variant="contained" size="large" onClick={update} >
                        Edit
                    </LoadingButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <InputBase sx={inputStyle} onChange={(e)=>setPostTxt(e.target.value)} value={postTxt} placeholder='What you want to post' multiline rows={3} />
                    <Box width='100%' display="flex" justifyContent="center" alignItems="center">
                        <Box component={'img'} src={getSinglePost?.post?.postImg?.url} alt="post img" />
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    </Fragment>
  )
}

export default EditPostModal