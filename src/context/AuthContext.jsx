"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { authService } from "../services/auth"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  // Ensure that there is a user ID in localStorage
  useEffect(() => {
    // If there is no user ID in localStorage, create a temporary one.
    if (!localStorage.getItem("user_id")) {
      const tempUserId = `temp_${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem("user_id", tempUserId)
      console.log("ID de usuario temporal creado:", tempUserId)
    }
  }, [])

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true)
        const userData = await authService.verifyToken()

        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }

        setError(null)
      } catch (err) {
        setUser(null)
        setIsAuthenticated(false)
        setError("Error al verificar la autenticación")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      await authService.login({ email, password })
      const userData = await authService.verifyToken()

      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    try {
      setLoading(true)
      setError(null)

      await authService.register({ username, email, password })
      const userData = await authService.verifyToken()

      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  // Functions for verifying roles
  const isAdmin = () => {
    return user && user.roles && user.roles.includes("admin")
  }

  const isModerator = () => {
    return user && user.roles && user.roles.includes("moderator")
  }

  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isModerator,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }

  return context
}
