import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json({ error: "Refresh token manquant" }, { status: 400 })
    }

    const response = await fetch("https://api.markazgn.org/users/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh_token }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || "Échec du rafraîchissement du token" },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Définir le cookie avec le nouveau token
    const headers = new Headers()
    headers.append("Set-Cookie", `accessToken=${data.access_token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`)

    return NextResponse.json(data, {
      headers,
    })
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error)
    return NextResponse.json({ error: "Erreur serveur lors du rafraîchissement du token" }, { status: 500 })
  }
}
