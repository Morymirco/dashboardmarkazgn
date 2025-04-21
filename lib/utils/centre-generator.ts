import type { CentreCreateRequest } from "../services/centre-service"

// Fonction pour obtenir une image aléatoire d'Unsplash
export function getRandomUnsplashImage(query = "mosque,school,education,islamic"): string {
  const width = 800
  const height = 600
  const unsplashUrl = `https://source.unsplash.com/random/${width}x${height}?${query}`
  return unsplashUrl
}

// Liste de noms de centres islamiques pour la génération aléatoire
const centreNames = [
  "Centre Al-Noor",
  "Institut Al-Hidaya",
  "Centre Éducatif Al-Falah",
  "Académie Al-Firdaws",
  "Institut Al-Iman",
  "Centre d'Études Islamiques Al-Huda",
  "École Coranique Al-Furqan",
  "Centre Al-Rahma",
  "Institut Al-Salam",
  "Centre Éducatif Al-Taqwa",
  "Académie Al-Madinah",
  "Institut Al-Quds",
  "Centre Al-Barakah",
  "École Coranique Al-Ihsan",
  "Centre Al-Hikma",
]

// Liste de communes pour la génération aléatoire
const communes = ["Ratoma", "Matoto", "Kaloum", "Dixinn", "Matam", "Conakry", "Kindia", "Kankan", "Labé", "Mamou"]

// Fonction pour générer un centre aléatoire
export function generateRandomCentre(userId: number): CentreCreateRequest {
  // Générer un nombre aléatoire entre min et max inclus
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  // Sélectionner un nom aléatoire
  const randomName = centreNames[Math.floor(Math.random() * centreNames.length)]

  // Sélectionner une commune aléatoire
  const randomCommune = communes[Math.floor(Math.random() * communes.length)]

  // Générer des installations aléatoires
  const facilities = [
    { name: "Salles de classe", count: getRandomInt(4, 12), description: "Salles spacieuses et bien équipées" },
    { name: "Bibliothèque", count: 1, description: "Collection de livres islamiques et éducatifs" },
    { name: "Mosquée", count: 1, description: `Capacité de ${getRandomInt(100, 500)} fidèles` },
  ]

  // Ajouter des installations supplémentaires aléatoirement
  if (Math.random() > 0.5) {
    facilities.push({
      name: "Salle informatique",
      count: 1,
      description: `${getRandomInt(5, 20)} ordinateurs avec logiciels éducatifs`,
    })
  }
  if (Math.random() > 0.5) {
    facilities.push({ name: "Cantine", count: 1, description: "Repas servis midi et soir" })
  }
  if (Math.random() > 0.7) {
    facilities.push({ name: "Terrain de sport", count: 1, description: "Pour les activités physiques des élèves" })
  }

  // Générer des statistiques aléatoires
  const students = getRandomInt(50, 300)
  const teachers = getRandomInt(5, 25)
  const classrooms = getRandomInt(4, 15)

  // Générer des programmes aléatoires
  const programs = [
    {
      id: "101",
      name: "Mémorisation du Coran",
      description: "Programme intensif de mémorisation du Coran avec suivi personnalisé",
      duration: `${getRandomInt(2, 5)} ans`,
      ageRange: "7-18 ans",
      students: getRandomInt(20, 80),
      schedule: "Lundi au Vendredi, 8h-12h",
    },
    {
      id: "102",
      name: "Tajwid (Récitation)",
      description: "Apprentissage des règles de récitation correcte du Coran",
      duration: `${getRandomInt(1, 2)} ans`,
      ageRange: "Tous âges",
      students: getRandomInt(15, 60),
      schedule: "Lundi, Mercredi, Vendredi, 14h-16h",
    },
  ]

  // Ajouter des programmes supplémentaires aléatoirement
  if (Math.random() > 0.3) {
    programs.push({
      id: "103",
      name: "Langue arabe",
      description: "Cours de langue arabe pour débutants et avancés",
      duration: `${getRandomInt(2, 4)} ans`,
      ageRange: "Tous âges",
      students: getRandomInt(15, 50),
      schedule: "Mardi, Jeudi, 14h-17h",
    })
  }
  if (Math.random() > 0.5) {
    programs.push({
      id: "104",
      name: "Fiqh (Jurisprudence)",
      description: "Étude des principes de la jurisprudence islamique",
      duration: `${getRandomInt(1, 3)} ans`,
      ageRange: "16+ ans",
      students: getRandomInt(10, 40),
      schedule: "Samedi, 9h-12h",
    })
  }

  // Générer des frais pour chaque programme
  const fees = programs.map((program) => ({
    programId: program.id,
    programName: program.name,
    amount: getRandomInt(20000, 60000),
    currency: "GNF",
    period: "mensuel",
    scholarshipAvailable: Math.random() > 0.5,
  }))

  // Générer des images Unsplash
  const imageCount = getRandomInt(1, 4)
  const images = []
  for (let i = 0; i < imageCount; i++) {
    images.push(getRandomUnsplashImage())
  }

  // Générer le centre complet
  return {
    statuts: [1],
    categories: [getRandomInt(1, 3)],
    cours: [1, 2, 3, 4].slice(0, getRandomInt(1, 4)),
    images: ["1"], // Utiliser l'ID d'image par défaut pour l'API
    user: userId,
    nom: randomName,
    short_description: `${randomName} est un centre d'éducation islamique situé à ${randomCommune}.`,
    long_description: `${randomName} est un centre d'apprentissage du Coran offrant des cours pour tous les âges et niveaux. Notre approche pédagogique combine méthodes traditionnelles et modernes pour faciliter l'apprentissage et la mémorisation du Coran. Nous proposons également des cours de langue arabe et de sciences islamiques.`,
    location: `${randomCommune}, Guinée`,
    latitude: 0,
    longitude: 0,
    commune: randomCommune,
    programme: `de ${getRandomInt(7, 9)}h à ${getRandomInt(15, 18)}h`,
    autre: "Centre d'éducation islamique",
    contact: {
      phone: `+224 ${getRandomInt(600, 699)} ${getRandomInt(10, 99)} ${getRandomInt(10, 99)} ${getRandomInt(10, 99)}`,
      email: `contact@${randomName.toLowerCase().replace(/\s+/g, "-")}.org`,
      website: `www.${randomName.toLowerCase().replace(/\s+/g, "-")}.org`,
      socialMedia: {
        facebook: `https://facebook.com/${randomName.toLowerCase().replace(/\s+/g, "")}`,
        instagram: `https://instagram.com/${randomName.toLowerCase().replace(/\s+/g, "")}`,
        twitter: null,
      },
    },
    statistics: {
      students,
      teachers,
      classrooms,
      graduatedStudents: getRandomInt(100, 500),
      booksInLibrary: getRandomInt(500, 2000),
      averageClassSize: getRandomInt(15, 30),
    },
    facilities,
    schedule: {
      weekdays: `${getRandomInt(7, 9)}h00 - ${getRandomInt(16, 19)}h00`,
      saturday: `${getRandomInt(8, 10)}h00 - ${getRandomInt(14, 17)}h00`,
      sunday: Math.random() > 0.7 ? `${getRandomInt(9, 11)}h00 - ${getRandomInt(13, 15)}h00` : "Fermé",
      holidays: "Fermé pendant les jours fériés islamiques",
      ramadan: `Horaires spéciaux: ${getRandomInt(8, 10)}h00 - ${getRandomInt(14, 16)}h00`,
    },
    admissionProcess: {
      steps: [
        "Remplir le formulaire d'inscription",
        "Entretien avec l'élève et les parents",
        "Test de niveau (pour certains programmes)",
        "Paiement des frais d'inscription",
      ],
      requiredDocuments: [
        "Copie de la carte d'identité ou extrait de naissance",
        "2 photos d'identité",
        "Certificats d'études précédentes (si applicable)",
      ],
      registrationFee: {
        amount: getRandomInt(50000, 150000),
        currency: "GNF",
        oneTime: true,
      },
    },
    fees,
    achievements: [
      {
        year: 2022,
        title: "Participation au concours national de récitation",
        description: "Plusieurs élèves ont participé au concours national",
      },
      {
        year: 2021,
        title: "Expansion du centre",
        description: "Ajout de nouvelles salles de classe",
      },
    ],
    partnerships: [
      {
        id: "501",
        name: "Association pour l'Éducation Islamique",
        location: "Conakry, Guinée",
        type: "Local",
        description: "Collaboration sur des projets éducatifs",
      },
    ],
    tags: ["coran", "éducation", "mémorisation", randomCommune.toLowerCase()],
    legalStatus: "Association à but non lucratif",
    status: "active",
    registrationNumber: `EDU-ISL-${getRandomInt(2010, 2023)}-${getRandomInt(100, 999)}`,
    programs,
  }
}
