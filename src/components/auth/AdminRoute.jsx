"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Verificando permisos de administrador..." />
  }

  if (!isAuthenticated) {
    // Redirect to the login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin()) {
    // Redirect to the home page if you are not an administrator.
    return <Navigate to="/" state={{ message: "No tienes permisos de administrador" }} replace />
  }

  return <>{children}</>
}

export default AdminRoute
