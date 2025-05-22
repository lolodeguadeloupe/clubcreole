import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Bed, MapPin, Star, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Checkbox } from "@/components/ui/checkbox";

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  features: string[];
  description: string;
}

const AccommodationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2");
  const [isBooking, setIsBooking] = useState(false);
  const [updatePhone, setUpdatePhone] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchAccommodation = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase 
        .from("hebergements")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        navigate("/hebergements");
      } else {
        setAccommodation(data);
      }
      setLoading(false);
    };
    fetchAccommodation();
  }, [id, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.first_name + " " + user.last_name);
      setEmail(user.email);
      if (user.phone) {
        setPhone(user.phone);
      }
    }
  }, [isAuthenticated, user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !arrival || !departure) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }
    setIsBooking(true);
    try {
      const { error } = await supabase.from("accommodation_bookings").insert({
        accommodation_id: accommodation?.id,
        name,
        email,
        phone,
        arrival,
        departure,
        guests: parseInt(guests),
        status: "pending"
      });
      if (error) throw error;

      // Si l'utilisateur est connecté et a coché la case pour mettre à jour son numéro
      if (isAuthenticated && updatePhone) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ phone })
          .eq('id', user.id);
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du numéro de téléphone:", updateError);
        }
      }

      setBookingSuccess(true);
      toast({
        title: "Réservation effectuée !",
        description: `Votre réservation à ${accommodation?.name} a été enregistrée.`
      });
      setName("");
      setEmail("");
      setPhone("");
      setArrival("");
      setDeparture("");
      setGuests("2");
      setUpdatePhone(false);
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la réservation.", variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  if (!accommodation) return <div className="container mx-auto px-4 py-8">Hébergement non trouvé</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-6">
            <img src={accommodation.image} alt={accommodation.name} className="w-full h-full object-cover" />
          </div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-creole-blue">{accommodation.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{accommodation.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
              <span className="font-medium">{accommodation.rating}/5</span>
            </div>
            <div className="mt-4 text-gray-700">{accommodation.description}</div>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Réserver cet hébergement</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700 mb-4">
                  Votre réservation a bien été enregistrée !
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <Label htmlFor="arrival">Arrivée</Label>
                    <Input id="arrival" type="date" value={arrival} onChange={e => setArrival(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="departure">Départ</Label>
                    <Input id="departure" type="date" value={departure} onChange={e => setDeparture(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="guests">Occupants</Label>
                    <select id="guests" value={guests} onChange={e => setGuests(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'personne' : 'personnes'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-creole-green hover:bg-creole-green/90" disabled={isBooking}>
                    {isBooking ? "Réservation en cours..." : "Vérifier la disponibilité"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
