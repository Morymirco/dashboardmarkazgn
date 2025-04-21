import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

const utilisateurs = [
  {
    id: 1,
    nom: "Mamadou Diallo",
    email: "mamadou.diallo@example.com",
    role: "Administrateur",
    centre: "Centre Al-Firdaws",
    dateInscription: "2023-01-15",
    status: "Actif",
  },
  {
    id: 2,
    nom: "Fatoumata Camara",
    email: "fatoumata.camara@example.com",
    role: "Enseignant",
    centre: "Centre Al-Hidaya",
    dateInscription: "2023-02-20",
    status: "Actif",
  },
  {
    id: 3,
    nom: "Ibrahim Bah",
    email: "ibrahim.bah@example.com",
    role: "Enseignant",
    centre: "Centre Al-Falah",
    dateInscription: "2023-03-10",
    status: "Actif",
  },
  {
    id: 4,
    nom: "Aissatou Barry",
    email: "aissatou.barry@example.com",
    role: "Étudiant",
    centre: "Centre Al-Nour",
    dateInscription: "2023-04-05",
    status: "Inactif",
  },
  {
    id: 5,
    nom: "Ousmane Sylla",
    email: "ousmane.sylla@example.com",
    role: "Étudiant",
    centre: "Centre Al-Ihsan",
    dateInscription: "2023-05-15",
    status: "Actif",
  },
]

export default function UtilisateursPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Utilisateurs</h2>
        <Button asChild>
          <Link href="/dashboard/utilisateurs/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input placeholder="Rechercher un utilisateur..." className="max-w-sm" />
        <Button variant="outline">Rechercher</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Gérez les utilisateurs de la plateforme MarkazGN</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilisateurs.map((utilisateur) => (
                <TableRow key={utilisateur.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?${utilisateur.id}`} alt={utilisateur.nom} />
                        <AvatarFallback>
                          {utilisateur.nom
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{utilisateur.nom}</span>
                    </div>
                  </TableCell>
                  <TableCell>{utilisateur.email}</TableCell>
                  <TableCell>{utilisateur.role}</TableCell>
                  <TableCell>{utilisateur.centre}</TableCell>
                  <TableCell>{new Date(utilisateur.dateInscription).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        utilisateur.status === "Actif"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {utilisateur.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/utilisateurs/${utilisateur.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/utilisateurs/${utilisateur.id}/modifier`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Éditer
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
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
