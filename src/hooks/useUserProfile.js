"use client"

import { useState, useEffect } from "react"
import { userProfileService } from "../services/userProfileApi"
import { useAuth } from "../context/AuthContext"

export const useUserProfile = (userId = null) => {
  const { user } = useAuth()
  const targetUserId = userId || user?.id

  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = async () => {
    if (!targetUserId) {
      setError("ID de usuario no disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await userProfileService.getUserProfile(targetUserId)
      setProfileData(data)
    } catch (err) {
      setError("Error al cargar el perfil")
      console.error("Error in useUserProfile:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [targetUserId])

  const refetch = () => {
    fetchProfile()
  }

  return {
    profileData,
    loading,
    error,
    refetch,
  }
}
