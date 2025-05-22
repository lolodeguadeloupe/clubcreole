
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin, Martini, Music, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface NightEvent {
  id: number;
  name: string;
  type: string;
  venue: string;
  image: string;
  description: string;
  date: string;
  time: string;
  price: number;
  offer: string;
  rating: number;
  features: string[];
}

const NightlifeActivity = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<NightEvent | null>(null);
  const [nightEvents, setNightEvents] = useState<NightEvent[]>([]);

  useEffect(() => {
    const fetchNightEvents = async () => {
      const { data, error } = await supabase
        .from("soirees")
        .select("*");

      if (error) {
        console.error("Erreur lors de la récupération des soirées:", error);
        return;
      }

      if (data) {
        setNightEvents(data);
      }
    };

    fetchNightEvents();
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
        <h1 className="text-3xl font-bold text-[#9b87f5]">Soirées & Vie Nocturne</h1>
        <p className="text-gray-600 mt-2">
          Découvrez les meilleures soirées et établissements nocturnes partenaires du Club Créole
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {nightEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <Badge className="absolute top-3 right-3 bg-[#6E59A5] text-white">
                <Martini className="w-4 h-4 mr-1" />
                {event.type}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{event.name}</CardTitle>
                <div className="flex items-center text-yellow-500">
                  <Star className="fill-yellow-500 h-5 w-5" />
                  <span className="ml-1 text-gray-700">{event.rating}</span>
                </div>
              </div>
              <CardDescription className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" /> {event.venue}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{event.time}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {event.description}
              </p>
              <div className="flex items-center text-[#8B5CF6] font-medium">
                <Martini className="h-4 w-4 mr-2" />
                <span className="text-sm line-clamp-1">{event.offer}</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-[#7E69AB] hover:bg-[#6E59A5]"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Voir les détails
                  </Button>
                </DialogTrigger>
                {selectedEvent && (
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{selectedEvent.name}</DialogTitle>
                      <DialogDescription className="font-medium text-[#8B5CF6]">
                        {selectedEvent.type} | {selectedEvent.venue}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img 
                        src={selectedEvent.image} 
                        alt={selectedEvent.name} 
                        className="w-full h-56 object-cover rounded-md"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-[#8B5CF6]" />
                          <span>{selectedEvent.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#8B5CF6]" />
                          <span>{selectedEvent.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#8B5CF6]" />
                        <span>{selectedEvent.venue}</span>
                      </div>
                      <p className="text-gray-700">{selectedEvent.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedEvent.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="bg-[#D6BCFA] text-[#6E59A5] border-[#8B5CF6]">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                        <h3 className="font-semibold text-[#8B5CF6] flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Offre spéciale Club Créole
                        </h3>
                        <p className="mt-1 text-gray-700">{selectedEvent.offer}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-[#8B5CF6]">
                          {selectedEvent.price}€
                        </div>
                        <Button className="bg-[#7E69AB] hover:bg-[#6E59A5]">
                          Réserver maintenant
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
        <h2 className="text-2xl font-bold text-[#9b87f5] mb-2">Comment profiter des avantages?</h2>
        <p className="text-gray-700 mb-4">
          En tant que membre du Club Créole, présentez simplement votre carte de membre ou application mobile
          lors de votre arrivée dans les établissements partenaires pour bénéficier des offres exclusives sur les soirées et événements.
        </p>
        <Button className="bg-[#7E69AB] hover:bg-[#6E59A5]">
          Devenir membre
        </Button>
      </div>
    </div>
  );
};

export default NightlifeActivity;
