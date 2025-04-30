import type React from "react"
export interface Information {
  label: string
  value: string
}

export interface Centre {
  id: number
  nom: string | null
  slug: string
  adresse: string
  description: string
  images: string[]
  installations: string[]
  informations: { label: string; value: string }[]
  contact: { fixe: string; mobile: string } | null
  statistics?: any
  facilities?: any
  schedule?: any
  admissionProcess?: any
  fees?: any
  achievements?: any
  partnerships?: any
  tags?: string[]
  legalStatus?: string
  status?: string
  registrationNumber?: string
  programs?: any
  categories?: any
  cours?: any
  statuts?: any
  latitude?: number
  longitude?: number
  user?: any
  // Nouveaux champs
  presentation?: string | null
  creation?: string | null
  manager_full_name?: string | null
  manager_email?: string | null
  managers?: { name: string; role: string }[] | null
  total_inscrits?: number
  capacity?: number
  tarifs?: { mensuel: number; inscription: number } | null
  opening_days?: string[] | null
  certifications?: string[] | null
  is_agrement?: boolean
  collaboration?: string | null
  is_support?: boolean
  commentaire?: string | null
  student_types?: number[]
  cours_graders?: number[]
  languages?: number[]
}

export interface TabProps {
  id: string
  label: string
  icon: React.ReactNode
}

export interface Programme {
  id: number
  titre: string
  description: string
  duree: string
  niveau: string
  prix: string
}

export interface Enseignant {
  id: number
  nom: string
  poste: string
  bio: string
  image: string
  specialites: string[]
}

export interface Temoignage {
  id: number
  nom: string
  role: string
  contenu: string
  date: string
  avatar?: string
}
