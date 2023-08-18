import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import LoginComponent from './LoginComponent';
import SignupComponent from './SignupComponent';
import { Container } from '@mui/system';

const SignupModal = ({open, setOpen}) => {

    const handleClose = ()=>{
        setOpen(false)
    }

  return (
    <Fragment>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Grid container>
                <Grid item xs={11}>
                    <Stack spacing={0}>
                        <Typography variant="h4" component='p'>Signup</Typography>
                        <Typography variant="p" component='p'>Its quick and free</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={1}>
                    <IconButton sx={{right:'0'}} onClick={handleClose} ><CloseIcon /></IconButton>
                </Grid>
            </Grid>
            <Divider flexItem />
        </DialogTitle>
        <DialogContent sx={{display:'flex', justifyContent:'center', alignItems:'flex-start'}}>
            <SignupComponent />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default SignupModal