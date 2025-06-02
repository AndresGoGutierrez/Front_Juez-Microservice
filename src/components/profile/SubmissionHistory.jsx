"use client"

import { useState } from "react"
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"

const SubmissionHistory = ({ profileData }) => {
  const [showAll, setShowAll] = useState(false)
  const submissions = profileData?.recentSubmissions || []
  const displayedSubmissions = showAll ? submissions : submissions.slice(0, 10)

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "aceptado":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "wrong answer":
      case "respuesta incorrecta":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "pending":
      case "pendiente":
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "aceptado":
        return "bg-green-100 text-green-800"
      case "wrong answer":
      case "respuesta incorrecta":
        return "bg-red-100 text-red-800"
      case "pending":
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Envíos ({submissions.length})</h3>

      {submissions.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay envíos recientes</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayedSubmissions.map((submission, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(submission.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{submission.problemTitle}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{submission.language}</span>
                      <span>•</span>
                      <span className="text-xs bg-blue-100 text-gray-800 px-2 py-0.5 rounded-full whitespace-nowrap">Problema: {submission.problemId || submission.problem_id || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </span>
              </div>
            ))}
          </div>

          {submissions.length > 10 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center justify-center mx-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Mostrar todos ({submissions.length - 10} más)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SubmissionHistory
