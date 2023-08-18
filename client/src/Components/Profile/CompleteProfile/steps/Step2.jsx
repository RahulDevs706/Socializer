import styled from '@emotion/styled'
import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material'
import { Container } from '@mui/system'
import React, { Fragment, useState } from 'react'
import { Country, State, City } from "country-state-city"

const Step2 = ({activeStep, setActiveStep, setCompleteData, completeData}) => {

    const StyledAuCo = styled(Autocomplete)(()=>({
        color: 'inherit',
        '& 	.MuiAutocomplete-inputRoot' :{
            border:'none',
            borderRadius:"15px",
            backgroundColor:"white",
            boxShadow:"1px 1px 10px 2px rgb(0 0 0 / 24%)"
        },
        '& 	.MuiAutocomplete-root' :{
            border:'none',
        },
        ' & 	.MuiAutocomplete-inputFocused':{
            border:'none'
        }
    }))

    const [address, setAddress] = useState({
        city:completeData?.address?.city,
        state:completeData?.address?.state,
        country:completeData?.address?.country
    })

    const {city, state, country} = address;

    const countries = Country.getAllCountries()
    const states = country && State.getStatesOfCountry(country)
    const cities = state && City.getCitiesOfState(country, state).map(i=>(i.name))

    const handleSubmit= ()=>{
        setCompleteData({...completeData, address:address})
    }

    const handleChange = (event, name)=>{
        setAddress({...address, [name]:event.target.value})
    }

    const handleNavigation = (action)=>{
        if(action==='next'){
          if(activeStep===3){
            return
          }
          handleSubmit();
          setActiveStep(activeStep+1)
  
        }else if(action==='skip'){
          if(activeStep===3){
            return
          }
          setActiveStep(activeStep+1)
  
        }else if(action==='back'){
          if(activeStep===0){
            return
          }
          setActiveStep(activeStep-1)
        }else{
          return
        }
      }


  return (
    <Fragment>
        <Container maxWidth="md">
           <Stack spacing={3}>
                <Stack direction={{xs:'column', sm:'row'}} spacing={2} alignItems="center">
                    <StyledAuCo
                        disablePortal
                        disableClearable
                        fullWidth
                        freeSolo
                        value={Country.getCountryByCode(country)}
                        onChange={(e)=>handleChange(e, "country")}
                        options={countries}
                        renderOption={(props, option) => (
                            <Box value={option?.isoCode} id="country" component="option" {...props}>
                                {option?.name}
                            </Box>
                        )}
                        
                        getOptionLabel={option=>option?.name}
                        renderInput={(params) => <TextField inputProps={{...params.inputProps, autoComplete: 'new-password', }} name='country' {...params} label="Country" />}
                    />
                    {country && (
                        <StyledAuCo
                        disablePortal
                        disableClearable
                        fullWidth
                        freeSolo
                        value={State.getStateByCodeAndCountry(state, country)}
                        onChange={(e)=>handleChange(e, "state")}
                        options={states}
                        renderOption={(props, option) => (
                            <Box value={option?.isoCode} id="state" component="option" {...props}>
                                {option?.name}
                            </Box>
                        )}
                        
                        getOptionLabel={option=>option?.name}
                        renderInput={(params) => <TextField inputProps={{...params.inputProps, autoComplete: 'new-password', }} name='state' {...params} label="State" />}
                    />
                    )}
                    {state && (
                        <StyledAuCo
                        disablePortal
                        disableClearable
                        fullWidth
                        required
                        freeSolo
                        value={city && city}
                        onChange={(e)=>handleChange(e, "city")}
                        options={cities}
                        renderOption={(props, option) => (
                            <Box value={option && option} id="city" component="option" {...props}>
                                {option}
                            </Box>
                        )}
                        renderInput={(params) => <TextField inputProps={{...params.inputProps, autoComplete: 'off', }} name='city' {...params} label="City" />}
                    />
                    )}
                </Stack>
                <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="md">
                <Stack alignItems="center" alignSelf="center" spacing={2} >
                        <Container sx={{alignSelf:"center", alignItems:"center"}} maxWidth="sm">
                            <Stack alignItems="center" alignSelf="center" spacing={2} direction='row'>
                                <Button onClick={()=>handleNavigation('back')}  size="large"  variant="contained" color="error" >
                                    Back
                                </Button>
                                <Box flexGrow={1}/>
                                <Button disabled={address.city===''?true:false} sx={{ml:0}} onClick={()=>handleNavigation('next')} size="large"  variant="contained" color="primary">
                                    {address.city===''?"Skip": "Next"}
                                </Button>
                            </Stack>
                        </Container>
                </Stack>
                </Container>
           </Stack>
        </Container>
    </Fragment>
  )
}

export default Step2;