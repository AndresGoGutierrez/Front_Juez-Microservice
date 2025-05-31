"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  // Function to determine whether a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                Juez Virtual
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/") && !isActive("/submissions")
                    ? "border-primary-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Problemas
              </Link>
              {isAuthenticated && (
                <Link
                  to="/submissions"
                  className={`${
                    isActive("/submissions")
                      ? "border-primary-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Mis Envíos
                </Link>
              )}
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Documentos
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Hola, {user?.username}</span>
                {isAdmin() && (
                  <Link to="/admin" className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                    Panel Admin
                  </Link>
                )}
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
