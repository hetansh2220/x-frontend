import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated } from '@/redux/authSlice'

export default function ProtectedRoutes() {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}