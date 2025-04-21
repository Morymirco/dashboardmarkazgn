"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Edit, Eye, Share2, Trash2, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getArticleBySlug, formatArticleFromApi, type ArticleResponse } from "@/lib/services/article-service"

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mettons à jour la fonction pour gérer correctement le contenu HTML échappé
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const data: ArticleResponse = await getArticleBySlug(params.slug)

        // Formater les données de l'API vers notre format interne
        const formattedArticle = formatArticleFromApi(data)

        // Désescaper le contenu HTML si nécessaire
        if (formattedArticle.contenu) {
          formattedArticle.contenu = formattedArticle.contenu.replace(/\\u003C/g, "<").replace(/\\u003E/g, ">")
        }

        setArticle(formattedArticle)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement de l'article:", err)
        setError("Impossible de charger l'article. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/blog">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Détail de l'article</h2>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement de l'article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/blog">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Détail de l'article</h2>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Article non trouvé"}</AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/dashboard/blog">Retour à la liste des articles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/blog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Détail de l'article</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/blog/${params.slug}/modifier`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Publier
          </Button>
        </div>
      </div>

      {/* En-tête de l'article */}
      <div className="relative rounded-lg overflow-hidden">
        <div className="aspect-[21/9] w-full relative">
          <Image src={article.image || "/placeholder.svg"} alt={article.titre} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">{article.categorie}</Badge>
              {article.vedette && <Badge className="bg-secondary text-secondary-foreground">En vedette</Badge>}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{article.titre}</h1>
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.tempsLecture} de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de l'article */}
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.contenu }} />
          </div>
        </CardContent>
      </Card>

      {/* Mettons à jour l'affichage des tags pour utiliser les tags fournis par l'API */}
      {article.tags && article.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations sur l'article */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Statut</span>
            <Badge
              variant="outline"
              className={
                article.vedette
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
              }
            >
              {article.vedette ? "Publié" : "Brouillon"}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Catégorie</span>
            <span className="font-medium">{article.categorie}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date de publication</span>
            <span className="font-medium">{article.date}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auteur</span>
            <span className="font-medium">
              {typeof article.auteur === "string" ? article.auteur : article.auteur.nom}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Temps de lecture</span>
            <span className="font-medium">{article.tempsLecture}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slug</span>
            <span className="font-medium">{article.slug}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
