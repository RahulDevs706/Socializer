import styled from '@emotion/styled';
import { Step, StepConnector, stepConnectorClasses, StepLabel, Stepper } from '@mui/material'
import React, { Fragment } from 'react'
import FaceIcon from '@mui/icons-material/Face';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CodeIcon from '@mui/icons-material/Code';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Container } from '@mui/system';

const ProfileStepper = ({activeStep}) => {

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundColor:"#1F5077",
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundColor:"#1F5077",
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
          theme?.palette?.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
      },
  }));
  
  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme?.palette?.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundColor:"#1F5077",

        boxShadow: '0 6px 10px 0 rgba(0,0,0,.40)',
    }),
    ...(ownerState.completed && {
      backgroundColor:"#1F5077",
    }),
  }));
  
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <FaceIcon />,
      2:<HomeIcon />,
      3: <CodeIcon />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );}
  
    const steps = [
        "Add a profile picture",
        "Where do you live",
        "Add a bio",
    ]



  return (
    <Fragment>
        <Container maxWidth={'lg'}>
          <Box alignItems='center' alignSelf='center'>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                  </Step>
                ))}
            </Stepper>
          </Box>
        </Container>
    </Fragment>
  )
}

export default ProfileStepper