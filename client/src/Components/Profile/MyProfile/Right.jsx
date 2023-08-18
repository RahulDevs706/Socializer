import { Button, Card, CardActions, CardHeader, Divider, Grid, Menu, MenuItem, IconButton, ImageList, ImageListItem, Stack, Typography } from '@mui/material'
import moment from 'moment'
import React, { useState } from 'react'
import { Fragment } from 'react'
import PostCard from '../../Posts/Post/PostCard'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GridOnIcon from '@mui/icons-material/GridOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom'
import {HiSortAscending, HiSortDescending} from "react-icons/hi"
import { useEffect } from 'react'

const asc = "ascend";
const des = "descend";
const most_L = "most_liked";
const most_C = "most_commented";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
            <>
                {children}
            </>
        )}
      </div>
    );
  }
  
  
  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }



const Right = ({posts}) => {

  const [allPosts, setAllPost] = useState(posts);
  const [sortType, setSortType] = useState(asc);

  const sortedPost_asc = posts && posts.slice().sort((p1, p2)=>{
    const p1_d = new Date(p1.createdAt);
    const p2_d = new Date(p2.createdAt);
    return p2_d-p1_d;
  });

  const sortedPost_most_liked = sortedPost_asc && sortedPost_asc.slice().sort((p1, p2)=>{
    const p1_L = p1.likedBy.length;
    const p2_L = p2.likedBy.length;
    return p2_L-p1_L;
  });

  

  const sortedPost_most_commented = sortedPost_asc && sortedPost_asc.slice().sort((p1, p2)=>{
    const p1_C = p1.comments.length;
    const p2_C = p2.comments.length;
    return p2_C-p1_C;
  });

  
  useEffect(() => {
    if(sortType===asc) setAllPost(sortedPost_asc);
    else if(sortType===des) setAllPost(posts);
    else if(sortType===most_L) setAllPost(sortedPost_most_liked);
    else if(sortType===most_C) setAllPost(sortedPost_most_commented);
  }, [sortType])

  const navigate = useNavigate()

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePost=(pId, cId)=>{
    navigate(`/profile/${cId}/${pId}`)
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handlePostOption_open = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [sortAnchorEl, setSortAnchorEl] = React.useState(null);
  const openSortMenu = Boolean(sortAnchorEl);
  const handleSortPost_open = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSortAnchorEl(null);
  };



  const handleSort=(type)=>{
    setSortType(type)

    handleClose();
  }





  return (
    <Fragment>
          <Stack spacing={2} display="flex" justifyContent="flexStart" alignItems="flexStart" >
            <Card>
                <CardHeader 
                    title={<Typography color="primary" variant="h5" component="p">Posts <Typography color="primary.light"  sx={{pl:1.2}} variant="h6" component="span">{posts?.length}</Typography></Typography>} 
                    action={<>
                      <IconButton disabled={posts && posts.length===0?true:false} onClick={handlePostOption_open}  aria-label="settings">
                          <MoreVertIcon color="primary" />
                      </IconButton>
                      <Menu
                        id="post-option"
                        aria-labelledby="post-option-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem fullWidth onClick={handleSortPost_open}>Sort</MenuItem>
                        <Menu 
                           id="sort-option"
                           aria-labelledby="sort-option-button"
                           anchorEl={sortAnchorEl}
                           open={openSortMenu}
                           onClose={handleClose}
                           anchorOrigin={{
                             vertical: 'top',
                             horizontal: 'right',
                           }}
                           transformOrigin={{
                             vertical: 'top',
                             horizontal: 'right',
                           }}
                        >
                            <MenuItem onClick={()=>handleSort(asc)} > <HiSortAscending/> Ascending(by date created)</MenuItem>
                            <MenuItem onClick={()=>handleSort(des)}> <HiSortDescending/> Descending(by date created)</MenuItem>
                            <MenuItem onClick={()=>handleSort(most_L)}> <FavoriteIcon sx={{color:"tomato"}}/> Most Liked</MenuItem>
                            <MenuItem onClick={()=>handleSort(most_C)}> <CommentIcon/> Most Commented</MenuItem>


                        </Menu>
                      </Menu>
                    </>}  
                />

                <Divider flexItem />
                <CardActions sx={{justifyContent:"center"}}>

                    <Tabs sx={{width:"100%"}} value={value} onChange={handleChange} variant="fullWidth" aria-label="Post View Type">
                        <Tab label={ <Typography display="flex" alignItems={'center'} justifyContent="center" variant="button"> <ViewDayIcon sx={{pr:3}} />  List </Typography>} {...a11yProps(0)} />
                        <Tab label={ <Typography display="flex" variant="button"> <GridOnIcon sx={{pr:3}} />  Grid </Typography> } {...a11yProps(1)} />
                    </Tabs>

                </CardActions>
            </Card>
                <TabPanel value={value} index={0}>
                    <Stack spacing={2}>
                        {allPosts?.map((item)=>{
                            const createdAt = moment(item?.createdAt).calendar();
                            return <PostCard createdBy={item.createdBy._id} likedBy={item.likedBy} key={item._id} id={item._id} avatarImg={item.createdBy.profileImg.url} name={item.createdBy.name} createdAt={createdAt} postImg={item?.postImg?.url} postText={item?.postText} comments={item.comments}   />
                        })}
                    </Stack>
                </TabPanel>
                
                <TabPanel value={value} index={1}>
                    <ImageList  sx={{ width: "100%"}} gap={8} cols={3} >
                        {allPosts?.map((item) => (
                            <ImageListItem onClick={()=>handlePost(item._id, item.createdBy._id)} sx={{cursor:'pointer'}} key={item._id}>
                                <img
                                    src={`${item?.postImg?.url}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item?.postImg?.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item?.postText}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </TabPanel>

          </Stack>
    </Fragment>
  )
}

export default Right