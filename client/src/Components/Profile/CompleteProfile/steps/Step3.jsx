import { Alert, Button, Container, InputBase, Snackbar, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg, completeProfile } from '../../../../Redux/Slice/userSlice';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect } from 'react';
import {useNavigate} from "react-router"
import { useCallback } from 'react';

const Step3 = ({activeStep, setActiveStep, setCompleteData, completeData}) => {
      const { profileCompletion} = useSelector(state=>state.user);
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const inputStyle = {
          padding: '5%',
          // width: {xs:'60vw', md:"40vw"},
          backgroundColor:"#ffffff",
          borderRadius:"20px",
          border:'none',
          boxShadow:"4px 7px 20px 3px rgb(0 0 0 / 24%)"
      }

      const [bio, setBio] = useState(completeData?.bio);
      const [isBioAdded, setIsBioAdded] = useState(false);
      const [buttonToShow, setButtonToShow] = useState();


      const handleChange = (e)=>{
        const {value} = e.target
        setBio(value)
      }

      const handleSkip = useCallback(()=>{
        if(bio!==""){
          return
        }
        dispatch(completeProfile(completeData));
      }, [bio, completeData, dispatch])

      const handleSave = useCallback(()=>{
        setCompleteData({...completeData, bio:bio});
        setIsBioAdded(true);
      }, [bio, setCompleteData, completeData])

      const handleSubmit = useCallback(
        ()=>{
          dispatch(completeProfile(completeData));
        }, [dispatch, completeData]
      )


      useEffect(() => {
        
      if(profileCompletion.success===true){
        setTimeout(()=>{
          navigate("/");
          window.location.reload()
          
        }, 3000)
      }

        if(bio===""){
          setButtonToShow( 
            <Button onClick={()=>handleSkip()}  size="large"  variant="contained" color="primary" >
              Skip
            </Button>
          )
        }else if(bio!=="" && isBioAdded===false){
          setButtonToShow(
            <Button onClick={()=>handleSave()}  size="large"  variant="contained" color="primary" >
              Save
            </Button>
          )
        }else if(bio!=="" && isBioAdded){
          setButtonToShow(
            <LoadingButton loadingPosition='start' loading={profileCompletion.loading} onClick={()=>handleSubmit()}  size="large"  variant="contained" color="primary" >
              Submit
            </LoadingButton>
          )
        }
      }, [profileCompletion, navigate, bio, isBioAdded, handleSubmit, handleSave, handleSkip]);


      const handleNavigation = (action)=>{
        if(action==='next'){
          if(activeStep===3){
            return
          }
          handleSubmit();

          dispatch(completeProfile(completeData))

          if(profileCompletion.success===true){
            setActiveStep(activeStep+1)
          }
  
        }else if(action==='skip'){
          if(activeStep===3){
            return
          }
          setActiveStep(activeStep+1)
  
        }else if(action==='back'){
          if(activeStep===0){
            return
          }
          setActiveStep(activeStep-1)
        }else{
          return
        }
      }

      const handleClose = (action)=>{
        if(action==="error"){
            dispatch(clearMsg("PC_Error"))
        }
        if(action==="success"){
            dispatch(clearMsg("PC_Success"))
        }
    }


  return (
    <Fragment>
        <Container maxWidth="sm">
          <Stack alignContent="center" spacing={3}>
              <InputBase sx={inputStyle} onChange={(e)=>handleChange(e)} value={bio} placeholder='Tell us something about yourself...' multiline rows={10} />
              <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="md">
                <Stack alignItems="center" alignSelf="center" spacing={2} >
                    <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="sm">
                        <Stack alignItems="center" alignSelf="center" spacing={2} direction='row'>
                          <Button onClick={()=>handleNavigation('back')}  size="large"  variant="contained" color="error" >
                            Back
                          </Button>
                          <Box flexGrow={1.5} />

                          {buttonToShow}

                        </Stack>
                    </Container>
                </Stack>
              </Container>
          </Stack>
        </Container>
        <Snackbar open={profileCompletion.success} autoHideDuration={3000} onClose={()=>handleClose("success")}>
            <Alert variant='filled' severity={"success"} onClose={()=>handleClose("success")} sx={{ width: '100%' }}>
                {profileCompletion.message}
            </Alert>
        </Snackbar>
        <Snackbar open={profileCompletion.error} autoHideDuration={3000} onClose={()=>handleClose("error")}>
            <Alert variant='filled' severity={"error"} onClose={()=>handleClose("error")} sx={{ width: '100%' }}>
                {profileCompletion.message}
            </Alert>
        </Snackbar>
    </Fragment>
  )
}

export default Step3