import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AuthorizedRoutes = ({children}) => {

    const {isLoggedIn} = useSelector(state => state.user)
    return (
        <Fragment>
            {
                isLoggedIn? children : <Navigate to="/" replace />
            }
            
        </Fragment>
    )
}

export default AuthorizedRoutes
