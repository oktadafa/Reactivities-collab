import React from 'react'
import { useStore } from '../store/store'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function RequireAuth() {
    const {userStore : {IsLoggedIn}} = useStore()
    const location = useLocation()
    if(!IsLoggedIn)
        {
            return (
                <Navigate to='/' state={{from: location }}/>
            )
        }
        return <Outlet/>
}
