"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  getUserInfo,
  isAuthenticated,
  logout,
  getCurrentUser,
  setupTokenRefresh,
  refreshAccessToken,
  isTokenExpired,
  getAccessToken,
} from "@/lib/auth"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  logout: () => Promise<void>
  refreshUserInfo: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  logout: async () => {},
  refreshUserInfo: async () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Fonction pour rafraîchir les informations utilisateur
  const refreshUserInfo = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        return true
      } else if (pathname.startsWith("/dashboard")) {
        // Si l'utilisateur n'est pas authentifié et tente d'accéder au dashboard
        router.push("/")
        return false
      }
      return false
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des informations utilisateur:", error)
      return false
    }
  }

  // Vérifier et rafraîchir le token si nécessaire
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = getAccessToken()

      if (token && isTokenExpired(token)) {
        console.log("Token expiré au chargement, tentative de rafraîchissement...")
        const newToken = await refreshAccessToken()

        if (!newToken) {
          console.log("Échec du rafraîchissement du token au chargement, déconnexion...")
          await logout()
          router.push("/")
        } else {
          console.log("Token rafraîchi avec succès au chargement")
        }
      }
    }

    checkAndRefreshToken()
  }, [router])

  // Configurer le rafraîchissement automatique du token
  useEffect(() => {
    const cleanupTokenRefresh = setupTokenRefresh()
    return cleanupTokenRefresh
  }, [])

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      try {
        setLoading(true)
        const authenticated = isAuthenticated()

        if (authenticated) {
          console.log("Utilisateur authentifié, récupération des informations...")
          // Essayer de récupérer l'utilisateur depuis l'API
          const currentUser = await getCurrentUser()

          if (currentUser) {
            console.log("Informations utilisateur récupérées avec succès:", currentUser)
            setUser(currentUser)
          } else {
            console.log("Échec de la récupération des informations utilisateur, utilisation des données locales")
            // Si l'API échoue, utiliser les données du localStorage
            const localUser = getUserInfo()
            if (localUser) {
              setUser(localUser)
            } else if (pathname.startsWith("/dashboard")) {
              console.log("Aucune information utilisateur disponible, redirection vers la page de connexion")
              router.push("/")
            }
          }
        } else if (pathname.startsWith("/dashboard")) {
          console.log("Utilisateur non authentifié tentant d'accéder au dashboard, redirection")
          router.push("/")
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Rafraîchir les informations utilisateur périodiquement (toutes les 15 minutes)
  useEffect(() => {
    if (isAuthenticated()) {
      const interval = setInterval(
        () => {
          refreshUserInfo()
        },
        15 * 60 * 1000,
      ) // 15 minutes

      return () => clearInterval(interval)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        logout: handleLogout,
        refreshUserInfo,
        isLoading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
