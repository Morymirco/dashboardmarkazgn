"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, MapPin, Plus, Users, Edit, Loader2, AlertCircle, TrashIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCentres, formatCentreFromApi } from "@/lib/services/centre-service"
import type { Centre } from "@/types/centre"
import { useRouter } from "next/navigation"

export default function CentresPage() {
  const router = useRouter()
  const [centres, setCentres] = useState<Centre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        setLoading(true)
        const data = await getCentres()

        // Formater les données de l'API vers notre format interne
        const formattedCentres = data.map(formatCentreFromApi)

        setCentres(formattedCentres)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des centres:", err)
        setError("Impossible de charger les centres. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchCentres()
  }, [])

  // Filtrer les centres selon la recherche
  const filteredCentres = centres.filter(
    (centre) =>
      centre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.adresse.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Centres</h2>
          <Button asChild>
            <Link href="/dashboard/centres/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un centre
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement des centres...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Centres</h2>
        <Button asChild>
          <Link href="/dashboard/centres/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un centre
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Rechercher un centre..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          {searchTerm ? "Effacer" : "Rechercher"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {filteredCentres.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Aucun centre ne correspond à votre recherche."
              : "Aucun centre n'est disponible pour le moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((centre) => (
            <Card key={centre.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image src={centre.images[0] || "/placeholder.svg"} alt={centre.nom} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold">{centre.nom}</h3>
                    <div className="flex items-center text-white/80 text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{centre.adresse}</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{centre.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">
                      {centre.informations.find((i) => i.label === "Nombre d'étudiants")?.value || "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/centres/slug/${centre.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/centres/${centre.id}/modifier`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Éditer
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => router.push(`/dashboard/centres/slug/${centre.slug}`)}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
