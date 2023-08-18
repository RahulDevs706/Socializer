import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Container } from '@mui/system';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Box, Button, IconButton, Stack } from '@mui/material';

const Step4 = ({activeStep, setActiveStep, setCompleteData, completeData}) => {

  const [isAdded, setIsAdded] = React.useState(false);  

  const handleToggle = (value) => () => {
    setIsAdded(true)
  };

  const handleNavigation = (action)=>{
    if(action==='next'){
      if(activeStep===3){
        return
      }
      setActiveStep(activeStep+1)

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


  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box >
          <Stack alignItems='center' alignSelf='center' spacing={2}>
          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {[0, 1, 2, 3].map((value) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem
                  key={value}
                  secondaryAction={
                    <IconButton onClick={()=>handleToggle(value._id)}>
                      {isAdded?(<PersonRemoveIcon />):(<PersonAddIcon />)}
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar n°${value + 1}`}
                        src={`/static/images/avatar/${value + 1}.jpg`}
                      />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={"Rahul Singh"} secondary={"Bilaspur, CG, IN"}  />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="md">
            <Stack alignItems="center" alignSelf="center" spacing={2} >
              <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="sm">
                <Stack alignItems="center" alignSelf="center" spacing={2} direction='row'>
                  <Button onClick={()=>handleNavigation('back')}  size="large"  variant="contained" color="error" >
                    Back
                  </Button>
                  <Box sx={{display:{xs:'none', sm:"block"}}} flexGrow={1}/>
                  <Button  onClick={()=>handleNavigation('skip')}  size="large"  variant="outlined" color="primary" sx={{ml:0 ,display:{xs:'none', sm:"block"}}}>
                      Skip
                  </Button>
                  <Box sx={{display:{xs:'block', sm:"none"}}} flexGrow={1.5} />
                  <Button sx={{ml:0}} onClick={()=>handleNavigation('next')} size="large"  variant="contained" color="primary">
                      Next
                  </Button>
                </Stack>
              </Container>
              <Button fullWidth onClick={()=>handleNavigation('skip')}  size="large"  variant="outlined" color="primary" sx={{ml:0 ,display:{xs:'block', sm:"none"}}}>
                Skip
              </Button>
            </Stack>
          </Container>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Step4