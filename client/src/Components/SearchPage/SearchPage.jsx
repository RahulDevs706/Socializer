import React, { Fragment, useEffect } from 'react'
import Result from "./Result.jsx"
import { useSearchParams } from 'react-router-dom'
import LeftBar from '../home/Home/components/LeftBar.jsx';
import { Grid } from '@mui/material';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword")

  return (
    <Fragment>

        <Grid container>
          <Grid item xs={'none'} sm={2.5} lg={2} display={{xs:"none", sm:'block'}}>
              <LeftBar />
          </Grid>
          <Grid item xs={12} sm={9.5} lg={10}>
            <Result query={keyword} />
          </Grid>
      </Grid>
    </Fragment>
  )
}

export default SearchPage