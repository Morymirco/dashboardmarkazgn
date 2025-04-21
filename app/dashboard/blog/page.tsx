"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Calendar, Clock, Edit, Eye, Plus, Search, Star, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
// Remplacer l'import du type Article par l'import depuis notre service
import type { Article } from "@/types/article"
import { getArticles, formatArticleFromApi, type ArticleResponse } from "@/lib/services/article-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Dans la fonction useEffect, mettre à jour la façon dont nous traitons les données
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const data: ArticleResponse[] = await getArticles()

        // Formater les données de l'API vers notre format interne
        const formattedArticles = data.map(formatArticleFromApi)

        setArticles(formattedArticles)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des articles:", err)
        setError("Impossible de charger les articles. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Mettre à jour la façon dont nous filtrons les articles en vedette
  // Les articles en vedette sont ceux qui ont is_published à true
  const articlesVedette = articles.filter((article) => article.vedette)

  // Filtrer les articles selon la recherche et la catégorie
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.extrait.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || article.categorie.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Trier les articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortBy === "az") {
      return a.titre.localeCompare(b.titre)
    } else if (sortBy === "za") {
      return b.titre.localeCompare(a.titre)
    }
    return 0
  })

  // Extraire les catégories uniques
  const categories = [...new Set(articles.map((article) => article.categorie))]

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
          <Button asChild>
            <Link href="/dashboard/blog/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel article
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Chargement des articles...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
        <Button asChild>
          <Link href="/dashboard/blog/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((categorie) => (
                <SelectItem key={categorie} value={categorie.toLowerCase()}>
                  {categorie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
            <SelectItem value="za">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="tous" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tous">Tous les articles</TabsTrigger>
          <TabsTrigger value="vedette">Articles en vedette</TabsTrigger>
          <TabsTrigger value="brouillons">Brouillons</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="tous" className="space-y-6">
          {/* Articles en vedette (carrousel) */}
          {articlesVedette.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Articles en vedette</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articlesVedette.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.titre}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-secondary-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          En vedette
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{article.categorie}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.tempsLecture}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2">{article.titre}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{typeof article.auteur === "string" ? article.auteur : article.auteur.nom}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{article.extrait}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/blog/${article.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/blog/${article.slug}/modifier`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tous les articles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tous les articles</h3>
            {sortedArticles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {searchTerm || selectedCategory !== "all"
                      ? "Aucun article ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                      : "Vous n'avez pas encore d'articles. Commencez par en créer un nouveau."}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/blog/nouveau">
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un article
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedArticles.map((article) => (
                  <Card key={article.id} className="flex flex-col h-full">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.titre}
                        fill
                        className="object-cover"
                      />
                      {article.vedette && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-secondary text-secondary-foreground">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            En vedette
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{article.categorie}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.tempsLecture}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2">{article.titre}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{typeof article.auteur === "string" ? article.auteur : article.auteur.nom}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{article.extrait}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-auto">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/blog/${article.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/blog/${article.slug}/modifier`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedArticles.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled>
                  <span className="sr-only">Page précédente</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Page suivante</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </nav>
            </div>
          )}
        </TabsContent>

        <TabsContent value="vedette" className="space-y-6">
          {articlesVedette.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun article en vedette</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Vous n'avez pas encore d'articles en vedette. Marquez un article comme "En vedette" pour le mettre en
                  avant.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesVedette.map((article) => (
                <Card key={article.id} className="flex flex-col h-full">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.titre}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        En vedette
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.categorie}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.tempsLecture}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{article.titre}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{typeof article.auteur === "string" ? article.auteur : article.auteur.nom}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{article.extrait}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-auto">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/blog/${article.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/blog/${article.slug}/modifier`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="brouillons">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun brouillon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Vous n'avez pas encore de brouillons d'articles. Commencez à rédiger un nouvel article pour le sauvegarder
              comme brouillon.
            </p>
            <Button asChild>
              <Link href="/dashboard/blog/nouveau">
                <Plus className="mr-2 h-4 w-4" />
                Créer un brouillon
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="archives">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun article archivé</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Vous n'avez pas encore archivé d'articles. Les articles archivés apparaîtront ici.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
