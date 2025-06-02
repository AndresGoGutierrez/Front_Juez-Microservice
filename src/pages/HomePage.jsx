"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProblemList from "../components/problems/ProblemList";
import DocumentsIntegration from "../components/documents/DocumentsIntegration";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { useProblems } from "../hooks/useProblems";

const HomePage = () => {
  const { problems, loading, error } = useProblems();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  // Filter issues by search term and difficulty
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "" ||
      problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return <Loading message="Cargando problemas..." />;
  }

  // Display authentication message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 pt-12 flex justify-center">
        <div className=" w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 mb-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-center">
              Inicia sesión para ver los problemas
            </h2>
            <p className="mb-4 text-center">
              Necesitas iniciar sesión para acceder a la lista de problemas y
              enviar soluciones.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-600 text-black rounded-md hover:bg-primary-700"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display error message if there is a problem loading data
  if (error && error !== "Necesitas iniciar sesión para ver los problemas") {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      

      {/* 👉 Document integration here */}
      <DocumentsIntegration />

      {problems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No se encontraron problemas con los filtros actuales.
          </p>
        </div>
      ) : (
        <ProblemList problems={filteredProblems} />
      )}
    </div>
  );
};

export default HomePage;
