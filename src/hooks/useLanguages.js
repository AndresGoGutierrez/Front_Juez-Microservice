"use client"

import { useState, useEffect } from "react"
import { languageService } from "../services/api"

export function useLanguages() {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true)
        console.log("Obteniendo lenguajes...")

        // Intentar obtener lenguajes del localStorage primero
        const cachedLanguages = localStorage.getItem("languages")
        if (cachedLanguages) {
          const parsedLanguages = JSON.parse(cachedLanguages)
          console.log("Lenguajes obtenidos de cache:", parsedLanguages)
          setLanguages(parsedLanguages)
          setError(null)

          // Actualizar en segundo plano
          try {
            const freshData = await languageService.getAll()
            console.log("Lenguajes actualizados:", freshData)
            setLanguages(freshData)
            localStorage.setItem("languages", JSON.stringify(freshData))
          } catch (backgroundError) {
            console.warn("Error al actualizar lenguajes en segundo plano:", backgroundError)
          }

          setLoading(false)
          return
        }

        // Si no hay cache, obtener del servidor
        const data = await languageService.getAll()
        console.log("Lenguajes obtenidos:", data)
        setLanguages(data)
        setError(null)

        // Guardar en localStorage para futuras visitas
        localStorage.setItem("languages", JSON.stringify(data))
      } catch (err) {
        console.error("Error en useLanguages:", err)
        setError("Error al cargar los lenguajes")

        // Intentar usar lenguajes predeterminados si hay un error
        const defaultLanguages = [
          { id: 1, name: "Python 3.8" },
          { id: 2, name: "C++ (GCC 9.2.0)" },
          { id: 3, name: "Java (OpenJDK 13.0.1)" },
          { id: 4, name: "JavaScript (Node.js 12.14.0)" },
          { id: 5, name: "C (GCC 9.2.0)" },
          { id: 6, name: "C# (Mono 6.6.0.161)" },
          { id: 7, name: "Go (1.13.5)" },
          { id: 8, name: "Ruby (2.7.0)" },
          { id: 9, name: "Rust (1.40.0)" },
        ]

        setLanguages(defaultLanguages)
        localStorage.setItem("languages", JSON.stringify(defaultLanguages))
      } finally {
        setLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  return { languages, loading, error }
}
