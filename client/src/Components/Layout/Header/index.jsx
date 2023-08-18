import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ExploreIcon from '@mui/icons-material/Explore';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import {useDispatch, useSelector} from "react-redux";
import { clearMsg, logoutUser } from '../../../Redux/Slice/userSlice';
import { Autocomplete, Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchAction } from '../../../Redux/Slice/utilSlice';
import NotificationModal from './NotificationMenu';
import io from 'socket.io-client'

const socket = io("http://192.168.1.6:3001/", {
    transports:['websocket']
})

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '45ch',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.3, 1.3, 1.3, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '45ch',
    },
  },
}));



 const Header = ()=>{
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {user} = useSelector(state=>state.user)
  const {logout} = useSelector(state=>state.user)

  const handleProfile=()=>{
    navigate(`/profile/${user._id}`)
  }

  const location = useLocation();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    navigate(`/profile/${user._id}`)
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  React.useEffect(() => {
    if(logout.success){
      navigate("/");
      dispatch(clearMsg('logout'))
    }
    if(logout.error){
      dispatch(clearMsg('logout'))
    }
  }, [logout.success, logout.error, dispatch, navigate])
  

  const handleLogOut = ()=>{
    dispatch(logoutUser());
  }

  const handleExplore = ()=>{
    navigate('/explore')
}

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogOut}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton onClick={handleExplore} size="large" color="inherit">
            <ExploreIcon />
        </IconButton>
        <p>Explore</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          onClick
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon  />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={handleProfile}
        >
          <Avatar sizes='small' src={user?.profileImg?.url} alt={user?.fName} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const {notification} = useSelector(s=>s.user)
  

  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const openNotificationMenu = Boolean(notificationAnchor);

  const handleNotificationBtnClick = (event)=>{
    setNotificationAnchor(event.currentTarget);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{p:"0.6% 0"}} position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, cursor:"pointer"}}
            fontFamily="Ubuntu"
            onClick={()=>navigate("/")}
          >
            Socializer
          </Typography>
          <Box sx={{ flexGrow:0.2 }} />

          {/* <SearchComponent /> */}

          <Box sx={{ flexGrow:2 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton onClick={handleExplore} size="large" aria-label="Mail" color="inherit">
                <ExploreIcon fontSize='large' />
            </IconButton>
            <IconButton size="large" aria-label="Mail" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon fontSize='large' />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="Notification"
              color="inherit"
              onClick={handleNotificationBtnClick}
              aria-controls={openNotificationMenu ? 'NotificationMenu' : undefined}
              aria-haspopup="true"
              aria-expanded={openNotificationMenu ? 'true' : undefined}
            >
              <Badge badgeContent={notification.count} color="error">
                <NotificationsIcon fontSize='large' />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="Account"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
            <Avatar sizes='small' src={user?.profileImg?.url? user.profileImg.url :'/ProfileImg' } alt={user?.fName} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <NotificationModal open={openNotificationMenu} anchor={notificationAnchor} setAnchor={setNotificationAnchor} />
    </Box>
  );
}

export default Header
