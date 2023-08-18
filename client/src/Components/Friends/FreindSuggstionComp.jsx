import { Box, Card, CardContent, CardHeader, Divider, IconButton, Stack } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import {FiRefreshCcw as Refresh} from "react-icons/fi"
import { useDispatch, useSelector } from 'react-redux'
import { clearMsg, getSuggestions } from '../../Redux/Slice/userSlice'
import axios from "axios";
import SuggestionCard from '../home/Home/components/SuggestionCard'
import _ from "lodash"
import Loader from '../Layout/Loader/Loader'

const FreindSuggstionComp = () => {
    
    const dispatch = useDispatch();

    const [compLoad, setCompLoad]=useState(true);
    
    // getting the current Location(lat and long);
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

    const {suggestions} = useSelector(s=>s.user.friendReq);
    const {isLoggedIn} = useSelector(s=>s.user);

    const [res, setRes] =useState([])


    useEffect(() => {
        setRes(suggestions?.friends?.slice(0, 3));
    }, [suggestions]);
    
    function handleRefresh() {

        dispatch(getSuggestions(address));
    }

    const {send} = useSelector(s=>s.user.friendReq);


    const delayedGetSuggestions = _.debounce((dispatch, address) => {
        dispatch(getSuggestions(address));
        setCompLoad(false);
      }, 100); // Adjust the debounce interval as needed

      useEffect(() => {
        if (send.success) {
            setCompLoad(true); // Set loading to true before fetching suggestions
            delayedGetSuggestions(dispatch, address)
            dispatch(clearMsg("FR_send"));
        }
    }, [address, dispatch, send.success]); 

    console.log(res);

    const isMounted = useRef(false);

    // Listen for changes in the address and trigger the debounced function
    useEffect(() => {
        if (isMounted.current && address && isLoggedIn) {
            setCompLoad(true); // Set loading to true before fetching suggestions
            delayedGetSuggestions(dispatch, address);
        }
    }, [address, dispatch, isLoggedIn]);
    
    
    // Set isMounted to true after the component is mounted
    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);
    
  
  

  return (
    <Fragment>
        <Card>
            <CardHeader 
                sx={{backgroundColor:"#1f5077", color:"#fff"}}
                title="Suggestions"
                action={<IconButton onClick={handleRefresh}>
                    <Refresh color="#fff" />
                </IconButton>}
            />
            <Divider />
            {/* <CardContent sx={{padding:0, paddingBottom:"0 !important"}}>
               {res.length>0?  
               <Stack>
                    {
                        res?.map(f=>{
                            return <SuggestionCard key={f._id} f={f} address={address}/>
                        })
                    }
                </Stack>:
                <Box display='flex' justifyContent='center' alignItems='center' width='100%' height="35vh" color="#aaa"> 
                </Box>}
            </CardContent> */}

            <CardContent sx={{padding:0, paddingBottom:"0 !important"}}>
                {compLoad ? (
                    <Box display='flex' justifyContent='center' alignItems='center' width='100%' height="35vh" color="#aaa">
                        <Loader/>                 
                    </Box>
                ) : (
                    <Stack>
                        {res.length > 0 ? (
                            res.map(f => (
                                <SuggestionCard key={f._id} f={f} address={address} />
                            ))
                        ) : (
                            <Box display='flex' justifyContent='center' alignItems='center' width='100%' height="35vh" color="#aaa">
                                No suggestions to show.
                            </Box>
                        )}
                    </Stack>
                )}
            </CardContent>
        </Card>
    </Fragment>
  )
}

export default FreindSuggstionComp