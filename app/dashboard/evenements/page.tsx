import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Plus } from "lucide-react"
import Link from "next/link"
import type { Evenement } from "@/types/evenement"

// Données de test améliorées
const evenements: Evenement[] = [
  {
    id: 1,
    titre: "Grand Séminaire sur l'Apprentissage du Coran",
    date: "25 Mars 2024",
    heure: "09:00 - 17:00",
    lieu: "Centre Islamique Al-Firdaws, Conakry",
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Rejoignez-nous pour une journée exceptionnelle dédiée à l'apprentissage du Coran avec des experts reconnus. Cette formation intensive vous permettra d'améliorer votre récitation et votre compréhension du Livre Saint.",
    type: "seminaire",
    programme: [
      "08:00 - 08:45 : Accueil des participants",
      "09:00 - 10:15 : Conférence d'ouverture",
      "10:30 - 12:00 : Ateliers pratiques de récitation",
      "12:30 - 14:00 : Pause déjeuner et prière",
      "14:00 - 15:30 : Sessions interactives",
      "15:45 - 16:30 : Table ronde avec les experts",
      "16:30 - 17:00 : Clôture et remise des certificats",
    ],
    prix: "100,000 GNF",
    places: 200,
    placesRestantes: 45,
    organisateur: "Association des Centres Coraniques de Guinée",
    contact: "+224 623 45 67 89",
    intervenants: ["Imam Ousmane Diallo", "Ustaz Mohamed Camara", "Dr. Ibrahim Bah"],
  },
  {
    id: 2,
    titre: "Conférence sur l'Éducation Islamique Moderne",
    date: "15 Avril 2024",
    heure: "14:00 - 18:00",
    lieu: "Centre Al-Hidaya, Kindia",
    image: "/placeholder.svg?height=400&width=800",
    description: "Une conférence sur les méthodes modernes d'enseignement islamique, adaptées aux défis contemporains.",
    type: "conference",
    programme: [
      "14:00 - 14:30 : Accueil et introduction",
      "14:30 - 15:30 : Présentation principale",
      "15:30 - 16:00 : Pause",
      "16:00 - 17:30 : Panel de discussion",
      "17:30 - 18:00 : Questions et réponses",
    ],
    prix: "Gratuit",
    places: 150,
    placesRestantes: 72,
    organisateur: "Centre Al-Hidaya",
    contact: "+224 555 12 34 56",
    intervenants: ["Dr. Fatou Bah", "Prof. Mamadou Sow"],
  },
  {
    id: 3,
    titre: "Journée Portes Ouvertes - Centres Coraniques",
    date: "5 Mai 2024",
    heure: "10:00 - 16:00",
    lieu: "Divers centres à Conakry",
    image: "/placeholder.svg?height=400&width=800",
    description: "Découvrez les centres d'éducation coranique de Conakry lors de cette journée portes ouvertes.",
    type: "portes-ouvertes",
    programme: [
      "10:00 - 12:00 : Visites guidées",
      "12:00 - 13:30 : Pause déjeuner",
      "13:30 - 15:00 : Démonstrations et présentations",
      "15:00 - 16:00 : Rencontres avec les enseignants",
    ],
    prix: "Gratuit",
    places: 300,
    placesRestantes: 300,
    organisateur: "Coordination des Centres Coraniques",
    contact: "+224 622 33 44 55",
    intervenants: ["Coordinateurs des différents centres"],
  },
  {
    id: 4,
    titre: "Formation des Enseignants en Pédagogie Coranique",
    date: "20-22 Juin 2024",
    heure: "09:00 - 17:00",
    lieu: "Centre de Formation Al-Falah, Kankan",
    image: "/placeholder.svg?height=400&width=800",
    description:
      "Formation intensive de trois jours pour les enseignants des écoles coraniques sur les méthodes pédagogiques modernes.",
    type: "formation",
    programme: [
      "Jour 1 : Fondements pédagogiques",
      "Jour 2 : Méthodes d'enseignement interactives",
      "Jour 3 : Évaluation et suivi des élèves",
    ],
    prix: "250,000 GNF",
    places: 50,
    placesRestantes: 12,
    organisateur: "Institut de Formation des Enseignants",
    contact: "+224 666 77 88 99",
    intervenants: ["Dr. Aissatou Barry", "Prof. Ibrahim Diallo", "Mme. Mariama Camara"],
  },
  {
    id: 5,
    titre: "Concours de Récitation du Coran",
    date: "10 Juillet 2024",
    heure: "14:00 - 19:00",
    lieu: "Grande Mosquée de Conakry",
    image: "/placeholder.svg?height=400&width=800",
    description: "Concours annuel de récitation du Coran ouvert aux jeunes de 7 à 18 ans.",
    type: "concours",
    programme: [
      "14:00 - 14:30 : Cérémonie d'ouverture",
      "14:30 - 17:00 : Compétition par catégories d'âge",
      "17:00 - 17:30 : Délibération du jury",
      "17:30 - 18:30 : Remise des prix",
      "18:30 - 19:00 : Clôture",
    ],
    prix: "Gratuit pour les participants",
    places: 200,
    placesRestantes: 85,
    organisateur: "Comité National du Concours de Récitation",
    contact: "+224 611 22 33 44",
    intervenants: ["Membres du jury international"],
  },
]

export default function EvenementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Événements</h2>
        <Button asChild>
          <Link href="/dashboard/evenements/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un événement
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input placeholder="Rechercher un événement..." className="max-w-sm" />
        <Button variant="outline">Rechercher</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des événements</CardTitle>
          <CardDescription>Gérez les événements organisés par MarkazGN</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Places</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evenements.map((evenement) => (
                <TableRow key={evenement.id}>
                  <TableCell className="font-medium">{evenement.titre}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {evenement.date}
                    </div>
                  </TableCell>
                  <TableCell>{evenement.lieu}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {evenement.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {evenement.placesRestantes} / {evenement.places}
                  </TableCell>
                  <TableCell>{evenement.prix}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/evenements/${evenement.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/evenements/${evenement.id}/modifier`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Éditer
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
