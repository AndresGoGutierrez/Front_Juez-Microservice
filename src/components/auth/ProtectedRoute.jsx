"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Verificando autenticación..." />
  }

  if (!isAuthenticated) {
    // Redirigir a la página de inicio de sesión, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
