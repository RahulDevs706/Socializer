import { Button, CircularProgress, Divider, IconButton, InputBase, Paper, Stack, TextField } from '@mui/material'
import React, { Fragment } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearPostMsg, createComment, getCommentsPostSingle, getMyPost } from '../../../../Redux/Slice/postSlice';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

const CreateComment = ({id}) => {

    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const {create} = useSelector(s=>s.post.postComments)
    const { enqueueSnackbar } = useSnackbar();
    
    useEffect(() => {
        if(create.success){
            dispatch(getCommentsPostSingle(id))

            dispatch(clearPostMsg("CC"))
        }

    }, [create.success, dispatch, id]);

    useEffect(() => {
        const option = {
            variant:"info",
            anchorOrigin:{
                vertical:"top",
                horizontal:"center",
            },
        }

        if(create.success || create.error){
            enqueueSnackbar(create.message, option)
            dispatch(getMyPost());
        }

        if(create.success){
            setComment("");   
        }
    }, [create.error, create.message, create.success, enqueueSnackbar]);



    const handleComment = (e)=>{
        e.preventDefault();
        if(comment===""){
            enqueueSnackbar("Comment cannot be empty", {variant:"error", anchorOrigin:{vertical:"top", horizontal:'center'}})
            return
        }
        dispatch(createComment({
            id:id,
            txt:comment
        }))
    }

  return (
    <Fragment>
        <Stack overflow="hidden" alignItems="center" width="100%">
            <Paper
            component="form"
            onSubmit={handleComment}
            sx={{display: 'flex', alignItems: 'center', width: "100%" }}
            >
                <InputBase
                    sx={{ ml:5 , flex: 1}}
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder="Enter a Comment"
                    value={comment}
                    inputProps={{ 'aria-label': 'Enter a Comment' }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type='submit' color="primary" sx={{ p: '10px' }} aria-label="Send">
                    {create.loading?<CircularProgress color="grey" />:<SendIcon fontSize="large" />}
                </IconButton>
            </Paper>
        </Stack>
    </Fragment>
  )
}

export default CreateComment