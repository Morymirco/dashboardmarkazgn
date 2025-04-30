import { getAccessToken } from "@/lib/auth"

export const API_URL = "https://api.markazgn.org"

export interface CentreImage {
  id: number
  image: string
}

export interface CentreFacility {
  name: string
  count: number
  description: string
}

export interface CentreStatistics {
  students: number
  teachers: number
  classrooms: number
  booksInLibrary: number
  averageClassSize: number
  graduatedStudents: number
}

export interface CentreContact {
  email: string
  phone: string
  website: string
  socialMedia: {
    twitter: string | null
    facebook: string
    instagram: string
  }
}

export interface CentreProgram {
  id: string
  name: string
  ageRange: string
  duration: string
  schedule: string
  students: number
  description: string
}

export interface CentreFee {
  amount: number
  period: string
  currency: string
  programId: string
  programName: string
  scholarshipAvailable: boolean
}

export interface CentreAchievement {
  year: number
  title: string
  description: string
}

export interface CentrePartnership {
  id: string
  name: string
  type: string
  location: string
  description: string
}

export interface CentreSchedule {
  sunday: string
  ramadan: string
  holidays: string
  saturday: string
  weekdays: string
}

export interface CentreAdmissionProcess {
  steps: string[]
  registrationFee: {
    amount: number
    oneTime: boolean
    currency: string
  }
  requiredDocuments: string[]
}

export interface CentreCategory {
  id: number
  nom: string
}

export interface CentreCours {
  id: number
  name: string
}

export interface CentreStatut {
  id: number
  name: string
}

export interface CentreUser {
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

export interface CentreResponse {
  id: number
  user: CentreUser | null
  slug: string | null
  installations: string[] | null
  statuts: CentreStatut[]
  categories?: CentreCategory[]
  cours: CentreCours[]
  name: string | null
  description?: string | null
  short_description?: string | null
  long_description?: string | null
  location?: string | null
  latitude?: number
  longitude?: number
  commune: string | null
  programme?: string | null
  compte?: string | null
  autre?: string | null
  contact: {
    fixe: string
    mobile: string
  } | null
  statistics?: CentreStatistics | null
  facilities?: CentreFacility[] | null
  schedule?: CentreSchedule | null
  admissionProcess?: CentreAdmissionProcess | null
  fees?: CentreFee[] | null
  achievements?: CentreAchievement[] | null
  partnerships?: CentrePartnership[] | null
  tags?: string[] | null
  created_at?: string
  updated_at?: string
  legalStatus?: string | null
  status?: string | null
  registrationNumber?: string | null
  programs?: CentreProgram[] | null
  images: CentreImage[] | null
  presentation: string | null
  creation: string | null
  manager_full_name: string | null
  manager_email: string | null
  managers: {
    name: string
    role: string
  }[] | null
  total_inscrits: number
  capacity: number
  tarifs: {
    mensuel: number
    inscription: number
  } | null
  opening_days: string[] | null
  certifications: string[] | null
  is_agrement: boolean
  collaboration: string | null
  is_support: boolean
  commentaire: string | null
  student_types: number[]
  cours_graders: number[]
  languages: number[]
}

export interface CentreListResponse {
  count: number
  next: string | null
  previous: string | null
  results: CentreResponse[]
}

export interface CentreCreateRequest {
  statuts: number[]
  categories: number[]
  cours: number[]
  images: string[]
  user: number
  compte?: string
  nom: string
  short_description?: string
  long_description?: string
  location?: string
  latitude?: number
  longitude?: number
  commune?: string
  programme?: string
  autre?: string
  contact?: {
    phone?: string
    email?: string
    website?: string
    socialMedia?: {
      facebook?: string
      instagram?: string
      twitter?: string | null
    }
  }
  statistics?: {
    students?: number
    teachers?: number
    classrooms?: number
    graduatedStudents?: number
    booksInLibrary?: number
    averageClassSize?: number
  }
  facilities?: {
    name: string
    count: number
    description: string
  }[]
  schedule?: {
    weekdays?: string
    saturday?: string
    sunday?: string
    holidays?: string
    ramadan?: string
  }
  admissionProcess?: {
    steps?: string[]
    requiredDocuments?: string[]
    registrationFee?: {
      amount: number
      currency: string
      oneTime: boolean
    }
  }
  fees?: {
    programId: string
    programName: string
    amount: number
    currency: string
    period: string
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
    location: string
    type: string
    description: string
  }[]
  tags?: string[]
  legalStatus?: string
  status?: string
  registrationNumber?: string
  programs?: {
    id: string
    name: string
    description: string
    duration: string
    ageRange: string
    students: number
    schedule: string
  }[]
}

export async function getCentres() {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/markaz/`, {
      headers,
    })
    console.log(response)

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des centres: ${response.status}`)
    }

    const data: CentreListResponse = await response.json()
    console.log("data", data)
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération des centres:", error)
    throw error
  }
}

export async function getCentreById(id: number) {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/markaz/${id}/`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du centre: ${response.status}`)
    }

    const data: CentreResponse = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération du centre:", error)
    throw error
  }
}

export async function getCentreBySlug(slug: string) {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/markaz/${slug}/`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du centre: ${response.status}`)
    }

    const data: CentreResponse = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération du centre par slug:", error)
    throw error
  }
}

// Fonction utilitaire pour formater les données de centre de l'API vers notre format interne
export function formatCentreFromApi(centre: CentreResponse) {
  return {
    id: centre.id,
    nom: centre.name,
    slug: centre.slug || `centre-${centre.id}`,
    adresse: centre.location || centre.commune || "Adresse non spécifiée",
    description:
      centre.long_description || centre.short_description || centre.description || centre.presentation || "Aucune description disponible",
    images: centre.images ? centre.images.map((img) => img.image) : ["/placeholder.svg"],
    installations: centre.installations || [],
    informations: [
      ...(centre.statistics
        ? [
            { label: "Nombre d'étudiants", value: centre.statistics.students.toString() },
            { label: "Nombre d'enseignants", value: centre.statistics.teachers.toString() },
          ]
        : []),
      ...(centre.programs ? [{ label: "Programmes", value: centre.programs.length.toString() }] : []),
      ...(centre.contact?.mobile ? [{ label: "Contact", value: centre.contact.mobile }] : []),
      ...(centre.status ? [{ label: "Statut", value: centre.status }] : []),
      ...(centre.total_inscrits ? [{ label: "Inscrits", value: centre.total_inscrits.toString() }] : []),
      ...(centre.capacity ? [{ label: "Capacité", value: centre.capacity.toString() }] : []),
    ],
    contact: centre.contact,
    statistics: centre.statistics,
    facilities: centre.facilities,
    schedule: centre.schedule,
    admissionProcess: centre.admissionProcess,
    fees: centre.fees,
    achievements: centre.achievements,
    partnerships: centre.partnerships,
    tags: centre.tags,
    legalStatus: centre.legalStatus,
    status: centre.status,
    registrationNumber: centre.registrationNumber,
    programs: centre.programs,
    categories: centre.categories,
    cours: centre.cours,
    statuts: centre.statuts,
    latitude: centre.latitude,
    longitude: centre.longitude,
    user: centre.user,
    presentation: centre.presentation,
    creation: centre.creation,
    manager_full_name: centre.manager_full_name,
    manager_email: centre.manager_email,
    managers: centre.managers,
    total_inscrits: centre.total_inscrits,
    capacity: centre.capacity,
    tarifs: centre.tarifs,
    opening_days: centre.opening_days,
    certifications: centre.certifications,
    is_agrement: centre.is_agrement,
    collaboration: centre.collaboration,
    is_support: centre.is_support,
    commentaire: centre.commentaire,
    student_types: centre.student_types,
    cours_graders: centre.cours_graders,
    languages: centre.languages,
  }
}

export async function createCentre(centreData: CentreCreateRequest) {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/markaz/`, {
      method: "POST",
      headers,
      body: JSON.stringify(centreData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `Erreur lors de la création du centre: ${response.status} ${errorData ? JSON.stringify(errorData) : ""}`,
      )
    }

    const data: CentreResponse = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la création du centre:", error)
    throw error
  }
}

export async function updateCentre(id: number, centreData: Partial<CentreCreateRequest>) {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/markaz/${id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(centreData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `Erreur lors de la mise à jour du centre: ${response.status} ${errorData ? JSON.stringify(errorData) : ""}`,
      )
    }

    const data: CentreResponse = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du centre:", error)
    throw error
  }
}

export async function deleteCentre(id: number) {
  try {
    const token = getAccessToken()
    const headers: HeadersInit = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/markaz/${id}/`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression du centre: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la suppression du centre:", error)
    throw error
  }
}
