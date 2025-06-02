import api from "./api";

export const userProfileService = {
  // Obtener perfil completo del usuario
  getUserProfile: async (userId) => {
    try {
      console.log(`Solicitando perfil del usuario: ${userId}`);

      // Primero obtenemos todos los envíos del usuario
      const allSubmissions = await userProfileService.getRecentSubmissions(userId, 1000);
      
      // Calculamos estadísticas basadas en los envíos
      const userStats = userProfileService.calculateUserStats(allSubmissions);
      const solvedProblems = userProfileService.getAcceptedProblems(allSubmissions);
      const languageStats = userProfileService.calculateLanguageStats(allSubmissions);

      const profileData = {
        ...userStats,
        solvedProblems,
        languageStats,
        recentSubmissions: allSubmissions.slice(0, 50) // Mostrar solo los 50 más recientes
      };

      console.log("Perfil completo obtenido:", profileData);
      return profileData;
    } catch (error) {
      console.error("Error al obtener perfil del usuario:", error);
      throw error;
    }
  },

  // Calcular estadísticas basadas en los envíos
  calculateUserStats: (submissions) => {
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
    const successRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;
    const lastSubmission = submissions.length > 0 ? submissions[0].created_at : null;
    
    // Problemas únicos resueltos
    const uniqueSolvedProblems = [...new Set(
      submissions
        .filter(s => s.status === 'accepted')
        .map(s => s.problem_id)
    )].length;

    return {
      problemsSolved: uniqueSolvedProblems,
      totalSubmissions,
      successRate,
      lastSubmission,
      rank: null, // Esto podría venir de otro endpoint
      level: userProfileService.determineUserLevel(uniqueSolvedProblems)
    };
  },

  // Determinar nivel del usuario basado en problemas resueltos
  determineUserLevel: (solvedCount) => {
    if (solvedCount === 0) return "Principiante";
    if (solvedCount < 10) return "Novato";
    if (solvedCount < 30) return "Intermedio";
    if (solvedCount < 100) return "Avanzado";
    return "Experto";
  },

  // Obtener problemas aceptados únicos
  getAcceptedProblems: (submissions) => {
    const acceptedProblemsMap = {};
    
    submissions.forEach(sub => {
      if (sub.status === 'accepted' && !acceptedProblemsMap[sub.problem_id]) {
        acceptedProblemsMap[sub.problem_id] = {
          problem_id: sub.problem_id,
          title: sub.problem_title || `Problema ${sub.problem_id}`,
          solved_at: sub.created_at,
          language: sub.language
        };
      }
    });

    return Object.values(acceptedProblemsMap);
  },

  // Calcular estadísticas de lenguajes usados
  calculateLanguageStats: (submissions) => {
    const languageMap = {};
    const totalSubmissions = submissions.length;

    submissions.forEach(sub => {
      if (!languageMap[sub.language]) {
        languageMap[sub.language] = {
          language: sub.language,
          count: 0,
          accepted: 0
        };
      }
      languageMap[sub.language].count++;
      if (sub.status === 'accepted') {
        languageMap[sub.language].accepted++;
      }
    });

    return Object.values(languageMap).map(lang => ({
      ...lang,
      percentage: Math.round((lang.count / totalSubmissions) * 100),
      successRate: Math.round((lang.accepted / lang.count) * 100) || 0
    }));
  },

  // Obtener envíos recientes (ya funciona correctamente según tu comentario)
  getRecentSubmissions: async (userId, limit = 50) => {
    try {
      const response = await api.get(`/api/submissions`, {
        params: {
          user_id: userId,
          limit: limit
        }
      });
      
      return response.data.map(sub => ({
        id: sub.id_submission || sub.id,
        problem_id: sub.problem_id,
        problem_title: sub.problem?.title || `Problema ${sub.problem_id}`,
        status: sub.status_submission || sub.status,
        language: sub.language_submission || sub.language,
        created_at: sub.created_at
      }));
      
    } catch (error) {
      console.error("Error al obtener envíos recientes:", error);
      return [];
    }
  },

  // Obtener ranking del usuario (si está disponible)
  getUserRanking: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/ranking`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener ranking del usuario:", error);
      return { rank: null, totalUsers: 0 };
    }
  },
};