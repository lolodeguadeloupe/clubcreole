import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Gift,
  Wrench,
  HeartHandshake,
  Music,
  Hotel,
  Ticket,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EventBooking } from "./EventBooking";
import { toast } from "sonner";

interface Advantage {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  badge: string | null;
  image_url: string;
  is_event: boolean;
  event_date: string | null;
  discount: string | null;
}

const iconMap: Record<string, any> = {
  Gift,
  Wrench,
  HeartHandshake,
  Music,
  Hotel,
  Ticket,
};

export const Advantages = () => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        
        const { data, error } = await supabase
          .from('advantages')
          .select('*')
          .order('created_at', { ascending: false });

         console.log("Requête Supabase:", {
          table: 'advantages',
          operation: 'select',
          orderBy: 'created_at'
        });

        if (error) {
          console.log("Erreur lors de la requête Supabase:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        }

        if (!data) {
          console.log("Aucune donnée reçue");
        } else {
          console.log("Données reçues:", {
            count: data.length,
            firstItem: data[0],
            lastItem: data[data.length - 1]
          });
        }
        
        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }
        setAdvantages(data || []);
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError('Erreur lors du chargement des avantages');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvantages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-500 mb-2">{error}</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="text-creole-green border-creole-green hover:bg-creole-green hover:text-white"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (advantages.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Aucun avantage disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <section id="bons-plans" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-creole-blue mb-4">
          Les bons plans !
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">Les coups de cœur du mois</p>
        
        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {advantages.map((advantage, index) => {
              const Icon = iconMap[advantage.icon_name];
              return (
                <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={advantage.image_url}
                        alt={advantage.title}
                        className="w-full h-full object-cover"
                      />
                      {advantage.badge && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2"
                        >
                          {advantage.badge}
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5" />}
                        <CardTitle>{advantage.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{advantage.description}</p>
                      {advantage.is_event && advantage.event_date && (
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Date : {advantage.event_date}</span>
                          {advantage.discount && (
                            <Badge variant="outline">
                              Réduction : {advantage.discount}
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardFooter>
                        {advantage.is_event ? (
                          <EventBooking
                            eventName={advantage.title}
                            eventDate={advantage.event_date}
                            discount={advantage.discount}
                          >
                            <Button 
                              variant="outline" 
                              className="text-creole-green border-creole-green hover:bg-creole-green hover:text-white w-full mt-2 text-sm sm:text-base"
                            >
                              Réserver
                            </Button>
                          </EventBooking>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="text-creole-green border-creole-green hover:bg-creole-green hover:text-white w-full mt-2 text-sm sm:text-base"
                          >
                            En savoir plus
                          </Button>
                        )}
                      </CardFooter>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex justify-center mt-4 sm:mt-8 gap-2">
            <CarouselPrevious className="relative static" />
            <CarouselNext className="relative static" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
