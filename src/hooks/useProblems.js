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

        // Solo intentar cargar problemas si el usuario está autenticado
        if (isAuthenticated) {
          const data = await problemService.getAll()
          setProblems(data)
          setError(null)
        } else {
          // Si no está autenticado, establecer un mensaje informativo
          setError("Necesitas iniciar sesión para ver los problemas")
          setProblems([])
        }
      } catch (err) {
        console.error(err)

        // Manejar específicamente errores de autenticación
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
  }, [isAuthenticated]) // Añadir isAuthenticated como dependencia para recargar cuando cambie

  return { problems, loading, error }
}
