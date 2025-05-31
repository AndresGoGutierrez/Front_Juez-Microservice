"use client"

import { useState, useEffect } from "react"
import { submissionService } from "../services/api"

export function useSubmission(id) {
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    let isMounted = true
    let pollingInterval = null

    const fetchSubmission = async () => {
      if (!id) {
        if (isMounted) {
          setLoading(false)
          setError("ID de envío no especificado")
        }
        return
      }

      try {
        console.log(`Obteniendo envío con ID: ${id}`)
        const data = await submissionService.getById(id)
        console.log("Datos del envío recibidos:", data)

        if (isMounted) {
          setSubmission(data)
          setError(null)

          // Check whether we need to continue consulting
          const statusRequiresPolling = ["in_queue", "processing", "pending", "In Queue", "Processing", "Pending"]
          const needsPolling = statusRequiresPolling.includes(data.status)

          setPolling(needsPolling)

          if (!needsPolling && pollingInterval) {
            clearInterval(pollingInterval)
            pollingInterval = null
          }
        }
      } catch (err) {
        console.error(`Error al obtener el envío ${id}:`, err)

        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setError(`Envío con ID ${id} no encontrado`)
          } else {
            setError(`Error al cargar el envío: ${err.message}`)
          }
          setPolling(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSubmission()

    // Configure polling if necessary
    if (polling) {
      pollingInterval = setInterval(fetchSubmission, 3000)
    }

    return () => {
      isMounted = false
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [id, polling])

  return { submission, loading, error }
}
