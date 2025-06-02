"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { userProfileService } from "../services/userProfileApi"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import UserProfileCard from "../components/profile/UserProfileCard"
import UserStats from "../components/profile/UserStats"
import ProblemsSolved from "../components/profile/ProblemsSolved"
import LanguageStats from "../components/profile/LanguageStats"
import SubmissionHistory from "../components/profile/SubmissionHistory"

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated || !user) {
        setError("Usuario no autenticado")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await userProfileService.getUserProfile(user.id)
        setProfileData(data)
        setError(null)
      } catch (err) {
        setError("Error al cargar el perfil del usuario")
        console.error("Error fetching profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user, isAuthenticated])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Información del usuario */}
            <div className="lg:col-span-1">
              <UserProfileCard user={user} profileData={profileData} />
              <div className="mt-6">
                <UserStats profileData={profileData} />
              </div>
            </div>

            {/* Columna derecha - Estadísticas y actividad */}
            <div className="lg:col-span-2 space-y-8">
              <ProblemsSolved profileData={profileData} />
              <LanguageStats profileData={profileData} />
              <SubmissionHistory profileData={profileData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage
