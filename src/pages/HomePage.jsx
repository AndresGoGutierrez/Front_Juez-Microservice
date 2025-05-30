"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ProblemList from "../components/problems/ProblemList"
import DocumentsIntegration from '../components/documents/DocumentsIntegration'
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { useProblems } from "../hooks/useProblems"

const HomePage = () => {
  const { problems, loading, error } = useProblems()
  const { isAuthenticated, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")

  // Filtrar problemas por término de búsqueda y dificultad
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty =
      difficultyFilter === "" || problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesDifficulty
  })

  if (loading) {
    return <Loading message="Cargando problemas..." />
  }

  // Mostrar mensaje de autenticación si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Juez Virtual</h1>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Inicia sesión para ver los problemas</h2>
          <p className="mb-4">Necesitas iniciar sesión para acceder a la lista de problemas y enviar soluciones.</p>
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 bg-primary-600 text-black rounded-md hover:bg-primary-700">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar mensaje de error si hay un problema al cargar los datos
  if (error && error !== "Necesitas iniciar sesión para ver los problemas") {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {user && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          <p>Bienvenido, {user.username}! Estás conectado y puedes acceder a todos los problemas.</p>
        </div>
      )}

      {/* 👉 Integración de documentos aquí */}
      <DocumentsIntegration />

      {problems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron problemas con los filtros actuales.</p>
        </div>
      ) : (
        <ProblemList problems={filteredProblems} />
      )}
    </div>
  )
}

export default HomePage
