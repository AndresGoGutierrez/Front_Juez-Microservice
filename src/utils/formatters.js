// Formatear el tamaño de memoria
export const formatMemory = (bytes) => {
  if (!bytes) return "N/A";

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

// Formatear fecha
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Obtener la clase CSS para la dificultad del problema
export const getDifficultyClass = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "fácil":
      return "difficulty-easy";
    case "medium":
    case "medio":
      return "difficulty-medium";
    case "hard":
    case "difícil":
      return "difficulty-hard";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Obtener la clase CSS para el estado del envío
export const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "status-accepted";
    case "wrong_answer":
      return "status-wrong-answer";
    case "time_limit_exceeded":
      return "status-time-limit";
    case "compilation_error":
      return "status-compilation-error";
    case "runtime_error":
      return "status-runtime-error";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Formatear texto con saltos de línea
export const formatText = (text) => {
  if (!text) return "";
  return text.replace(/\n/g, "<br>");
};