"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useProblem } from "../hooks/useProblem"
import { useLanguages } from "../hooks/useLanguages"
import { useAuth } from "../context/AuthContext"
import CodeEditor from "../components/editor/CodeEditor"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { submissionService } from "../services/api"

const ProblemPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth() // Obtener el usuario actual

  console.log("ID del problema desde useParams:", id)

  // Convertir el ID a número si existe
  const problemId = id ? Number.parseInt(id, 10) : null

  const { problem, loading: problemLoading, error: problemError } = useProblem(problemId)
  const { languages, loading: languagesLoading, error: languagesError } = useLanguages()

  const [selectedLanguage, setSelectedLanguage] = useState(1) // Default to Python
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Logs para depuración
  useEffect(() => {
    if (problem) {
      console.log("Problema cargado:", problem)
      console.log("Campos de formato:", {
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        input_format: problem.input_format,
        output_format: problem.output_format,
      })
    }
  }, [problem])

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId)
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Por favor, escribe tu solución antes de enviar")
      return
    }

    try {
      setSubmitting(true)
      setSubmitError(null)

      // Encontrar el nombre del lenguaje seleccionado
      const selectedLang = languages.find((lang) => lang.id === selectedLanguage)
      const languageName = selectedLang ? selectedLang.name : "Unknown"

      const submission = await submissionService.create({
        problem_id: problemId,
        language_id: selectedLanguage,
        language_name: languageName, // Añadir el nombre del lenguaje
        source_code: code,
        user_id: user?.id || localStorage.getItem("user_id") || "default_user", // Usar ID del usuario si está disponible
      })

      console.log("Envío creado exitosamente:", submission)

      // Redirigir a la página de resultados
      navigate(`/submissions/${submission.id || submission.id_submission}`)
    } catch (error) {
      console.error("Error al enviar la solución:", error)

      // Mostrar mensaje de error más detallado
      let errorMessage = "Error al enviar la solución. Por favor, intenta de nuevo."
      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          errorMessage = `Error: ${error.response.data.detail}`
        } else {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`
        }
      }

      setSubmitError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Mostrar estado de carga
  if (problemLoading || languagesLoading) {
    return <Loading message={`Cargando problema ${id}...`} />
  }

  // Mostrar error si no hay ID
  if (!id) {
    return <ErrorMessage message="ID de problema no especificado" />
  }

  // Mostrar errores
  if (problemError) {
    return <ErrorMessage message={problemError} />
  }

  if (languagesError) {
    return <ErrorMessage message={languagesError} />
  }

  // Verificar si el problema existe
  if (!problem) {
    return <ErrorMessage message={`No se pudo cargar el problema con ID ${id}`} />
  }

  // Funciones auxiliares
  const formatText = (text = "") => {
    return text.replace(/\n/g, "<br>")
  }

  const getDifficultyClass = (difficulty = "") => {
    switch (difficulty.toLowerCase()) {
      case "easy":
      case "fácil":
        return "difficulty-easy"
      case "medium":
      case "medio":
        return "difficulty-medium"
      case "hard":
      case "difícil":
        return "difficulty-hard"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Renderizar el problema
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
        <div className="flex space-x-2">
          <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
          <span className="badge badge-info">Tiempo: {problem.time_limit}s</span>
          <span className="badge badge-info">Memoria: {problem.memory_limit} MB</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: formatText(problem.description) }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Formato de Entrada</h3>
            <div
              className="bg-gray-50 p-4 rounded-md"
              dangerouslySetInnerHTML={{ __html: formatText(problem.inputFormat || problem.input_format || "") }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Formato de Salida</h3>
            <div
              className="bg-gray-50 p-4 rounded-md"
              dangerouslySetInnerHTML={{ __html: formatText(problem.outputFormat || problem.output_format || "") }}
            />
          </div>
        </div>

        {problem.constraints && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Restricciones</h3>
            <div
              className="bg-gray-50 p-4 rounded-md"
              dangerouslySetInnerHTML={{ __html: formatText(problem.constraints) }}
            />
          </div>
        )}

        {problem.tags && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {typeof problem.tags === "string" ? (
                problem.tags.split(",").map((tag, index) => (
                  <span key={index} className="badge bg-gray-100 text-gray-800">
                    {tag.trim()}
                  </span>
                ))
              ) : (
                <span className="badge bg-gray-100 text-gray-800">Sin etiquetas</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Enviar Solución</h2>

        {languages && languages.length > 0 ? (
          <CodeEditor
            language={selectedLanguage}
            languages={languages}
            onLanguageChange={handleLanguageChange}
            onCodeChange={handleCodeChange}
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
            <p>No se pudieron cargar los lenguajes de programación. Por favor, recarga la página.</p>
          </div>
        )}

        {submitError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <p>{submitError}</p>
          </div>
        )}

        <div className="mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-primary-600 text-black rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar Solución"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProblemPage
