"use client"

import { useEffect } from "react"
import { getAccessToken, isTokenExpired, refreshAccessToken, logout } from "@/lib/auth"

export function TokenRefreshHandler() {
  useEffect(() => {
    // Vérifier le token toutes les minutes
    const interval = setInterval(async () => {
      const token = getAccessToken()

      if (token && isTokenExpired(token)) {
        console.log("Token expiré, rafraîchissement automatique...")
        const newToken = await refreshAccessToken()

        if (!newToken) {
          console.log("Échec du rafraîchissement automatique, déconnexion...")
          await logout()
          window.location.href = "/"
        } else {
          console.log("Token rafraîchi avec succès")
        }
      }
    }, 60 * 1000) // Vérifier chaque minute

    return () => clearInterval(interval)
  }, [])

  // Ce composant ne rend rien, il gère simplement le rafraîchissement du token
  return null
}
