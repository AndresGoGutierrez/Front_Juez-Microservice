import { Link } from "react-router-dom"

const ProblemCard = ({ problem }) => {
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

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg shadow-sm overflow-hidden">
      <Link to={`/problems/${problem.id_problem}`} className="block p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{problem.title}</h3>
          <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{problem.description.substring(0, 100)}...</p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">ID: {problem.id_problem}</span>
          <span className="text-gray-500">Tiempo: {problem.time_limit}s</span>
        </div>
      </Link>
    </div>
  )
}

export default ProblemCard