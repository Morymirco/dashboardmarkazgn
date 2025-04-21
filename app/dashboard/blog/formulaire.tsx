"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Upload, X, Loader2, Plus, Tag, Star, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { fr } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"
// Ajoutez ces imports au début du fichier
import { createArticle, updateArticle } from "@/lib/services/article-service"

// Catégories prédéfinies
const CATEGORIES = [
  "Éducation",
  "Islam",
  "Coran",
  "Actualités",
  "Événements",
  "Témoignages",
  "Conseils",
  "Pédagogie",
  "Culture",
  "Technologie",
  "Santé",
  "Formation",
  "Gestion",
]

// Tags suggérés
const SUGGESTED_TAGS = [
  "Éducation",
  "Enfants",
  "Mémorisation",
  "Développement",
  "Apprentissage",
  "Pédagogie",
  "Spiritualité",
  "Formation",
  "Culture",
  "Coran",
  "Enseignement",
  "Tradition",
  "Modernité",
]

// Images Unsplash pour les articles
const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1603354350317-6ddba75b3e47?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567057419565-4349c49d8a04?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590009617786-6d054a2a3c7c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609599006353-e629aaabeb38?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?q=80&w=1200&auto=format&fit=crop",
]

// Titres d'articles aléatoires
const RANDOM_TITLES = [
  "L'importance de l'apprentissage du Coran dès le plus jeune âge",
  "Les méthodes modernes d'enseignement du Coran",
  "Le rôle des centres coraniques dans la préservation de l'identité culturelle",
  "L'impact de la technologie sur l'enseignement coranique",
  "Les bienfaits psychologiques de la récitation du Coran",
  "Comment organiser efficacement un centre d'éducation coranique",
  "Les concours de récitation du Coran : préparation et bénéfices",
  "L'importance de la formation continue pour les enseignants du Coran",
]

// Extraits d'articles aléatoires
const RANDOM_EXCERPTS = [
  "Découvrez pourquoi il est bénéfique d'initier les enfants à l'apprentissage du Coran dès leur plus jeune âge et comment cela peut façonner positivement leur développement.",
  "Une exploration des approches pédagogiques contemporaines qui facilitent l'apprentissage et la mémorisation du Coran tout en respectant les méthodes traditionnelles.",
  "Comment les centres d'éducation coranique contribuent à maintenir vivantes les traditions et l'identité culturelle tout en s'adaptant aux défis contemporains.",
  "Analyse des avantages et des défis que représente l'intégration des outils numériques dans l'enseignement traditionnel du Coran.",
  "Étude des effets positifs de la récitation régulière du Coran sur la santé mentale, la réduction du stress et le bien-être émotionnel.",
  "Guide pratique pour la gestion administrative, pédagogique et logistique d'un centre d'enseignement du Coran.",
  "Conseils pour préparer les élèves aux compétitions de récitation et analyse des avantages éducatifs et personnels de ces événements.",
]

// Contenu d'article aléatoire
const RANDOM_CONTENT = `
<p>L'apprentissage du Coran dès le plus jeune âge est une tradition profondément ancrée dans la culture islamique. Cette pratique, transmise de génération en génération, offre de nombreux bienfaits pour le développement spirituel, intellectuel et moral des enfants.</p>

<h2>Les bienfaits cognitifs</h2>

<p>Les recherches scientifiques modernes confirment ce que la tradition islamique enseigne depuis des siècles : la mémorisation et la récitation du Coran stimulent le développement cognitif des enfants. En effet, cet exercice mobilise plusieurs fonctions cérébrales simultanément :</p>

<ul>
  <li>La mémoire à court et à long terme</li>
  <li>La concentration et l'attention</li>
  <li>Les capacités linguistiques</li>
  <li>La coordination entre l'écoute et la reproduction vocale</li>
</ul>

<p>Des études ont montré que les enfants qui mémorisent le Coran développent des capacités mnésiques supérieures à la moyenne, ce qui leur est bénéfique dans tous les domaines d'apprentissage.</p>

<h2>Le développement spirituel</h2>

<p>Au-delà des aspects cognitifs, l'apprentissage précoce du Coran permet aux enfants de développer une connexion spirituelle profonde. Les versets coraniques, avec leur sagesse intemporelle, imprègnent l'esprit de l'enfant et façonnent sa vision du monde selon les valeurs islamiques fondamentales :</p>

<ul>
  <li>La compassion et la miséricorde</li>
  <li>La justice et l'équité</li>
  <li>La patience et la persévérance</li>
  <li>La gratitude et l'humilité</li>
</ul>

<p>Cette imprégnation précoce permet à l'enfant de développer une boussole morale solide qui le guidera tout au long de sa vie.</p>

<h2>Conclusion</h2>

<p>L'apprentissage du Coran dès le plus jeune âge constitue un investissement précieux dans le développement global de l'enfant. Au-delà de sa dimension spirituelle fondamentale, cette pratique offre des bénéfices cognitifs, moraux et identitaires qui accompagneront l'enfant tout au long de sa vie.</p>
`

interface BlogFormProps {
  articleId?: number
  initialData?: any
}

export default function BlogForm({ articleId, initialData }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [titre, setTitre] = useState(initialData?.titre || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [extrait, setExtrait] = useState(initialData?.extrait || "")
  const [contenu, setContenu] = useState(initialData?.contenu || "")
  const [categorie, setCategorie] = useState(initialData?.categorie || "")
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : new Date())
  const [tempsLecture, setTempsLecture] = useState(initialData?.tempsLecture || "")
  const [vedette, setVedette] = useState(initialData?.vedette || false)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)

  const isEditing = !!articleId

  const generateSlug = () => {
    if (titre) {
      const generatedSlug = titre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      setSlug(generatedSlug)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Créer un URL pour prévisualiser l'image
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImage(null)
    setImagePreview(null)
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  // Fonction pour générer des données aléatoires
  const generateRandomData = () => {
    // Sélectionner un titre aléatoire
    const randomTitle = RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)]
    setTitre(randomTitle)

    // Générer un slug à partir du titre
    const generatedSlug = randomTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
    setSlug(generatedSlug)

    // Sélectionner un extrait aléatoire
    setExtrait(RANDOM_EXCERPTS[Math.floor(Math.random() * RANDOM_EXCERPTS.length)])

    // Définir le contenu
    setContenu(RANDOM_CONTENT)

    // Sélectionner une catégorie aléatoire
    setCategorie(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)])

    // Définir une date aléatoire dans les 3 derniers mois
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    const randomDate = new Date(threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime()))
    setDate(randomDate)

    // Définir un temps de lecture aléatoire
    setTempsLecture(`${Math.floor(Math.random() * 10) + 3} min`)

    // Définir aléatoirement si l'article est en vedette
    setVedette(Math.random() > 0.7)

    // Sélectionner 2 à 4 tags aléatoires
    const numTags = Math.floor(Math.random() * 3) + 2
    const shuffledTags = [...SUGGESTED_TAGS].sort(() => 0.5 - Math.random())
    setTags(shuffledTags.slice(0, numTags))

    // Sélectionner une image aléatoire d'Unsplash
    setImagePreview(UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)])
  }

  // Dans la fonction handleSubmit, remplacez la partie de simulation par un vrai appel API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Préparer les données pour l'API
      const formData = new FormData()
      formData.append("titre", titre)
      formData.append("slug", slug)
      formData.append("contenu", contenu)
      formData.append("is_published", vedette.toString())

      // Ajouter l'image si elle existe
      if (image) {
        formData.append("images", image)
      } else if (imagePreview && !imagePreview.startsWith("/placeholder")) {
        // Si c'est une URL d'image externe, nous devons la télécharger et la convertir en fichier
        try {
          const response = await fetch(imagePreview)
          const blob = await response.blob()
          const file = new File([blob], "image.jpg", { type: "image/jpeg" })
          formData.append("images", file)
        } catch (err) {
          console.error("Erreur lors de la conversion de l'URL en fichier:", err)
        }
      }

      let result
      if (isEditing) {
        result = await updateArticle(articleId!.toString(), formData)
        setSuccess("Article mis à jour avec succès")
      } else {
        result = await createArticle(formData)
        setSuccess("Article créé avec succès")
      }

      // Redirection vers la page de détail après un court délai
      setTimeout(() => {
        router.push(`/dashboard/blog/${result.slug || slug || articleId}`)
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

        <div className="flex justify-between items-center">
          <CardTitle>{isEditing ? "Modifier l'article" : "Créer un nouvel article"}</CardTitle>
          <Button type="button" variant="outline" onClick={generateRandomData} className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Générer des données aléatoires
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de l'article</Label>
              <Input
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Titre de l'article"
                required
                onBlur={generateSlug}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="exemple-de-slug"
                  required
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Générer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Le slug est utilisé dans l'URL de l'article (ex: monsite.com/blog/exemple-de-slug)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extrait">Extrait</Label>
              <Textarea
                id="extrait"
                value={extrait}
                onChange={(e) => setExtrait(e.target.value)}
                placeholder="Bref résumé de l'article (visible dans les listes d'articles)"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select value={categorie} onValueChange={setCategorie} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date de publication</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tempsLecture">Temps de lecture</Label>
                <Input
                  id="tempsLecture"
                  value={tempsLecture}
                  onChange={(e) => setTempsLecture(e.target.value)}
                  placeholder="Ex: 5 min"
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch id="vedette" checked={vedette} onCheckedChange={setVedette} />
                <Label htmlFor="vedette">Mettre en vedette</Label>
                {vedette && <Star className="ml-2 h-4 w-4 fill-yellow-400 text-yellow-400" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenu de l'article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contenu">Corps de l'article</Label>
              <Textarea
                id="contenu"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                placeholder="Contenu de l'article (supporte le format HTML)"
                rows={10}
                required
              />
              <p className="text-xs text-muted-foreground">
                Note: En production, un éditeur de texte riche serait implémenté ici.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image principale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <div className="relative rounded-md overflow-hidden">
                <div className="aspect-video w-full relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Aperçu de l'image"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed rounded-md flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Cliquez pour télécharger une image</span>
                <span className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max. 2MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag"
                  className="pl-8"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
              </div>
              <Button type="button" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Tags suggérés:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag)).map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!tags.includes(tag)) {
                        setTags((prev) => [...prev, tag])
                      }
                    }}
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/blog")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Publication..."}
              </>
            ) : isEditing ? (
              "Mettre à jour"
            ) : (
              "Publier l'article"
            )}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}
