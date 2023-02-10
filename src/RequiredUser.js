import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const RequiredUser = ({ user }) => {
    return (
        <div>
            {
                user ? <Outlet /> : <Navigate to='/login' />
            }
        </div>
    )
}

export default RequiredUser