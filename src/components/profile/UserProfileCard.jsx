import { User, Calendar, Mail, Trophy, Target } from "lucide-react"

const UserProfileCard = ({ user, profileData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <Mail className="w-5 h-5 mr-3 text-gray-400" />
          <span>{user?.email}</span>
        </div>

        {user?.created_at && (
          <div className="flex items-center text-gray-700">
            <Calendar className="w-5 h-5 mr-3 text-gray-400" />
            <span>Miembro desde {formatDate(user.created_at)}</span>
          </div>
        )}

        {profileData?.rank && (
          <div className="flex items-center text-gray-700">
            <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
            <span>Ranking: #{profileData.rank}</span>
          </div>
        )}

        <div className="flex items-center text-gray-700">
          <Target className="w-5 h-5 mr-3 text-green-500" />
          <span>Nivel: {profileData?.level || "Principiante"}</span>
        </div>
      </div>

      {user?.roles && user.roles.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Roles</h3>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileCard
