import { Card, CardMedia, Typography, CardContent, Avatar, Stack } from '@mui/material'
import React, { Fragment } from 'react'

const SettingsCard = ({icon, cardTitle, ...rest}) => {
  return (
    <Fragment>
        <Card onClick={rest.onClick} sx={{borderRadius:"25%", backgroundColor:"#1f5077db" , boxShadow: '0px 2px 4px -1px #1f507782, 0px 3px 5px -1px #1f50779c, 0px 1px 7px 2px #1f507778',  cursor:"pointer", ":hover":{transform:"scale(1.1)", boxShadow: "0px 2px 15px -4px #1f507782, 0px 3px 35px 2px #1f50779c, 0px 1px 20px 12px #1f507778"}, transition:"0.3s ease-in-out"}}>
            <CardContent>
                <Stack spacing="4" alignItems={'center'}>
                    <Avatar src={icon} variant="square" sx={{width:225, height:225, p:3}} />
                    <Typography variant='h5' color={'white.main'} textAlign="center">
                        {cardTitle}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    </Fragment>
  )
}

export default SettingsCard