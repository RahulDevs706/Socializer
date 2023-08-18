import { Avatar, Card, CardContent, CardHeader, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, getCommentsPostSingle } from '../../../../Redux/Slice/postSlice';


const CommentCard = ({txt, by, at, postId, commentId, commentCreatedBy}) => {


  const dispatch = useDispatch();
  const {delete:commentDelete} = useSelector(s=>s.post.postComments)
  const {user} = useSelector(s=>s.user);


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null)
  };

  useEffect(() => {
    if(commentDelete.success){
      dispatch(getCommentsPostSingle(postId))
    }
  }, [commentDelete, dispatch, postId]);

  const handleDelete = ()=>{
    dispatch(deleteComment({id: postId, commentId: commentId}))
  }

  const createdAt = moment(at).calendar();


  const cCardStyle = {  
    width:{xs:"95%", sm:"65%"},
    boxShadow:"0px 0px 13px 3px #e5e5e5",
    borderRadius:"17px"
  }

  return (
    <Fragment>
      <Card sx={cCardStyle}>
        <CardHeader
          sx={{p:"0.5rem"}}
          avatar={
              <Avatar src={by.profileImg.url} alt={by.name} size="large" aria-label="avatar" />
          }
          action={
              (by._id===user._id || commentCreatedBy===user._id) && (<IconButton onClick={handleClick} aria-label="options">
                  <MoreVertIcon />
              </IconButton>)
          }
          title={by.name}
          subheader={createdAt}
        />
        <CardContent sx={{p:"0.5rem 1rem"}}>
          <Typography variant="body2">
            {txt}
          </Typography>
        </CardContent>
      </Card>


      <Menu
        id="Comment Option"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disabled={commentDelete.loading} onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Fragment>
  )
}

export default CommentCard