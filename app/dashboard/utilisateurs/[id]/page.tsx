"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Phone,
  Building,
  MoreHorizontal,
  Edit,
  Key,
  Shield,
  FileText,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Utilisateur {
  id: number
  nom: string
  email: string
  role: string
  centre?: string
  telephone?: string
  status: "Actif" | "Inactif"
  dateInscription: string
  avatar?: string
}

// Données simulées pour l'utilisateur
const mockUtilisateur: Utilisateur = {
  id: 1,
  nom: "Mamadou Diallo",
  email: "mamadou.diallo@example.com",
  role: "Administrateur",
  centre: "Centre Islamique Al-Firdaws",
  telephone: "+224 623 45 67 89",
  status: "Actif",
  dateInscription: "2023-01-15",
}

export default function UtilisateurDetailPage({ params }: { params: { id: string } }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dans un environnement réel, vous feriez un appel API ici
    const fetchUtilisateur = async () => {
      try {
        // Simuler une requête API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setUtilisateur(mockUtilisateur)
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUtilisateur()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement des détails de l'utilisateur...</p>
        </div>
      </div>
    )
  }

  if (!utilisateur) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/utilisateurs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Détail de l'utilisateur</h2>
        </div>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-lg">Utilisateur non trouvé</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/utilisateurs">Retour à la liste</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dateInscriptionFormatee = format(new Date(utilisateur.dateInscription), "PPP", { locale: fr })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/utilisateurs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Profil utilisateur</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/utilisateurs/${params.id}/modifier`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Key className="mr-2 h-4 w-4" />
                Réinitialiser le mot de passe
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Changer le rôle
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Désactiver le compte</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={utilisateur.avatar || "/placeholder.svg"} alt={utilisateur.nom} />
              <AvatarFallback className="text-2xl">
                {utilisateur.nom
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{utilisateur.nom}</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className="bg-primary/10 text-primary border-primary/20">{utilisateur.role}</Badge>
                <Badge
                  variant={utilisateur.status === "Actif" ? "default" : "destructive"}
                  className={
                    utilisateur.status === "Actif"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : ""
                  }
                >
                  {utilisateur.status}
                </Badge>
                <p className="text-sm text-muted-foreground">Inscrit le {dateInscriptionFormatee}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{utilisateur.email}</p>
              </div>
              {utilisateur.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{utilisateur.telephone}</p>
                </div>
              )}
              {utilisateur.centre && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{utilisateur.centre}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activite" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activite" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Activité récente
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Historique des actions récentes de l'utilisateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {index === 0
                        ? "A modifié un événement"
                        : index === 1
                          ? "A créé un nouvel article"
                          : index === 2
                            ? "A ajouté un utilisateur"
                            : index === 3
                              ? "S'est connecté au système"
                              : "A mis à jour les informations d'un centre"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(2024, 2, 20 - index * 2), "PP à HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir toute l'historique
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Historique des paiements et transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground mb-4">Aucune transaction trouvée pour cet utilisateur.</p>
                <Button variant="outline">Enregistrer une nouvelle transaction</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Gérer les droits d'accès de l'utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Gestion des utilisateurs</p>
                      <p className="text-xs text-muted-foreground">Créer, modifier et supprimer des utilisateurs</p>
                    </div>
                  </div>
                  <Badge variant="outline">Autorisé</Badge>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Gestion des événements</p>
                      <p className="text-xs text-muted-foreground">Créer, modifier et supprimer des événements</p>
                    </div>
                  </div>
                  <Badge variant="outline">Autorisé</Badge>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Gestion des centres</p>
                      <p className="text-xs text-muted-foreground">Créer, modifier et supprimer des centres</p>
                    </div>
                  </div>
                  <Badge variant="outline">Autorisé</Badge>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Gestion du blog</p>
                      <p className="text-xs text-muted-foreground">Créer, modifier et supprimer des articles</p>
                    </div>
                  </div>
                  <Badge variant="outline">Autorisé</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Modifier les permissions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
