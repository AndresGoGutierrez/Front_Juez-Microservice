"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"

function CodeEditor({ language, languages, onLanguageChange, onCodeChange, initialCode = "" }) {
  const [code, setCode] = useState(initialCode)
  const [editorLanguage, setEditorLanguage] = useState("python")

  // Mapeo de IDs de lenguaje a identificadores de Monaco
  const languageMap = {
    1: "python", // Python
    2: "cpp", // C++
    3: "java", // Java
    4: "javascript", // JavaScript
    5: "c", // C
    6: "csharp", // C#
    7: "go", // Go
    8: "ruby", // Ruby
    9: "rust", // Rust
  }

  // Actualizar el lenguaje del editor cuando cambia el lenguaje seleccionado
  useEffect(() => {
    const monacoLanguage = languageMap[language] || "plaintext"
    setEditorLanguage(monacoLanguage)

    // Iniciar con un editor vacío, sin plantillas
    if (code === "" || code === initialCode) {
      setCode("")
      onCodeChange("")
    }
  }, [language, initialCode, code, onCodeChange])

  const handleEditorChange = (value) => {
    if (value !== undefined) {
      setCode(value)
      onCodeChange(value)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
          Lenguaje
        </label>
        <select
          id="language-select"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          value={language}
          onChange={(e) => onLanguageChange(Number(e.target.value))}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="code-editor" className="block text-sm font-medium text-gray-700 mb-1">
          Código
        </label>
        <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: "400px" }}>
          <Editor
            height="100%"
            language={editorLanguage}
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
              renderLineHighlight: "all",
              tabSize: 4,
              wordWrap: "on",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
