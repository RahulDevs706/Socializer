import { Autocomplete, Avatar, Button, Card, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { Fragment } from 'react'
import ResultCard from "./ResultCard.jsx"
import {useDispatch, useSelector} from "react-redux";
import { searchAction } from '../../Redux/Slice/utilSlice.js';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import Loader from "../Layout/Loader/Loader"


const Result = ({ query}) => {

  const dispatch=useDispatch();

  const {search} = useSelector(s=>s.utils)
  const {user} = useSelector(s=>s.user)
  const [key, setKey] = useState(query);
  const [searchParams, setSearchParams] = useSearchParams();


  const [result, setResult] = useState(search.result);
  const keyword = searchParams.get("keyword");
  React.useEffect(()=>{
    setResult(search.result);
  },[search.result])

  console.log(result)

  const onlySpaces=(str) =>{
    return str?.trim().length === 0;
  }

  const filterOptions = [];

  // filling option for filter
  search?.result?.forEach(item=>{
    const loc = `${item.address.city}, ${item.address.state}, ${item.address.country}`;
    if(!filterOptions.includes(loc)){
      filterOptions.push(loc);
    }
  })

  const searchFunc = React.useCallback((q)=>{
    if(!onlySpaces(q)){
      dispatch(searchAction(q));
    }else{
      setResult([]);
    }
  }, [dispatch])

  const filterResults = (value)=>{
    const temp=search.result.filter(i=>{
      const loc = `${i.address.city}, ${i.address.state}, ${i.address.country}`;
      return value.includes(loc);
    })

    if(temp.length!==0){
      setResult(temp);
    }else{
      setResult(search.result)
    }
  }


  React.useEffect(() => {
    searchFunc(keyword)
  },[searchFunc, keyword]);  



  const handleSearch = (e)=>{
    searchFunc(e.target.value);
    setKey(e.target.value);
    setSearchParams({keyword:e.target.value});
  }

  var resText = "";
  if(keyword!=="" && keyword!==null){
    resText="No Results!!! You might have spelled it wrong or your friend is not on Socializer"
  }else{
    resText=""
  }

  const [openFilter, setOpenFilter] = useState(false);

  return (
    <Fragment>
        <Container maxWidth={"xl"} >
          <Container maxWidth={"md"}> {/* search bar */}
            <Stack direction={"column"} p={"8%"} >
              <Stack position={"sticky"} top={0} spacing={2} direction="row">
                <TextField sx={{backgroundColor:"white"}} placeholder="Search" value={key} fullWidth onChange={handleSearch}/>
                <Button disabled={!Boolean(query)} variant="contained" onClick={()=>setOpenFilter(!openFilter)} >
                  <FilterListIcon />
                </Button>
              </Stack>
              <Box display={openFilter?"block":"none"} p="1%">
                <Autocomplete
                  multiple
                  size="small"
                  limitTags={2}
                  options={filterOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Filter by location"
                      placeholder="Location"
                    />
                  )}
                  onChange={(e, option)=>filterResults(option)}
                />
              </Box>
            </Stack>
          </Container>

          <Divider flexItem />

          <Container maxWidth={"xl"}> {/* results */}
              {search.loading?(<Loader />):(
                <Box flexGrow={1} padding={2}>
                  <Grid container spacing={{ xs: 2, md: 4 }}>
                      {result?.length!==0?(result?.map(i=>
                      <Grid sx={{margin:{xs:"auto", md:"initial"}}} item xs={12} sm={6} md={4} lg={3} key={i._id}>
                        <ResultCard query={query} id={i._id} name={i.name} location={`${i.address.city}, ${i.address.state}, ${i.address.country}`} img={i.profileImg.url} bio={i.bio}  />
                      </Grid>
                      )):(
                        <Box padding={2} sx={{width:"100vw", height:"50vh"}} display="flex" justifyContent="center" alignItems="center">
                          <Typography variant="heading1" component="p" color="GrayText" > {resText} </Typography>
                        </Box>
                      )}
                  </Grid>
                </Box>)
              }
              
          </Container>
        </Container>
    </Fragment>
  )
}

export default Result 