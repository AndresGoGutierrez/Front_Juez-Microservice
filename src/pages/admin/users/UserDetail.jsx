import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { adminUserService } from "../../../services/adminApi"
import Loading from "../../../components/common/Loading"
import ErrorMessage from "../../../components/common/ErrorMessage"

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")


  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Obtener detalles del usuario
        const userData = await adminUserService.getById(id)
        setUser(userData)

        // Obtener envíos del usuario
        const submissionsData = await adminUserService.getUserSubmissions(id)
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : submissionsData.submissions || [])

        setError(null)
      } catch (err) {
        console.error(`Error al obtener datos del usuario ${id}:`, err)
        setError(`Error al cargar el usuario. ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserData()
    }
  }, [id])

  const handleRoleClick = () => {
    setSelectedRole(user.roles && user.roles.length > 0 ? user.roles[0] : "user")
    setShowRoleModal(true)
  }

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value)
  }

  const handleRoleSubmit = async () => {
    try {
      await adminUserService.changeRole(id, selectedRole)

      // Actualizar el usuario en el estado
      setUser({
        ...user,
        roles: [selectedRole],
      })

      setShowRoleModal(false)
    } catch (error) {
      console.error(`Error al cambiar el rol del usuario ${id}:`, error)
      alert(`Error al cambiar el rol: ${error.message}`)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"
    return new Date(dateString).toLocaleString()
  }

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || ""

    if (statusLower.includes("accepted")) return "bg-green-100 text-green-800"
    if (statusLower.includes("wrong")) return "bg-red-100 text-red-800"
    if (statusLower.includes("time limit")) return "bg-yellow-100 text-yellow-800"
    if (statusLower.includes("compilation")) return "bg-indigo-100 text-indigo-800"
    if (statusLower.includes("runtime")) return "bg-pink-100 text-pink-800"
    if (statusLower.includes("pending") || statusLower.includes("queue") || statusLower.includes("processing"))
      return "bg-blue-100 text-blue-800"

    return "bg-gray-100 text-gray-800"
  }

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "moderator":
        return "bg-yellow-100 text-yellow-800"
      case "user":
      default:
        return "bg-green-100 text-green-800"
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loading message={`Cargando usuario ${id}...`} />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <ErrorMessage message={error} />
        <div className="mt-4">
          <button
            onClick={() => navigate("/api/users")}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <ErrorMessage message={`No se encontró el usuario con ID ${id}`} />
        <div className="mt-4">
          <button
            onClick={() => navigate("/api/users")}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>
        <button
          onClick={handleRoleClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Cambiar Rol
        </button>
      </div>

      {/* Información del usuario */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{user.username}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">ID: {user.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            {user.roles &&
              user.roles.map((role, index) => (
                <span key={index} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleClass(role)}`}>
                  {role}
                </span>
              ))}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nombre de Usuario</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Roles</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <span
                        key={index}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleClass(role)}`}
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Sin roles asignados
                    </span>
                  )}
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fecha de Registro</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.updatedAt ? formatDate(user.updatedAt) : "No actualizado"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total de Envíos</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{submissions.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Envíos del usuario */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Envíos del Usuario</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Historial de envíos</p>
          </div>
          <Link to={`/admin/submissions?userId=${id}`} className="text-sm text-primary-600 hover:text-primary-900">
            Ver todos los envíos →
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {submissions.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-gray-500">Este usuario no ha realizado envíos</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Problema
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Lenguaje
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.slice(0, 10).map((submission) => (
                    <tr key={submission.id || submission.id_submission}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.id || submission.id_submission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/problems/${submission.problem_id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Problema #{submission.problem_id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(submission.status || submission.status_submission)}`}
                        >
                          {submission.status || submission.status_submission}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.language || submission.language_submission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/submissions/${submission.id || submission.id_submission}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para cambiar rol */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar Rol de Usuario</h3>
            <p className="text-sm text-gray-500 mb-4">Selecciona el nuevo rol para el usuario {user.username}.</p>

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <option value="user">Usuario</option>
                <option value="moderator">Moderador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleRoleSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default UserDetail
