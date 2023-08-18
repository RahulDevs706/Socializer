import { Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { Fragment } from 'react'
import BgImg from "../../../Images/logo.png"
import LoginComponent from "./LoginComponent.jsx"

const LoginSignup = () => {

  const style= {
    backgroundImage: `url(${BgImg})`,
    backgroundRepeat:'no-repeat',
    backgroundPosition:'center',
    backgroundSize:'contain'
  }

  return (
    <Fragment>
      <Container maxWidth="lg">
        <Grid  container sx={{height:'80vh'}} >
          <Grid item xs={12} md={5.5}>
              <Stack sx={{display:'flex', justifyContent:'center', alignItems:"flex-start", height:'100%', mt:{xs:'10%', md:"none"}}}>
                <Typography color='primary' variant="h2" sx={{fontWeight:"500", fontFamily:"Ubuntu"}} component='div'>
                  Socializer
                </Typography>
                <Typography variant={'h4'} component='p'>
                  Keep socializing with your loved ones
                </Typography>
              </Stack>
          </Grid>
          <Grid flexShrink style={style} item xs={12} md={6.5} sx={{display:'flex', justifyContent:'center', alignItems:"flex-start", height:'100%'}} >
            <LoginComponent />
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  )
}

export default LoginSignup