import { Code, CheckCircle, Clock, TrendingUp } from "lucide-react"

const UserStats = ({ profileData }) => {
  const stats = [
    {
      icon: CheckCircle,
      label: "Problemas Resueltos",
      value: profileData?.problemsSolved || 0,
      color: "text-green-500",
    },
    {
      icon: Code,
      label: "Total de Envíos",
      value: profileData?.totalSubmissions || 0,
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Tasa de Éxito",
      value: profileData?.successRate ? `${profileData.successRate}%` : "0%",
      color: "text-purple-500",
    },
    {
      icon: Clock,
      label: "Último Envío",
      value: profileData?.lastSubmission ? new Date(profileData.lastSubmission).toLocaleDateString("es-ES") : "Nunca",
      color: "text-orange-500",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <IconComponent className={`w-5 h-5 mr-3 ${stat.color}`} />
                <span className="text-gray-700">{stat.label}</span>
              </div>
              <span className="font-semibold text-gray-900">{stat.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserStats
