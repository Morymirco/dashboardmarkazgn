"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Loader2, Plus, Trash, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { AlertCircle, CheckCircle } from "lucide-react"
import { createCentre, updateCentre, getCentreById, type CentreCreateRequest } from "@/lib/services/centre-service"
import { generateRandomCentre, getRandomUnsplashImage } from "@/lib/utils/centre-generator"
import { Checkbox } from "@/components/ui/checkbox"

interface Installation {
  id?: number
  nom: string
}

interface Information {
  id?: number
  label: string
  value: string
}

interface CentreFormProps {
  centreId?: number
  initialData?: any
}

export default function CentreForm({ centreId, initialData }: CentreFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  const [userId, setUserId] = useState<number>(initialData?.user?.id || 9) // Valeur par défaut pour les tests

  // Données de base du centre
  const [nom, setNom] = useState(initialData?.nom || "")
  const [adresse, setAdresse] = useState(initialData?.adresse || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [commune, setCommune] = useState(initialData?.commune || "")
  const [programme, setProgramme] = useState(initialData?.programme || "")
  const [compte, setCompte] = useState(initialData?.compte || "")
  const [autre, setAutre] = useState(initialData?.autre || "")

  // Catégories, statuts et cours
  const [categories, setCategories] = useState<number[]>(initialData?.categories?.map((cat: any) => cat.id) || [1])
  const [statuts, setStatuts] = useState<number[]>(initialData?.statuts?.map((stat: any) => stat.id) || [1])
  const [cours, setCours] = useState<number[]>(initialData?.cours?.map((c: any) => c.id) || [1, 2, 3, 4])

  // Installations et informations
  const [installations, setInstallations] = useState<Installation[]>(
    initialData?.installations?.map((inst: string) => ({ nom: inst })) || [],
  )
  const [informations, setInformations] = useState<Information[]>(initialData?.informations || [])

  // Contact
  const [phone, setPhone] = useState(initialData?.contact?.phone || "")
  const [email, setEmail] = useState(initialData?.contact?.email || "")
  const [website, setWebsite] = useState(initialData?.contact?.website || "")
  const [facebook, setFacebook] = useState(initialData?.contact?.socialMedia?.facebook || "")
  const [instagram, setInstagram] = useState(initialData?.contact?.socialMedia?.instagram || "")
  const [twitter, setTwitter] = useState(initialData?.contact?.socialMedia?.twitter || "")

  const isEditing = !!centreId

  // Fonction pour charger les données du centre si on est en mode édition
  useEffect(() => {
    if (isEditing && centreId) {
      const loadCentreData = async () => {
        try {
          setLoading(true)
          const centreData = await getCentreById(centreId)

          // Mettre à jour tous les états avec les données du centre
          setNom(centreData.nom || "")
          setAdresse(centreData.location || "")
          setDescription(centreData.long_description || centreData.short_description || centreData.description || "")
          setCommune(centreData.commune || "")
          setProgramme(centreData.programme || "")
          setCompte(centreData.compte || "")
          setAutre(centreData.autre || "")

          // Catégories, statuts et cours
          setCategories(centreData.categories?.map((cat) => cat.id) || [1])
          setStatuts(centreData.statuts?.map((stat) => stat.id) || [1])
          setCours(centreData.cours?.map((c) => c.id) || [1, 2, 3, 4])

          // Installations
          if (centreData.facilities) {
            setInstallations(centreData.facilities.map((facility) => ({ nom: facility.name })))
          }

          // Informations
          const infos = []
          if (centreData.statistics) {
            infos.push({ label: "Nombre d'étudiants", value: centreData.statistics.students.toString() })
            infos.push({ label: "Nombre d'enseignants", value: centreData.statistics.teachers.toString() })
          }
          if (centreData.programs) {
            infos.push({ label: "Programmes", value: centreData.programs.length.toString() })
          }
          setInformations(infos)

          // Contact
          setPhone(centreData.contact?.phone || "")
          setEmail(centreData.contact?.email || "")
          setWebsite(centreData.contact?.website || "")
          setFacebook(centreData.contact?.socialMedia?.facebook || "")
          setInstagram(centreData.contact?.socialMedia?.instagram || "")
          setTwitter(centreData.contact?.socialMedia?.twitter || "")

          // Images
          if (centreData.images && centreData.images.length > 0) {
            const previews = centreData.images.map((img) => img.image)
            setImagesPreviews(previews)
          }

          // User ID
          if (centreData.user) {
            setUserId(centreData.user.id)
          }
        } catch (err: any) {
          setError(err.message || "Erreur lors du chargement des données du centre")
        } finally {
          setLoading(false)
        }
      }

      loadCentreData()
    }
  }, [isEditing, centreId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setImages((prev) => [...prev, ...filesArray])

      // Créer des URL pour prévisualiser les images
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setImagesPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Révoque l'URL de prévisualisation pour libérer la mémoire
    URL.revokeObjectURL(imagesPreviews[index])
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const addInstallation = () => {
    setInstallations((prev) => [...prev, { nom: "" }])
  }

  const updateInstallation = (index: number, value: string) => {
    setInstallations((prev) => prev.map((item, i) => (i === index ? { ...item, nom: value } : item)))
  }

  const removeInstallation = (index: number) => {
    setInstallations((prev) => prev.filter((_, i) => i !== index))
  }

  const addInformation = () => {
    setInformations((prev) => [...prev, { label: "", value: "" }])
  }

  const updateInformation = (index: number, field: "label" | "value", value: string) => {
    setInformations((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeInformation = (index: number) => {
    setInformations((prev) => prev.filter((_, i) => i !== index))
  }

  // Fonction pour générer un centre aléatoire
  const generateRandomCentreData = () => {
    const randomCentre = generateRandomCentre(userId)

    // Mettre à jour tous les états avec les données générées
    setNom(randomCentre.nom)
    setAdresse(randomCentre.location || "")
    setDescription(randomCentre.long_description || "")
    setCommune(randomCentre.commune || "")
    setProgramme(randomCentre.programme || "")
    setCompte(randomCentre.compte || "")
    setAutre(randomCentre.autre || "")

    // Catégories, statuts et cours
    setCategories(randomCentre.categories)
    setStatuts(randomCentre.statuts)
    setCours(randomCentre.cours)

    // Installations
    if (randomCentre.facilities) {
      setInstallations(randomCentre.facilities.map((facility) => ({ nom: facility.name })))
    }

    // Informations
    const infos = []
    if (randomCentre.statistics) {
      infos.push({ label: "Nombre d'étudiants", value: randomCentre.statistics.students.toString() })
      infos.push({ label: "Nombre d'enseignants", value: randomCentre.statistics.teachers.toString() })
    }
    if (randomCentre.programs) {
      infos.push({ label: "Programmes", value: randomCentre.programs.length.toString() })
    }
    setInformations(infos)

    // Contact
    setPhone(randomCentre.contact?.phone || "")
    setEmail(randomCentre.contact?.email || "")
    setWebsite(randomCentre.contact?.website || "")
    setFacebook(randomCentre.contact?.socialMedia?.facebook || "")
    setInstagram(randomCentre.contact?.socialMedia?.instagram || "")
    setTwitter(randomCentre.contact?.socialMedia?.twitter || "")

    // Générer des images Unsplash
    const newImagePreviews = []
    for (let i = 0; i < 3; i++) {
      newImagePreviews.push(getRandomUnsplashImage())
    }

    // Révoquer les anciennes URL de prévisualisation
    imagesPreviews.forEach((url) => URL.revokeObjectURL(url))

    // Mettre à jour les prévisualisations d'images
    setImagesPreviews(newImagePreviews)
    setImages([]) // Réinitialiser les fichiers d'images
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Préparer les données du centre pour l'API
      const centreData: CentreCreateRequest = {
        statuts,
        categories,
        cours,
        images: ["1"], // Utiliser l'ID d'image par défaut pour l'API
        user: userId,
        nom,
        short_description: description.substring(0, 100) + "...",
        long_description: description,
        location: adresse,
        latitude: 0,
        longitude: 0,
        commune,
        programme,
        compte,
        autre,
        contact: {
          phone,
          email,
          website,
          socialMedia: {
            facebook,
            instagram,
            twitter: twitter || null,
          },
        },
        // Ajouter d'autres champs si nécessaire
      }

      let result
      if (isEditing) {
        result = await updateCentre(centreId, centreData)
      } else {
        result = await createCentre(centreData)
      }

      setSuccess(isEditing ? "Centre mis à jour avec succès" : "Centre créé avec succès")

      // Redirection vers la page de détail
      setTimeout(() => {
        router.push(`/dashboard/centres/slug/${result.slug || `centre-${result.id}`}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Succès</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={generateRandomCentreData} className="mb-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Générer des données aléatoires
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du centre</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom du centre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse complète"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commune">Commune</Label>
              <Input
                id="commune"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Commune"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du centre"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programme">Programme</Label>
              <Input
                id="programme"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                placeholder="Programme (ex: de 8h à 17h)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compte">Compte bancaire</Label>
              <Input
                id="compte"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                placeholder="Numéro de compte bancaire"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autre">Autres informations</Label>
              <Textarea
                id="autre"
                value={autre}
                onChange={(e) => setAutre(e.target.value)}
                placeholder="Autres informations"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catégories et cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Catégories</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="category-1"
                    checked={categories.includes(1)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCategories((prev) => [...prev, 1])
                      } else {
                        setCategories((prev) => prev.filter((id) => id !== 1))
                      }
                    }}
                  />
                  <label htmlFor="category-1">Mémorisation</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="category-2"
                    checked={categories.includes(2)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCategories((prev) => [...prev, 2])
                      } else {
                        setCategories((prev) => prev.filter((id) => id !== 2))
                      }
                    }}
                  />
                  <label htmlFor="category-2">Langue arabe</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="category-3"
                    checked={categories.includes(3)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCategories((prev) => [...prev, 3])
                      } else {
                        setCategories((prev) => prev.filter((id) => id !== 3))
                      }
                    }}
                  />
                  <label htmlFor="category-3">Sciences islamiques</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cours</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cours-1"
                    checked={cours.includes(1)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCours((prev) => [...prev, 1])
                      } else {
                        setCours((prev) => prev.filter((id) => id !== 1))
                      }
                    }}
                  />
                  <label htmlFor="cours-1">Mémorisation du coran</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cours-2"
                    checked={cours.includes(2)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCours((prev) => [...prev, 2])
                      } else {
                        setCours((prev) => prev.filter((id) => id !== 2))
                      }
                    }}
                  />
                  <label htmlFor="cours-2">Lecture simple</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cours-3"
                    checked={cours.includes(3)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCours((prev) => [...prev, 3])
                      } else {
                        setCours((prev) => prev.filter((id) => id !== 3))
                      }
                    }}
                  />
                  <label htmlFor="cours-3">Figh</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cours-4"
                    checked={cours.includes(4)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCours((prev) => [...prev, 4])
                      } else {
                        setCours((prev) => prev.filter((id) => id !== 4))
                      }
                    }}
                  />
                  <label htmlFor="cours-4">Fiqh</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="statut-1"
                    checked={statuts.includes(1)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatuts((prev) => [...prev, 1])
                      } else {
                        setStatuts((prev) => prev.filter((id) => id !== 1))
                      }
                    }}
                  />
                  <label htmlFor="statut-1">En ligne</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Site web" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="URL Facebook"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="URL Instagram"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="URL Twitter"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Installations et équipements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {installations.map((installation, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={installation.nom}
                  onChange={(e) => updateInstallation(index, e.target.value)}
                  placeholder="Nom de l'installation"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeInstallation(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInstallation}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une installation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {informations.map((info, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <Label>Libellé</Label>
                  <Input
                    value={info.label}
                    onChange={(e) => updateInformation(index, "label", e.target.value)}
                    placeholder="Ex: Année de création"
                  />
                </div>
                <div className="flex gap-2 items-end md:mt-[27px]">
                  <Input
                    value={info.value}
                    onChange={(e) => updateInformation(index, "value", e.target.value)}
                    placeholder="Ex: 2015"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeInformation(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInformation}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une information
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagesPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <Image src={preview || "/placeholder.svg"} alt={`Image ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
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
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/centres")}>
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
              "Créer le centre"
            )}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}
