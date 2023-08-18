import styled from '@emotion/styled'
import { Avatar, Button, IconButton, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { getSuggestions } from '../../../../Redux/Slice/userSlice'
import _ from "lodash";

const NavBox = styled(Button)(({theme})=>({
  borderRadius:"0 10px 10px 0",
  width:'100%',
  padding: theme.spacing(2, 0),
  margin:theme.spacing(1, 0),
  cursor:'pointer',
  color:"white",
  display:'flex',
  alignItems:'center',
  fontSize:"large",
  fontFamily:"Ubuntu",
  '&:hover':{
    backgroundColor:"#1f5077"
  }
}))

const LeftBar = () => {
 const {user, isLoggedIn} = useSelector(s=>s.user)
  const boxStyle={
    bgcolor:"#1f507735",
    borderRadius:"0 17px 17px 0", 
    height:"110vh",
    // boxShadow:"7px 11px 7px 4px #1f507724",
    backdropfilter:"blur(5px)",
    position:"sticky",
    top:0
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [bgColor, setBgColor] =useState("")

  const dispatch = useDispatch();

  const handleHome = ()=>{
    navigate("/")
  }

  const handleExplore = ()=>{
    navigate("/explore")
  }

  const handleFriends = ()=>{
    navigate('/profile/friends')
  }

  const handleSettings = ()=>{
    navigate('/profile/settings')
  }

  const handleProfile=()=>{
    navigate(`/profile/${user._id}`)
  }


  const navArray = [
    {
      text:"Home",
      url:"/",
      icon:<HomeIcon />,
      action:handleHome
    },
    {
      text:"Explore",
      url:"/explore",
      icon:<ExploreIcon />,
      action:handleExplore
    },    
    {
      text:"Friends",
      url:"/profile/friends",
      icon:<GroupIcon />,
      action:handleFriends
    },
    {
      text:"Settings",
      url:"/profile/settings",
      icon:<SettingsIcon />,
      action:handleSettings
    }
  ]

  console.log(location.pathname);

  const [currentLocation, setCurrentLocation] = useState({
    latitude:"",
    longitude:""
  });
  
  useEffect(() => {
    if (navigator.geolocation) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(
        (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        },
        (error) => {
        console.error('Error getting user location:', error.message);
        }
    );
    } else {
    console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  
  // getting city state and country from lat an long
  const [address, setAddress] = useState();
  
  useEffect(() => {
    const getAddressFromCoordinates = async () => {
    try {
        const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLocation?.latitude}&lon=${currentLocation?.longitude}&zoom=18&addressdetails=1`
        );
  
        if (response.data && response.data.address) {
  
        setAddress({
            city:response.data.address.city,
            state:response.data.address.state,
            country:response.data.address.country
        });
        } else {
        setAddress('Address not found');
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        setAddress('Error fetching address');
    }
    };
  
    if(currentLocation.latitude && currentLocation.longitude){
        getAddressFromCoordinates();
    }
  }, [currentLocation.latitude, currentLocation.longitude]);
  
  const delayedGetSuggestions = _.debounce((dispatch, address) => {
    dispatch(getSuggestions(address));
  }, 1000); // Adjust the debounce interval as needed
  
  

  return (
    <Fragment>
        <Box alignItems='center' sx={boxStyle}>
          <Stack height={"100%"} justifyContent='space-between' alignItems='center' spacing={5}>
            {/* Profile Segment */}
            <Stack  width="100%" justifyContent='space-between' alignItems='center' spacing={4}>
              <Box alignItems='center' sx={{m:"8% 8%"}}>
                <IconButton onClick={handleProfile}>
                  <Avatar sx={{fontSize:'5rem', width:{xs:"10vw", sm:"10vw",  md:"12vw"}, height:{xs:"10vw", sm:"10vw", md:"12vw"}}} src={user?.profileImg?.url} alt={user?.fName} />
                </IconButton>
                <Typography align='center' variant="h4" color='#1f5077' fontFamily="Ubuntu">
                  {user.name}
                </Typography>
              </Box>
              {/* Nav Buttons */}
              <Box width='100%'>
                {navArray.map((item, idx)=>{
                return(
                  <NavBox sx={item.url===location.pathname ? {backgroundColor:"#1f5077"}:{backgroundColor:"#1f507795"}} onClick={item.action} key={idx} variant='contained' >
                    <Box flexGrow={0.2} />
                    {item.icon}
                    <Box flexGrow={0.3} />
                      {item.text}
                    <Box flexGrow={1} />
                  </NavBox>
                )})}
              </Box>
            </Stack>
            {/* Footer */}
            <Box mt={2} width='100%' justifySelf={'flex-end'}>
            <Box flexGrow={1} />
              <Box width="100%">
                  <Typography gutterBottom variant='subtitle1'  textAlign='center' color="primary">
                    Made with  <FavoriteIcon color="error" fontSize="subtitle1" /> Socializer<br />
                  </Typography>
                  <Typography variant='subtitle2'  textAlign='center' color="primary">
                    &copy; Rahul Singh, 2022
                  </Typography>

              </Box>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#1F5077" fill-opacity="1" d="M0,128L48,106.7C96,85,192,43,288,53.3C384,64,480,128,576,160C672,192,768,192,864,181.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </Box>
          </Stack>
        </Box>
    </Fragment>
  )
}

export default LeftBar