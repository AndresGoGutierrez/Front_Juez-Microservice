"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { adminProblemService } from "../../../services/adminApi"
import Loading from "../../../components/common/Loading"
import ErrorMessage from "../../../components/common/ErrorMessage"

const ProblemList = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true)
        const data = await adminProblemService.getAll()
        setProblems(data)
        setError(null)
      } catch (err) {
        console.error("Error al obtener problemas:", err)
        setError("Error al cargar los problemas. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  // Filtrar problemas por término de búsqueda y dificultad
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty =
      difficultyFilter === "" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesDifficulty
  })

  const handleDeleteClick = (problemId) => {
    setShowConfirmDelete(problemId)
  }

  const handleConfirmDelete = async (problemId) => {
    try {
      await adminProblemService.delete(problemId)
      setProblems(problems.filter((problem) => problem.id_problem !== problemId))
      setShowConfirmDelete(null)
    } catch (error) {
      console.error(`Error al eliminar el problema ${problemId}:`, error)
      alert(`Error al eliminar el problema: ${error.message}`)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmDelete(null)
  }

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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
        <Loading message="Cargando problemas..." />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <ErrorMessage message={error} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Problemas</h1>
        <Link
          to="/admin/problems/create"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Crear Problema
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Buscar problemas
          </label>
          <input
            type="text"
            id="search"
            placeholder="Buscar problemas..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="difficulty" className="sr-only">
            Filtrar por dificultad
          </label>
          <select
            id="difficulty"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">Todas las dificultades</option>
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron problemas con los filtros actuales.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredProblems.map((problem) => (
              <li key={problem.id_problem}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-lg font-medium text-primary-600 truncate">{problem.title}</p>
                      <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/admin/problems/${problem.id_problem}`}
                        className="mr-2 font-medium text-primary-600 hover:text-primary-900"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/admin/problems/${problem.id_problem}/edit`}
                        className="mr-2 font-medium text-yellow-600 hover:text-yellow-900"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(problem.id_problem)}
                        className="font-medium text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        ID: {problem.id_problem} | Tiempo: {problem.time_limit}s | Memoria: {problem.memory_limit} MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal de confirmación de eliminación */}
                {showConfirmDelete === problem.id_problem && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar eliminación</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        ¿Estás seguro de que deseas eliminar el problema "{problem.title}"? Esta acción no se puede
                        deshacer.
                      </p>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelDelete}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(problem.id_problem)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  )
}

export default ProblemList
