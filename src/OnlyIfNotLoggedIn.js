import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const OnlyIfNotLoggedIn = ({ user }) => {
    return (
        <div>
            {
                user ? <Navigate to='/' /> : <Outlet />
            }
        </div>
    )
}

export default OnlyIfNotLoggedIn