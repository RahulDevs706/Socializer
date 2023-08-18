import { Grid } from '@mui/material';
import React, { Fragment } from 'react'
import LeftBar from '../../home/Home/components/LeftBar';
import SettingsComp from "./SettingsComp.jsx"

const SettingsPage = () => {

  return (
    <Fragment>
        <Grid container>
            <Grid item xs={'none'} sm={2.5} lg={2} display={{xs:"none", sm:'block'}}>
                <LeftBar />
            </Grid>
            <Grid item xs={12} sm={9.5} lg={10}>
                <SettingsComp />
            </Grid>
        </Grid>
    </Fragment>
  )
}

export default SettingsPage