export interface Auteur {
  nom: string
  role: string
  image: string
  bio: string
}

export interface Article {
  id: number
  titre: string
  slug: string
  extrait: string
  contenu: string
  image: string
  date: string
  auteur: Auteur | string // Pour compatibilité avec les deux formats
  categorie: string
  tempsLecture: string
  vedette?: boolean
  tags?: string[]
}
