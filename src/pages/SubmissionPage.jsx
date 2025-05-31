"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useSubmission } from "../hooks/useSubmission"
import SubmissionResult from "../components/submissions/SubmissionResult"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"

function SubmissionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const submissionId = id ? Number.parseInt(id, 10) : null

  const { submission, loading, error } = useSubmission(submissionId)

  // Logs for debugging
  useEffect(() => {
    console.log("SubmissionPage - ID:", id)
    console.log("SubmissionPage - Parsed ID:", submissionId)
    console.log("SubmissionPage - Submission:", submission)
    console.log("SubmissionPage - Loading:", loading)
    console.log("SubmissionPage - Error:", error)
  }, [id, submissionId, submission, loading, error])

  // Redirect to the shipping list if there is no ID
  useEffect(() => {
    if (!id) {
      console.log("No hay ID de envío, redirigiendo a la lista de envíos")
      navigate("/submissions")
    }
  }, [id, navigate])

  if (!id) {
    return <Loading message="Redirigiendo a la lista de envíos..." />
  }

  if (loading) {
    return <Loading message={`Cargando resultado del envío ${id}...`} />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/submissions" className="text-primary-600 hover:text-primary-800">
            &larr; Volver a mis envíos
          </Link>
        </div>
        <ErrorMessage message={error} />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/submissions" className="text-primary-600 hover:text-primary-800">
            &larr; Volver a mis envíos
          </Link>
        </div>
        <ErrorMessage message={`No se pudo cargar el envío con ID ${id}`} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between">
        <Link to={`/problems/${submission.problem_id}`} className="text-primary-600 hover:text-primary-800">
          &larr; Volver al problema
        </Link>
        <Link to="/submissions" className="text-primary-600 hover:text-primary-800">
          Ver todos mis envíos &rarr;
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Resultado del Envío</h1>

      <SubmissionResult submission={submission} />
    </div>
  )
}

export default SubmissionPage
