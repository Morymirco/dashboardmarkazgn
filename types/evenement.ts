export interface Evenement {
  id: number
  titre: string
  date: string
  heure: string
  lieu: string
  image: string
  description: string
  type: string
  programme: string[]
  prix: string
  places: number
  placesRestantes: number
  organisateur: string
  contact: string
  intervenants: string[]
}
