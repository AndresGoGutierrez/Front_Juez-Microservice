const SubmissionResult = ({ submission }) => {
  console.log("Renderizando SubmissionResult con:", submission)

  if (!submission) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
        <p>No hay datos de envío disponibles.</p>
      </div>
    )
  }

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || ""

    if (statusLower.includes("accepted")) return "status-accepted"
    if (statusLower.includes("wrong")) return "status-wrong-answer"
    if (statusLower.includes("time limit")) return "status-time-limit"
    if (statusLower.includes("compilation")) return "status-compilation-error"
    if (statusLower.includes("runtime")) return "status-runtime-error"
    if (statusLower.includes("pending") || statusLower.includes("queue") || statusLower.includes("processing"))
      return "bg-blue-100 text-blue-800"

    return "bg-gray-100 text-gray-800"
  }

  const formatMemory = (bytes) => {
    if (!bytes) return "N/A"

    const kb = bytes / 1024
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`
    }

    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
  }

  const formatTime = (time) => {
    if (!time) return "N/A"
    return `${time.toFixed(3)} s`
  }

  const isPending =
    submission.status?.toLowerCase().includes("pending") ||
    submission.status?.toLowerCase().includes("queue") ||
    submission.status?.toLowerCase().includes("processing")

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Resultado del Envío</h3>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(submission.status)} mr-2`}>
            {submission.status || "Estado desconocido"}
          </span>
          <span className="text-gray-500 text-sm">
            Tiempo: {formatTime(submission.execution_time)} | Memoria: {formatMemory(submission.memory_used)}
          </span>
        </div>

        {submission.status_description && <p className="mt-2 text-gray-700">{submission.status_description}</p>}
      </div>

      {isPending && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-4 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>
            Tu solución está siendo evaluada. Esta página se actualizará automáticamente cuando el resultado esté
            disponible.
          </p>
        </div>
      )}

      {submission.compile_output && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Salida de Compilación</h4>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
            <code>{submission.compile_output}</code>
          </pre>
        </div>
      )}

      {submission.stderr && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Error de Ejecución</h4>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
            <code>{submission.stderr}</code>
          </pre>
        </div>
      )}

      {submission.test_cases && submission.test_cases.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Casos de Prueba</h4>
          <div className="space-y-4">
            {submission.test_cases.map((testCase, index) => {
              const passed = testCase.passed || testCase.status?.toLowerCase().includes("accepted")
              const bgClass = passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              const textColor = passed ? "text-green-800" : "text-red-800"

              return (
                <div key={index} className={`${bgClass} border rounded-lg p-4`}>
                  <h5 className={`${textColor} font-medium`}>Caso de prueba #{index + 1}</h5>
                  {testCase.status_description && (
                    <p className={`text-sm ${textColor} mb-2`}>{testCase.status_description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Entrada:</p>
                      <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                        <code>{testCase.input || testCase.input_data}</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Salida esperada:</p>
                      <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                        <code>{testCase.expected_output}</code>
                      </pre>
                    </div>
                  </div>

                  {!passed && (testCase.actual_output || testCase.output) && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Tu salida:</p>
                      <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                        <code>{testCase.actual_output || testCase.output}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2">Detalles del Envío</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">ID del Problema:</p>
            <p className="text-sm">{submission.problem_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Lenguaje:</p>
            <p className="text-sm">{submission.language_submission || "No especificado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Fecha de Envío:</p>
            <p className="text-sm">{new Date(submission.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">ID del Envío:</p>
            <p className="text-sm">{submission.id || submission.id_submission}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionResult
