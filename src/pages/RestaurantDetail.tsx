import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Tag, Star, Calendar, Clock, User, Users } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth"; // Hook to handle authentication
import { sendEmail } from "@/lib/email"; // Fonction pour envoyer des emails
import { AuthProvider } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  type: string;
  image: string;
  location: string;
  description: string;
  rating: number;
  offer: string;
  icon: string;
}

const RestaurantDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  // Les informations personnelles sont récupérées depuis le profil utilisateur
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [phone, setPhone] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { user, isAuthenticated } = useAuth(); // Gestion de l'authentification

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du restaurant :", error.message);
        navigate("/restaurant");
      } else {
        setRestaurant(data);
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, [id, navigate]);
  
  // Effet séparé pour gérer l'initialisation du téléphone et les réservations en attente
  useEffect(() => {
    // Initialiser le numéro de téléphone avec celui de l'utilisateur s'il est connecté
    if (isAuthenticated && user?.phone) {
       setPhone(user.phone);
    } 

    // Vérifier s'il y a des données de réservation en attente dans localStorage
    const checkPendingBooking = async () => {
      if (isAuthenticated && localStorage.getItem('pendingBooking')) {
        try {
          const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking') || '{}');
          
          // Vérifier que la réservation concerne bien ce restaurant
          if (pendingBooking.restaurantId === id) {
            console.log("Réservation en attente trouvée pour ce restaurant", pendingBooking);
            
            setDate(pendingBooking.date || "");
            setTime(pendingBooking.time || "");
            setGuests(pendingBooking.guests || "2");
            setPhone(pendingBooking.phone || user?.phone || "");
            
            // Si l'utilisateur vient de se connecter (redirection depuis login)
            if (location.state?.fromLogin) {
              console.log("Utilisateur venant de se connecter, soumission automatique de la réservation");
              // Attendre un court instant pour s'assurer que tout est initialisé
              setTimeout(async () => {
                // Soumettre automatiquement la réservation
                const success = await handleBookingSubmit(pendingBooking);
                if (success) {
                  // Supprimer les données temporaires uniquement en cas de succès
                  localStorage.removeItem('pendingBooking');
                  console.log("Réservation automatique réussie et données temporaires supprimées");
                }
              }, 500);
            }
          }
        } catch (error) {
          console.error("Erreur lors du traitement de la réservation en attente:", error);
        }
      }
    };
    
    if (isAuthenticated && restaurant) {
      checkPendingBooking();
    }
  }, [id, isAuthenticated, user, location.state, restaurant]);

  // Fonction pour mettre à jour le numéro de téléphone de l'utilisateur dans son profil
  const updateUserPhoneNumber = async (phoneNumber: string) => {
    // Vérifier si l'utilisateur est connecté et si le numéro est différent
    if (isAuthenticated && user && user.id && phoneNumber !== user.phone) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ phone: phoneNumber })
          .eq('id', user.id);

        if (error) {
           console.error("Erreur lors de la mise à jour du numéro de téléphone :", error);
         } else {
           console.log("Numéro de téléphone mis à jour avec succès");
           toast({
             title: "Profil mis à jour",
             description: "Votre numéro de téléphone a été enregistré dans votre profil.",
             variant: "default",
           });
         }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
      }
    }
  };

  // Fonction pour gérer la soumission de réservation (utilisée directement ou après connexion)
  const handleBookingSubmit = async (bookingData: any = null) => {
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
    if (!user?.name || !user?.email) {
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
      // Mettre à jour le numéro de téléphone de l'utilisateur si nécessaire
      if (isAuthenticated && bookingPhone !== user?.phone) {
        await updateUserPhoneNumber(bookingPhone);
      }

      const { error } = await supabase.from("bookings").insert({
        restaurant_id: restaurant?.id,
        name: user?.name,
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
        body: `Une nouvelle réservation a été effectuée par ${user?.name} pour ${bookingGuests} personne(s) le ${bookingDate} à ${bookingTime}.`,
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
  
  // Fonction appelée lors de la soumission du formulaire
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Stocker les données de réservation dans localStorage avant redirection
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
    }

    // Si l'utilisateur est déjà connecté, procéder à la réservation
    await handleBookingSubmit();
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Restaurant non trouvé</p>
        <Button onClick={() => navigate("/restaurant")}>Retour aux restaurants</Button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="container mx-auto px-4 py-8">


        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-6">
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-creole-green text-white">
                {restaurant.type}
              </Badge>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-creole-blue">{restaurant.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
                <span className="font-medium">{restaurant.rating}/5</span>
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
                  <p className="text-gray-700">{restaurant.description}</p>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 mt-6">
                    <h3 className="font-semibold text-creole-green flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Offre spéciale Club Créole
                    </h3>
                    <p className="mt-1 text-gray-700">{restaurant.offer}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="photos">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <img src={restaurant.image} alt={restaurant.name} className="rounded-lg h-40 w-full object-cover" />
                  <img src={restaurant.image} alt={restaurant.name} className="rounded-lg h-40 w-full object-cover" />
                  <img src={restaurant.image} alt={restaurant.name} className="rounded-lg h-40 w-full object-cover" />
                  <img src={restaurant.image} alt={restaurant.name} className="rounded-lg h-40 w-full object-cover" />
                  <img src={restaurant.image} alt={restaurant.name} className="rounded-lg h-40 w-full object-cover" />
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
                      Votre réservation chez {restaurant.name} a été acceptée. Vous recevrez une confirmation par email.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    {isAuthenticated && (
                      <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-gray-600 mb-1">Réservation au nom de :</p>
                        <p className="font-medium">{user?.name}</p>
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
                <p>Email: contact@{restaurant.name.toLowerCase().replace(/\s/g, '')}.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default RestaurantDetail;