import { faker } from "@faker-js/faker/locale/fr"

// Exporter faker pour l'utiliser dans d'autres fichiers
export { faker }

// Fonction utilitaire pour générer un nombre aléatoire entre min et max
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fonction pour générer une date aléatoire entre deux dates
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Fonction pour générer un texte aléatoire avec une longueur spécifique
export function randomText(minLength: number, maxLength: number): string {
  const paragraphs = faker.lorem.paragraphs(randomInt(1, 3))
  if (paragraphs.length <= maxLength) return paragraphs
  return paragraphs.substring(0, randomInt(minLength, maxLength))
}

// Fonction pour générer un prix aléatoire (multiple de 1000)
export function randomPrice(min = 10000, max = 500000, step = 5000): number {
  const steps = Math.floor((max - min) / step)
  return min + randomInt(0, steps) * step
}

// Fonction pour générer un tableau d'éléments aléatoires
export function randomArray<T>(array: T[], min = 1, max: number = array.length): T[] {
  const count = randomInt(min, Math.min(max, array.length))
  return faker.helpers.arrayElements(array, count)
}

// Fonction pour générer un nom d'événement aléatoire
export function randomEventName(): string {
  const prefixes = [
    "Conférence sur",
    "Séminaire de",
    "Atelier d'",
    "Formation en",
    "Journée de",
    "Rencontre pour",
    "Célébration de",
  ]

  const subjects = [
    "l'apprentissage du Coran",
    "l'éducation islamique",
    "la récitation coranique",
    "la mémorisation du Coran",
    "l'histoire islamique",
    "la pédagogie coranique",
    "la spiritualité musulmane",
    "les sciences islamiques",
  ]

  const locations = ["à Conakry", "à Kindia", "à Kankan", "à Labé", "à Mamou", "en Guinée"]

  return `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(subjects)} ${faker.helpers.arrayElement(locations)}`
}
