"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { adminSubmissionService } from "../../../services/adminApi"
import Loading from "../../../components/common/Loading"
import ErrorMessage from "../../../components/common/ErrorMessage"

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    userId: "",
    problemId: "",
    status: "",
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        const data = await adminSubmissionService.getAll({
          ...filters,
          skip: (page - 1) * limit,
          limit,
        })

        setSubmissions(data.submissions || data)
        setTotalPages(data.totalPages || Math.ceil(data.length / limit) || 1)
        setError(null)
      } catch (err) {
        console.error("Error al obtener envíos:", err)
        setError("Error al cargar los envíos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [filters, page, limit])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
    setPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters({
      userId: "",
      problemId: "",
      status: "",
    })
    setPage(1)
  }

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

  if (loading && page === 1) {
    return (
      <AdminLayout>
        <Loading message="Cargando envíos..." />
      </AdminLayout>
    )
  }

  if (error && page === 1) {
    return (
      <AdminLayout>
        <ErrorMessage message={error} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Envíos</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              ID de Usuario
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.userId}
              onChange={handleFilterChange}
              placeholder="Filtrar por ID de usuario"
            />
          </div>
          <div>
            <label htmlFor="problemId" className="block text-sm font-medium text-gray-700 mb-1">
              ID de Problema
            </label>
            <input
              type="text"
              id="problemId"
              name="problemId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.problemId}
              onChange={handleFilterChange}
              placeholder="Filtrar por ID de problema"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos los estados</option>
              <option value="accepted">Aceptado</option>
              <option value="wrong_answer">Respuesta Incorrecta</option>
              <option value="time_limit_exceeded">Tiempo Límite Excedido</option>
              <option value="compilation_error">Error de Compilación</option>
              <option value="runtime_error">Error de Ejecución</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Lista de envíos */}
      {loading && page > 1 ? (
        <Loading message="Cargando envíos..." />
      ) : error && page > 1 ? (
        <ErrorMessage message={error} />
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron envíos con los filtros actuales.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                  Lenguaje
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
              {submissions.map((submission) => (
                <tr key={submission.id || submission.id_submission}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.id || submission.id_submission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/admin/users/${submission.user_id}`} className="text-primary-600 hover:text-primary-900">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.language || submission.language_submission}
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
                      to={`/submissions/${submission.id || submission.id_submission}`}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => adminSubmissionService.reprocess(submission.id || submission.id_submission)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Reprocesar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Página {page} de {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SubmissionList
