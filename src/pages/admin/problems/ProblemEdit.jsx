"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { adminProblemService } from "../../../services/adminApi"
import Loading from "../../../components/common/Loading"
import ErrorMessage from "../../../components/common/ErrorMessage"

const ProblemEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    difficulty: "medium",
    time_limit: 1.0,
    memory_limit: 256,
    is_public: true,
    tags: "",
    test_cases: [],
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        const problem = await adminProblemService.getById(id)

        // Normalizar los datos del problema
        setFormData({
          title: problem.title || "",
          description: problem.description || "",
          inputFormat: problem.inputFormat || problem.input_format || "",
          outputFormat: problem.outputFormat || problem.output_format || "",
          constraints: problem.constraints || "",
          difficulty: problem.difficulty || "medium",
          time_limit: problem.time_limit || 1.0,
          memory_limit: problem.memory_limit || 256,
          is_public: problem.is_public !== undefined ? problem.is_public : true,
          tags: problem.tags || "",
          test_cases: problem.test_cases || [],
        })

        setError(null)
      } catch (err) {
        console.error(`Error al obtener el problema ${id}:`, err)
        setError(`Error al cargar el problema. ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProblem()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.test_cases]
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      test_cases: updatedTestCases,
    })
  }

  const addTestCase = () => {
    setFormData({
      ...formData,
      test_cases: [
        ...formData.test_cases,
        {
          input_data: "",
          expected_output: "",
          is_sample: false,
          order: formData.test_cases.length,
        },
      ],
    })
  }

  const removeTestCase = (index) => {
    if (formData.test_cases.length <= 1) {
      alert("Debe haber al menos un caso de prueba")
      return
    }

    const updatedTestCases = formData.test_cases.filter((_, i) => i !== index)
    // Actualizar el orden de los casos de prueba restantes
    updatedTestCases.forEach((testCase, i) => {
      testCase.order = i
    })

    setFormData({
      ...formData,
      test_cases: updatedTestCases,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError(null)

      // Validar que haya al menos un caso de prueba
      if (formData.test_cases.length === 0) {
        throw new Error("Debe haber al menos un caso de prueba")
      }

      // Validar que los casos de prueba tengan datos
      const invalidTestCases = formData.test_cases.some((tc) => !tc.input_data?.trim() || !tc.expected_output?.trim())

      if (invalidTestCases) {
        throw new Error("Todos los casos de prueba deben tener datos de entrada y salida esperada")
      }

      const response = await adminProblemService.update(id, formData)
      console.log("Problema actualizado:", response)

      // Redirigir a la página de detalles del problema
      navigate(`/admin/problems/${id}`)
    } catch (err) {
      console.error("Error al actualizar problema:", err)
      setError(err.message || "Error al actualizar el problema. Por favor, intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loading message={`Cargando problema ${id}...`} />
      </AdminLayout>
    )
  }

  if (error && !formData.title) {
    return (
      <AdminLayout>
        <ErrorMessage message={error} />
        <div className="mt-4">
          <button
            onClick={() => navigate("/admin/problems")}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Volver a la lista de problemas
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Problema</h1>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción *
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="inputFormat" className="block text-sm font-medium text-gray-700">
                Formato de Entrada
              </label>
              <textarea
                name="inputFormat"
                id="inputFormat"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.inputFormat}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">
                Formato de Salida
              </label>
              <textarea
                name="outputFormat"
                id="outputFormat"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.outputFormat}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">
                Restricciones
              </label>
              <textarea
                name="constraints"
                id="constraints"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.constraints}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Dificultad *
              </label>
              <select
                name="difficulty"
                id="difficulty"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Fácil</option>
                <option value="medium">Medio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Etiquetas (separadas por comas)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.tags}
                onChange={handleChange}
                placeholder="ej: arrays, strings, math"
              />
            </div>

            <div>
              <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700">
                Tiempo Límite (segundos) *
              </label>
              <input
                type="number"
                name="time_limit"
                id="time_limit"
                required
                min="0.1"
                step="0.1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.time_limit}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="memory_limit" className="block text-sm font-medium text-gray-700">
                Memoria Límite (MB) *
              </label>
              <input
                type="number"
                name="memory_limit"
                id="memory_limit"
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.memory_limit}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_public"
                  id="is_public"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.is_public}
                  onChange={handleChange}
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                  Publicar problema (visible para todos los usuarios)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Casos de prueba */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Casos de Prueba</h2>
            <button
              type="button"
              onClick={addTestCase}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Añadir Caso de Prueba
            </button>
          </div>

          {formData.test_cases.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay casos de prueba. Añade al menos uno.</div>
          ) : (
            formData.test_cases.map((testCase, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Caso de Prueba #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`input_${index}`} className="block text-sm font-medium text-gray-700">
                      Entrada *
                    </label>
                    <textarea
                      id={`input_${index}`}
                      rows={4}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={testCase.input_data}
                      onChange={(e) => handleTestCaseChange(index, "input_data", e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor={`output_${index}`} className="block text-sm font-medium text-gray-700">
                      Salida Esperada *
                    </label>
                    <textarea
                      id={`output_${index}`}
                      rows={4}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={testCase.expected_output}
                      onChange={(e) => handleTestCaseChange(index, "expected_output", e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`is_sample_${index}`}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={testCase.is_sample}
                        onChange={(e) => handleTestCaseChange(index, "is_sample", e.target.checked)}
                      />
                      <label htmlFor={`is_sample_${index}`} className="ml-2 block text-sm text-gray-700">
                        Caso de ejemplo (visible para los usuarios)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/problems/${id}`)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary-600 text-black rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default ProblemEdit
