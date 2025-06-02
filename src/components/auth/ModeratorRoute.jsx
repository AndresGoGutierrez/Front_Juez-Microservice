"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"

const ModeratorRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isModerator, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Verificando permisos de moderador..." />
  }

  if (!isAuthenticated) {
    // Redirect to the login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin() && !isModerator()) {
    // Redirect to the home page if you are not an administrator or moderator
    return <Navigate to="/" state={{ message: "No tienes permisos de moderador" }} replace />
  }

  return <>{children}</>
}

export default ModeratorRoute
