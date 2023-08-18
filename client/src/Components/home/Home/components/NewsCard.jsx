import React, { useEffect } from 'react'
import { Fragment } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { getNews } from '../../../../Redux/Slice/utilSlice';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom'

const NewsLoader = ()=>{
  return(
    <Fragment>
      <Card elevation={2} sx={{ maxWidth: "100%" }}>
         <Skeleton variant="rectangular" width={'100%'} height={150} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <Skeleton variant='text' />
            <Skeleton variant='text' />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Skeleton variant='text' />
            <Skeleton variant='text' />
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">
            <Skeleton variant="rectangular"/>
          </Button>
        </CardActions>
      </Card>
    </Fragment>
  )
}

const NewsCard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNews())
  }, [dispatch]);

  const {news}=useSelector(s=>s.utils)
  
  const {data, loading} = news

  return (
    <Fragment>
     {loading?(<NewsLoader />):(
        <Card elevation={2} sx={{ maxWidth: "100%" }}>
          <CardMedia
            component="img"
            alt="image"
            height="150"
            image={data.urlToImage}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.description}
            </Typography>
          </CardContent>
          <CardActions>
          <Link target='_blank' to={{pathname:data.url}}> <Button size="small">Learn More</Button></Link>
          </CardActions>
        </Card>
     )}
    </Fragment>
  )
}

export default NewsCard