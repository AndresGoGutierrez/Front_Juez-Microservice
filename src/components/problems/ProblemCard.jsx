import { Link } from "react-router-dom"

const ProblemCard = ({ problem }) => {
  const getDifficultyClass = (difficulty) => {
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

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {/* Make sure the route is /problems/:id */}
      <Link to={`/problems/${problem.id_problem}`} className="block p-6">
        <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{problem.description.substring(0, 100)}...</p>
        <div className="flex justify-between items-center">
          <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
          <span className="text-gray-500 text-sm">Tiempo límite: {problem.time_limit}s</span>
        </div>
      </Link>
    </div>
  )
}

export default ProblemCard
