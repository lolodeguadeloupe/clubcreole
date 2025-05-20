import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createClient, User } from '@supabase/supabase-js'
import { CardContent } from '@/components/ui/card'
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { User as UserIcon, Users, CheckCircle, Tag, Calendar, Clock } from "lucide-react"
import { sendEmail } from "@/lib/email"

// Typage minimal pour la page détail
type RestaurantDetail = {
  id: string
  name: string
  description?: string
  address?: string
  opening_hours?: string
  image?: string
  type?: string
  location?: string
  rating?: number
  offer?: string
  icon?: string
}

interface BookingData {
  date?: string;
  time?: string;
  guests?: string;
  phone?: string;
  restaurantId?: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("info");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [phone, setPhone] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [savePhoneNumber, setSavePhoneNumber] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single()
        if (error || !data) throw error || new Error('Non trouvé')
        setRestaurant(data)
      } catch (err) {
        setError('Restaurant non trouvé')
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurant()
  }, [id])

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  if (loading) return <div className="text-center mt-10">Chargement...</div>
  if (error || !restaurant) return <div className="text-center mt-10 text-red-500">{error || 'Restaurant non trouvé'}</div>

   // Fonction appelée lors de la soumission du formulaire
   const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Stocker les données de réservation dans localStorage avant redirection
      console.log("Non identifié");
      localStorage.setItem('pendingBooking', JSON.stringify({
        restaurantId: id,
        date,
        time,
        guests,
        phone
      }));
      
      // Rediriger vers la page de connexion
      navigate('/login', { state: { redirectTo: `/restaurant/${id}` } });
      return;
    } else {
      console.log("Identifié");
    }


    // Si l'utilisateur est déjà connecté, procéder à la réservation
    await handleBookingSubmit();
  };

   // Fonction pour gérer la soumission de réservation (utilisée directement ou après connexion)
   const handleBookingSubmit = async (bookingData: BookingData | null = null) => {
    // Utiliser les données fournies ou celles du formulaire
    const bookingDate = bookingData?.date || date;
    const bookingTime = bookingData?.time || time;
    const bookingGuests = bookingData?.guests || guests;
    const bookingPhone = bookingData?.phone || phone;
    
    if (!bookingDate || !bookingTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return false;
    }
    
    // Vérifier que l'utilisateur a un profil complet et qu'un numéro de téléphone est fourni
    if (!user?.user_metadata?.name || !user?.email) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez compléter votre profil avant de réserver.",
        variant: "destructive",
      });
      navigate('/profile');
      return false;
    }
    
    if (!bookingPhone) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir un numéro de téléphone pour la réservation.",
        variant: "destructive",
      });
      return false;
    }

    setIsBooking(true);
    try {
      // Mettre à jour le numéro de téléphone de l'utilisateur si nécessaire et si l'utilisateur a donné son consentement
      if (isAuthenticated && savePhoneNumber && bookingPhone !== user?.phone) {
        await updateUserPhoneNumber(bookingPhone);
      }

      const { error } = await supabase.from("bookings").insert({
        restaurant_id: restaurant?.id,
        name: user?.user_metadata?.name,
        email: user?.email,
        phone: bookingPhone,
        date: bookingDate,
        time: bookingTime,
        guests: parseInt(bookingGuests),
        status: "accepted", // Statut accepté automatiquement
      });

      if (error) throw error;

      // Envoyer un email au propriétaire du restaurant
      await sendEmail({
        to: `contact@${restaurant!.name.toLowerCase().replace(/\s/g, '')}.com`,
        subject: `Nouvelle réservation pour ${restaurant!.name}`,
        body: `Une nouvelle réservation a été effectuée par ${user?.user_metadata?.name} pour ${bookingGuests} personne(s) le ${bookingDate} à ${bookingTime}.`,
      });

      // Afficher le message de succès
      setBookingSuccess(true);
      
      // Réinitialiser uniquement les champs du formulaire
      setDate("");
      setTime("");
      setGuests("2");
      setPhone("");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsBooking(false);
    }
  };

  const updateUserPhoneNumber = async (phoneNumber: string) => {
    if (!user) return;
    await supabase.auth.updateUser({
      phone: phoneNumber,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/restaurants")}
        className="mb-4"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-6">
            {loading ? (
              <div>Chargement...</div>
            ) : restaurant ? (
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div>Restaurant non trouvé</div>
            )}
            <Badge className="absolute top-4 right-4 bg-creole-green text-white">
              {restaurant?.type}
            </Badge>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-creole-blue">{restaurant?.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{restaurant?.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
              <span className="font-medium">{restaurant?.rating}/5</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">À propos du restaurant</h3>
                <p className="text-gray-700">{restaurant?.description}</p>
                
                <div className="bg-green-50 p-4 rounded-md border border-green-200 mt-6">
                  <h3 className="font-semibold text-creole-green flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Offre spéciale Club Créole
                  </h3>
                  <p className="mt-1 text-gray-700">{restaurant?.offer}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="photos">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img src={restaurant?.image} alt={restaurant?.name} className="rounded-lg h-40 w-full object-cover" />
                <img src={restaurant?.image} alt={restaurant?.name} className="rounded-lg h-40 w-full object-cover" />
                <img src={restaurant?.image} alt={restaurant?.name} className="rounded-lg h-40 w-full object-cover" />
                <img src={restaurant?.image} alt={restaurant?.name} className="rounded-lg h-40 w-full object-cover" />
                <img src={restaurant?.image} alt={restaurant?.name} className="rounded-lg h-40 w-full object-cover" />
              </div>
            </TabsContent>
            
            <TabsContent value="menu">
              <p className="text-gray-600">Le menu sera bientôt disponible.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Réserver une table</CardTitle>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mt-1">Connectez-vous pour réserver une table</p>
              )}
            </CardHeader>
            <CardContent>
              {bookingSuccess ? (
                <Alert className="bg-green-50 border-green-200 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-800 font-medium">Réservation confirmée !</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Votre réservation chez {restaurant?.name} a été acceptée. Vous recevrez une confirmation par email.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  {isAuthenticated && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-sm text-gray-600 mb-1">Réservation au nom de :</p>
                      <p className="font-medium">{user?.user_metadata?.name}</p>
                      <p className="text-sm text-gray-600 mt-2">{user?.email}</p>
                      <p className="text-sm text-gray-600">{user?.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Heure</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guests">Nombre de personnes</Label>
                    <select 
                      id="guests" 
                      value={guests} 
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Numéro de téléphone pour cette réservation"
                      required 
                    />
                  </div>
                  
                  {isAuthenticated && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="savePhoneNumber"
                        checked={savePhoneNumber}
                        onChange={(e) => setSavePhoneNumber(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-creole-green focus:ring-creole-green"
                      />
                      <Label htmlFor="savePhoneNumber" className="text-sm font-normal cursor-pointer">
                        Enregistrer ce numéro dans mon profil
                      </Label>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-creole-green hover:bg-creole-green/90"
                    disabled={isBooking}
                  >
                    {isBooking ? "Réservation en cours..." : "Réserver maintenant"}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    En réservant, vous acceptez nos conditions générales d'utilisation.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Horaires d'ouverture</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>11:30 - 14:30, 19:00 - 22:30</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi - Dimanche</span>
                <span>11:30 - 15:00, 19:00 - 23:00</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>Téléphone: 0590 XX XX XX</p>
              <p>Email: contact@{restaurant?.name.toLowerCase().replace(/\s/g, '')}.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
);
} 