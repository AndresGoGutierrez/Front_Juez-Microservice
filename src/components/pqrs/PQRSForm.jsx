"use client"

import { useState, useEffect } from "react"
import { pqrsService } from "../../services/pqrsApi"
import { useAuth } from "../../context/AuthContext"
import Loading from "../common/Loading"
import ErrorMessage from "../common/ErrorMessage"

const PQRSForm = ({ onSuccess }) => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
    categoria_id: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await pqrsService.getCategories()
        setCategories(categoriesData)
      } catch (err) {
        setError("Error al cargar las categorías")
        console.error(err)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await pqrsService.createPQRS(formData)
      setFormData({
        tipo: "",
        descripcion: "",
        categoria_id: "",
      })
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la PQRS")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Enviando PQRS..." />
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva PQRS</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de PQRS
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Petición">Petición</option>
            <option value="Queja">Queja</option>
            <option value="Reclamo">Reclamo</option>
            <option value="Sugerencia">Sugerencia</option>
            <option value="Información">Información</option>
          </select>
        </div>

        <div>
          <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa detalladamente su petición, queja, reclamo, sugerencia o solicitud de información..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormData({ tipo: "", descripcion: "", categoria_id: "" })}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar PQRS"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PQRSForm
