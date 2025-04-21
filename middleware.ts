import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Récupérer le token d'accès depuis les cookies
  const accessToken = request.cookies.get("accessToken")?.value

  console.log("Middleware - URL:", request.nextUrl.pathname)
  console.log("Middleware - Token présent:", !!accessToken)

  // Vérifier si l'utilisateur tente d'accéder à une route protégée
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    if (!accessToken) {
      console.log("Middleware - Redirection vers la page de connexion")
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Vérifier si le token est expiré
    try {
      const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString())

      const isExpired = payload.exp < Math.floor(Date.now() / 1000)

      if (isExpired) {
        console.log("Middleware - Token expiré, redirection vers la page de connexion")
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      console.error("Middleware - Erreur lors de la vérification du token:", error)
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Si l'utilisateur est déjà authentifié et tente d'accéder à la page de connexion,
  // rediriger vers le tableau de bord
  if (request.nextUrl.pathname === "/" && accessToken) {
    try {
      const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString())

      const isExpired = payload.exp < Math.floor(Date.now() / 1000)

      if (!isExpired) {
        console.log("Middleware - Redirection vers le tableau de bord")
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.error("Middleware - Erreur lors de la vérification du token:", error)
    }
  }

  return NextResponse.next()
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
