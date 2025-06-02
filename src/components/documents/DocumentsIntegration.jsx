import React from 'react'
import { useNavigate } from 'react-router-dom'

const DocumentsIntegration = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('auth_token')

  // Si no hay token, redirige al login o a una ruta protegida
  if (!token) {
    navigate('/login') // o la ruta que uses para login
    return null
  }

  const documentsUrl = 'http://localhost:3000'

  const goToDocumentsService = () => {
    window.location.href = documentsUrl
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Biblioteca de Documentos</h2>
      <p className="text-gray-600 mb-4">
        Accede a nuestra biblioteca de documentos donde podrás ver, subir y descargar documentos PDF.
      </p>
      <button
        onClick={goToDocumentsService}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Acceder a la Biblioteca
      </button>
    </div>
  )
}

export default DocumentsIntegration
