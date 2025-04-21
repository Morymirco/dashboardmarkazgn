import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Gestion des Dons | MarkazGN Dashboard",
  description: "Gérez les dons reçus par l'organisation",
}

export default function DonsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Dons</h1>
        <Button asChild>
          <Link href="/dashboard/dons/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un don
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">Consultez et gérez les dons reçus par l'organisation.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total des dons</CardTitle>
            <CardDescription>Montant total reçu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 000 000 FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Dons ce mois</CardTitle>
            <CardDescription>Montant reçu ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 250 000 FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Nombre de donateurs</CardTitle>
            <CardDescription>Donateurs uniques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Liste des dons récents</CardTitle>
          <CardDescription>Les 10 derniers dons reçus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Donateur</th>
                  <th className="text-left py-3 px-4">Montant</th>
                  <th className="text-left py-3 px-4">Méthode</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{`${new Date().getDate() - index}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</td>
                    <td className="py-3 px-4">{`Donateur ${index + 1}`}</td>
                    <td className="py-3 px-4">{`${(Math.random() * 500000).toFixed(0)} FCFA`}</td>
                    <td className="py-3 px-4">{index % 2 === 0 ? "Mobile Money" : "Carte bancaire"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${index % 3 === 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                      >
                        {index % 3 === 0 ? "En attente" : "Confirmé"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/dons/${index + 1}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
