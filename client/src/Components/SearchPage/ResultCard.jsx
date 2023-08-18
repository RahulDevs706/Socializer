import React from 'react'
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@mui/material'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
// import {makeStyles} from "@material-ui/core/styles"
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';


  const StyledAvatar = styled(Avatar)`
  ${({ theme }) => `
  cursor:pointer;
  border:2px solid #1F5077;
  transition: ${theme.transitions.create(['transform', 'border'], {
    duration: theme.transitions.duration.shorter,
  })};
  &:hover {
    transform: scale(1.1);
    border:none;
  }
  `}`

  const SendButton = styled(SendIcon)`
  ${({ theme }) => `
  cursor:pointer;
  transition: ${theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shorter,
  })};
  &:hover {
    transform: scale(1.2);
  }
  `}`
  const AddFriend = styled(PersonAddAlt1Icon)`
  ${({ theme }) => `
  cursor:pointer;
  transition: ${theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shorter,
  })};
  &:hover {
    transform: scale(1.2);
  }
  `}`
  const RemoveFriend = styled(PersonRemoveAlt1Icon)`
  ${({ theme }) => `
  cursor:pointer;
  transition: ${theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shorter,
  })};
  &:hover {
    transform: scale(1.2);
  }
  `}`

  

const ResultCard = ({name, location, img, bio,id}) => {
    // const classes = useStyles();
    // const [exit, setExit] = React.useState(false);
    const navigate = useNavigate();

    const handleProfile=(id)=>{
      navigate(`/profile/${id}`)
    }


    const modBio = bio?.length>=50?`" ${bio?.substring(0, 50)}..."`:`" ${bio} "`;

  return (
    <Card elevation={6} sx={{  borderRadius:"3rem", maxWidth:"19rem", margin:"auto"}}>
        <CardMedia>
            <Box  display="flex" justifyContent={"center"} p={3}>
                <Box flexShrink={0.75} flexItem />
                    <StyledAvatar onClick={()=>{handleProfile(id)}} sx={{height:190, width:190, flexShrink:0.5 }} src={img} alt={name}/>
                <Box flexShrink={0.75} flexItem/>
            </Box>
        </CardMedia>
        <CardContent>
            <Typography variant='heading1' component="h2" textAlign={"center"} color="primary">{name}</Typography>
            <Typography gutterBottom variant='body1' component="h5"  textAlign={"center"} color="primary">{location}</Typography>
            <Typography gutterBottom variant='body2' component="p" color="primary.light"  textAlign={"center"}>{modBio}</Typography>
        </CardContent>
        <CardActions sx={{bgcolor:"#1F5077", display: "flex", justifyContent:"center", alignItems:"center"}}>     
                <AddFriend sx={{fontSize:"1.75rem", cursor:"pointer", color:"#fff"}}  />
                <Box flexGrow={0.75} maxWidth={90} flexItem />
                <SendButton color="gray" sx={{fontSize:"1.75rem", cursor:"pointer",  color:"#fff"}} />
        </CardActions>
    </Card>

  )
}

export default ResultCard