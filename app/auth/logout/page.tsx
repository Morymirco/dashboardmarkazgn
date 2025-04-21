"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()

        // Redirection vers la page d'accueil après 2 secondes
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (err) {
        setError("Une erreur est survenue lors de la déconnexion. Vous avez tout de même été déconnecté localement.")
      } finally {
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [router, logout])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLoggingOut ? "Déconnexion en cours..." : "Déconnexion réussie"}</CardTitle>
          <CardDescription>
            {isLoggingOut
              ? "Veuillez patienter pendant que nous vous déconnectons..."
              : "Vous avez été déconnecté avec succès de votre compte administrateur."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoggingOut ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <p className="text-muted-foreground">
              {error || "Vous serez redirigé vers la page d'accueil dans quelques secondes..."}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
