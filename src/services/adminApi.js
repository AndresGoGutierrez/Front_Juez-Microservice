import api from "./api";
import axios from "axios";
import { authService } from "./auth";

// Base URL for the authentication service
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:4000";

// Axios instance for token authentication
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Interceptor for adding tokens to headers
authApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-access-token"] = token;
    }
    console.log("Enviando solicitud a:", config.url, "con headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Problem management service (no changes to shipments)
export const adminProblemService = {
  getAll: async () => {
    try {
      const response = await api.get("/api/problems");
      return response.data;
    } catch (error) {
      console.error("Error al obtener problemas:", error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/api/problems/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el problema ${id}:`, error);
      throw error;
    }
  },
  create: async (problemData) => {
    try {
      const response = await api.post("/api/problems", problemData);
      return response.data;
    } catch (error) {
      console.error("Error al crear problema:", error);
      throw error;
    }
  },
  update: async (id, problemData) => {
    try {
      const response = await api.put(`/api/problems/${id}`, problemData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el problema ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/problems/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el problema ${id}:`, error);
      throw error;
    }
  },
};

// User management service with fallback
export const adminUserService = {
  getAll: async () => {
    try {
      console.log("Solicitando usuarios desde /api/users...");
      const response = await authApi.get("/api/users");
      console.log("Usuarios recibidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios en /api/users:", error);
      try {
        console.log("Intentando con ruta alternativa /api/admin/users...");




        const response = await authApi.get("/api//users");


        
        console.log("Usuarios recibidos (alternativa):", response.data);
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener usuarios en /api/admin/users:", secondError);
        console.log("Devolviendo datos simulados para usuarios");
        return [
          { id: "1", username: "admin", email: "admin@example.com", roles: ["admin"], createdAt: new Date().toISOString() },
          { id: "2", username: "user1", email: "user1@example.com", roles: ["user"], createdAt: new Date().toISOString() },
          { id: "3", username: "user2", email: "user2@example.com", roles: ["user"], createdAt: new Date().toISOString() },
        ];
      }
    }
  },
  getById: async (id) => {
    try {
      const response = await authApi.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el usuario ${id}:`, error);
      throw error;
    }
  },
  update: async (id, userData) => {
    try {
      const response = await authApi.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el usuario ${id}:`, error);
      throw error;
    }
  },
  changeRole: async (id, roleData) => {
    try {
      const response = await authApi.patch(`/api/users/${id}/role`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar el rol del usuario ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await authApi.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el usuario ${id}:`, error);
      throw error;
    }
  },
};

// Shipping management service
const SubmissionFilters = {
  USER_ID: 'user_id',
  PROBLEM_ID: 'problem_id',
  STATUS: 'status',
  LIMIT: 'limit',
  SKIP: 'skip',
};

export const adminSubmissionService = {
  // Get shipments with dynamic filters
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append(SubmissionFilters.USER_ID, filters.userId);
      if (filters.problemId) params.append(SubmissionFilters.PROBLEM_ID, filters.problemId);
      if (filters.status) params.append(SubmissionFilters.STATUS, filters.status);
      if (filters.limit) params.append(SubmissionFilters.LIMIT, filters.limit);
      if (filters.skip) params.append(SubmissionFilters.SKIP, filters.skip);

      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/api/submissions${query}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener envíos:", error);
      throw error;
    }
  },

  // Obtain a specific shipment
  getById: async (userId) => {
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

  // Reprocess a shipment (simulated)
  reprocess: async (id) => {
    try {
      // TODO: Implement actual call to reprocessing endpoint
      return {
        id,
        status: "PENDING",
        message: "Envío reprocesado correctamente",
      };
    } catch (error) {
      console.error(`Error al reprocesar el envío ${id}:`, error);
      throw error;
    }
  },

  // Delete a shipment
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/submissions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el envío ${id}:`, error);
      throw error;
    }
  },
};
