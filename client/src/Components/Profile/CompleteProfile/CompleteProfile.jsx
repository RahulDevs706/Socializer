import { Avatar, Button, Container, IconButton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Loader from '../../Layout/Loader/Loader';
import ProfileStepper from "./ProfileStepper"
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';


const CompleteProfile = () => {
    const {loadUser,isProfileCompleted} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [activeComponent, setActiveComponent] = useState();
    const initialState = {
      profileImgUrl:"",
      address:{
        city:"",
        state:"",
        country:""
      },
      bio:"",
    }
    const [completeData, setCompleteData] = useState(initialState);
    
    useEffect(() => {
      if(activeStep===0){
        setActiveComponent(<Step1 completeData={completeData} setCompleteData={setCompleteData} setActiveStep={setActiveStep} activeStep={activeStep} />)
      }else if(activeStep===1){
        setActiveComponent(<Step2 completeData={completeData} setCompleteData={setCompleteData} setActiveStep={setActiveStep} activeStep={activeStep} />)
      }else if(activeStep===2){
        setActiveComponent(<Step3 completeData={completeData} setCompleteData={setCompleteData} setActiveStep={setActiveStep} activeStep={activeStep} />)
      }else if(activeStep===3){
        setActiveComponent(<Step4 completeData={completeData} setCompleteData={setCompleteData} setActiveStep={setActiveStep} activeStep={activeStep} />)
      }

      console.log(completeData);

    }, [activeStep, completeData]);

    useEffect(() => {
      if(isProfileCompleted){
        navigate("/");
      }
    }, [isProfileCompleted, navigate]);

  return (

    <Fragment>
        {loadUser.loading?(<Loader />):(
            <Fragment>
              <Container maxWidth="md" sx={{mt:'2%'}}>
                <Stack spacing={3}>
                  <ProfileStepper activeStep={activeStep} />
                  <Box>
                    {activeComponent}
                  </Box>
                </Stack>

              </Container>

            </Fragment>
        )}
    </Fragment>
  )
}

export default CompleteProfile