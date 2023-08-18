import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Slide, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import imgIcon from "../../../Images/image.png"
import LoadingButton from '@mui/lab/LoadingButton';
import {useDispatch, useSelector} from "react-redux"
import { createPost, getMyPost } from '../../../Redux/Slice/postSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreatePostModal = ({open, setOpen}) => {

    const dispatch = useDispatch();
    const {createPost:postCreateState} = useSelector(s=>s.post)

    const inputStyle = {
        width: "100%",
        backgroundColor:"#fff",
        border:'none',
    }
    const [postText, setPostText] = useState("");

    const [postImgAdded, setPostImgAdded] = useState(false)
    const [postImg, setPostImg] = useState(null);

    const handleChange = (e)=>{
        setPostText(e.target.value);
    }

    const addPostImg = (e)=>{
        const {files} = e.target;

        const reader = new FileReader();

        reader.onload=() =>{
            if(reader.readyState===2){
                setPostImg(reader.result);
                setPostImgAdded(true)
            }
        }

        if(files.length !==0){
            reader.readAsDataURL(files[0]);
        }else{
            setPostImg(null);
            setPostImgAdded(false)
        }
    }

    const addPost = ()=>{

        if(Boolean(postImg)===false){
            return
        }

        let data = {}
        
        data.postImg = postImg
        if(postText!==""){
            data.postText = postText;
        }
        

        if(Boolean(postImg)){
            dispatch(createPost(data));
        }
    }

    useEffect(() => {

        if(postCreateState.success){
            setPostImg(null);
            setPostImgAdded(false)
            setPostText("");
            setOpen(false)
            dispatch(getMyPost)
        }

        return () => {
            
        };

    }, [postCreateState.success, setOpen, dispatch]);





  return (
    <Fragment>
        <Dialog TransitionComponent={Transition} fullWidth maxWidth='md' open={open} >
            <DialogTitle sx={{borderRadius:"17px"}}>
                <Stack alignItems='center' direction='row'>
                    <IconButton onClick={()=>setOpen(false)}>
                        <CloseIcon fontSize='large' />
                    </IconButton>
                    <Typography variant="h6">
                        Create Post
                    </Typography>
                    <Box flexGrow={1} />
                    <LoadingButton loading={postCreateState.loading} loadingPosition="start"  variant="contained" size="large" onClick={addPost} >
                        Post
                    </LoadingButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <InputBase sx={inputStyle} onChange={(e)=>handleChange(e)} value={postText} placeholder='What you want to post' multiline rows={postImgAdded?3:15} />
                {postImgAdded&&(
                    <Box width='100%' display="flex" justifyContent="center" alignItems="center">
                        <Stack alignItems="center" justifyContent='center' spacing={2}>
                            <Box component={'img'} src={postImg} alt="post img" width={{xs:"100%", sm:"75%"}} height={{xs:"100%", sm:"75%"}}  />
                        </Stack>
                    </Box>
                )}
                <Divider flexItem />
                <Box width='100%' display="flex" justifyContent="center" alignItems="center">
                    <IconButton>
                        <label htmlFor='postUpload'>
                            <Avatar variant='rounded' src={imgIcon} htmlFor="postUpload" sx={{width:{xs:"8vw",sm:"6vw",md:"3vw"}, height:{xs:"8vw",sm:"6vw",md:"3vw"}}} />
                            <input style={{display:'none'}} accept="image/*" type="file" id="postUpload" onChange={addPostImg} />
                        </label>                        
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    </Fragment>
  )
}

export default CreatePostModal