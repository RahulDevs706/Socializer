import { Avatar, Box, Divider, Skeleton, Stack, Typography } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWeather } from '../../../../Redux/Slice/utilSlice'
import LocationOffIcon from '@mui/icons-material/LocationOff';
import NewsCard from './NewsCard'
import FriendSugg from "../../../Friends/FreindSuggstionComp";



const RightBar = () => {
  const boxStyle={
    bgcolor:"#1f507755",
    borderRadius:" 17px 0 0 17px", 
    height:"100vh",
    // boxShadow:"-7px 11px 7px 4px #1f50774d",
    position:"sticky",
    top:0
  }










  return (
    <Fragment>
        <Box alignItems='center' sx={boxStyle}>
          <Stack spacing={4}>
            <Box>
              <FriendSugg />
            </Box>
            <Box>
              <NewsCard />
            </Box>
          </Stack>
        </Box>
    </Fragment>
  )
}

export default RightBar