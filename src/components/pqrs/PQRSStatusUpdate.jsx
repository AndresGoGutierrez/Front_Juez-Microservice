"use client"

import { useState, useEffect } from "react"
import { pqrsService } from "../../services/pqrsApi"
import ErrorMessage from "../common/ErrorMessage"

const PQRSStatusUpdate = ({ pqrsId, currentStatus, onStatusUpdate }) => {
  const [states, setStates] = useState([])
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await pqrsService.getStates()
        setStates(statesData)
      } catch (err) {
        setError("Error al cargar los estados")
        console.error(err)
      }
    }

    fetchStates()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await pqrsService.updatePQRSStatus(pqrsId, {
        estado_id: selectedStatus,
        comentario: comment,
      })

      setComment("")
      if (onStatusUpdate) {
        onStatusUpdate()
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el estado")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Actualizar Estado</h2>
      </div>
      <div className="px-6 py-4">
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Estado
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Agregue un comentario sobre el cambio de estado..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || selectedStatus === currentStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar Estado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PQRSStatusUpdate
