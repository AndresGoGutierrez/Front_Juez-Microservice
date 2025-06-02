"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { pqrsService } from "../../services/pqrsApi"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"
import ErrorMessage from "../common/ErrorMessage"
import PQRSStatusUpdate from "./PQRSStatusUpdate"

const PQRSDetail = () => {
  const { id } = useParams()
  const { user, isAdmin, isModerator } = useAuth()
  const [pqrs, setPqrs] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const canManageStatus = isAdmin() || isModerator()

  useEffect(() => {
    const fetchPQRSData = async () => {
      try {
        setLoading(true)
        const [pqrsData, historyData] = await Promise.all([pqrsService.getPQRSById(id), pqrsService.getPQRSHistory(id)])
        setPqrs(pqrsData)
        setHistory(historyData)
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar los datos de la PQRS")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPQRSData()
    }
  }, [id])

  const handleStatusUpdate = async () => {
    try {
      const [pqrsData, historyData] = await Promise.all([pqrsService.getPQRSById(id), pqrsService.getPQRSHistory(id)])
      setPqrs(pqrsData)
      setHistory(historyData)
    } catch (err) {
      console.error("Error refreshing data:", err)
    }
  }

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
    return <Loading message="Cargando detalles de la PQRS..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!pqrs) {
    return <ErrorMessage message="PQRS no encontrada" />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/pqrs" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la lista
        </Link>
      </div>

      {/* PQRS Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">PQRS #{pqrs.id}</h1>
            <div className="flex space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(pqrs.tipo)}`}
              >
                {pqrs.tipo}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pqrs.estado)}`}
              >
                {pqrs.estado}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Categoría</h3>
              <p className="text-sm text-gray-900">{pqrs.categoria}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de creación</h3>
              <p className="text-sm text-gray-900">
                {new Date(pqrs.fecha).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {canManageStatus && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Usuario ID</h3>
                <p className="text-sm text-gray-900">{pqrs.usuario_id}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{pqrs.descripcion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update (Admin/Moderator only) */}
      {canManageStatus && (
        <PQRSStatusUpdate pqrsId={pqrs.id} currentStatus={pqrs.estado_id} onStatusUpdate={handleStatusUpdate} />
      )}

      {/* History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Historial</h2>
        </div>
        <div className="px-6 py-4">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay historial disponible</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.estado)}`}
                    >
                      {entry.estado}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {entry.comentario && <p className="text-sm text-gray-700 mt-1">{entry.comentario}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PQRSDetail
