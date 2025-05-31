"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 mr-8">
              Juez Virtual
            </Link>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Panel de Administración
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user?.username} ({user?.email})
            </span>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              Volver al sitio
            </Link>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white shadow rounded-lg p-4">
            <nav className="space-y-1">
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin") &&
                  !isActive("/admin/problems") &&
                  !isActive("/admin/users") &&
                  !isActive("/admin/submissions")
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/problems"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/problems") ? "bg-primary-100 text-primary-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Problemas
              </Link>
              <Link
                to="/admin/users"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/users") ? "bg-primary-100 text-primary-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Usuarios
              </Link>
              <Link
                to="/admin/submissions"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/submissions") ? "bg-primary-100 text-primary-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Envíos
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-white shadow rounded-lg p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
