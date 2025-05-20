import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, Music, Users, Ticket, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface Concert {
  id: number;
  name: string;
  artist: string;
  genre: string;
  image: string;
  location: string;
  description: string;
  date: string;
  time: string;
  price: number;
  offer: string;
  rating: number;
  icon: React.ElementType;
}


const ConcertActivity = () => {
  const navigate = useNavigate();
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [concerts, setConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      const { data, error } = await supabase
        .from("concerts")
        .select("*");
      
      if (error) {
        console.error("Erreur lors de la récupération des concerts:", error);
        return;
      }
      
      if (data) {
        // Ajouter l'icône Music à chaque concert
        const concertsWithIcon = data.map(concert => ({
          ...concert,
          icon: Music
        }));
        setConcerts(concertsWithIcon);
      }
    };

    fetchConcerts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="mb-4"
      >
        <ArrowLeft className="h-6 w-6" />
        <span>Retour</span>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-creole-blue">Concerts & Événements Musicaux</h1>
        <p className="text-gray-600 mt-2">
          Découvrez les concerts partenaires du Club Créole et profitez d'offres exclusives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {concerts.map((concert) => (
          <Card key={concert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={concert.image} 
                alt={concert.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <Badge className="absolute top-3 right-3 bg-purple-600 text-white">
                <concert.icon className="w-4 h-4 mr-1" />
                {concert.genre}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{concert.name}</CardTitle>
                <div className="flex items-center text-yellow-500">
                  <Star className="fill-yellow-500 h-5 w-5" />
                  <span className="ml-1 text-gray-700">{concert.rating}</span>
                </div>
              </div>
              <CardDescription className="font-medium text-purple-700">{concert.artist}</CardDescription>
              <CardDescription className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" /> {concert.location}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{concert.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{concert.time}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {concert.description}
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <Ticket className="h-4 w-4 mr-2" />
                <span className="text-sm line-clamp-1">{concert.offer}</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setSelectedConcert(concert)}
                  >
                    Voir les détails
                  </Button>
                </DialogTrigger>
                {selectedConcert && (
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{selectedConcert.name}</DialogTitle>
                      <DialogDescription className="font-medium text-purple-700">
                        {selectedConcert.artist}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img 
                        src={selectedConcert.image} 
                        alt={selectedConcert.name} 
                        className="w-full h-56 object-cover rounded-md"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span>{selectedConcert.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span>{selectedConcert.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span>{selectedConcert.location}</span>
                      </div>
                      <p className="text-gray-700">{selectedConcert.description}</p>
                      <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                        <h3 className="font-semibold text-purple-700 flex items-center">
                          <Ticket className="h-4 w-4 mr-2" />
                          Offre spéciale Club Créole
                        </h3>
                        <p className="mt-1 text-gray-700">{selectedConcert.offer}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-purple-700">
                          {selectedConcert.price}€
                        </div>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => navigate(`/concerts/${selectedConcert.id}`)}
                        >
                          Réserver des places
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-creole-blue mb-2">Comment profiter des avantages?</h2>
        <p className="text-gray-700 mb-4">
          En tant que membre du Club Créole, présentez simplement votre carte de membre ou application mobile
          lors de l'achat de vos billets pour bénéficier des offres exclusives sur les concerts et événements partenaires.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Devenir membre
        </Button>
      </div>
    </div>
  );
};

export default ConcertActivity;
