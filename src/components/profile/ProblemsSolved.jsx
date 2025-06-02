import { CheckCircle, Clock, AlertCircle } from "lucide-react"

const ProblemsSolved = ({ profileData }) => {
  const problems = profileData?.solvedProblems || []

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
      case "fácil":
        return "bg-green-100 text-green-800"
      case "medium":
      case "medio":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
      case "difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
      case "pendiente":
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Problemas Resueltos ({problems.length})</h3>

      {problems.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aún no has resuelto ningún problema</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {problems.map((problem, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                {getStatusIcon(problem.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{problem.title}</h4>
                  <p className="text-sm text-gray-500">

                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-sm text-gray-500">{problem.language}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProblemsSolved
