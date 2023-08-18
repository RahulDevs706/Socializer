import React from 'react'
import { Fragment } from 'react'
import {Grid} from "@mui/material"
import LeftBar from './components/LeftBar'
import MidPart from './components/MidPart'
import RightBar from './components/RightBar'

const Home = () => {
  
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={'none'} lg={2}  sm={2.5} display={{xs:"none", sm:'block'}}>
            <LeftBar />
        </Grid>
        <Grid item xs={12} lg={7.5} sm={6.9}>
          <MidPart />
        </Grid>
        <Grid item xs={'none'} lg={2.5}  sm={2.6} display={{xs:"none", sm:'block'}}>
            <RightBar />
        </Grid>

      </Grid>
    </Fragment>
  )
}

export default Home