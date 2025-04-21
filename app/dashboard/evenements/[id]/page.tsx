"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Share2, Users, User, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getAccessToken } from "@/lib/auth"

interface ImageType {
  id: number
  image: string
  evenement: number
}

interface Evenement {
  id: number
  nom: string
  is_payement: boolean
  date_debut: string
  date_fin: string
  description: string
  montant: number
  is_published: boolean
  autre: string
  images: ImageType[]
  // Champs supplémentaires pour l'affichage
  lieu?: string
  type?: string
  programme?: string[]
  prix?: string
  places?: number
  placesRestantes?: number
  organisateur?: string
  contact?: string
  intervenants?: string[]
}

export default function EvenementDetailPage({ params }: { params: { id: string } }) {
  const [evenement, setEvenement] = useState<Evenement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchEvenement = async () => {
      setLoading(true)
      try {
        const token = getAccessToken()
        const response = await fetch(`https://api.markazgn.org/api/evenement/evenement/${params.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Impossible de récupérer les détails de l'événement")
        }

        const data = await response.json()
        setEvenement(data)
      } catch (err) {
        console.error(err)
        setError("Une erreur est survenue lors du chargement de l'événement")
      } finally {
        setLoading(false)
      }
    }

    fetchEvenement()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement de l'événement...</p>
        </div>
      </div>
    )
  }

  if (error || !evenement) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/evenements">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Détail de l'événement</h2>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{error || "Événement non trouvé"}</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/evenements">Retour à la liste</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formater les dates
  const dateDebut = new Date(evenement.date_debut)
  const dateFin = new Date(evenement.date_fin)

  const dateDebutFormatee = format(dateDebut, "dd MMMM yyyy", { locale: fr })
  const dateFinFormatee = format(dateFin, "dd MMMM yyyy", { locale: fr })

  const heureDebutFormatee = format(dateDebut, "HH:mm", { locale: fr })
  const heureFinFormatee = format(dateFin, "HH:mm", { locale: fr })

  // Pour la démo, on utilise des valeurs fictives pour certains champs
  const placesTotal = evenement.places || 100
  const placesRestantes = evenement.placesRestantes || 50
  const placesOccupees = placesTotal - placesRestantes
  const pourcentageOccupe = Math.round((placesOccupees / placesTotal) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/evenements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Détail de l'événement</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button asChild>
            <Link href={`/dashboard/evenements/${evenement.id}/modifier`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      {/* En-tête de l'événement */}
      <div className="relative rounded-lg overflow-hidden">
        {evenement.images && evenement.images.length > 0 ? (
          <div className="aspect-[21/9] w-full relative">
            <Image
              src={evenement.images[activeImage]?.image || "/placeholder.svg"}
              alt={evenement.nom}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[21/9] w-full relative bg-muted flex items-center justify-center">
            <Calendar className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <Badge className="mb-2 self-start" variant={evenement.is_published ? "secondary" : "outline"}>
            {evenement.is_published ? "Publié" : "Non publié"}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{evenement.nom}</h1>
          <div className="flex flex-wrap gap-4 text-white">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{dateDebutFormatee}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {heureDebutFormatee} - {heureFinFormatee}
              </span>
            </div>
            {evenement.lieu && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{evenement.lieu}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Miniatures des images */}
      {evenement.images && evenement.images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {evenement.images.map((image, index) => (
            <button
              key={index}
              className={`relative aspect-square overflow-hidden rounded-md ${
                index === activeImage ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveImage(index)}
            >
              <Image
                src={image.image || "/placeholder.svg"}
                alt={`${evenement.nom} - Miniature ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">À propos de cet événement</h3>
              <p className="text-muted-foreground whitespace-pre-line">{evenement.description}</p>

              {evenement.autre && (
                <>
                  <h4 className="text-lg font-semibold mt-6 mb-2">Informations complémentaires</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{evenement.autre}</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Programme */}
          {evenement.programme && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Programme détaillé</h3>
                <div className="space-y-4">
                  {evenement.programme.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {index + 1}
                        </div>
                        {index < evenement.programme!.length - 1 && <div className="w-0.5 h-full bg-border mt-1"></div>}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intervenants */}
          {evenement.intervenants && evenement.intervenants.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Intervenants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evenement.intervenants.map((intervenant, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{intervenant}</p>
                        <p className="text-xs text-muted-foreground">Intervenant</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Informations pratiques */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Informations pratiques</h3>

              <div>
                <p className="text-sm font-medium mb-1">Prix</p>
                <p className="text-2xl font-bold">
                  {evenement.is_payement ? `${evenement.montant.toLocaleString("fr-FR")} GNF` : "Gratuit"}
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Places disponibles</p>
                  <p className="text-sm font-medium">
                    {placesRestantes} / {placesTotal}
                  </p>
                </div>
                <Progress value={pourcentageOccupe} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {pourcentageOccupe >= 75 ? "Places limitées, réservez rapidement !" : "Places encore disponibles"}
                </p>
              </div>

              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Gérer les inscriptions
              </Button>
            </CardContent>
          </Card>

          {/* Organisateur */}
          {evenement.organisateur && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">Organisateur</h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{evenement.organisateur}</p>
                    <p className="text-xs text-muted-foreground">Organisateur principal</p>
                  </div>
                </div>
                {evenement.contact && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-1">Contact</p>
                      <p className="text-muted-foreground">{evenement.contact}</p>
                    </div>
                  </>
                )}
                <Button variant="outline" className="w-full">
                  Contacter l'organisateur
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Actions administratives */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Actions administratives</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Exporter la liste des participants
                </Button>
                <Button variant="outline" className="w-full">
                  Envoyer un rappel aux inscrits
                </Button>
                <Button
                  variant={evenement.is_published ? "outline" : "default"}
                  className={`w-full ${!evenement.is_published ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  {evenement.is_published ? "Dépublier l'événement" : "Publier l'événement"}
                </Button>
                <Button variant="destructive" className="w-full">
                  Supprimer l'événement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
