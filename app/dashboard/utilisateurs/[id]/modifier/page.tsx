import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import UtilisateurForm from "../../formulaire"

// Données de test pour simuler un utilisateur existant
const mockUtilisateurData = {
  id: 1,
  nom: "Mamadou Diallo",
  email: "mamadou.diallo@example.com",
  role: "Administrateur",
  telephone: "+224 623 45 67 89",
  centre: "Centre Al-Firdaws",
  status: "Actif",
  dateInscription: "2023-01-15",
}

export default function ModifierUtilisateurPage({ params }: { params: { id: string } }) {
  const utilisateurId = Number.parseInt(params.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/utilisateurs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Modifier l'utilisateur</h2>
        </div>
      </div>

      <UtilisateurForm utilisateurId={utilisateurId} initialData={mockUtilisateurData} />
    </div>
  )
}
