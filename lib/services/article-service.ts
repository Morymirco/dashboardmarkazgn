import { getAccessToken } from "@/lib/auth"

const API_URL = "https://api.markazgn.org"

export interface ArticleImage {
  id: number
  image: string
  article: number
}

// Mettons à jour l'interface ArticleResponse pour inclure tous les champs retournés par l'API
export interface ArticleResponse {
  id: number
  titre: string
  contenu: string
  slug: string
  is_published: boolean
  images: ArticleImage[]
  created_at: string
  updated_at: string
  tags: string[]
  categories: string[]
  article: number | null
  auteur: {
    email: string
    password: string
    firstname: string
    lastname: string
    adresse: string
    image: string | null
    tel: string
    role: string | null
    is_accept_mail: boolean
  }
}

export async function getArticles() {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/article/`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des articles: ${response.status}`)
    }

    const data: ArticleResponse[] = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error)
    throw error
  }
}

// Mettons à jour la fonction getArticleBySlug pour s'assurer qu'elle utilise la bonne URL

export async function getArticleBySlug(slug: string) {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/article/${slug}/`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'article: ${response.status}`)
    }

    const data: ArticleResponse = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error)
    throw error
  }
}

export async function createArticle(articleData: FormData) {
  try {
    const token = getAccessToken()

    if (!token) {
      throw new Error("Vous devez être connecté pour créer un article")
    }

    const response = await fetch(`${API_URL}/article/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: articleData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Erreur lors de la création de l'article")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error)
    throw error
  }
}

export async function updateArticle(slug: string, articleData: FormData) {
  try {
    const token = getAccessToken()

    if (!token) {
      throw new Error("Vous devez être connecté pour modifier un article")
    }

    const response = await fetch(`${API_URL}/article/${slug}/update/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: articleData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Erreur lors de la modification de l'article")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la modification de l'article:", error)
    throw error
  }
}

export async function deleteArticle(slug: string) {
  try {
    const token = getAccessToken()

    if (!token) {
      throw new Error("Vous devez être connecté pour supprimer un article")
    }

    const response = await fetch(`${API_URL}/article/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Erreur lors de la suppression de l'article")
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error)
    throw error
  }
}

// Mettons à jour la fonction formatArticleFromApi pour utiliser les nouvelles données
export function formatArticleFromApi(article: ArticleResponse) {
  return {
    id: article.id,
    titre: article.titre,
    slug: article.slug,
    extrait: extractExcerpt(article.contenu), // Générer un extrait à partir du contenu
    contenu: article.contenu,
    image: article.images && article.images.length > 0 ? article.images[0].image : "/placeholder.svg",
    date: new Date(article.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    auteur:
      article.auteur && (article.auteur.firstname || article.auteur.lastname)
        ? `${article.auteur.firstname} ${article.auteur.lastname}`.trim()
        : "Admin",
    categorie: article.categories && article.categories.length > 0 ? article.categories[0] : "Non catégorisé",
    tempsLecture: estimateReadingTime(article.contenu),
    tags: article.tags || [],
    vedette: article.is_published,
  }
}

// Fonction pour estimer le temps de lecture
function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
  return `${minutes} min`
}

// Fonction pour extraire un extrait du contenu
function extractExcerpt(content: string, maxLength = 150): string {
  // Supprimer les balises HTML
  const textContent = content.replace(/<\/?[^>]+(>|$)/g, "")

  // Limiter la longueur et ajouter des points de suspension si nécessaire
  if (textContent.length <= maxLength) {
    return textContent
  }

  // Trouver le dernier espace avant maxLength pour ne pas couper un mot
  const lastSpace = textContent.lastIndexOf(" ", maxLength)
  return textContent.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "..."
}
