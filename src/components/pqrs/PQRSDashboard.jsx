"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { pqrsService } from "../../services/pqrsApi"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"
import ErrorMessage from "../common/ErrorMessage"

const PQRSDashboard = () => {
  const { isAdmin, isModerator } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentPQRS, setRecentPQRS] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const canViewStats = isAdmin() || isModerator()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const pqrsData = await pqrsService.getAllPQRS()
        setRecentPQRS(pqrsData.slice(0, 5))

        if (canViewStats) {
          const statsData = await pqrsService.getPQRSStats()
          setStats(statsData)
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar los datos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [canViewStats])

  if (loading) {
    return <Loading message="Cargando dashboard PQRS..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard PQRS</h1>
        <Link to="/pqrs/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Nueva PQRS
        </Link>
      </div>

      {/* Statistics (Admin/Moderator only) */}
      {canViewStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Total</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Pendientes</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">En Curso</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">Completadas</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent PQRS */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {canViewStats ? "PQRS Recientes" : "Mis PQRS Recientes"}
            </h2>
            <Link to="/pqrs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas →
            </Link>
          </div>
        </div>

        {recentPQRS.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No hay PQRS registradas</p>
            <Link to="/pqrs/create" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
              Crear primera PQRS
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentPQRS.map((pqrs) => (
              <Link key={pqrs.id} to={`/pqrs/${pqrs.id}`} className="block px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">PQRS #{pqrs.id}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{pqrs.tipo}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{pqrs.descripcion}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        pqrs.estado === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : pqrs.estado === "En curso"
                            ? "bg-blue-100 text-blue-800"
                            : pqrs.estado === "Atendida"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pqrs.estado}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PQRSDashboard
