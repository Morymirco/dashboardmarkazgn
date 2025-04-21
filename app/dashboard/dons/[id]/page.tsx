"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Check, CreditCard, Download, MoreHorizontal, User, Heart, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Interface pour le type de don
interface Don {
  id: number
  montant: number
  date: string
  donateur: {
    nom: string
    email: string
    telephone: string
    avatar?: string
  }
  methode: string
  statut: "confirmé" | "en attente" | "annulé"
  reference: string
  message?: string
  projet?: string
}

// Données simulées pour un don
const mockDon: Don = {
  id: 1,
  montant: 500000,
  date: "2024-03-15T14:30:00",
  donateur: {
    nom: "Mamadou Diallo",
    email: "mamadou.diallo@example.com",
    telephone: "+224 622 33 44 55",
  },
  methode: "Mobile Money",
  statut: "confirmé",
  reference: "DON-20240315-001",
  message: "Pour soutenir l'éducation des enfants au centre coranique",
  projet: "Centre Al-Firdaws",
}

export default function DonDetailPage({ params }: { params: { id: string } }) {
  const [don, setDon] = useState<Don | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dans un environnement réel, vous feriez un appel API ici
    const fetchDon = async () => {
      try {
        // Simuler une requête API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setDon(mockDon)
      } catch (error) {
        console.error("Erreur lors du chargement du don:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDon()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement des détails du don...</p>
        </div>
      </div>
    )
  }

  if (!don) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/dons">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Détail du don</h2>
        </div>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-lg">Don non trouvé</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/dons">Retour à la liste</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/dons">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Détail du don</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Télécharger le reçu
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Envoyer un e-mail de remerciement</DropdownMenuItem>
              <DropdownMenuItem>Marquer comme traité</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Annuler le don</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du don</CardTitle>
              <CardDescription>Détails sur le don effectué par {don.donateur.nom}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="text-2xl font-bold">{don.montant.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Date</span>
                  <span>{format(new Date(don.date), "PPP à HH:mm", { locale: fr })}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Référence</span>
                  <span>{don.reference}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Méthode de paiement</span>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{don.methode}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge
                    variant={
                      don.statut === "confirmé" ? "default" : don.statut === "en attente" ? "outline" : "destructive"
                    }
                  >
                    {don.statut === "confirmé" && <Check className="h-3 w-3 mr-1" />}
                    {don.statut}
                  </Badge>
                </div>
                {don.projet && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Projet associé</span>
                    <span>{don.projet}</span>
                  </div>
                )}
              </div>

              {don.message && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Message du donateur:</h4>
                  <div className="bg-muted p-3 rounded-md text-muted-foreground italic">"{don.message}"</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historique des dons de ce donateur */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des dons</CardTitle>
              <CardDescription>Dons antérieurs effectués par ce donateur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{(300000 - index * 50000).toLocaleString("fr-FR")} FCFA</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(2024, 1, 15 - index * 30), "PP", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">confirmé</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir tous les dons de ce donateur
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donateur</CardTitle>
              <CardDescription>Informations sur le donateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={don.donateur.avatar || "/placeholder.svg"} alt={don.donateur.nom} />
                  <AvatarFallback className="text-xl">
                    {don.donateur.nom
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{don.donateur.nom}</h3>
                  <p className="text-sm text-muted-foreground">Donateur régulier</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{don.donateur.email}</p>
                    <p className="text-sm text-muted-foreground">{don.donateur.telephone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Historique</p>
                    <p className="text-sm text-muted-foreground">Donateur depuis: 2023</p>
                    <p className="text-sm text-muted-foreground">Nombre de dons: 4</p>
                    <p className="text-sm text-muted-foreground">Total des dons: 1,500,000 FCFA</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full">
                <User className="mr-2 h-4 w-4" />
                Voir le profil donateur
              </Button>
              <Button variant="outline" className="w-full">
                Envoyer un message
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Générer un reçu fiscal</Button>
              <Button variant="outline" className="w-full">
                Modifier le don
              </Button>
              <Button variant="outline" className="w-full">
                Envoyer un remerciement
              </Button>
              <Button variant="destructive" className="w-full">
                Annuler le don
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
