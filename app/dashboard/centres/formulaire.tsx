"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Loader2, Plus, Trash, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Fonctions utilitaires (à adapter selon votre implémentation)
import {createCentre, updateCentre, getCentreById, API_URL} from "@/lib/services/centre-service"
import { generateRandomCentre, getRandomUnsplashImage } from "@/lib/utils/centre-generator"
import {getAccessToken} from "@/lib/auth";

interface Installation {
  nom: string
}

interface Manager {
  name: string
  role: string
}

interface CentreFormProps {
  centreId?: number
  initialData?: any
}

export default function CentreForm({ centreId, initialData }: CentreFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  const [userId, setUserId] = useState<number>(initialData?.user?.id || 9)

  // Champs utilisateur
  const [userEmail, setUserEmail] = useState(initialData?.user?.email || "")
  const [password, setPassword] = useState("")
  const [firstname, setFirstname] = useState(initialData?.user?.firstname || "")
  const [lastname, setLastname] = useState(initialData?.user?.lastname || "")
  const [userAdresse, setUserAdresse] = useState(initialData?.user?.adresse || "")
  const [userTel, setUserTel] = useState(initialData?.user?.tel || "")
  const [userRole, setUserRole] = useState(initialData?.user?.role || "manager")
  const [isAcceptMail, setIsAcceptMail] = useState(initialData?.user?.is_accept_mail || false)

  // Champs Markaz
  const [name, setName] = useState(initialData?.name || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [adresse, setAdresse] = useState(initialData?.adresse || "")
  const [tel, setTel] = useState(initialData?.tel || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [website, setWebsite] = useState(initialData?.website || "")
  const [presentation, setPresentation] = useState(initialData?.presentation || "")
  const [creation, setCreation] = useState(initialData?.creation || "")
  const [commune, setCommune] = useState(initialData?.commune || "")
  const [managerFullName, setManagerFullName] = useState(initialData?.manager_full_name || "")
  const [managerEmail, setManagerEmail] = useState(initialData?.manager_email || "")
  const [totalInscrits, setTotalInscrits] = useState(initialData?.total_inscrits || 0)
  const [capacity, setCapacity] = useState(initialData?.capacity || 0)
  const [isAgrement, setIsAgrement] = useState(initialData?.is_agrement || false)
  const [isSupport, setIsSupport] = useState(initialData?.is_support || false)
  const [commentaire, setCommentaire] = useState(initialData?.commentaire || "")
  const [collaboration, setCollaboration] = useState(initialData?.collaboration || "")

  // Contact
  const [contactFixe, setContactFixe] = useState(initialData?.contact?.fixe || "")
  const [contactMobile, setContactMobile] = useState(initialData?.contact?.mobile || "")

  // Managers
  const [managers, setManagers] = useState<Manager[]>(initialData?.managers || [])

  // Tarifs
  const [tarifs, setTarifs] = useState(initialData?.tarifs || { inscription: 0, mensuel: 0 })

  // Arrays
  const [openingDays, setOpeningDays] = useState<string[]>(initialData?.opening_days || [])
  const [installations, setInstallations] = useState<Installation[]>(initialData?.installations?.map((inst: string) => ({ nom: inst })) || [])
  const [certifications, setCertifications] = useState<string[]>(initialData?.certifications || [])
  const [statuts, setStatuts] = useState<number[]>(initialData?.statuts?.map((stat: any) => stat.id) || [])
  const [cours, setCours] = useState<number[]>(initialData?.cours?.map((c: any) => c.id) || [])
  const [studentTypes, setStudentTypes] = useState<number[]>(initialData?.student_types?.map((st: any) => st.id) || [])
  const [coursGraders, setCoursGraders] = useState<number[]>(initialData?.cours_graders?.map((cg: any) => cg.id) || [])
  const [languages, setLanguages] = useState<number[]>(initialData?.languages?.map((lang: any) => lang.id) || [])
  const [relationship, setRelationShip] = useState([])

  const isEditing = !!centreId

  // Charger les données du centre en mode édition
  useEffect(() => {
    if (isEditing && centreId) {
      const loadCentreData = async () => {
        try {
          setLoading(true)
          const centreData = await getCentreById(centreId)

          // Utilisateur
          setUserEmail(centreData.user?.email || "")
          setFirstname(centreData.user?.firstname || "")
          setLastname(centreData.user?.lastname || "")
          setUserAdresse(centreData.user?.adresse || "")
          setUserTel(centreData.user?.tel || "")
          setUserRole(centreData.user?.role || "manager")
          setIsAcceptMail(centreData.user?.is_accept_mail || false)

          // Markaz
          setName(centreData.name || "")
          setSlug(centreData.slug || "")
          setDescription(centreData.description || "")
          setAdresse(centreData.adresse || "")
          setTel(centreData.tel || "")
          setEmail(centreData.email || "")
          setWebsite(centreData.website || "")
          setPresentation(centreData.presentation || "")
          setCreation(centreData.creation || "")
          setCommune(centreData.commune || "")
          setManagerFullName(centreData.manager_full_name || "")
          setManagerEmail(centreData.manager_email || "")
          setTotalInscrits(centreData.total_inscrits || 0)
          setCapacity(centreData.capacity || 0)
          setIsAgrement(centreData.is_agrement || false)
          setIsSupport(centreData.is_support || false)
          setCommentaire(centreData.commentaire || "")
          setCollaboration(centreData.collaboration || "")

          // Contact
          setContactFixe(centreData.contact?.fixe || "")
          setContactMobile(centreData.contact?.mobile || "")

          // Managers
          setManagers(centreData.managers || [])

          // Tarifs
          setTarifs(centreData.tarifs || { inscription: 0, mensuel: 0 })

          // Arrays
          setOpeningDays(centreData.opening_days || [])
          setInstallations(centreData.installations?.map((inst: string) => ({ nom: inst })) || [])
          setCertifications(centreData.certifications || [])
          setStatuts(centreData.statuts?.map((stat: any) => stat.id) || [])
          setCours(centreData.cours?.map((c: any) => c.id) || [])
          setStudentTypes(centreData.student_types?.map((st: any) => st.id) || [])
          setCoursGraders(centreData.cours_graders?.map((cg: any) => cg.id) || [])
          setLanguages(centreData.languages?.map((lang: any) => lang.id) || [])

          // Images
          if (centreData.images && centreData.images.length > 0) {
            setImagesPreviews(centreData.images.map((img: any) => img.image))
          }

          // User ID
          if (centreData.user) {
            setUserId(centreData.user.id)
          }
        } catch (err: any) {
          setError(err.message || "Erreur lors du chargement des données du centre")
        } finally {
          setLoading(false)
        }
      }
      loadCentreData()
    }


    loadRelationShip()
  }, [isEditing, centreId])

  const loadRelationShip = ()=>{
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(`${API_URL}/relationship/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setRelationShip(result)
      })
      .catch((error) => console.error(error));
  }

  // Gestion des images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setImages((prev) => [...prev, ...filesArray])
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setImagesPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(imagesPreviews[index])
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Gestion des installations
  const addInstallation = () => {
    setInstallations((prev) => [...prev, { nom: "" }])
  }

  const updateInstallation = (index: number, value: string) => {
    setInstallations((prev) => prev.map((item, i) => (i === index ? { ...item, nom: value } : item)))
  }

  const removeInstallation = (index: number) => {
    setInstallations((prev) => prev.filter((_, i) => i !== index))
  }

  // Gestion des managers
  const addManager = () => {
    setManagers((prev) => [...prev, { name: "", role: "" }])
  }

  const updateManager = (index: number, field: "name" | "role", value: string) => {
    setManagers((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeManager = (index: number) => {
    setManagers((prev) => prev.filter((_, i) => i !== index))
  }

  // Gestion des jours d'ouverture
  const toggleOpeningDay = (day: string) => {
    setOpeningDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  // Gestion des certifications
  const addCertification = () => {
    setCertifications((prev) => [...prev, ""])
  }

  const updateCertification = (index: number, value: string) => {
    setCertifications((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index))
  }

  // Générer des données aléatoires
  const generateRandomCentreData = () => {
    // Générer des données aléatoires pour simuler un centre
    const randomCentre = generateRandomCentre(userId);
  
    // Mettre à jour les états du formulaire avec les données générées
    setUserEmail(randomCentre.email || "manager@markaz.com");
    setPassword(randomCentre.password || "password123");
    setFirstname(randomCentre.firstname || "John");
    setLastname(randomCentre.lastname || "Doe");
    setUserAdresse(randomCentre.adresse || "123 Main St");
    setUserTel(randomCentre.tel || "+123456789");
    setUserRole(randomCentre.role || "manager");
    setIsAcceptMail(randomCentre.is_accept_mail ?? true);
  
    setName(randomCentre.name || "Markaz Al Quran");
    setSlug(randomCentre.slug || "Centre-enseignement-du-Coran");
    setDescription(randomCentre.presentation || "Une école moderne du Coran");
    setAdresse(randomCentre.adresse || "123 Main St");
    setTel(randomCentre.tel || "+22390909090");
    setEmail(randomCentre.email || "contact@markaz.com");
    setWebsite(randomCentre.website || "https://markaz.com");
    setPresentation(randomCentre.presentation || "Une école moderne du Coran");
    setCreation(randomCentre.creation || "2023-09-01T00:00:00Z");
    setCommune(randomCentre.commune || "Commune VI");
    setManagerFullName(randomCentre.manager_full_name || "Ali Youcef");
    setManagerEmail(randomCentre.manager_email || "ali@markaz.com");
    setTotalInscrits(randomCentre.total_inscrits || 45);
    setCapacity(randomCentre.capacity || 100);
    setIsAgrement(randomCentre.is_agrement ?? true);
    setIsSupport(randomCentre.is_support ?? false);
    setCommentaire(randomCentre.commentaire || "Très bonne organisation");
    setCollaboration(randomCentre.collaboration || "Avec plusieurs ONG");
  
    setContactFixe(randomCentre.contact?.fixe || "+22320202020");
    setContactMobile(randomCentre.contact?.mobile || "+22390909090");
  
    setManagers(
      randomCentre.managers || [
        { name: " Ali", role: "admin" },
        { name: "Fatou", role: "coordinator" },
      ]
    );
  
    setTarifs(
      randomCentre.tarifs || {
        inscription: 10000,
        mensuel: 15000,
      }
    );
  
    setOpeningDays(randomCentre.opening_days || ["Lundi", "Mercredi", "Samedi"]);
    setInstallations(
      randomCentre.installations?.map((inst: string) => ({ nom: inst })) || [
        { nom: "Salle de classe" },
        { nom: "Bibliothèque" },
      ]
    );
    setCertifications(randomCentre.certifications || ["Agrément A", "Label B"]);
    setStatuts(randomCentre.statuts || [1, 2]);
    setCours(randomCentre.cours || [1, 3]);
    setStudentTypes(randomCentre.student_types || [1]);
    setCoursGraders(randomCentre.cours_graders || [1, 2]);
    setLanguages(randomCentre.languages || [1]);
  
    // Gérer les images
    const newImagePreviews = [];
    for (let i = 0; i < 3; i++) {
      newImagePreviews.push(getRandomUnsplashImage());
    }
    imagesPreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagesPreviews(newImagePreviews);
    setImages([]);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      // Construire l'objet JSON dans le format exact
      const centreData = {
        email: userEmail,
        password: password || undefined, // Ne pas inclure si vide (pour l'édition)
        firstname,
        lastname,
        adresse: userAdresse,
        tel: userTel,
        role: userRole,
        is_accept_mail: isAcceptMail,
        name,
        slug,
        presentation,
        creation: creation ? new Date(creation).toISOString() : undefined,
        commune,
        manager_full_name: managerFullName,
        manager_email: managerEmail,
        contact: {
          fixe: contactFixe,
          mobile: contactMobile,
        },
        managers: managers.map((manager) => ({
          name: manager.name,
          role: manager.role,
        })),
        total_inscrits: totalInscrits,
        capacity,
        tarifs: {
          inscription: tarifs.inscription,
          mensuel: tarifs.mensuel,
        },
        opening_days: openingDays,
        installations: installations.map((inst) => inst.nom),
        certifications,
        is_agrement: isAgrement,
        is_support: isSupport,
        commentaire,
        collaboration,
        statuts,
        cours,
        student_types: studentTypes,
        cours_graders: coursGraders,
        languages,
        images: images, // À adapter selon si votre API attend des URLs ou des fichiers
      };

      // Affiche bien toutes les données avec les images aussi mais 
      // des que on les met dans le formdata, il ya certaines valeurs qui disparaisse
      // A revoir plus tard
      console.log(centreData);
  
      // Construire le FormData correctement
      const formData = new FormData();

      // Ajouter les champs simples
      formData.append('email', centreData.email);
      if (centreData.password) formData.append('password', centreData.password);
      formData.append('firstname', centreData.firstname);
      formData.append('lastname', centreData.lastname);
      formData.append('adresse', centreData.adresse);
      formData.append('tel', centreData.tel);
      formData.append('role', centreData.role);
      formData.append('is_accept_mail', centreData.is_accept_mail);
      formData.append('name', centreData.name);
      formData.append('slug', centreData.slug);
      formData.append('presentation', centreData.presentation);
      if (centreData.creation) formData.append('creation', centreData.creation);
      formData.append('commune', centreData.commune);
      formData.append('manager_full_name', centreData.manager_full_name);
      formData.append('manager_email', centreData.manager_email);
      formData.append('total_inscrits', centreData.total_inscrits);
      formData.append('capacity', centreData.capacity);
      formData.append('is_agrement', centreData.is_agrement);
      formData.append('is_support', centreData.is_support);
      formData.append('commentaire', centreData.commentaire);
      formData.append('collaboration', centreData.collaboration);

      // Ajouter les objets imbriqués en les convertissant en JSON
      formData.append('contact', JSON.stringify(centreData.contact));
      formData.append('tarifs', JSON.stringify(centreData.tarifs));

      // Ajouter les tableaux
      formData.append('managers', JSON.stringify(centreData.managers));
      formData.append('opening_days', JSON.stringify(centreData.opening_days));
      formData.append('installations', JSON.stringify(centreData.installations));
      formData.append('certifications', JSON.stringify(centreData.certifications));
      statuts.map(statut=>{formData.append('statuts', statut)})
      cours.map(cour=>{formData.append('cours', cour)})
      studentTypes.map(st=>{formData.append('student_types', st)})
      coursGraders.map(cg=>{formData.append('cours_graders', cg)})
      languages.map(l=>{formData.append('languages', l)})

      // Ajouter les images (si ce sont des fichiers)
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`images`, image); // Adaptez selon votre structure d'images
        });
      }

      // Pour vérifier le contenu de FormData (en développement seulement)
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const token = getAccessToken()
      const response = await fetch(`${API_URL}/users/register_manager/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // À inclure si nécessaire
          // Ne pas mettre 'Content-Type' car FormData le génère automatiquement avec le boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData) // Erreur globales a parcourir
        const errorMessage = (errorData.user_errors || errorData.markaz_errors)['detail']; // Erreur detail
        throw new Error(errorMessage || 'Erreur lors de la requête');
      }

      const responseData = await response.json();
      console.log('Succès:', responseData);
      setSuccess(isEditing ? "Centre mis à jour avec succès" : "Centre créé avec succès");

      // Traitez la réponse ici (redirection, message de succès, etc.)

      //images.forEach((image, index) => {
      //  formData.append(`images[${index}]`, image); // Envoyer les fichiers images
      //});
  
      // Ajouter les données JSON comme un champ dans FormData si l'API accepte un mixte
      //formData.append("data", JSON.stringify(centreData));
  
      //let result;
      //if (isEditing) {
      //  result = await updateCentre(centreId, formData);
      //} else {
      //  result = await createCentre(formData);
      //}
  
      setSuccess(isEditing ? "Centre mis à jour avec succès" : "Centre créé avec succès");
      //setTimeout(() => {
      //  router.push(`/dashboard/centres/slug/${result.slug || `centre-${result.id}`}`);
      //}, 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

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

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={generateRandomCentreData} className="mb-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Générer des données aléatoires
          </Button>
        </div>

        {/* Informations utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email de l'utilisateur"
                required
              />
            </div>
            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Nom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userAdresse">Adresse</Label>
              <Input
                id="userAdresse"
                value={userAdresse}
                onChange={(e) => setUserAdresse(e.target.value)}
                placeholder="Adresse de l'utilisateur"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userTel">Téléphone</Label>
              <Input
                id="userTel"
                value={userTel}
                onChange={(e) => setUserTel(e.target.value)}
                placeholder="Numéro de téléphone"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Rôle</Label>
              <Input
                id="userRole"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="Rôle (ex: manager)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAcceptMail"
                checked={isAcceptMail}
                onCheckedChange={(checked) => setIsAcceptMail(!!checked)}
              />
              <Label htmlFor="isAcceptMail">Accepter les emails</Label>
            </div>
          </CardContent>
        </Card>

        {/* Informations générales du Markaz */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales du Markaz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du Markaz</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du Markaz"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Slug (ex: markaz-al-quran)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du Markaz"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse complète"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Téléphone</Label>
              <Input
                id="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="Numéro de téléphone"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Site web"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentation">Présentation</Label>
              <Textarea
                id="presentation"
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
                placeholder="Présentation du Markaz"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creation">Date de création</Label>
              <Input
                id="creation"
                type="datetime-local"
                value={creation}
                onChange={(e) => setCreation(e.target.value)}
                placeholder="Date de création"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commune">Commune</Label>
              <Input
                id="commune"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Commune"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerFullName">Nom complet du responsable</Label>
              <Input
                id="managerFullName"
                value={managerFullName}
                onChange={(e) => setManagerFullName(e.target.value)}
                placeholder="Nom complet du manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerEmail">Email du responsable</Label>
              <Input
                id="managerEmail"
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="Email du manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalInscrits">Nombre total d'inscrits</Label>
              <Input
                id="totalInscrits"
                type="number"
                value={totalInscrits}
                onChange={(e) => setTotalInscrits(Number(e.target.value))}
                placeholder="Nombre total d'inscrits"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                placeholder="Capacité"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAgrement"
                checked={isAgrement}
                onCheckedChange={(checked) => setIsAgrement(!!checked)}
              />
              <Label htmlFor="isAgrement">Agrément</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSupport"
                checked={isSupport}
                onCheckedChange={(checked) => setIsSupport(!!checked)}
              />
              <Label htmlFor="isSupport">Support</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commentaire">Commentaire</Label>
              <Textarea
                id="commentaire"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Commentaires"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collaboration">Collaboration</Label>
              <Textarea
                id="collaboration"
                value={collaboration}
                onChange={(e) => setCollaboration(e.target.value)}
                placeholder="Collaborations"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactFixe">Téléphone fixe</Label>
              <Input
                id="contactFixe"
                value={contactFixe}
                onChange={(e) => setContactFixe(e.target.value)}
                placeholder="Numéro de téléphone fixe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactMobile">Téléphone mobile</Label>
              <Input
                id="contactMobile"
                value={contactMobile}
                onChange={(e) => setContactMobile(e.target.value)}
                placeholder="Numéro de téléphone mobile"
              />
            </div>
          </CardContent>
        </Card>

        {/* Managers */}
        <Card>
          <CardHeader>
            <CardTitle>Enseignants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {managers.map((manager, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={manager.name}
                    onChange={(e) => updateManager(index, "name", e.target.value)}
                    placeholder="Nom complet de l'enseignant  "
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quanlifications</Label>
                  <Input
                    value={manager.role}
                    onChange={(e) => updateManager(index, "role", e.target.value)}
                    placeholder="Quanlification de l'enseignant"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeManager(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addManager}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Enseignant
            </Button>
          </CardContent>
        </Card>

        {/* Tarifs */}
        <Card>
          <CardHeader>
            <CardTitle>Tarifs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tarifInscription">Frais d'inscription</Label>
              <Input
                id="tarifInscription"
                type="number"
                value={tarifs.inscription}
                onChange={(e) => setTarifs({ ...tarifs, inscription: Number(e.target.value) })}
                placeholder="Frais d'inscription"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tarifMensuel">Frais mensuels</Label>
              <Input
                id="tarifMensuel"
                type="number"
                value={tarifs.mensuel}
                onChange={(e) => setTarifs({ ...tarifs, mensuel: Number(e.target.value) })}
                placeholder="Frais mensuels"
              />
            </div>
          </CardContent>
        </Card>

        {/* Jours d'ouverture */}
        <Card>
          <CardHeader>
            <CardTitle>Jours d'ouverture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={openingDays.includes(day)}
                  onCheckedChange={() => toggleOpeningDay(day)}
                />
                <Label htmlFor={`day-${day}`}>{day}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Installations */}
        <Card>
          <CardHeader>
            <CardTitle>Installations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {installations.map((installation, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={installation.nom}
                  onChange={(e) => updateInstallation(index, e.target.value)}
                  placeholder="Nom de l'installation"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeInstallation(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInstallation}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une installation
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  placeholder="Nom de la certification"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeCertification(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addCertification}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une certification
            </Button>
          </CardContent>
        </Card>

        {/* Statuts, Cours, Student Types, Cours Graders, Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Catégories et options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Statuts */}
            <div className="space-y-2">
              <Label>Statuts</Label>
              {relationship?.statuts?.length > 0 ? (
                <div className="flex flex-wrap flex-col gap-2">
                  {relationship.statuts.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`statut-${item.id}`}
                        checked={statuts.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatuts((prev) => [...prev, item.id]);
                          } else {
                            setStatuts((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                      />
                      <label htmlFor={`statut-${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun statut</p>
              )}
            </div>

            {/* Cours */}
            <div className="space-y-2">
              <Label>Cours</Label>
              {relationship?.cours?.length > 0 ? (
                <div className="flex flex-wrap flex-col gap-2">
                  {relationship.cours.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cours-${item.id}`}
                        checked={cours.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCours((prev) => [...prev, item.id]);
                          } else {
                            setCours((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                      />
                      <label htmlFor={`cours-${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun cours</p>
              )}
            </div>

            {/* Types d'étudiants */}
            <div className="space-y-2">
              <Label>Types d'étudiants</Label>
              {relationship?.student_types?.length > 0 ? (
                <div className="flex flex-wrap flex-col gap-2">
                  {relationship.student_types.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`student-type-${item.id}`}
                        checked={studentTypes.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStudentTypes((prev) => [...prev, item.id]);
                          } else {
                            setStudentTypes((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                      />
                      <label htmlFor={`student-type-${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun type d'étudiant</p>
              )}
            </div>

            {/* Niveaux de cours */}
            <div className="space-y-2">
              <Label>Niveaux de cours</Label>
              {relationship?.cours_graders?.length > 0 ? (
                <div className="flex flex-wrap flex-col gap-2">
                  {relationship.cours_graders.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cours-grader-${item.id}`}
                        checked={coursGraders.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCoursGraders((prev) => [...prev, item.id]);
                          } else {
                            setCoursGraders((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                      />
                      <label htmlFor={`cours-grader-${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun niveau de cours</p>
              )}
            </div>

            {/* Langues */}
            <div className="space-y-2">
              <Label>Langues</Label>
              {relationship?.languages?.length > 0 ? (
                <div className="flex flex-wrap flex-col gap-2">
                  {relationship.languages.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${item.id}`}
                        checked={languages.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLanguages((prev) => [...prev, item.id]);
                          } else {
                            setLanguages((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                      />
                      <label htmlFor={`language-${item.id}`}>{item.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucune langue</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagesPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <Image src={preview || "/placeholder.svg"} alt={`Image ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="border border-dashed rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors aspect-square">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">Ajouter une image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
              </label>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/centres")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Création..."}
              </>
            ) : isEditing ? (
              "Mettre à jour"
            ) : (
              "Créer le centre"
            )}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}