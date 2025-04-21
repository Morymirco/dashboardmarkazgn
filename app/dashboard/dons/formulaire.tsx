"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"

interface DonFormProps {
  donId?: number
  initialData?: any
}

export default function DonForm({ donId, initialData }: DonFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [montant, setMontant] = useState(initialData?.montant || "")
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : new Date())
  const [nomDonateur, setNomDonateur] = useState(initialData?.donateur?.nom || "")
  const [emailDonateur, setEmailDonateur] = useState(initialData?.donateur?.email || "")
  const [telephoneDonateur, setTelephoneDonateur] = useState(initialData?.donateur?.telephone || "")
  const [methode, setMethode] = useState(initialData?.methode || "")
  const [reference, setReference] = useState(initialData?.reference || "")
  const [message, setMessage] = useState(initialData?.message || "")
  const [projet, setProjet] = useState(initialData?.projet || "")

  const isEditing = !!donId

  const methodesPaiement = ["Mobile Money", "Carte bancaire", "Virement bancaire", "Espèces", "Chèque"]
  const projets = [
    "Centre Islamique Al-Firdaws",
    "Centre Al-Hidaya",
    "Centre Al-Falah",
    "Centre Al-Nour",
    "Centre Al-Ihsan",
    "Programme d'éducation coranique",
    "Aide aux étudiants",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En production, ici on enverrait les données à l'API
      console.log({
        montant,
        date,
        donateur: {
          nom: nomDonateur,
          email: emailDonateur,
          telephone: telephoneDonateur,
        },
        methode,
        reference,
        message,
        projet,
      })

      setSuccess(isEditing ? "Don mis à jour avec succès" : "Don enregistré avec succès")

      // Redirection vers la page de détail
      setTimeout(() => {
        router.push(`/dashboard/dons/${donId || 1}`)
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

        <Card>
          <CardHeader>
            <CardTitle>Informations du don</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (FCFA)</Label>
              <Input
                id="montant"
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="Montant du don"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date du don</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="methode">Méthode de paiement</Label>
              <Select value={methode} onValueChange={setMethode} required>
                <SelectTrigger id="methode">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  {methodesPaiement.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Référence de paiement</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Référence ou numéro de transaction"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projet">Projet associé (optionnel)</Label>
              <Select value={projet} onValueChange={setProjet}>
                <SelectTrigger id="projet">
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aucun">Aucun projet spécifique</SelectItem>
                  {projets.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations du donateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomDonateur">Nom du donateur</Label>
              <Input
                id="nomDonateur"
                value={nomDonateur}
                onChange={(e) => setNomDonateur(e.target.value)}
                placeholder="Nom complet du donateur"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailDonateur">Email</Label>
              <Input
                id="emailDonateur"
                type="email"
                value={emailDonateur}
                onChange={(e) => setEmailDonateur(e.target.value)}
                placeholder="Email du donateur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephoneDonateur">Téléphone</Label>
              <Input
                id="telephoneDonateur"
                value={telephoneDonateur}
                onChange={(e) => setTelephoneDonateur(e.target.value)}
                placeholder="Numéro de téléphone du donateur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message ou commentaire du donateur"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/dons")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Enregistrement..."}
              </>
            ) : isEditing ? (
              "Mettre à jour"
            ) : (
              "Enregistrer le don"
            )}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}
