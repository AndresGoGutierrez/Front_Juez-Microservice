import { Code2, BarChart3 } from "lucide-react"

const LanguageStats = ({ profileData }) => {
  const languageStats = profileData?.languageStats || []

  const getLanguageColor = (language) => {

    const baseLanguage = String(language).split(' ')[0].toLowerCase().trim();
    const colors = {
      python: "bg-blue-500",
      javascript: "bg-yellow-500",
      java: "bg-red-500",
      "c++": "bg-purple-500",
      c: "bg-gray-500",
      go: "bg-cyan-500",
      rust: "bg-orange-500",
      ruby: "bg-red-400",
      "c#": "bg-green-500",
      typescript: "bg-blue-400",
      php: "bg-indigo-400",
      swift: "bg-orange-400",
      kotlin: "bg-purple-400",
      r: "bg-blue-300",
      bash: "bg-gray-600",
      default: "bg-gray-400"
    }
    
    // Mapeo especial para nombres compuestos
    const specialCases = {
        "c++": "cpp",
        "c#": "csharp" // No necesario aquí pero por si acaso
    };

    const normalizedLanguage = specialCases[baseLanguage] || baseLanguage;
    return colors[normalizedLanguage] || colors.default;
  }

  // Calcular el máximo de envíos (asegurando mínimo 1 para evitar división por 0)
  const maxSubmissions = Math.max(
    ...languageStats.map(lang => lang.count || lang.submissions || 0), 
    1
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Code2 className="w-5 h-5 mr-2 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Lenguajes de Programación</h3>
      </div>

      {languageStats.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay estadísticas de lenguajes disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {languageStats.map((lang, index) => {
            // Asegurar compatibilidad con diferentes estructuras de datos
            const submissions = lang.count || lang.submissions || 0
            const accepted = lang.accepted || 0
            const successRate = submissions > 0 
              ? Math.round((accepted / submissions) * 100) 
              : 0
            
            const percentage = (submissions / maxSubmissions) * 100

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getLanguageColor(lang.language)}`}></div>
                    <span className="font-medium text-gray-900 capitalize">
                      {lang.language.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {submissions}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">envíos</span>
                  </div>
                </div>
                
                {/* Barra de progreso total */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getLanguageColor(lang.language)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                {/* Barra de progreso de aceptados */}
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                  <div
                    className="h-1 rounded-full bg-green-500"
                    style={{ 
                      width: `${successRate}%`,
                      opacity: submissions > 0 ? 1 : 0.3
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Aceptados: {accepted}</span>
                  <span>
                    Tasa: {successRate}%
                    {submissions === 0 && ' (sin envíos)'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageStats