"use client"

import { useState, useEffect } from "react"
import { problemService } from "../services/api"
import { useAuth } from "../context/AuthContext"

export function useProblems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true)

        // Only attempt to load problems if the user is authenticated.
        if (isAuthenticated) {
          const data = await problemService.getAll()
          setProblems(data)
          setError(null)
        } else {
          // If not authenticated, set an informational message
          setError("Necesitas iniciar sesión para ver los problemas")
          setProblems([])
        }
      } catch (err) {
        console.error(err)

        // Specifically handling authentication errors
        if (err.response && err.response.status === 401) {
          setError("Necesitas iniciar sesión para ver los problemas")
        } else {
          setError("Error al cargar los problemas. Por favor, intenta de nuevo más tarde.")
        }

        setProblems([])
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [isAuthenticated]) // Add isAuthenticated as a dependency to reload when it changes

  return { problems, loading, error }
}
