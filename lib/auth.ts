// Types pour l'authentification
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
    email: string
    password: string
    firstname: string
    lastname: string
    image: string | null
    tel: string | null
    role: string
  }
}

export interface RefreshResponse {
  access_token: string
}

export interface AuthError {
  detail?: string
  email?: string[]
  password?: string[]
  non_field_errors?: string[]
}

// Fonction pour se connecter à l'API
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch("https://api.markazgn.org/users/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData: AuthError = await response.json()
    throw new Error(
      errorData.detail ||
        errorData.non_field_errors?.[0] ||
        errorData.email?.[0] ||
        errorData.password?.[0] ||
        "Une erreur est survenue lors de la connexion",
    )
  }

  return response.json()
}

// Fonction pour stocker les tokens dans le localStorage
export function setAuthTokens(tokens: { access_token: string; refresh_token?: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", tokens.access_token)

    if (tokens.refresh_token) {
      localStorage.setItem("refreshToken", tokens.refresh_token)
    }

    // Synchroniser avec les cookies pour le middleware
    document.cookie = `accessToken=${tokens.access_token}; path=/; max-age=86400; SameSite=Strict`
  }
}

// Fonction pour stocker les informations utilisateur
export function setUserInfo(user: LoginResponse["user"]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Fonction pour vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("accessToken")
}

// Fonction pour récupérer le token d'accès
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken")
}

// Fonction pour récupérer le token de rafraîchissement
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refreshToken")
}

// Fonction pour récupérer les informations utilisateur
export function getUserInfo(): LoginResponse["user"] | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    return null
  }
}

// Fonction pour rafraîchir le token d'accès
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch("https://api.markazgn.org/users/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Échec du rafraîchissement du token")
    }

    const data: RefreshResponse = await response.json()

    // Mettre à jour le token d'accès
    setAuthTokens({ access_token: data.access_token })

    return data.access_token
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error)
    return null
  }
}

// Fonction pour se déconnecter
export async function logout() {
  const token = getAccessToken()

  try {
    // Appel à l'API de déconnexion
    if (token) {
      await fetch("https://api.markazgn.org/auth/logout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
  } finally {
    if (typeof window !== "undefined") {
      // Supprimer les tokens et les informations utilisateur du localStorage
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")

      // Supprimer le cookie
      document.cookie = "accessToken=; path=/; max-age=0"
    }
  }
}

// Fonction pour récupérer l'utilisateur courant depuis l'API
export async function getCurrentUser() {
  let token = getAccessToken()

  if (!token) {
    return null
  }

  try {
    let response = await fetch("https://api.markazgn.org/users/getuser/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })

    // Si le token est expiré, essayer de le rafraîchir
    if (response.status === 401) {
      console.log("Token expiré, tentative de rafraîchissement...")
      const newToken = await refreshAccessToken()

      if (!newToken) {
        console.log("Échec du rafraîchissement du token, déconnexion...")
        await logout()
        return null
      }

      // Réessayer avec le nouveau token
      console.log("Token rafraîchi avec succès, nouvelle tentative...")
      token = newToken
      response = await fetch("https://api.markazgn.org/users/getuser/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        console.log("Échec de la récupération de l'utilisateur même après rafraîchissement du token")
        await logout()
        return null
      }
    } else if (!response.ok) {
      console.log("Erreur lors de la récupération de l'utilisateur:", response.status)
      await logout()
      return null
    }

    const userData = await response.json()

    // Mettre à jour les informations utilisateur dans le localStorage
    setUserInfo(userData)

    return userData
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return null
  }
}

// Fonction pour vérifier si le token est expiré
export function isTokenExpired(token: string): boolean {
  if (!token) return true

  try {
    // Décoder le token JWT (sans vérification de signature)
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    const { exp } = JSON.parse(jsonPayload)

    // Vérifier si le token est expiré
    const currentTime = Math.floor(Date.now() / 1000)
    return exp < currentTime
  } catch (error) {
    console.error("Erreur lors de la vérification de l'expiration du token:", error)
    return true
  }
}

// Fonction pour configurer un intervalle de rafraîchissement du token
export function setupTokenRefresh() {
  if (typeof window === "undefined") return

  // Rafraîchir le token toutes les 10 minutes
  const interval = setInterval(
    async () => {
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
    },
    10 * 60 * 1000,
  ) // 10 minutes

  return () => clearInterval(interval)
}
