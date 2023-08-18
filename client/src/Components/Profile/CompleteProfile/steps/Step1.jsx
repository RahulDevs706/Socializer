import { Avatar, Button, Container, IconButton, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { Fragment } from 'react'
import { useState } from 'react'
import defProfPic from "../../../../Images/Profile.png"

const Step1 = ({setActiveStep, activeStep, setCompleteData, completeData}) => {

    const profileUrl = completeData.profileImgUrl? completeData.profileImgUrl : defProfPic

    const [profilePreview, setProfilePreview] = useState(profileUrl)
    const [profile, setProfile] = useState(profileUrl);
    const [profileAdded, setProfileAdded] = useState(false);



    const profileImageChange = (e)=>{
        const {files} = e.target;
        const reader = new FileReader();

        reader.onload=() =>{
            if(reader.readyState===2){
                setProfilePreview(reader.result);
                setProfile(reader.result);
                setProfileAdded(true)
            }
        }

        if(files.length !==0){
            reader.readAsDataURL(files[0]);
        }else{
            setProfilePreview(defProfPic);
            setProfileAdded(false)
        }

    }
    const handleSubmit = ()=>{
        if(profile===defProfPic){
            return
        }
        setCompleteData({...completeData, profileImgUrl:profile});
    }

    const handleNavigation = (action)=>{
        if(action==='next'){
          if(activeStep===3){
            return
          }
          handleSubmit();
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
    
  return (
    <Fragment>
        <Box alignSelf={'center'}>
            <Stack alignItems="center" spacing={2}>
                <Box>
                    <IconButton>
                        <label htmlFor='ProfileUpload'>
                            <Avatar src={profilePreview} htmlFor="ProfileUpload" sx={{width:{xs:"60vw", sm:"35vw",  md:"25vw"}, height:{xs:"60vw", sm:"35vw", md:"25vw"}}} />
                            <input style={{display:'none'}} accept="image/*" type="file" id="ProfileUpload" onChange={profileImageChange} />
                        </label>                        
                    </IconButton>
                </Box>
            </Stack>
            <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="md">
              <Stack alignItems="center" alignSelf="center" spacing={2} >
                    <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="sm">
                        <Stack alignItems="center" alignSelf="center" spacing={2} direction='row'>
                            <Button onClick={()=>handleNavigation('back')}  size="large"  variant="contained" color="error" >
                            Back
                            </Button>
                            <Box flexGrow={1}/>
                            <Button sx={{ml:0}} onClick={()=>handleNavigation('next')} size="large"  variant="contained" color="primary">
                                {profileAdded? "Next": "Skip"}
                            </Button>
                        </Stack>
                    </Container>
              </Stack>
            </Container>
        </Box>
    </Fragment>
  )
}

export default Step1