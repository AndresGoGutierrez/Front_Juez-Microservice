import axios from "axios"

// URL base para el servicio de autenticación
const AUTH_API_URL = "http://localhost:4000/api/auth"

// Añadir esto al inicio del archivo
console.log("Configuración de autenticación:", {
  AUTH_API_URL,
  ENV_AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL,
})

// Crear una instancia de axios para autenticación
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      console.log("Intentando iniciar sesión con:", credentials)
      console.log("URL de autenticación:", AUTH_API_URL + "/signin")

      const response = await authApi.post(`/signin`, credentials)
      console.log("Respuesta de login:", response.data)

      const { token } = response.data

      if (token) {
        // Guardar el token en localStorage
        localStorage.setItem("auth_token", token)
        console.log("Token guardado correctamente:", token)
        return token
      } else {
        throw new Error("No se recibió un token válido")
      }
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message)
      if (error.message.includes("Network Error")) {
        console.error(
          "Error de red - Posible problema CORS. Verifica que el servidor de autenticación esté configurado correctamente.",
        )
      }
      throw error
    }
  },

  // Registrar un nuevo usuario
  register: async (userData) => {
    try {
      console.log("Intentando registrar usuario:", userData)
      console.log("URL completa:", `${AUTH_API_URL}/signup`)

      // Intenta una solicitud directa para depurar
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

      // Continuar con la solicitud normal
      const response = await authApi.post(`/signup`, userData)
      console.log("Respuesta de registro:", response.data)

      const { token } = response.data

      if (token) {
        // Guardar el token en localStorage
        localStorage.setItem("auth_token", token)
        console.log("Token guardado correctamente:", token)
        return token
      } else {
        throw new Error("No se recibió un token válido")
      }
    } catch (error) {
      console.error("Error en registro:", error.response?.data || error.message)
      if (error.message.includes("Network Error")) {
        console.error(
          "Error de red - Posible problema CORS. Verifica que el servidor de autenticación esté configurado correctamente.",
        )
      }
      throw error
    }
  },

  // Verificar el token actual
  verifyToken: async () => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      console.log("No hay token almacenado")
      return null
    }

    try {
      console.log("Verificando token:", token)

      // Enviar el token en múltiples formatos para asegurar compatibilidad
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

      console.log("Respuesta de verificación:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al verificar token:", error.response?.data || error.message)
      localStorage.removeItem("auth_token")
      return null
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem("auth_token")
    console.log("Sesión cerrada, token eliminado")
  },

  // Obtener el token actual
  getToken: () => {
    const token = localStorage.getItem("auth_token")
    return token
  },

  // Comprobar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token")
  },
}

// Configurar interceptor global para añadir el token a todas las solicitudes
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
