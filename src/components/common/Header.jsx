"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Logo from "../../assets/Logo_black.png"

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Function to determine whether a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const isAdmin = () => {
    return user?.roles?.includes("admin")
  }

  const isModerator = () => {
    return user?.roles?.includes("moderator")
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={Logo || "/placeholder.svg"} alt="CodeDev Logo" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/profile"
                className={`${
                  isActive("/profile")
                    ? "border-primary-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Mi Perfil
              </Link>
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
                <>
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
                  <a
                    href="http://localhost:3000"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Documentos
                  </a>
                  {isAuthenticated && !isAdmin() && !isModerator() && (
                    <Link
                      to="/pqrs"
                      className={`${
                        isActive("/pqrs")
                          ? "border-primary-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      PQRS
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Hola, {user?.username}</span>
                {(isAdmin() || isModerator()) && (
                  <Link to="/pqrs" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    PQRS Admin
                  </Link>
                )}
                {isAdmin() && (
                  <Link to="/admin" className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                    Panel Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
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
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Menú principal</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`${
              isActive("/profile")
                ? "bg-primary-50 border-primary-500 text-primary-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Mi Perfil
          </Link>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`${
              isActive("/")
                ? "bg-primary-50 border-primary-500 text-primary-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Problemas
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive("/submissions")
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                Mis Envíos
              </Link>
              <a
                href="http://localhost:3000"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Documentos
              </a>
              {isAuthenticated && !isAdmin() && !isModerator() && (
                <Link
                  to="/pqrs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${
                    isActive("/pqrs")
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  PQRS
                </Link>
              )}
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <span className="text-sm text-gray-700">Hola, {user?.username}</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {(isAdmin() || isModerator()) && (
                  <Link
                    to="/pqrs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    PQRS Admin
                  </Link>
                )}
                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
