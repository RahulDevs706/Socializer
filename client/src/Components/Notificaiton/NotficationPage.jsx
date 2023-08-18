import { Box, Button, Container, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { NotificationCard } from '../Layout/Header/NotificationMenu'
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationFromDB, clearAllNotificaiton, clearMsg, filterNotification, setNotificationCount } from '../../Redux/Slice/userSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterMenuOption = ({anchorEl, handleClose, open, notifications})=>{

    const dispatch = useDispatch();

    const handleFilter = (type)=>{
        const data = {
            type, notifications
        }
        dispatch(filterNotification(data));
    }

  

    return (
        <Fragment>
            <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={()=>handleFilter("unread")}>
            Unread
        </MenuItem>
        <MenuItem onClick={()=>handleFilter("read")}>
            Read
        </MenuItem>
      </Menu>
        </Fragment>
    )
}

const NotificationOptions = ({anchorEl, handleClose, open, notifications})=>{


    const [filterMenuAnchor, setFilterMenuAnchor] = React.useState(null);
    const openFilterMenu = Boolean(filterMenuAnchor);
    const dispatch = useDispatch();


    const handleFilterMenu_open = (event) => {
      setFilterMenuAnchor(event.currentTarget);
    };

    const handleFilterMenu_close = () => {
      setFilterMenuAnchor(null);
    };

    const handleClear = ()=>{
        dispatch(clearAllNotificaiton())
    }

    return (
    <Fragment>
        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >

        <MenuItem onClick={handleFilterMenu_open}>
          <ListItemIcon>
            <FilterListIcon />
          </ListItemIcon>
          Filter
        </MenuItem>

        <MenuItem onClick={handleClear}>
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
            Clear All
        </MenuItem>

      </Menu>
      <FilterMenuOption open={openFilterMenu} anchorEl={filterMenuAnchor} handleClose={handleFilterMenu_close} notifications={notifications} />
    </Fragment>
)
}

const NotficationPage = () => {
    const dispatch = useDispatch();

    // React.useEffect(()=>{
    //   dispatch(addNotificationFromDB());
    // },[dispatch]);


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
  
    const {notification} = useSelector(s=>s.user)
    // console.log(notification.notifications);

    const [notificationArray, setNotificationArray] = useState([]);

    // () => {
    //   if (notification && notification.notifications) {
    //     return [...notification.notifications];
    //   }
    //   return [];
    // }
      useEffect(()=>{
        if(notification.notifications){
          setNotificationArray(notification.notifications);
        }
      }, [notification.notifications]);
      
    //   useEffect(() => {
    //     if (notification.fromSocket && notification.fromSocket.notification && Array.isArray(notification.fromSocket.notification) && notification.fromSocket.notification.length > 0) {
    //       setNotificationArray((prevArray) => {
    //         const tempArray = notification.fromSocket.notification.map((n) => ({ ...n }));
    //         return [...tempArray, ...prevArray];
    //       });
    //     }
    //   }, [notification.fromSocket]);
    
  
    // if (notification.fromSocket?.notification && Array.isArray(notification.fromSocket.notification) && notification.fromSocket.notification.length > 0) {
    //   const tempArray = [];
    //   notification.fromSocket.notification.forEach(n => {
    //     const newNotification = { ...n };
    //     tempArray.push(newNotification);
    //   });
    //   setNotificationArray([...tempArray, ...notificationArray]);
    // }

    useEffect(() => {
      if(notification.filter.called){
        setNotificationArray( notification.filter.filteredData);
      }
      return()=>{
        dispatch(clearMsg("Fil_N"))
      }
    }, [notification.filter.called, dispatch, notification.filter.filteredData])
    
    console.log(notificationArray);


    
  
  return (
    <Fragment>
        <Container maxWidth="sm">
            <Box height={"100vh"} bgcolor={'white'}>
                <Stack maxHeight={'100%'} >
                    <Box sx={{p:"0.5rem 1rem", bgcolor:"#1F5077", position:"relative"}}>
                        <Stack direction={'row'}>
                            <Typography sx={{typography:{xs:'h5', sm:"h4"}, fontWeight:"bold"}} color="#fff" > Notifications </Typography>
                            <Box flexGrow={1} flexItem />
                            {notificationArray.length>0 && <IconButton onClick={handleClick}><MoreVertIcon color="white" /></IconButton>}
                        </Stack>
                    </Box>
                    {
                        notificationArray.length>0?<Box bgcolor={"white"}>
                        {notificationArray?.map(not=>(
                            <NotificationCard id={not?._id} sentBy={not?.user} post={not?.payload?.post&& not?.payload?.post} text={not?.message} createdAt={not.createdAt}  type={not?.type} seen={not?.seen} />
                        ))}
                    </Box>:
                    <Box width={'100%'} height={'100vh'} maxHeight={'100%'} justifyContent={'center'} display={'flex'} alignItems="center">
                        <Typography color={"#aaa"}>No notification avaialable</Typography>
                    </Box>
                    }
                </Stack>
                
            </Box>
        </Container>
        <NotificationOptions notifications={notification.notifications} open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Fragment>
  )
}

export default NotficationPage