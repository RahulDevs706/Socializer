import { AppBar, Badge, Box, Container, Tab, Tabs, Typography } from '@mui/material';
import React, { Fragment, useEffect } from 'react'
import { RiUserShared2Fill as SentIcon, RiUserReceivedFill as GotIcon, RiUserFill as FriendIcon} from "react-icons/ri"
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg, loadUser } from '../../Redux/Slice/userSlice';
import FriendCard from './FriendCard';

function TabPanel(props) {
    const { children, value, load, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Fragment>
            {children}
          </Fragment>
        )}
      </div>
    );
  }

function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
}  
  

const FriendComp = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    const {user} = useSelector(s=>s.user);
    const {loading, success} = useSelector(s=>s.user.friendReq.accept_remove_cancel);

    const dispatch = useDispatch();

    useEffect(() => {
      if(success){
        dispatch(loadUser())
        dispatch(clearMsg("FR_Canc"))
      }
    }, [success])
    

    console.log(loading)

    const fList_size = user?.friendList?.length;
    const fReqSent_size = user?.friendReq?.sent?.length;
    const fReqGot_size = user?.friendReq?.got?.length;

    return (
      <Container sx={{pl:0, pr:0}} maxWidth={"sm"}>
        <Box sx={{ minHeight:"100vh", maxHeight:"100%", width: '100%', bgcolor:"white" }}>
            <AppBar sx={{boxShadow:"0px 3px 4px -1px rgb(0 0 0 / 20%), 0px 7px 5px 0px rgb(0 0 0 / 14%), 0px 7px 5px 0px rgb(0 0 0 / 12%)"}} position="static">
                <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="friends-page"
                centered
                >
                    <Tab sx={{p:1}} icon={<Badge badgeContent={fList_size} color="info"><FriendIcon fontSize={"1.25rem"} /></Badge>} label="Friend List" {...a11yProps(0)} />
                    <Tab sx={{p:1}} icon={<Badge badgeContent={fReqGot_size} color="error"><GotIcon fontSize={"1.25rem"} /></Badge>} label="Friend Request" {...a11yProps(1)} />
                    <Tab sx={{p:1}} icon={<Badge badgeContent={fReqSent_size} color="info"><SentIcon fontSize={"1.25rem"} /></Badge>} label="Request Sent" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel load={loading} value={value} index={0}>
                <Box>
                    {user?.friendList?.map(i=>(
                        <FriendCard f={i} iconType="list" />
                    ))}
                </Box>
            </TabPanel>
            <TabPanel  load={loading} value={value} index={1}>
                <Box>
                    {user?.friendReq?.got?.map(i=>(
                        <FriendCard f={i} iconType="got" />
                    ))}
                </Box>
            </TabPanel>
            <TabPanel  load={loading} value={value} index={2}>
                <Box>
                    {user?.friendReq?.sent?.map(i=>(
                        <FriendCard f={i} iconType="sent" />
                    ))}
                </Box>
            </TabPanel>
      </Box>
      </Container>
    );
  
  
}

export default FriendComp