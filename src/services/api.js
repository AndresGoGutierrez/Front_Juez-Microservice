import axios from "axios"
import { authService } from "./auth"

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending authentication cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor to add the authentication token to all requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      // Add the token in multiple formats to ensure compatibility
      config.headers["Authorization"] = `Bearer ${token}`
      config.headers["x-access-token"] = token
    }
    console.log("Enviando solicitud a:", config.url, "con headers:", config.headers)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor for handling responses and errors
api.interceptors.response.use(
  (response) => {
    console.log("Respuesta recibida de:", response.config.url, "status:", response.status)
    return response
  },
  (error) => {
    // If we receive a 401, we could redirect to the login page or refresh the token.
    if (error.response && error.response.status === 401) {
      console.log("Error de autenticación: Token inválido o expirado")
      // Optionally, clear the token and redirect to login
      // authService.logout()
      // window.location.href = '/login'
    }

    // Improve CORS error handling
    if (error.message.includes("Network Error")) {
      console.error("Error de red - Posible problema CORS. Verifica que el servidor esté configurado correctamente.")
      console.error("URL solicitada:", error.config?.url)
      console.error("Método:", error.config?.method)
      console.error("Headers:", error.config?.headers)
    }

    return Promise.reject(error)
  },
)

// Object for handling API calls
export const problemService = {
  // Get all problems
  getAll: async () => {
    try {
      console.log("Solicitando problemas...")
      const response = await api.get("/api/problems")
      console.log("Problemas recibidos:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al obtener problemas:", error)
      // Return an empty array in case of error to avoid errors in the UI
      if (error.response && error.response.status === 401) {
        console.error("Error de autenticación al obtener problemas")
        return []
      }
      throw error
    }
  },

  // Get a specific problem
  getById: async (id) => {
    try {
      console.log(`Solicitando problema con ID: ${id}`)
      const response = await api.get(`/api/problems/${id}`)
      console.log(`Problema ${id} recibido:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error al obtener el problema ${id}:`, error)
      console.error("Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      })
      throw error
    }
  },
}

export const languageService = {
  // Get all available languages
  getAll: async () => {
    try {
      console.log("Solicitando lenguajes...")
      const response = await api.get("/api/languages")
      console.log("Lenguajes recibidos:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al obtener lenguajes:", error)
      // In case of error, return a default list of languages
      console.log("Usando lista predeterminada de lenguajes")
      return [
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
    }
  },
}

export const submissionService = {
  // Create a new shipment
  create: async (data) => {
    try {
      // Transform the data into the format expected by the backend
      const submissionData = {
        problem_id: data.problem_id,
        language_submission: data.language_name, // Language name
        language_id: data.language_id,
        sourceCode: data.source_code, // Alias required
        user_id: data.user_id || localStorage.getItem("user_id") || "default_user", // Get user_id from localStorage or use a default value
      }

      console.log("Enviando solución con datos:", submissionData)

      const response = await api.post("/api/submissions", submissionData)
      console.log("Respuesta de creación de envío:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al enviar solución:", error)
      console.error("Detalles del error:", error.response?.data)
      throw error
    }
  },

  // Obtain a specific shipment
  getById: async (id) => {
    try {
      console.log(`Solicitando envío con ID: ${id}`)
      const response = await api.get(`/api/submissions/${id}`)
      console.log(`Envío ${id} recibido:`, response.data)

      // Normalize fields to ensure compatibility
      const normalizedSubmission = {
        ...response.data,
        id: response.data.id || response.data.id_submission,
        status: response.data.status || response.data.status_submission || "Pending",
      }

      return normalizedSubmission
    } catch (error) {
      console.error(`Error al obtener resultado del envío ${id}:`, error)
      throw error
    }
  },

  getAll: async () => {
    try {
      console.log("Solicitando todos los envíos")
      const response = await api.get(`/api/submissions`)
      console.log("Todos los envíos recibidos:", response.data)

      // Normalize fields to ensure compatibility
      const normalizedSubmissions = response.data.map((submission) => ({
        ...submission,
        id: submission.id || submission.id_submission,
        status: submission.status || submission.status_submission || "Pending",
      }))

      return normalizedSubmissions
    } catch (error) {
      console.error("Error al obtener todos los envíos:", error)
      throw error
    }
  },

  // Get all submissions from a user
  getByUser: async (userId) => {
    try {
      console.log(`Solicitando envíos del usuario: ${userId}`)
      const response = await api.get(`/api/submissions?user_id=${userId}`)
      console.log(`Envíos del usuario ${userId} recibidos:`, response.data)

      // Normalize fields to ensure compatibility
      const normalizedSubmissions = response.data.map((submission) => ({
        ...submission,
        id: submission.id || submission.id_submission,
        status: submission.status || submission.status_submission || "Pending",
      }))

      return normalizedSubmissions
    } catch (error) {
      console.error("Error al obtener envíos del usuario:", error)

      // If there is a 404 error, return an empty array instead of throwing an error.
      if (error.response && error.response.status === 404) {
        console.log("No se encontraron envíos para este usuario, devolviendo array vacío")
        return []
      }

      throw error
    }
  },
}

export default api
