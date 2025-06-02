"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { pqrsService } from "../../services/pqrsApi"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"
import ErrorMessage from "../common/ErrorMessage"

const PQRSList = () => {
  const { user, isAdmin, isModerator } = useAuth()
  const [pqrsList, setPqrsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPQRS = async () => {
      try {
        setLoading(true)
        const data = await pqrsService.getAllPQRS()
        setPqrsList(data)
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar las PQRS")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPQRS()
  }, [])

  const getStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en curso":
        return "bg-blue-100 text-blue-800"
      case "atendida":
        return "bg-green-100 text-green-800"
      case "aplazada":
        return "bg-orange-100 text-orange-800"
      case "rechazada":
        return "bg-red-100 text-red-800"
      case "cancelada":
        return "bg-gray-100 text-gray-800"
      case "finalizada":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTipoColor = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "petición":
        return "bg-blue-100 text-blue-800"
      case "queja":
        return "bg-red-100 text-red-800"
      case "reclamo":
        return "bg-orange-100 text-orange-800"
      case "sugerencia":
        return "bg-green-100 text-green-800"
      case "información":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <Loading message="Cargando PQRS..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isAdmin() || isModerator() ? "Gestión de PQRS" : "Mis PQRS"}
        </h2>
        <Link
          to="/pqrs/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Nueva PQRS
        </Link>
      </div>

      {pqrsList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No hay PQRS registradas</div>
          <Link
            to="/pqrs/create"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear primera PQRS
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {pqrsList.map((pqrs) => (
              <li key={pqrs.id}>
                <Link to={`/pqrs/${pqrs.id}`} className="block hover:bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(pqrs.tipo)}`}
                        >
                          {pqrs.tipo}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pqrs.estado)}`}
                        >
                          {pqrs.estado}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {pqrs.categoria}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 truncate">PQRS #{pqrs.id}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pqrs.descripcion}</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>
                          Creada el{" "}
                          {new Date(pqrs.fecha).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {(isAdmin() || isModerator()) && <span className="ml-4">Usuario ID: {pqrs.usuario_id}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PQRSList
