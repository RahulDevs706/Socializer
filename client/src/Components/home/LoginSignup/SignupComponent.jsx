import { Alert, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Snackbar, Stack, TextField } from '@mui/material'
import { Container } from '@mui/system'
import React, { Fragment, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { signupSchema } from '../../../utils/signupSchema'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useDispatch, useSelector} from "react-redux"
import EmailVerify from './EmailVerify'
import {sendEmail, clearMsg, registerUser} from "../../../Redux/Slice/userSlice"
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom'

const SignupComponent = () => {
    const dispatch = useDispatch();
    const {register, isLoggedIn} = useSelector(state=>state.user);
    const [openVerify, setOpenVerify] = useState(register.emailVerification.sent);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState({
        p:false,
        cP:false,
    });

    useEffect(() => {
        if(isLoggedIn){
            navigate("/profile/complete")
        }
        return () => {
            navigate("/profile/complete")
        };
    }, [navigate, isLoggedIn]);

    const handleClickShowPassword = (action) => {
        if(action==='p'){
            setShowPassword({...showPassword, [action]:!showPassword.p})
        }else if(action==="cP"){
            setShowPassword({...showPassword, [action]:!showPassword.cP})
        }
    };
    
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const initialValues = {
        fName:"",
        lName:"",
        email:"",
        password:"",
        confirmPassword:"",
        dob:"",
        gender:""
    }

    

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: signupSchema,
        onSubmit: (values) => {
            const digits = '0123456789';
            let code = '';
            for (let i = 0; i<5; i++ ) {
                code += digits[Math.floor(Math.random() * 10)];
            }
            const name = `${values.fName} ${values.lName}`
            const data = {
                name:name,
                email:values.email,
                code:code
            }

            if(register.emailVerification.verification.started===false){
                dispatch(sendEmail(data));
                setOpenVerify(true);
            }
        },
    });




    const handleClose = (action) => {
        if(action==="error"){
            dispatch(clearMsg("R_Error"))
        }
        if(action==="success"){
            dispatch(clearMsg("R_Success"))

        }
    };

    const handleSubmit=()=>{

        const {fName, lName, email, password, dob, gender} = formik.values

        const signupForm = new FormData();
        const name = `${fName} ${lName}`
        
        signupForm.append("name", name)
        signupForm.append("email", email)
        signupForm.append("password", password)
        signupForm.append("dob", dob)
        signupForm.append("gender", gender)

        dispatch(registerUser(signupForm))
    }

  return (
    <Fragment>
        <Container maxWidth="sm" sx={{display:'flex', justifyContent:'center', alignItems:'flex-start', width:{md:'30vw',sm:'40vw', xs:'80vw'}}}>
                <form style={{margin:"2%"}} onSubmit={formik.handleSubmit}>
                    <Stack sx={{ width:"100%"}} spacing={1.5} >
                        <Stack direction='row' spacing={1.5}>
                            <TextField
                                fullWidth id='fName' 
                                name='fName' 
                                autoComplete='off'
                                disabled={register.emailVerification.verification.started}
                                label='First Name' 
                                value={formik.values.fName}
                                onChange={formik.handleChange} 
                                error={formik.touched.fName && Boolean(formik.errors.fName)}  
                                helperText={formik.touched.fName && formik.errors.fName}
                            />
                            <TextField
                                fullWidth id='lName' 
                                name='lName' 
                                autoComplete='off'
                                disabled={register.emailVerification.verification.started}
                                label='Last Name' 
                                value={formik.values.lName}
                                onChange={formik.handleChange} 
                                error={formik.touched.email && Boolean(formik.errors.lName)}  
                                helperText={formik.touched.lName && formik.errors.lName}
                            />
                        </Stack>
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
                            disabled={register.emailVerification.verification.started}

                        />
                        <FormControl fullWidth variant="outlined" error={formik.touched.password && Boolean(formik.errors.password)}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput 
                                fullWidth id='password' 
                                name='password' 
                                type={showPassword.p?'text':"password"}
                                autoComplete='off'
                                label='Password' 
                                disabled={register.emailVerification.verification.started}
                                value={formik.values.password}
                                onChange={formik.handleChange} 
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=>handleClickShowPassword('p')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword.p ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formik.touched.password && <FormHelperText>{formik.errors.password}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth variant="outlined" error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
                        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                            <OutlinedInput 
                                fullWidth id='confirmPassword' 
                                name='confirmPassword' 
                                type={showPassword.cP?'text':"password"}
                                disabled={register.emailVerification.verification.started}
                                label='Confirm Password' 
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange} 
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=>handleClickShowPassword('cP')}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword.cP ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formik.touched.confirmPassword && <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>}
                        </FormControl>
                        
                        <TextField
                            fullWidth
                            id="dob"
                            label="DoB"
                            type="date"
                            name='dob'
                            disabled={register.emailVerification.verification.started}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            value={formik.values.dob}
                            onChange={formik.handleChange}
                            error={formik.touched.dob && Boolean(formik.errors.dob)}  
                            helperText={formik.touched.dob && formik.errors.dob}
                        />

                        <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}  >
                            <InputLabel id='genderLabel'>Gender</InputLabel>
                            <Select
                                labelId='genderLabel'
                                id='gender'
                                name='gender'
                                disabled={register.emailVerification.verification.started}
                                label='Gender'
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value='male'>Male</MenuItem>
                                <MenuItem value='female'>Female</MenuItem>
                            </Select>
                            {formik.touched.gender && <FormHelperText>{formik.errors.gender}</FormHelperText>}
                        </FormControl>

                        {register.emailVerification.verification.completed ? (
                        <LoadingButton  loadingPosition="start" loading={register.loading} size='large' variant="contained" color="success" fullWidth onClick={handleSubmit} >
                            Submit
                        </LoadingButton>
                        ):(
                        <Button size='large' variant="contained" color="success" fullWidth type='submit' >
                            Submit
                        </Button>
                        ) }

                        
                    </Stack>
                </form>
            </Container>

            <Snackbar open={register.success} autoHideDuration={3000} onClose={()=>handleClose("success")}>
                <Alert variant='filled' severity="success" onClose={()=>handleClose("success")} sx={{ width: '100%' }}>
                    {register.message}
                </Alert>
            </Snackbar>
            <Snackbar open={register.error} autoHideDuration={3000} onClose={()=>handleClose("error")}>
                <Alert variant='filled' severity="error" onClose={()=>handleClose("error")} sx={{ width: '100%' }}>
                    {register.message}
                </Alert>
            </Snackbar>
            <EmailVerify handleClose={handleClose} name={formik.values.fName} open={openVerify} setOpen={setOpenVerify} email={formik.values.email} />
    </Fragment>
  )
}

export default SignupComponent