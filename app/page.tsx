"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { isAuthenticated } from "@/lib/auth"
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, rediriger vers le tableau de bord
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold">MarkazGN</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="https://www.markazgn.org"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Site principal
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 lg:p-8 xl:p-12">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Administration MarkazGN</h1>
              <p className="text-muted-foreground">Connectez-vous pour accéder au tableau de bord</p>
            </div>
            <LoginForm />
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Plateforme réservée aux administrateurs de MarkazGN.
                <br />
                Pour toute question, contactez le support technique.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Bienvenue sur la plateforme d'administration</h2>
                <p className="text-muted-foreground">
                  MarkazGN est né d'une vision ambitieuse : créer un pont entre les apprenants et les centres
                  d'excellence en éducation coranique en Guinée.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Gestion des centres</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Gérez les centres d'éducation coranique enregistrés sur la plateforme.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Gestion des événements</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Organisez et suivez les événements et activités.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Gestion des utilisateurs</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Administrez les comptes des enseignants et des étudiants.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Suivez les performances et l'évolution de la plateforme.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MarkazGN. Tous droits réservés.</p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Conditions d'utilisation
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Politique de confidentialité
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
