import { Alert, Button, Divider, Paper, Snackbar, Stack, TextField } from '@mui/material'
import { Container } from '@mui/system'
import React, { Fragment, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { loginSchema } from '../../../utils/loginSchema';
import SignupModal from './SignupModal';
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg, loginUser } from '../../../Redux/Slice/userSlice';
import {useNavigate} from "react-router-dom"
import LoadingButton from '@mui/lab/LoadingButton';


const LoginComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {login, isLoggedIn, isProfileCompleted, user} = useSelector(state=>state.user)
    const [open, setOpen] = useState(false);

    const handleOpen = ()=>{
        setOpen(true)
    }

    useEffect(() => {
        if(isLoggedIn && isProfileCompleted===true){
            navigate("/")
        }
        if(isLoggedIn && isProfileCompleted===false){
            navigate("/profile/complete")
        }
        if(login.success) dispatch(clearMsg("L_success"))
    }, [navigate, isLoggedIn, isProfileCompleted, login.success, dispatch]);

    const initialValues = {
        email:"",
        password:""
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            dispatch(loginUser(values));
        }
    });

    const handleClose = (action) => {
        if(action==="error"){
            dispatch(clearMsg("L_error"))
        }
        if(action==="success"){
            // socket.emit("login", {userId:user._id})
            dispatch(clearMsg("L_success"))
        }
    };

  return (
    <Fragment>
        <Container sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
            <Paper elevation={6} sx={{width:{md:'25vw', sm:'60vw', xs:'75vw'}, borderRadius:"10px"}}>
            <Stack spacing={2} sx={{p:'5%'}}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2} >
                        <TextField 
                            fullWidth id='email' 
                            name='email' 
                            type='email'
                            autoComplete='off'
                            label='Email' 
                            value={formik.values.email}
                            onChange={formik.handleChange} 
                            error={formik.touched.email && Boolean(formik.errors.email)}  
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField 
                            fullWidth id='password' 
                            name='password' 
                            type='password'
                            autoComplete='off'
                            label='Password' 
                            value={formik.values.password}
                            onChange={formik.handleChange} 
                            error={formik.touched.password && Boolean(formik.errors.password)}  
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <LoadingButton loadingPosition='start' loading={login.loading} size='large' variant="contained" color="primary" fullWidth type='submit'>
                            Login
                        </LoadingButton>
                    </Stack>
                </form>

                <Button size='small' color="error">
                    Forgot password?
                </Button>
                <Divider flexItem />
                <Button onClick={handleOpen} size='large' variant="contained" color="success">
                    Create Account
                </Button>
            </Stack>

                </Paper>
             </Container>

             <SignupModal open={open} setOpen={setOpen} />
             <Snackbar open={login.success} autoHideDuration={3000} onClose={()=>handleClose("success")}>
                <Alert variant='filled' severity="success" onClose={()=>handleClose("success")} sx={{ width: '100%' }}>
                    {login.message}
                </Alert>
            </Snackbar>
            <Snackbar open={login.error} autoHideDuration={3000} onClose={()=>handleClose("error")}>
                <Alert variant='filled' severity="error" onClose={()=>handleClose("error")} sx={{ width: '100%' }}>
                    {login.message}
                </Alert>
            </Snackbar>
    </Fragment>
  )
}

export default LoginComponent