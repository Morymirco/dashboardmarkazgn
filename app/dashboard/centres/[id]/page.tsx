"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Info,
  BookOpen,
  Share2,
  Edit,
  Trash2,
  MapPin,
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign,
  Award,
  Handshake,
  Clock,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCentreById, deleteCentre, formatCentreFromApi } from "@/lib/services/centre-service"
import type { TabProps } from "@/types/centre"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

const tabs: TabProps[] = [
  {
    id: "presentation",
    label: "Présentation",
    icon: <Info className="w-5 h-5" />,
  },
  {
    id: "programmes",
    label: "Programmes",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: "tarifs",
    label: "Tarifs",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    id: "horaires",
    label: "Horaires",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "realisations",
    label: "Réalisations",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "partenariats",
    label: "Partenariats",
    icon: <Handshake className="w-5 h-5" />,
  },
]

export default function CentreDetailPage({ params }: { params: { id: string } }) {
  // Utiliser React.use pour unwrap l'objet params
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

  const router = useRouter()
  const [centre, setCentre] = useState<any>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // État pour le modal de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchCentre = async () => {
      try {
        setLoading(true)
        const centreId = Number.parseInt(id)
        const data = await getCentreById(centreId)

        // Formater les données de l'API vers notre format interne
        const formattedCentre = formatCentreFromApi(data)

        setCentre(formattedCentre)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement du centre:", err)
        setError("Impossible de charger les détails du centre. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchCentre()
  }, [id])

  // Fonction pour gérer la suppression du centre
  const handleDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      if (!centre) {
        throw new Error("Centre non trouvé")
      }

      // Appel à l'API pour supprimer le centre
      await deleteCentre(centre.id)

      setSuccess("Centre supprimé avec succès")
      setDeleteDialogOpen(false)

      // Redirection vers la liste des centres après un court délai
      setTimeout(() => {
        router.push("/dashboard/centres")
      }, 1500)
    } catch (err: any) {
      setError("Une erreur est survenue lors de la suppression du centre: " + (err.message || ""))
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/centres">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Détail du centre</h2>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement des détails du centre...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !centre) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/centres">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Détail du centre</h2>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Centre non trouvé"}</AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/dashboard/centres">Retour à la liste des centres</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {success && (
        <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/centres">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Détail du centre</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button asChild>
            <Link href={`/dashboard/centres/${centre.id}/modifier`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
            <DialogDescription>Cette action est irréversible</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <Trash2 className="h-16 w-16 text-destructive" />
            </div>
            <p className="text-center">
              Êtes-vous sûr de vouloir supprimer définitivement le centre <strong>{centre.nom}</strong> ?
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Cette action supprimera toutes les données associées à ce centre, y compris les événements, les programmes
              et les enseignants.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression en cours...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* En-tête du centre */}
      <div className="rounded-lg overflow-hidden bg-card">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{centre.nom}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{centre.adresse}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {centre.statuts &&
                centre.statuts.map((statut: any) => (
                  <Badge key={statut.id} className="self-start md:self-auto" variant="outline">
                    {statut.nom}
                  </Badge>
                ))}
              {centre.categories &&
                centre.categories.map((categorie: any) => (
                  <Badge key={categorie.id} className="self-start md:self-auto" variant="secondary">
                    {categorie.nom}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="relative">
          <div className="aspect-[21/9] w-full relative">
            <Image
              src={centre.images[activeImage] || "/placeholder.svg"}
              alt={`${centre.nom} - Image ${activeImage + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          {centre.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {centre.images.map((_: any, index: number) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === activeImage ? "bg-primary" : "bg-primary/30"}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Voir image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Miniatures */}
        {centre.images.length > 1 && (
          <div className="p-6 grid grid-cols-4 gap-2">
            {centre.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`relative aspect-[4/3] overflow-hidden rounded-md ${
                  index === activeImage ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${centre.nom} - Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="presentation" className="space-y-4">
        <TabsList className="flex flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Onglet Présentation */}
        <TabsContent value="presentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>À propos du centre</CardTitle>
              <CardDescription>Informations générales sur {centre.nom}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{centre.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Informations pratiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {centre.informations.map((info: any, index: number) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                      <p className="text-lg font-semibold">{info.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Installations et services</h3>
                <div className="flex flex-wrap gap-2">
                  {centre.facilities &&
                    centre.facilities.map((facility: any, index: number) => (
                      <Badge key={index} variant="secondary">
                        {facility.name} ({facility.count})
                      </Badge>
                    ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Cours proposés</h3>
                <div className="flex flex-wrap gap-2">
                  {centre.cours &&
                    centre.cours.map((cours: any) => (
                      <Badge key={cours.id} variant="outline">
                        {cours.nom}
                      </Badge>
                    ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {centre.tags &&
                    centre.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact et localisation</CardTitle>
              <CardDescription>Coordonnées et plan d'accès</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {centre.contact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Coordonnées</h4>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{centre.contact.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{centre.contact.phone}</span>
                    </p>
                    {centre.contact.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`https://${centre.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {centre.contact.website}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Réseaux sociaux</h4>
                    {centre.contact.socialMedia.facebook && (
                      <p className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={centre.contact.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Facebook
                        </a>
                      </p>
                    )}
                    {centre.contact.socialMedia.instagram && (
                      <p className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={centre.contact.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Instagram
                        </a>
                      </p>
                    )}
                    {centre.contact.socialMedia.twitter && (
                      <p className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={centre.contact.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Twitter
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Adresse</h4>
                <p className="text-muted-foreground">{centre.adresse}</p>
                {(centre.latitude !== 0 || centre.longitude !== 0) && (
                  <div className="mt-4 aspect-[16/9] w-full bg-muted rounded-md overflow-hidden">
                    <iframe
                      title="Localisation du centre"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${centre.longitude - 0.01},${centre.latitude - 0.01},${centre.longitude + 0.01},${centre.latitude + 0.01}&layer=mapnik&marker=${centre.latitude},${centre.longitude}`}
                    ></iframe>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {centre.admissionProcess && (
            <Card>
              <CardHeader>
                <CardTitle>Processus d'admission</CardTitle>
                <CardDescription>Comment s'inscrire au centre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Étapes d'inscription</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    {centre.admissionProcess.steps.map((step: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Frais d'inscription</h4>
                  <p className="text-muted-foreground">
                    {centre.admissionProcess.registrationFee.amount.toLocaleString()}{" "}
                    {centre.admissionProcess.registrationFee.currency}
                    {centre.admissionProcess.registrationFee.oneTime ? " (paiement unique)" : " (par période)"}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Documents requis</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {centre.admissionProcess.requiredDocuments.map((doc: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Programmes */}
        <TabsContent value="programmes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programmes d'enseignement</CardTitle>
              <CardDescription>Découvrez les différents programmes proposés par le centre</CardDescription>
            </CardHeader>
            <CardContent>
              {centre.programs && centre.programs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {centre.programs.map((programme: any) => (
                    <Card key={programme.id} className="overflow-hidden">
                      <div className="bg-primary h-2"></div>
                      <CardHeader>
                        <CardTitle>{programme.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{programme.ageRange}</Badge>
                          <Badge variant="outline">{programme.duration}</Badge>
                          <Badge variant="secondary">{programme.students} étudiants</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2">{programme.description}</p>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{programme.schedule}</span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucun programme n'est disponible pour ce centre.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tarifs */}
        <TabsContent value="tarifs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tarifs des programmes</CardTitle>
              <CardDescription>Frais de scolarité pour chaque programme</CardDescription>
            </CardHeader>
            <CardContent>
              {centre.fees && centre.fees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Programme</th>
                        <th className="text-left py-3 px-4">Montant</th>
                        <th className="text-left py-3 px-4">Période</th>
                        <th className="text-left py-3 px-4">Bourse disponible</th>
                      </tr>
                    </thead>
                    <tbody>
                      {centre.fees.map((fee: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{fee.programName}</td>
                          <td className="py-3 px-4">
                            {fee.amount.toLocaleString()} {fee.currency}
                          </td>
                          <td className="py-3 px-4 capitalize">{fee.period}</td>
                          <td className="py-3 px-4">
                            {fee.scholarshipAvailable ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              >
                                Disponible
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              >
                                Non disponible
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucune information tarifaire n'est disponible pour ce centre.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Horaires */}
        <TabsContent value="horaires" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horaires d'ouverture</CardTitle>
              <CardDescription>Jours et heures d'ouverture du centre</CardDescription>
            </CardHeader>
            <CardContent>
              {centre.schedule ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Jours de semaine</h4>
                    <p className="text-muted-foreground">{centre.schedule.weekdays}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Samedi</h4>
                    <p className="text-muted-foreground">{centre.schedule.saturday}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Dimanche</h4>
                    <p className="text-muted-foreground">{centre.schedule.sunday}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ramadan</h4>
                    <p className="text-muted-foreground">{centre.schedule.ramadan}</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <h4 className="font-medium">Jours fériés</h4>
                    <p className="text-muted-foreground">{centre.schedule.holidays}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    Aucune information sur les horaires n'est disponible pour ce centre.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Réalisations */}
        <TabsContent value="realisations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Réalisations et distinctions</CardTitle>
              <CardDescription>Accomplissements notables du centre</CardDescription>
            </CardHeader>
            <CardContent>
              {centre.achievements && centre.achievements.length > 0 ? (
                <div className="space-y-6">
                  {centre.achievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {achievement.year}
                        </div>
                        {index < centre.achievements.length - 1 && <div className="w-0.5 h-full bg-border mt-1"></div>}
                      </div>
                      <div className="pb-6">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucune réalisation n'est disponible pour ce centre.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Partenariats */}
        <TabsContent value="partenariats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partenariats</CardTitle>
              <CardDescription>Collaborations et partenariats du centre</CardDescription>
            </CardHeader>
            <CardContent>
              {centre.partnerships && centre.partnerships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {centre.partnerships.map((partnership: any) => (
                    <Card key={partnership.id}>
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">{partnership.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{partnership.type}</Badge>
                            <span className="text-sm text-muted-foreground">{partnership.location}</span>
                          </div>
                          <p className="text-muted-foreground mt-2">{partnership.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucun partenariat n'est disponible pour ce centre.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
