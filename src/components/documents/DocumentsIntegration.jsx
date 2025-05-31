// En src/components/documents/DocumentsIntegration.jsx (Virtual Judge)
import React from 'react'

const DocumentsIntegration = () => {
  // URL of the document microservice
  const documentsUrl = 'http://localhost:3000'
  
  // Obtain the authentication token
  const token = localStorage.getItem('auth_token')
  
  // Function to open the microservice in a new tab
  const openDocumentsService = () => {
    // Open in a new tab
    window.open(documentsUrl, '_blank')
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Biblioteca de Documentos</h2>
      <p className="text-gray-600 mb-4">
        Accede a nuestra biblioteca de documentos donde podrás ver, subir y descargar documentos PDF.
      </p>
      <button
        onClick={openDocumentsService}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Acceder a la Biblioteca
      </button>
    </div>
  )
}

export default DocumentsIntegration