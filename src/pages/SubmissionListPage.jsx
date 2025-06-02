"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { submissionService } from "../services/api"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"

function SubmissionListPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        console.log("Obteniendo lista de envíos...")

        if (user && user.id) {
          const data = await submissionService.getByUser(user.id)
          console.log("Envíos obtenidos:", data)
          setSubmissions(data)
        } else {
          const data = await submissionService.getAll()
          console.log("Envíos obtenidos (sin usuario específico):", data)
          setSubmissions(data)
        }

        setError(null)
      } catch (err) {
        console.error("Error al obtener envíos:", err)
        setError("No se pudieron cargar los envíos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [user])

  if (loading) {
    return <Loading message="Cargando envíos..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  // Aquí la función getStatusClass usa las mismas clases Tailwind del primer código
  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || ""

    if (statusLower.includes("accepted")) return "bg-green-100 text-green-800"
    if (statusLower.includes("wrong")) return "bg-red-100 text-red-800"
    if (statusLower.includes("time limit")) return "bg-yellow-100 text-yellow-800"
    if (statusLower.includes("compilation")) return "bg-indigo-100 text-indigo-800"
    if (statusLower.includes("runtime")) return "bg-pink-100 text-pink-800"
    if (
      statusLower.includes("pending") ||
      statusLower.includes("queue") ||
      statusLower.includes("processing")
    )
      return "bg-blue-100 text-blue-800"

    return "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Envíos</h1>

      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron envíos.</p>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.language || submission.language_submission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        submission.status || submission.status_submission
                      )}`}
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
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SubmissionListPage
