"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Upload, X, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { getAccessToken } from "@/lib/auth"

// Ajouter ces imports en haut du fichier, après les imports existants
// Remplacer l'import faker par notre utilitaire
import { faker, randomEventName, randomPrice } from "@/lib/faker"
import { AlertCircle } from "lucide-react"

interface ImageType {
  id?: number
  image: string
  evenement?: number
  file?: File // Pour les nouvelles images
  preview?: string // Pour l'aperçu des nouvelles images
}

interface Evenement {
  id?: number
  nom: string
  is_payement: boolean
  date_debut: string
  date_fin: string
  description: string
  montant: number
  is_published: boolean
  autre: string
  images: ImageType[]
}

interface EvenementFormProps {
  evenementId?: number
  initialData?: Evenement
}

const defaultEvenement: Evenement = {
  nom: "",
  is_payement: false,
  date_debut: new Date().toISOString(),
  date_fin: new Date().toISOString(),
  description: "",
  montant: 0,
  is_published: false,
  autre: "",
  images: [],
}

// Ajouter cette fonction après les déclarations d'interfaces et avant le composant EvenementForm
// Remplacer la fonction generateRandomEventData par celle-ci
function generateRandomEventData(): Evenement {
  // Générer une date de début aléatoire entre aujourd'hui et 3 mois dans le futur
  const startDate = faker.date.future({ years: 0.25 })

  // Générer une date de fin entre 1 heure et 3 jours après la date de début
  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + faker.number.int({ min: 1, max: 72 }))

  // Générer un booléen aléatoire pour is_payement et is_published
  const isPayment = faker.datatype.boolean()

  return {
    nom: randomEventName(),
    is_payement: isPayment,
    date_debut: startDate.toISOString(),
    date_fin: endDate.toISOString(),
    description: faker.lorem.paragraphs({ min: 2, max: 4 }),
    montant: isPayment ? randomPrice() : 0,
    is_published: faker.datatype.boolean(),
    autre: faker.lorem.paragraphs(1),
    images: [],
  }
}

export default function EvenementForm({ evenementId, initialData }: EvenementFormProps) {
  const router = useRouter()
  const [evenement, setEvenement] = useState<Evenement>(initialData || defaultEvenement)
  const [dateDebut, setDateDebut] = useState<Date | undefined>(
    initialData?.date_debut ? new Date(initialData.date_debut) : undefined,
  )
  const [dateFin, setDateFin] = useState<Date | undefined>(
    initialData?.date_fin ? new Date(initialData.date_fin) : undefined,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])

  const isEditing = !!evenementId

  useEffect(() => {
    if (dateDebut) {
      setEvenement((prev) => ({
        ...prev,
        date_debut: dateDebut.toISOString(),
      }))
    }
  }, [dateDebut])

  useEffect(() => {
    if (dateFin) {
      setEvenement((prev) => ({
        ...prev,
        date_fin: dateFin.toISOString(),
      }))
    }
  }, [dateFin])

  // Fonction pour charger les données de l'événement si on est en mode édition
  useEffect(() => {
    if (isEditing && !initialData) {
      const fetchEvenement = async () => {
        setLoading(true)
        try {
          const token = getAccessToken()
          const response = await fetch(`https://api.markazgn.org/evenement/evenement/${evenementId}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("Impossible de récupérer les détails de l'événement")
          }

          const data = await response.json()
          setEvenement(data)
          setDateDebut(new Date(data.date_debut))
          setDateFin(new Date(data.date_fin))
        } catch (err) {
          setError("Une erreur est survenue lors du chargement de l'événement")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchEvenement()
    }
  }, [evenementId, isEditing, initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvenement((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEvenement((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEvenement((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)

      // Créer des URL d'aperçu pour les nouvelles images
      const newImagesWithPreview = filesArray.map((file) => {
        return {
          file,
          preview: URL.createObjectURL(file),
          image: URL.createObjectURL(file), // Temporaire pour l'affichage
        }
      })

      // Ajouter les nouvelles images à l'état
      setEvenement((prev) => ({
        ...prev,
        images: [...prev.images, ...newImagesWithPreview],
      }))

      // Stocker les fichiers pour l'envoi
      setNewImages((prev) => [...prev, ...filesArray])
    }
  }

  const handleRemoveImage = (index: number) => {
    // Si l'image a un ID (existe déjà en base), l'ajouter à la liste des images à supprimer
    const imageToRemove = evenement.images[index]
    if (imageToRemove.id) {
      setImagesToDelete((prev) => [...prev, imageToRemove.id!])
    }

    // Supprimer l'image de l'état
    setEvenement((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = getAccessToken()

      // Préparer les données pour l'envoi
      const formData = new FormData()
      formData.append("nom", evenement.nom)
      formData.append("is_payement", evenement.is_payement.toString())
      formData.append("date_debut", evenement.date_debut)
      formData.append("date_fin", evenement.date_fin)
      formData.append("description", evenement.description)
      formData.append("montant", evenement.montant.toString())
      formData.append("is_published", evenement.is_published.toString())
      formData.append("autre", evenement.autre)

      // Ajouter les nouvelles images
      newImages.forEach((file) => {
        formData.append("images", file)
      })

      // Ajouter les IDs des images à supprimer
      if (imagesToDelete.length > 0) {
        formData.append("images_to_delete", JSON.stringify(imagesToDelete))
      }

      // Déterminer l'URL et la méthode en fonction du mode (création ou édition)
      const url = isEditing
        ? `https://api.markazgn.org/evenement/evenement/${evenementId}/update/`
        : "https://api.markazgn.org/evenement/evenement/create/"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Une erreur est survenue")
      }

      const data = await response.json()

      setSuccess(isEditing ? "Événement mis à jour avec succès" : "Événement créé avec succès")

      // Rediriger vers la page de détail après un court délai
      setTimeout(() => {
        router.push(`/dashboard/evenements/${data.id || evenementId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Ajouter cette fonction après handleSubmit dans le composant EvenementForm
  const handleGenerateRandomData = () => {
    const randomData = generateRandomEventData()
    setEvenement(randomData)
    setDateDebut(new Date(randomData.date_debut))
    setDateFin(new Date(randomData.date_fin))
  }

  if (loading && !evenement.nom) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement de l'événement...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            <AlertTitle>Succès</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{isEditing ? "Modifier l'événement" : "Créer un nouvel événement"}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateRandomData}
              className="flex items-center gap-1"
            >
              <AlertCircle className="h-4 w-4" />
              Générer des données
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'événement</Label>
              <Input
                id="nom"
                name="nom"
                value={evenement.nom}
                onChange={handleInputChange}
                placeholder="Nom de l'événement"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateDebut && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateDebut} onSelect={setDateDebut} initialFocus locale={fr} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dateFin && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFin ? format(dateFin, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFin} onSelect={setDateFin} initialFocus locale={fr} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={evenement.description}
                onChange={handleInputChange}
                placeholder="Description de l'événement"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autre">Informations complémentaires</Label>
              <Textarea
                id="autre"
                name="autre"
                value={evenement.autre}
                onChange={handleInputChange}
                placeholder="Informations complémentaires"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_payement">Paiement requis</Label>
                <p className="text-sm text-muted-foreground">Activer si l'événement nécessite un paiement</p>
              </div>
              <Switch
                id="is_payement"
                checked={evenement.is_payement}
                onCheckedChange={(checked) => handleSwitchChange("is_payement", checked)}
              />
            </div>

            {evenement.is_payement && (
              <div className="space-y-2">
                <Label htmlFor="montant">Montant (GNF)</Label>
                <Input
                  id="montant"
                  name="montant"
                  type="number"
                  value={evenement.montant}
                  onChange={handleNumberChange}
                  placeholder="Montant en GNF"
                  min="0"
                  step="1000"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_published">Publier l'événement</Label>
                <p className="text-sm text-muted-foreground">Activer pour rendre l'événement visible sur le site</p>
              </div>
              <Switch
                id="is_published"
                checked={evenement.is_published}
                onCheckedChange={(checked) => handleSwitchChange("is_published", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {evenement.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <Image
                    src={image.image || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <label className="border border-dashed rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors aspect-square">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">Ajouter une image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
              </label>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/evenements")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Création..."}
              </>
            ) : isEditing ? (
              "Mettre à jour"
            ) : (
              "Créer l'événement"
            )}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}
