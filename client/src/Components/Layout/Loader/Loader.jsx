import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';

export default function Loader() {
  return (
    <Box sx={{ display: 'flex', width:'100vw', height:"100vh", justifyContent:"center", alignItems:"center", maxWidth:"100%" }}>
      <Stack sx={{ display: 'flex', justifyContent:"center", alignItems:"center" }}>
        <CircularProgress />
        <Typography color="primary" variant='body1'>
            Hold on, we are just there...!
        </Typography>
      </Stack>
    </Box>
  );
}