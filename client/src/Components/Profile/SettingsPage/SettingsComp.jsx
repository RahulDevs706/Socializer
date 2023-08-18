import { Avatar, Breadcrumbs, Button, Card, CardHeader, Container, Dialog, DialogContent, DialogTitle, Divider, FormHelperText, Grid, IconButton, InputBase, Link, Paper, Stack, Switch, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { Fragment } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import publicI from "../../../Images/public_icon.png"
import privateI from "../../../Images/private_icon.png"
import changePass from "../../../Images/change_pass_icon.png"
import support from "../../../Images/contact_supp_icon.png"
import phoneIcon from "../../../Images/phoneIcon.png"
import addressIcon from "../../../Images/addressIcon.png"
import oldPass from "../../../Images/oldPass_icon.png"
import newPass from "../../../Images/newPass_icon.png"
import confPass from "../../../Images/confirmPass_icon.png"

import GoTo from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import ShowPassI from '@mui/icons-material/Visibility';
import HidePassI from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux'

import nameIcon from "../../../Images/name_icon.png"
import emailIcon from "../../../Images/email_icon.png"
import CheckIcon from '@mui/icons-material/Check';
import Edit from '@mui/icons-material/Edit'
import { useDispatch } from 'react-redux';
import { clearMsg, passVerify, profile_update, sendEmail } from '../../../Redux/Slice/userSlice.js'
import EmailVerify from '../../home/LoginSignup/EmailVerify.jsx'
import { useSnackbar } from 'notistack'
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik'
import * as Yup from "yup"
import {debounce} from "lodash"

const PassUpdateMod = ({open, setOpen})=>{

    const handleClose=()=>{
        
        setOldPassword("");
        dispatch(clearMsg("Pass_Ver"))
        formik.resetForm();
        setOpen(false);

    }

    const passVerifyStats = useSelector(s=>s.user.passVerify)
    const {profileUpdate} = useSelector(s=>s.user)

    useEffect(() => {
      if(profileUpdate.success) handleClose();

    }, [profileUpdate.success]);
    

    

    const dispatch = useDispatch();

    const [showPass, setShowPass] = useState({
        old:false,
        new:false,
        confirm:false
    });

    const [oldPassword, setOldPassword] = useState("")

    const handleShowPass=(type, value)=>{
        setShowPass({...showPass, [type]:value})
    }

    const updatePassSchema = Yup.object({
        newPassword: Yup.string().required("Password is required").min(8, "Password should be more than 8 characters").max(16, "Password cannot exceed 16 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password should contain atleast 1 Uppercase, 1 Lowercase, a Number and a Special Character")
        .notOneOf([oldPassword, `${oldPassword}1`, `${oldPassword}123`], 'New password must be different from old password'),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Password & confirm password must match').required("Confirm password is required"),
    })

    const verifyPassFn = (e, password)=>{
        setOldPassword(password)
        e.preventDefault();
        if(passVerifyStats.error || passVerifyStats.success) dispatch(clearMsg("Pass_Ver"))
        dispatch(passVerify({password}));
    }

var initialValues = {
    newPassword:"",
    confirmPassword:"",
}

const formik = useFormik({
    initialValues: initialValues,
    validationSchema: updatePassSchema,
    onSubmit: (values) => {
        const newData = new FormData();
        newData.append("data", values.newPassword );
        newData.append("type", "password");

        dispatch(profile_update(newData));
    },
});


    return (
        <Fragment>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{background:'transparent'}}
                maxWidth={"xs"}
            >
                <DialogTitle sx={{backgroundColor:"#1f5077"}}>
                    <Stack alignItems={'center'} sx={{width:"100%", maxWidth:"100%"}} direction={'row'} spacing={{xs:3, sm:4}}>
                        <Avatar src={changePass} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />
                        <Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}} >Change Password</Typography>
                        <Box flexGrow={{xs:0.3, sm:1}}  />
                        <IconButton onClick={handleClose}><CloseIcon  sx={{fontSize:{xs:24,sm:32}, color:"#fff"}} /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{backgroundColor:"#f1f9ff"}}>
                    <Stack spacing={3}>
                        <Paper 
                            component="div"
                            sx={{ p: '6px 8px', display: 'flex', alignItems: 'center' , borderRadius: '8px', boxShadow: passVerifyStats.error?"0px 0px 5px 2px #ff000069":"0px 0px 5px 2px #0000001f",}}
                        >
                            <Avatar src={oldPass} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />
                            <InputBase
                                type={showPass.old?"text":"password"}
                                sx={{ ml: 1, flex: 1 }}
                                disabled={passVerifyStats?.success}
                                placeholder="Old Password"
                                name="oldPassword"
                                inputProps={{ 'aria-label': 'old_password' }}
                                onChange={(e)=>setOldPassword(e.target.value)}
                                value={oldPassword}
                            />
                            <IconButton onClick={()=>handleShowPass("old", !showPass.old)}>{showPass.old?<HidePassI/>:<ShowPassI  />}</IconButton >
                        </Paper>

                        

                        {passVerifyStats?.success &&
                        <form onSubmit={formik.handleSubmit}>
                            <Stack spacing={2} >
                                <Divider />
                                <Stack spacing={0.5}>
                                    <Paper 
                                        component="div"
                                        sx={{ p: '6px 8px', 
                                            display: 'flex', 
                                            alignItems: 'center' , 
                                            borderRadius: '8px', 
                                            boxShadow: formik.touched.newPassword && Boolean(formik.errors.newPassword) ?"0px 0px 5px 2px #ff000069" : "0px 0px 5px 2px #0000001f", 
                                            color: formik.touched.newPassword && Boolean(formik.errors.newPassword) ? "#ff000069":'inherit',
                                        }}
                                    >
                                        <Avatar src={newPass} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />
                                        <InputBase
                                            type={showPass.new?"text":"password"}
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="New Password"
                                            name="newPassword"
                                            inputProps={{ 'aria-label': 'new_password' }}
                                            value={formik.values.newPassword}
                                            onChange={formik.handleChange} 
                                        />
                                        <IconButton onClick={()=>handleShowPass("new", !showPass.new)}>{showPass.new?<HidePassI/>:<ShowPassI  /> }</IconButton >

                                    </Paper>
                                    {formik.touched.newPassword && <FormHelperText sx={{pl:"1rem",  wordBreak:"1"}} variant='filled' error>{formik.errors.newPassword}</FormHelperText>}
                                </Stack>

                                <Stack spacing={0.5}>
                                    <Paper 
                                        component="div"
                                        sx={{ p: '6px 8px', 
                                            display: 'flex', 
                                            alignItems: 'center' , 
                                            borderRadius: '8px', 
                                            boxShadow: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword) ?"0px 0px 5px 2px #ff000069" : "0px 0px 5px 2px #0000001f", 
                                            color: formik.touched.confirmPassword && Boolean(formik.errors.newPassword) ? "#ff000069":'inherit',
                                        }}
                                    >
                                        <Avatar src={confPass} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />
                                        <InputBase
                                        type={showPass.confirm?"text":"password"}
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        inputProps={{ 'aria-label': 'confirm_password' }}
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange} 
                                        />
                                        <IconButton onClick={()=>handleShowPass("confirm", !showPass.confirm)}>{showPass.new?<HidePassI/>:<ShowPassI  /> }</IconButton >

                                    </Paper>
                                    {formik.touched.confirmPassword && <FormHelperText sx={{pl:"1rem",  wordBreak:"1"}} variant='filled' error>{formik.errors.confirmPassword}</FormHelperText>}
                                </Stack>

                                
                                <LoadingButton  size='large' loadingPosition="center" variant="contained" color="primary" type="submit" loading={profileUpdate.loading}>
                                    Change
                                </LoadingButton>
                            </Stack>
                        </form>
                        }


                        

                        {!passVerifyStats.success&&
                        <LoadingButton onClick={(e)=>verifyPassFn(e, oldPassword)} loadingPosition='center' loading={passVerifyStats.loading}  size='large' variant="contained" color="primary">
                            Verify
                        </LoadingButton>
                        }
                    </Stack>
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

const SupportModal = ({open, setOpen})=>{

    const handleClose=()=>{
        setOpen(false);
    }

    const supportDetails = {
        email:"support@socializer.com",
        number:"+919893010795",
        address:"Lorem ipsum dolor"
    }


    return (
        <Fragment>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{background:'transparent'}}
                maxWidth={"xs"}
            >
                <DialogTitle sx={{backgroundColor:"#1f5077"}}>
                    <Stack alignItems={'center'} sx={{width:"100%", maxWidth:"100%"}} direction={'row'} spacing={{xs:3, sm:4}}>
                        <Avatar src={support} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />
                        <Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}} >Support</Typography>
                        <Box flexGrow={{xs:0.3, sm:1}}  />
                        <IconButton onClick={handleClose}><CloseIcon  sx={{fontSize:{xs:24,sm:32}, color:"#fff"}} /></IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers sx={{backgroundColor:"#f1f9ff"}}>
                    <Stack spacing={2}>
                    <Card sx={{ width:"100%",  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={<Typography color="white.main" sx={{typography:{xs:"caption", sm:"subtitle1"}, wordBreak:"break-all"}}><Link underline='none' href={`mailto:${supportDetails.email}`} color="white.main">{supportDetails?.email}</Link> </Typography>}
                            avatar={<Avatar src={emailIcon}  variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />}
                        />
                    </Card>

                    <Card sx={{ width:"100%",  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={<Typography color="white.main" sx={{typography:{xs:"caption", sm:"subtitle1"}, wordBreak:"break-all"}}><Link underline='none'  href={`tel:${supportDetails.number}`} color="white.main">{supportDetails?.number}</Link> </Typography>}
                            avatar={<Avatar src={phoneIcon} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />}
                        />
                    </Card>

                    <Card sx={{ width:"100%",  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={<Typography color="white.main" sx={{typography:{xs:"caption", sm:"subtitle1"}, wordBreak:"break-all"}}>{supportDetails?.address}</Typography>}
                            avatar={<Avatar src={addressIcon} variant="square" sx={{width:{xs:30, sm:38}, height:{xs:30, sm:38}}} />}
                        />
                    </Card>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

const SettingsComp = () => {

    const {user} = useSelector(s=>s.user)
    const {profileUpdate} = useSelector(s=>s.user)


    const [checked, setChecked] = useState(true)
    const [openPass, setOpenPass] = useState(false)
    const [openSupport, setOpenSupport] = useState(false)

    const {emailVerification} = useSelector(state=>state.user.register);
    const [openVerifyModal, setOpenVerifyModal] = useState(emailVerification.sent)
    const { enqueueSnackbar } = useSnackbar();


    const dispatch = useDispatch();

    const [userDetails, setUserDetails] = useState({
        name:user?.name,
        email:user?.email,
        accountType:user?.accountType
    })

    useEffect(() => {
      if(user?.accountType==="private") setChecked(true);
      else if(user?.accountType==="public") setChecked(false);
    }, [user.accountType])
    
          
    const debouncedDispatch = debounce((newData) => {
        dispatch(profile_update(newData));
      }, 500); // adjust the debounce delay as per your requirement
    

    const handleAccChange=()=>{
        setChecked(!checked);

        const newAccountType = checked ? "public" : "private";
        setUserDetails({
          ...userDetails,
          accountType: newAccountType
        });
      
        const newData = new FormData();
        newData.append("data", newAccountType);
        newData.append("type", "accType");
        debouncedDispatch(newData);
    }

    console.log(userDetails.accountType);


    const [edit, setEdit] = useState({
        name:false,
        email:false
    })

    const handleEdit=(type, action)=>{
        setEdit({...edit, [type]:true})
        if(action==="update") handleSave(type)
    }

    const handleSave=(type)=>{
        if(type==='name'){
            
            const newData = new FormData();
            newData.append("data",userDetails.name );
            newData.append("type", "name");
    
            dispatch(profile_update(newData));
        }

        if(type==='email'){
            const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
            if(userDetails.email=== user.email || userDetails.email==="" || !regexExp.test(userDetails.email)){
                return;
            }
            
                const digits = '0123456789';
                let tempCode="";
                for (let i = 0; i<5; i++ ) {
                    tempCode += digits[Math.floor(Math.random() * 10)];
                }

                const data = {
                    name:user.name,
                    email:userDetails.email,
                    code:tempCode
                }
                dispatch(sendEmail(data))
                setOpenVerifyModal(true);
        }
    }

    useEffect(() => {
      if(emailVerification.verification.completed){
        dispatch(clearMsg("V_success"));
        setOpenVerifyModal(false);
        handleEmailUpdate()
    }
    }, [emailVerification.verification.completed]);

    useEffect(() => {
        const option = {
            anchorOrigin:{
              vertical:"bottom",
              horizontal:"left",
            },
            variant:"error",
            autoHideDuration: 3000
          }
          if(profileUpdate.error){
            enqueueSnackbar(profileUpdate.message, option)
            dispatch(clearMsg("Pro_Up"))
          }
          
    }, [profileUpdate.error]);

    useEffect(() => {
        const option = {
            anchorOrigin:{
              vertical:"bottom",
              horizontal:"left",
            },
            variant:"success",
            autoHideDuration: 3000
          }
          if(profileUpdate.success){
            enqueueSnackbar(profileUpdate.message, option)
            dispatch(clearMsg("Pro_Up"))
          }
    }, [profileUpdate.success]);

    
    
    

    const handleEmailUpdate=()=>{
        const newData = new FormData();
        newData.append("data",userDetails.email );
        newData.append("type", "email");

        dispatch(profile_update(newData));
    }



    const handleChange = (type, value)=>{
        setUserDetails({...userDetails, [type]:value});
    }



  return (
    <Fragment>
        <Container maxWidth={"lg"}  >
            <Grid spacing={3} container width={"100%"} justifyContent="center" height="100vh" alignContent={'center'} alignItems={'flex-strt'} mt="0" ml="0">

                <Grid sx={{pl:"0px !important"}} item md={6} xs={12}>
                    <Card sx={{ width:{md:"30vw", xs:"auto"},  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={edit.name?<InputBase type="text" onChange={(e)=>handleChange('name', e.target.value)}  sx={{color:"white.main", borderBottom:"2px solid #fff" }} fullWidth defaultValue={user?.name} /> : <Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}}>{user?.name}</Typography>}
                            avatar={<Avatar src={nameIcon} variant="square" size="large" />}
                            action={<IconButton>{edit.name?<CheckIcon  onClick={()=>handleEdit("name", "update")}   sx={{fontSize:"1.5rem", color:"#fff"}} />:<Edit  onClick={()=>handleEdit("name", "edit")}   sx={{fontSize:"1.5rem", cursor:"pointer", color:"#fff"}} />}</IconButton >}
                        />
                    </Card>
                </Grid>

                <Grid sx={{pl:"0px !important"}} item md={6} xs={12}>
                    <Card sx={{ width:{md:"30vw", xs:"auto"},  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={edit.email?<InputBase type="email" onChange={(e)=>handleChange('email', e.target.value)}  sx={{color:"white.main", fontFamily:"Ubuntu", fontSize:"1rem", borderBottom:"2px solid #fff" }} fullWidth defaultValue={user?.email} /> : <Typography sx={{overflow:"hiden", wordBreak:"break-all", typography:{xs:"body1", sm:"h6"}}} color="white.main"> {user?.email} </Typography>}
                            avatar={<Avatar src={emailIcon} variant="square" size="large" />}
                            action={<IconButton>{edit.email?<CheckIcon  onClick={()=>handleEdit("email", "update")}   sx={{fontSize:"1.5rem", color:"#fff"}} />:<Edit  onClick={()=>handleEdit("email", "edit")}   sx={{fontSize:"1.5rem", cursor:"pointer", color:"#fff"}} />}</IconButton >}
                        />
                    </Card>
                </Grid>

                <Grid sx={{pl:"0px !important"}} item md={6} xs={12} >
                    <Card  sx={{ width:{md:"30vw", xs:"auto"},  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={checked?<Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}} >Private</Typography>:<Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}} >Public</Typography>}
                            avatar={<Avatar src={checked?privateI:publicI} variant="square" size="large" />}
                            action={<Switch
                                checked={checked}
                                onChange={handleAccChange}
                                color="white"
                            />}
                        />
                    </Card>
                </Grid>

                <Grid sx={{pl:"0px !important"}} item md={6} xs={12} >
                    <Card sx={{ width:{md:"30vw", xs:"auto"},  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                            <CardHeader 
                                title={<Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}}>Change Password</Typography>}
                                avatar={<Avatar src={changePass} variant="square" size="large" />}
                                action={<IconButton><GoTo  onClick={()=>setOpenPass(true)}   sx={{fontSize:"1.8rem", color:"#fff"}} /></IconButton >}
                            />
                    </Card>
                </Grid>
                <Grid sx={{pl:"0px !important"}} item md={6} xs={12}>
                    <Card sx={{ width:{md:"30vw", xs:"auto"},  backgroundColor:"#1f5077", borderRadius:"15px"}}>
                        <CardHeader 
                            title={<Typography color="white.main" sx={{typography:{xs:"body1", sm:"h6"}}} >Contact Support</Typography>}
                            avatar={<Avatar src={support} variant="square" size="large" />}
                            action={<IconButton><GoTo  onClick={()=>setOpenSupport(true)}   sx={{fontSize:"1.8rem", color:"#fff"}} /></IconButton >}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Container>

        <PassUpdateMod open={openPass} setOpen={setOpenPass} />
        <EmailVerify name={user.name} email={userDetails.email} open={openVerifyModal} setOpen={setOpenVerifyModal} />
        <SupportModal open={openSupport} setOpen={setOpenSupport} />
    </Fragment>
  )
}

export default SettingsComp