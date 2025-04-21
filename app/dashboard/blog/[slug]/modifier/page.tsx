import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BlogForm from "../../formulaire"

// Données de test pour simuler un article existant
const mockArticleData = {
  id: 1,
  titre: "L'importance de l'apprentissage du Coran dès le plus jeune âge",
  slug: "importance-apprentissage-coran-jeune-age",
  extrait:
    "Découvrez pourquoi il est bénéfique d'initier les enfants à l'apprentissage du Coran dès leur plus jeune âge et comment cela peut façonner positivement leur développement.",
  contenu:
    "L'apprentissage du Coran dès le plus jeune âge est une tradition profondément ancrée dans la culture islamique. Cette pratique, transmise de génération en génération, offre de nombreux bienfaits pour le développement spirituel, intellectuel et moral des enfants...",
  image: "https://images.unsplash.com/photo-1603354350317-6ddba75b3e47?q=80&w=1200&auto=format&fit=crop",
  date: "2024-03-15",
  auteur: "Imam Ousmane Diallo",
  categorie: "Éducation",
  tempsLecture: "5 min",
  vedette: true,
  tags: ["Éducation", "Enfants", "Mémorisation", "Développement"],
}

export default function ModifierArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/blog/${params.slug}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Modifier l'article</h2>
        </div>
      </div>

      <BlogForm articleId={1} initialData={mockArticleData} />
    </div>
  )
}
