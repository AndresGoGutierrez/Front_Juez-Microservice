"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { adminProblemService, adminSubmissionService } from "../../../services/adminApi"
import Loading from "../../../components/common/Loading"
import ErrorMessage from "../../../components/common/ErrorMessage"

const ProblemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true)

        // Obtener detalles del problema
        const problemData = await adminProblemService.getById(id)
        setProblem(problemData)

        // Obtener envíos relacionados con este problema
        const submissionsData = await adminSubmissionService.getAll({ problemId: id, limit: 10 })
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : submissionsData.submissions || [])

        setError(null)
      } catch (err) {
        console.error(`Error al obtener datos del problema ${id}:`, err)
        setError(`Error al cargar el problema. ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProblemData()
    }
  }, [id])

  const handleDeleteClick = () => {
    setShowConfirmDelete(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await adminProblemService.delete(id)
      navigate("/admin/problems")
    } catch (error) {
      console.error(`Error al eliminar el problema ${id}:`, error)
      alert(`Error al eliminar el problema: ${error.message}`)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmDelete(false)
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

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
      case "fácil":
        return "bg-sky-50 text-sky-700"
      case "medium":
      case "medio":
        return "bg-purple-50 text-purple-700"
      case "hard":
      case "difícil":
        return "bg-orange-50 text-orange-700"
      default:
        return "bg-orange-50 text-orange-700"
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loading message={`Cargando problema ${id}...`} />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <ErrorMessage message={error} />
        <div className="mt-4">
          <button
            onClick={() => navigate("/admin/problems")}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Volver a la lista de problemas
          </button>
        </div>
      </AdminLayout>
    )
  }

  if (!problem) {
    return (
      <AdminLayout>
        <ErrorMessage message={`No se encontró el problema con ID ${id}`} />
        <div className="mt-4">
          <button
            onClick={() => navigate("/admin/problems")}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Volver a la lista de problemas
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
        <div className="flex space-x-2">
          <Link
            to={`/admin/problems/${id}/edit`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Editar
          </Link>
          <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Eliminar
          </button>
        </div>
      </div>

      {/* Información del problema */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles del Problema</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">ID: {problem.id_problem}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass(problem.difficulty)}`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {problem.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Formato de Entrada</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {problem.inputFormat || problem.input_format || "No especificado"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Formato de Salida</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {problem.outputFormat || problem.output_format || "No especificado"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Restricciones</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {problem.constraints || "No especificado"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Límites</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Tiempo: {problem.time_limit}s | Memoria: {problem.memory_limit} MB
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Etiquetas</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {problem.tags && typeof problem.tags === "string"
                    ? problem.tags.split(",").map((tag, index) => (
                        <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                          {tag.trim()}
                        </span>
                      ))
                    : problem.tags && Array.isArray(problem.tags)
                      ? problem.tags.map((tag, index) => (
                          <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                            {tag}
                          </span>
                        ))
                      : "No hay etiquetas"}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(problem.created_at)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {problem.updated_at ? formatDate(problem.updated_at) : "No actualizado"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Casos de prueba */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Casos de Prueba</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {problem.test_cases?.length || 0} caso(s) de prueba configurado(s)
          </p>
        </div>
        <div className="border-t border-gray-200">
          {!problem.test_cases || problem.test_cases.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-gray-500">No hay casos de prueba configurados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Entrada
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Salida Esperada
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {problem.test_cases.map((testCase, index) => (
                    <tr key={testCase.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded">{testCase.input_data}</pre>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded">{testCase.expected_output}</pre>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {testCase.is_sample ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Ejemplo
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Oculto
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Envíos recientes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Envíos Recientes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Últimos envíos para este problema</p>
          </div>
          <Link to={`/admin/submissions?problemId=${id}`} className="text-sm text-primary-600 hover:text-primary-900">
            Ver todos los envíos →
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {submissions.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-gray-500">No hay envíos para este problema</div>
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
                      Estado
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
                        <Link
                          to={`/admin/users/${submission.user_id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {submission.user_id}
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
                        {submission.language || submission.language_submission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/submissions/${submission.id || submission.id_submission}`}
                          className="text-primary-600 hover:text-primary-900"
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
      </div>

      {/* Modal de confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar eliminación</h3>
            <p className="text-sm text-gray-500 mb-4">
              ¿Estás seguro de que deseas eliminar el problema "{problem.title}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ProblemDetail
