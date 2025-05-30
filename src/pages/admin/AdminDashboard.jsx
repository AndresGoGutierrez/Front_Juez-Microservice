"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import { adminProblemService, adminUserService, adminSubmissionService } from "../../services/adminApi"
import Loading from "../../components/common/Loading"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    problems: { total: 0, loading: true, error: null },
    users: { total: 0, loading: true, error: null },
    submissions: { total: 0, loading: true, error: null },
    recentSubmissions: { data: [], loading: true, error: null },
  })

  useEffect(() => {
    const fetchStats = async () => {
      // Obtener estadísticas de problemas
      try {
        const problems = await adminProblemService.getAll()
        setStats((prev) => ({
          ...prev,
          problems: { total: problems.length, loading: false, error: null },
        }))
      } catch (error) {
        console.error("Error al obtener problemas:", error)
        setStats((prev) => ({
          ...prev,
          problems: { total: 0, loading: false, error: "Error al cargar problemas" },
        }))
      }

      // Obtener estadísticas de usuarios
      try {
        const users = await adminUserService.getAll()
        setStats((prev) => ({
          ...prev,
          users: { total: users.length, loading: false, error: null },
        }))
      } catch (error) {
        console.error("Error al obtener usuarios:", error)
        setStats((prev) => ({
          ...prev,
          users: { total: 0, loading: false, error: "Error al cargar usuarios" },
        }))
      }

      // Obtener estadísticas de envíos
      try {
        const submissions = await adminSubmissionService.getAll({ limit: 10 })
        setStats((prev) => ({
          ...prev,
          submissions: { total: submissions.length, loading: false, error: null },
          recentSubmissions: { data: submissions.slice(0, 5), loading: false, error: null },
        }))
      } catch (error) {
        console.error("Error al obtener envíos:", error)
        setStats((prev) => ({
          ...prev,
          submissions: { total: 0, loading: false, error: "Error al cargar envíos" },
          recentSubmissions: { data: [], loading: false, error: "Error al cargar envíos recientes" },
        }))
      }
    }

    fetchStats()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"
    return new Date(dateString).toLocaleString()
  }

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || ""

    if (statusLower.includes("accepted")) return "bg-green-100 text-green-800"
    if (statusLower.includes("wrong")) return "bg-red-100 text-red-800"
    if (statusLower.includes("time limit")) return "bg-yellow-100 text-yellow-800"
    if (statusLower.includes("compilation")) return "bg-indigo-100 text-indigo-800"
    if (statusLower.includes("runtime")) return "bg-pink-100 text-pink-800"
    if (statusLower.includes("pending") || statusLower.includes("queue") || statusLower.includes("processing"))
      return "bg-blue-100 text-blue-800"

    return "bg-gray-100 text-gray-800"
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de Problemas */}
        <div className="bg-white border rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Problemas</h2>
              {stats.problems.loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.problems.total}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/problems" className="text-sm text-blue-600 hover:text-blue-800">
              Ver todos los problemas →
            </Link>
          </div>
        </div>

        {/* Tarjeta de Usuarios */}
        <div className="bg-white border rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Usuarios</h2>
              {stats.users.loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/users" className="text-sm text-green-600 hover:text-green-800">
              Ver todos los usuarios →
            </Link>
          </div>
        </div>

        {/* Tarjeta de Envíos */}
        <div className="bg-white border rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Envíos</h2>
              {stats.submissions.loading ? (
                <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.submissions.total}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/submissions" className="text-sm text-purple-600 hover:text-purple-800">
              Ver todos los envíos →
            </Link>
          </div>
        </div>
      </div>

      {/* Envíos recientes */}
      <div className="bg-white border rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Envíos recientes</h2>
        </div>

        {stats.recentSubmissions.loading ? (
          <div className="p-6">
            <Loading message="Cargando envíos recientes..." />
          </div>
        ) : stats.recentSubmissions.error ? (
          <div className="p-6 text-center text-red-500">{stats.recentSubmissions.error}</div>
        ) : stats.recentSubmissions.data.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No hay envíos recientes</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Usuario
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Problema
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentSubmissions.data.map((submission) => (
                  <tr key={submission.id || submission.id_submission}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.id || submission.id_submission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/users/${submission.user_id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {submission.user_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/problems/${submission.problem_id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Problema #{submission.problem_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(submission.status || submission.status_submission)}`}
                      >
                        {submission.status || submission.status_submission}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/submissions/${submission.id || submission.id_submission}`}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
