import axios from "axios"

const PQRS_API_URL = "http://localhost:5000/api"

// Create axios instance for PQRS API
const pqrsApi = axios.create({
  baseURL: PQRS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
pqrsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    console.log("Sending token:", token) // Para debugging

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
      config.headers["x-access-token"] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
pqrsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("PQRS API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const pqrsService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await pqrsApi.get("/categories")
      return response.data
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  // Get all states
  getStates: async () => {
    try {
      const response = await pqrsApi.get("/states")
      return response.data
    } catch (error) {
      console.error("Error fetching states:", error)
      throw error
    }
  },

  // Create new PQRS
  createPQRS: async (pqrsData) => {
    try {
      const response = await pqrsApi.post("/pqrs", pqrsData)
      return response.data
    } catch (error) {
      console.error("Error creating PQRS:", error)
      throw error
    }
  },

  // Get all PQRS (filtered by user role)
  getAllPQRS: async () => {
    try {
      const response = await pqrsApi.get("/pqrs")
      return response.data
    } catch (error) {
      console.error("Error fetching PQRS:", error)
      throw error
    }
  },

  // Get specific PQRS by ID
  getPQRSById: async (id) => {
    try {
      const response = await pqrsApi.get(`/pqrs/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching PQRS:", error)
      throw error
    }
  },

  // Update PQRS status (admin/moderator only)
  updatePQRSStatus: async (id, statusData) => {
    try {
      const response = await pqrsApi.put(`/pqrs/${id}/status`, statusData)
      return response.data
    } catch (error) {
      console.error("Error updating PQRS status:", error)
      throw error
    }
  },

  // Get PQRS history
  getPQRSHistory: async (id) => {
    try {
      const response = await pqrsApi.get(`/pqrs/${id}/history`)
      return response.data
    } catch (error) {
      console.error("Error fetching PQRS history:", error)
      throw error
    }
  },

  // Get PQRS statistics (admin/moderator only)
  getPQRSStats: async () => {
    try {
      const response = await pqrsApi.get("/pqrs/stats")
      return response.data
    } catch (error) {
      console.error("Error fetching PQRS stats:", error)
      throw error
    }
  },
}
