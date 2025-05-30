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
    // Redirigir a la página de inicio de sesión, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin()) {
    // Redirigir a la página principal si no es administrador
    return <Navigate to="/" state={{ message: "No tienes permisos de administrador" }} replace />
  }

  return <>{children}</>
}

export default AdminRoute
