import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Calendar, Clock, Music, Star, Ticket } from "lucide-react";

interface Concert {
  id: number;
  name: string;
  artist: string;
  genre: string;
  image: string;
  location: string;
  description: string;
  date: string; // format YYYY-MM-DD
  time: string;
  price: number;
  offer: string;
  rating: number;
}

const ConcertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchConcert = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("concerts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        navigate("/concerts");
      } else {
        setConcert(data);
      }
      setLoading(false);
    };
    fetchConcert();
  }, [id, navigate]);

  console.log(concert);
  console.log(concert?.date);
  console.log(concert?.date.split('-'));
  const isDateValid = () => {
    if (!concert?.date) return false;
    console.log(concert.date);
    // On parse la date du concert
    const [year, month, day] = concert.date.split('-').map(Number);
    const concertDate = new Date(year, month - 1, day);
    
    // On crée la date d'aujourd'hui à minuit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // On compare les dates
    console.log('Date du concert:', concertDate);
    console.log('Date aujourd\'hui:', today);
    console.log('Comparaison:', concertDate >= today);

    return concertDate >= today;
  };

  const handleBuyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || tickets < 1) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }
    console.log(isDateValid());
    if (!isDateValid()) {
      toast({ title: "Date invalide", description: "Ce concert est déjà passé.", variant: "destructive" });
      return;
    }
    // Enregistrement dans Supabase
    try {
      const { error } = await supabase.from("concert_tickets").insert({
        concert_id: concert?.id,
        email,
        tickets
      });
      if (error) throw error;
      setBookingSuccess(true);
      toast({
        title: "Achat confirmé !",
        description: `Vous avez acheté ${tickets} billet(s) pour ${concert?.name}. Un email de confirmation sera envoyé à ${email}.`
      });
      setEmail("");
      setTickets(1);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Erreur lors de l'enregistrement.",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  if (!concert) return <div className="container mx-auto px-4 py-8">Concert non trouvé</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-6">
            <img src={concert.image} alt={concert.name} className="w-full h-full object-cover" />
          </div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-creole-blue">{concert.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <Music className="h-5 w-5 mr-2" />
              <span>{concert.artist}</span>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{concert.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{concert.date}</span>
              <Clock className="h-5 w-5 ml-4 mr-2" />
              <span>{concert.time}</span>
            </div>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
              <span className="font-medium">{concert.rating}/5</span>
            </div>
            <div className="mt-4 text-gray-700">{concert.description}</div>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Acheter un billet</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700 mb-4">
                  Votre achat a bien été enregistré !
                </div>
              ) : (
                <form onSubmit={handleBuyTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="tickets">Nombre de billets</Label>
                    <Input
                      id="tickets"
                      type="number"
                      min={1}
                      value={tickets}
                      onChange={e => setTickets(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-xl font-bold text-purple-700">
                    Prix total : {concert.price * tickets} €
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Acheter
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

export default ConcertDetail;
