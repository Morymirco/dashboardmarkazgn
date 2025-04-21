import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import EvenementForm from "../../formulaire"

export default function ModifierEvenementPage({ params }: { params: { id: string } }) {
  const evenementId = Number.parseInt(params.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/evenements/${evenementId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Modifier l'événement</h2>
        </div>
      </div>

      <EvenementForm evenementId={evenementId} />
    </div>
  )
}
