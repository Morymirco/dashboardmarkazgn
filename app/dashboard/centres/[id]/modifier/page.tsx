import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import CentreForm from "../../formulaire"

// Données de test pour simuler un centre existant
const mockCentreData = {
  id: 1,
  nom: "Centre Islamique Al-Firdaws",
  adresse: "Conakry, Ratoma",
  description: "Notre centre offre un environnement d'apprentissage optimal pour l'étude du Coran.",
  installations: [
    "Salles climatisées",
    "Bibliothèque",
    "Salle de prière",
    "Cafétéria",
    "Espace vert",
    "Parking",
    "Dortoirs",
    "Salle informatique",
  ],
  informations: [
    { label: "Année de création", value: "2015" },
    { label: "Capacité d'accueil", value: "200 étudiants" },
    { label: "Langues d'enseignement", value: "Arabe, Français" },
    { label: "Certification", value: "Diplôme reconnu" },
    { label: "Horaires", value: "7h - 18h" },
    { label: "Jours d'ouverture", value: "Lundi au Samedi" },
  ],
}

export default function ModifierCentrePage({ params }: { params: { id: string } }) {
  const centreId = Number.parseInt(params.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/centres/${centreId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Modifier le centre</h2>
        </div>
      </div>

      <CentreForm centreId={centreId} initialData={mockCentreData} />
    </div>
  )
}
