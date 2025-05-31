import axios from "axios"

// Base URL for the authentication service
const AUTH_API_URL = "http://localhost:4000/api/auth"

// Add this at the beginning of the file
console.log("Authentication configuration:", {
  AUTH_API_URL,
  ENV_AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL,
})

// Create an axios instance for authentication
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Authentication service
export const authService = {
  // Log in
  login: async (credentials) => {
    try {
      console.log("Attempting to log in with:", credentials)
      console.log("Authentication URL:", AUTH_API_URL + "/signin")

      const response = await authApi.post(`/signin`, credentials)
      console.log("Login response:", response.data)

      const { token } = response.data

      if (token) {
        // Save the token in localStorage
        localStorage.setItem("auth_token", token)
        console.log("Token successfully saved:", token)
        return token
      } else {
        throw new Error("No valid token received")
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      if (error.message.includes("Network Error")) {
        console.error(
          "Network error - Possible CORS issue. Make sure the authentication server is configured correctly.",
        )
      }
      throw error
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      console.log("Attempting to register user:", userData)
      console.log("Full URL:", `${AUTH_API_URL}/signup`)

      // Attempt a direct request for debugging
      try {
        const testResponse = await fetch(`${AUTH_API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        })
        console.log("Test fetch response:", testResponse.status, await testResponse.text())
      } catch (fetchError) {
        console.error("Test fetch error:", fetchError)
      }

      // Continue with the regular request
      const response = await authApi.post(`/signup`, userData)
      console.log("Registration response:", response.data)

      const { token } = response.data

      if (token) {
        // Save the token in localStorage
        localStorage.setItem("auth_token", token)
        console.log("Token successfully saved:", token)
        return token
      } else {
        throw new Error("No valid token received")
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message)
      if (error.message.includes("Network Error")) {
        console.error(
          "Network error - Possible CORS issue. Make sure the authentication server is configured correctly.",
        )
      }
      throw error
    }
  },

  // Verify the current token
  verifyToken: async () => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      console.log("No token stored")
      return null
    }

    try {
      console.log("Verifying token:", token)

      // Send the token in multiple formats to ensure compatibility
      const response = await authApi.post(
        `/verify`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-access-token": token,
          },
        },
      )

      console.log("Verification response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error verifying token:", error.response?.data || error.message)
      localStorage.removeItem("auth_token")
      return null
    }
  },

  // Log out
  logout: () => {
    localStorage.removeItem("auth_token")
    console.log("Logged out, token removed")
  },

  // Get the current token
  getToken: () => {
    const token = localStorage.getItem("auth_token")
    return token
  },

  // Check if the user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token")
  },
}

// Configure global interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
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
