import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { Fragment, useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import { emailVerifiaction, clearMsg, sendEmail } from '../../../Redux/Slice/userSlice'

const EmailVerify = ({email, name, open, setOpen}) => {

    const dispatch = useDispatch();
    const [seconds, setSeconds] = useState(60);
    const {register} = useSelector(state=>state.user);
    const [code, setCode] = useState("");

    const handleClose = (action)=>{
        if(action==="error"){
            dispatch(clearMsg("V_Error"))
        }
        if(action==="success"){
            dispatch(clearMsg("V_Success"))
        }
    }

    const handleDClose = ()=>{
        setOpen(false);
        setCode("");
        setSeconds(60);
    }

    const handleOtpChange = (e)=>{
        setCode(e.target.value);
    }

    const handleOtpSubmit = ()=>{
        const payload={
            enteredCode:code,
            sentCode:register.emailVerification.code
        }
        dispatch(emailVerifiaction(payload))
    }

    const handleResend = ()=>{
        const data = {
            name:name,
            email:email,
            code:register.emailVerification.code
        }
        dispatch(sendEmail(data));
    }

    useEffect(() => {
        if(!seconds) return;
        if(seconds===0){
            setSeconds(null)
         }
        let interval;

       if(register.emailVerification.sent){
        interval = setInterval(() => {
            setSeconds(seconds-1)
        }, 1000);
       }

        return () => clearInterval(interval);

    }, [seconds, register.emailVerification.sent]);


    useEffect(() => {
        if(register.emailVerification.verification.completed) {
            handleDClose()
        }
    }, [register.emailVerification.verification.completed])


    return (
    <Fragment>
        <Dialog open={open} onClose={handleDClose}>
        <DialogTitle>
            <Typography variant='h4' component='div' align='center'> OTP Verification</Typography>
        </DialogTitle>
        <DialogContent sx={{display:'flex', justifyContent:'center', alignItems:'flex-start'}}>
            <Container >
                <Stack spacing={2}>
                    <Box sx={
                        
                        {
                            alignSelf:"center",
                            width:'fit-content',
                            p:"1%",
                            bgcolor: "#D4EDDA",
                        }
                    }>
                        <Typography color='#86AE8E' variant='p' fontWeight={400} component='p' align='center' >
                            {register.emailVerification.message}
                        </Typography>
                    </Box>
                    <TextField
                        id='otp' 
                        sx={{width:{xs:"100%", md:'50%'}, alignSelf:"center"}}
                        name='otp'
                        InputProps={{ inputProps: { min: 0, max: 5 } }}
                        autoComplete='off'
                        label='Code' 
                        autoFocus
                        value={code}
                        onChange={handleOtpChange}  
                        helperText="Please enter code sent on your email to continue"
                    />
                    <Typography fontWeight={400} component='div' variant='subtitle1' align='center'>
                        You can resend verification code after <b>{seconds}</b> seconds.
                    </Typography>
                    <DialogActions>
                        <Button disabled={(seconds!==0 || register.emailVerification.attemptsLeft===0 ?true:false ) } onClick={handleResend} variant="outlined" color='primary'>
                            Resend
                        </Button>
                        <Button variant="contained" color='primary' onClick={handleOtpSubmit}>
                            Confirm
                        </Button>
                    </DialogActions>
                </Stack>
            </Container>
        </DialogContent>
        <Snackbar open={register.emailVerification.verification.completed} autoHideDuration={3000} onClose={()=>handleClose("success")}>
            <Alert variant='filled' severity={"success"} onClose={()=>handleClose("success")} sx={{ width: '100%' }}>
                {register.emailVerification.verification.message}
            </Alert>
        </Snackbar>
        <Snackbar open={register.emailVerification.verification.error} autoHideDuration={3000} onClose={()=>handleClose("error")}>
            <Alert variant='filled' severity={"error"} onClose={()=>handleClose("error")} sx={{ width: '100%' }}>
                {register.emailVerification.verification.message}
            </Alert>
        </Snackbar>
      </Dialog>

    </Fragment>
  )
}

export default EmailVerify