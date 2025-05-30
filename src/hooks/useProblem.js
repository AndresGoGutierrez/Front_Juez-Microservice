"use client"

import { useState, useEffect } from "react"
import { problemService } from "../services/api"

export function useProblem(id) {
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        console.log(`Obteniendo problema con ID: ${id}`)

        if (!id || isNaN(id)) {
          console.error("ID de problema inválido:", id)
          setError("ID de problema inválido")
          setLoading(false)
          return
        }

        const data = await problemService.getById(id)
        console.log("Problema obtenido:", data)

        // Añadir log para ver los campos específicos
        console.log("Campos del problema:", {
          inputFormat: data.inputFormat,
          outputFormat: data.outputFormat,
          input_format: data.input_format,
          output_format: data.output_format,
        })

        // Normalizar los nombres de los campos para asegurar compatibilidad
        const normalizedProblem = {
          ...data,
          // Asegurar que inputFormat y outputFormat estén disponibles
          inputFormat: data.inputFormat || data.input_format || "",
          outputFormat: data.outputFormat || data.output_format || "",
        }

        setProblem(normalizedProblem)
        setError(null)
      } catch (err) {
        console.error(`Error al obtener el problema ${id}:`, err)

        // Proporcionar mensajes de error más específicos
        if (err.response) {
          if (err.response.status === 404) {
            setError(`Problema con ID ${id} no encontrado`)
          } else if (err.response.status === 401) {
            setError("No tienes permiso para ver este problema. Por favor, inicia sesión.")
          } else {
            setError(`Error del servidor: ${err.response.status} ${err.response.statusText}`)
          }
        } else if (err.request) {
          setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
        } else {
          setError(`Error: ${err.message}`)
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProblem()
    } else {
      setLoading(false)
      setError("ID de problema no especificado")
    }
  }, [id])

  return { problem, loading, error }
}
