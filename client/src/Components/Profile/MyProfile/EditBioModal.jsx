import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Slide, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { Fragment, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch, useSelector} from "react-redux"
import { clearMsg, loadUser, profile_update, viewProfile } from '../../../Redux/Slice/userSlice';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import ArrowBack from '@mui/icons-material/ArrowBack';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const EditCommentModal = ({open, setOpen}) => {

    const theme = useTheme()

    const { enqueueSnackbar } = useSnackbar();
    
   
    const dispatch = useDispatch();

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));



    const {loading, success, message, error, type} = useSelector(s=>s.user.profileUpdate)
    const {user} = useSelector(s=>s.user);

    const [bio, setBio] = useState(user.bio);

    const handleChange = (e)=>{
        const {value} = e.target
        setBio(value)
      }

    const handleSubmit = ()=>{
        if(bio===user.bio){
            return
        }

        const newData = new FormData();
        newData.append("data", bio);
        newData.append("type", "bio");
        newData.append("Uid", user._id);

        dispatch(profile_update(newData));

        return
    }

    useEffect(() => {
        if(type==="bio" && loading===false && success===true) {
            setOpen(false);
            dispatch(clearMsg("Pro_Up"));
        }
    }, [loading,success, type])

    useEffect(() => {
        const option = {
            variant:"info",
            anchorOrigin:{
                vertical:"top",
                horizontal:"center",
            },
        }

        if( type==="bio" && !loading && (success || error)){
            enqueueSnackbar(message, option)
            dispatch(viewProfile(user._id));
            dispatch(loadUser());
        }

    }, [type, loading,error, message, success, enqueueSnackbar]);

    const handleClose=()=>{
        setOpen(false);
        setBio(user.bio);
    }
    

    console.log(message, loading, success);

  return (
    <Fragment>
        <Dialog fullWidth fullScreen={fullScreen} TransitionComponent={Transition} keepMounted open={open} onClose={handleClose}>
        <DialogTitle sx={{borderRadius:"17px"}}>
                <Stack alignItems='center' direction='row'>
                    <IconButton onClick={handleClose}>
                        <ArrowBack sx={{fontSize:"1.5rem"}} />
                    </IconButton>
                    <Typography component={'p'} variant="body1">
                        Update Bio
                    </Typography>
                    <Box flexGrow={1} />
                    <LoadingButton loading={loading} loadingPosition="start"  variant="contained" size="large" onClick={handleSubmit} >
                        Update
                    </LoadingButton>
                </Stack>
            </DialogTitle>           
             <DialogContent dividers>
                <Box display="flex" justifyContent={'center'} alignItems="center">
                    <InputBase sx={ {width: "100%", border:'none'}} onChange={(e)=>handleChange(e)} value={bio} placeholder='Tell us something about yourself...' multiline rows={10} />
                </Box>
            </DialogContent>
        </Dialog>
    </Fragment>

)
}

export default EditCommentModal;