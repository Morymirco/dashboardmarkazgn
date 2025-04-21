import type React from "react"
export interface Information {
  label: string
  value: string
}

export interface Centre {
  id: number
  nom: string
  slug: string
  adresse: string
  description: string
  images: string[]
  installations: string[]
  informations: Information[]
  // Nouveaux champs
  contact?: {
    email: string
    phone: string
    website: string
    socialMedia: {
      twitter: string | null
      facebook: string
      instagram: string
    }
  }
  statistics?: {
    students: number
    teachers: number
    classrooms: number
    booksInLibrary: number
    averageClassSize: number
    graduatedStudents: number
  }
  facilities?: {
    name: string
    count: number
    description: string
  }[]
  schedule?: {
    sunday: string
    ramadan: string
    holidays: string
    saturday: string
    weekdays: string
  }
  admissionProcess?: {
    steps: string[]
    registrationFee: {
      amount: number
      oneTime: boolean
      currency: string
    }
    requiredDocuments: string[]
  }
  fees?: {
    amount: number
    period: string
    currency: string
    programId: string
    programName: string
    scholarshipAvailable: boolean
  }[]
  achievements?: {
    year: number
    title: string
    description: string
  }[]
  partnerships?: {
    id: string
    name: string
    type: string
    location: string
    description: string
  }[]
  tags?: string[]
  legalStatus?: string
  status?: string
  registrationNumber?: string
  programs?: {
    id: string
    name: string
    ageRange: string
    duration: string
    schedule: string
    students: number
    description: string
  }[]
  categories?: {
    id: number
    nom: string
  }[]
  cours?: {
    id: number
    nom: string
  }[]
  statuts?: {
    id: number
    nom: string
  }[]
  latitude?: number
  longitude?: number
  user?: {
    id: number
    email: string
    firstname: string
    lastname: string
    adresse: string
    image: string | null
    tel: string
    role: string
    is_accept_mail: boolean
    articles: any[]
  }
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
