import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography, Zoom } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
import ArrowBack from '@mui/icons-material/ArrowBack';
import CommentCard from './CommentCard';
import { Box } from '@mui/system';
import {useDispatch, useSelector} from "react-redux";
import { clearPostMsg, getCommentsPostSingle } from '../../../../Redux/Slice/postSlice';
import CreateComment from "./CreateComment.jsx"
import { useSnackbar } from 'notistack';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const CommentModal = ({open, setOpen, commentCreatedBy, id}) => {

  const dispatch = useDispatch();
  const {get} = useSelector(s=>s.post.postComments)


  useEffect(() => {
    if(open){
      dispatch(getCommentsPostSingle(id))
    }
  }, [id, dispatch, open]);




  return (
    <Fragment>
      <Dialog TransitionComponent={Transition} fullWidth maxWidth='sm' open={open}>
        <DialogTitle>
          <Stack alignItems='center' direction='row'>
              <IconButton onClick={()=>setOpen(false)}>
                  <ArrowBack sx={{fontSize:"1.5rem"}} />
              </IconButton>
              <Typography variant="body1" component={'p'}>
                  Comments
              </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p:0}} dividers>
            {
              get.comments?.length === 0? (
              <Box width="100%" padding="10rem 0" color="#bbb" textAlign="center">
                No Comments Yet
              </Box>):
              <Box>
                <Stack  padding="1.5rem 2rem" spacing={2}>
                  {get.comments?.map(comment=>(
                    <CommentCard commentCreatedBy={commentCreatedBy} key={comment._id} postId={id} commentId={comment._id} txt={comment.txt} at={comment.at} by={comment.by} />
                  ))}
                </Stack>
              </Box>
            }
        </DialogContent>
        <DialogActions sx={{ p:0}}>
          <Box position={"sticky"} bottom="0" width="100%" bgcolor={"#ddd"}>
            <CreateComment id={id} />
          </Box>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default CommentModal