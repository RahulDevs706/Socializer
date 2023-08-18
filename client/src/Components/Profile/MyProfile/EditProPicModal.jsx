import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
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

const EditModal = ({open, setOpen, user}) => {

    const theme = useTheme()

    const { enqueueSnackbar } = useSnackbar();
    
   
    const dispatch = useDispatch();

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const profileUrl = user && user.profileImg?.url 



    const [profilePreview, setProfilePreview] = useState(profileUrl)
    const [profile, setProfile] = useState(profileUrl);

    const {loading, success, message, error, type} = useSelector(s=>s.user.profileUpdate)



    const profileImageChange = (e)=>{
        const {files} = e.target;
        const reader = new FileReader();

        reader.onload=() =>{
            if(reader.readyState===2){
                setProfilePreview(reader.result);
                setProfile(reader.result);
            }
        }

        if(files.length !==0){
            reader.readAsDataURL(files[0]);
        }else{
            setProfilePreview(profileUrl);
        }

    }

    const handleClose=()=>{
 
    }

    const handleSubmit = ()=>{
        if(profile===profileUrl){
            return
        }

        const newData = new FormData();
        newData.append("data", profile);
        newData.append("type", "profile_pic");
        newData.append("Uid", user._id);

        dispatch(profile_update(newData));

        return
    }

    useEffect(() => {
        if(type==="profile_pic" && loading===false && success===true) {
            setOpen(false);
            setProfile(profileUrl);
            setProfilePreview(profileUrl);
            dispatch(clearMsg("Pro_Up"));
        }
    }, [type,loading,success])

    useEffect(() => {
        const option = {
            variant:"info",
            anchorOrigin:{
                vertical:"top",
                horizontal:"center",
            },
        }

        if(type==="profile_pic" && !loading && (success || error)){
            enqueueSnackbar(message, option)
            dispatch(viewProfile(user._id));
            dispatch(loadUser());
        }

    }, [type,loading,error, message, success, enqueueSnackbar]);

    

    console.log(message, loading, success);


  return (
    <Fragment>
        <Dialog fullWidth fullScreen={fullScreen} TransitionComponent={Transition} keepMounted open={open} onClose={handleClose}>
        <DialogTitle sx={{borderRadius:"17px"}}>
                <Stack p="1" alignItems='center' direction='row'>
                    <IconButton onClick={()=>setOpen(false)}>
                        <ArrowBack sx={{fontSize:"1.5rem"}} />
                    </IconButton>
                    <Typography component={'p'} variant="body1">
                        Update Profile Picture
                    </Typography>
                    <Box flexGrow={1} />
                    <LoadingButton loading={loading} loadingPosition="start"  variant="contained" size="large" onClick={handleSubmit} >
                        Update
                    </LoadingButton>
                </Stack>
            </DialogTitle>           
             <DialogContent dividers>
                <Box display="flex" justifyContent={'center'} alignItems="center">
                    <IconButton sx={{cursor:'pointer'}}>
                        <label htmlFor='profileUpdate'>
                            <Avatar src={profilePreview} htmlFor="profileUpdate" sx={{width:{xs:"60vw", sm:"35vw",  md:"25vw"}, height:{xs:"60vw", sm:"35vw", md:"25vw"}}} />
                            <input style={{display:'none'}} accept="image/*" type="file" id="profileUpdate" onChange={profileImageChange} />
                        </label>                        
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    </Fragment>

)
}

export default EditModal