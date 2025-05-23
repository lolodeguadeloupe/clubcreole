import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

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

interface EventBookingProps {
  eventName: string;
  eventDate: string | null;
  discount: string | null;
  children: React.ReactNode;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gift,
  Wrench,
  HeartHandshake,
  Music,
  Hotel,
  Ticket,
};

export const Advantages: React.FC = () => {
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

        if (error) {
          console.error("Erreur Supabase:", error);
          if (error.code === 'PGRST301') {
            throw new Error("Erreur d'authentification avec Supabase");
          } else if (error.code === 'PGRST116') {
            throw new Error("Erreur de permission pour accéder aux avantages");
          } else {
            throw error;
          }
        }

        if (!data || data.length === 0) {
          console.log("Aucun avantage trouvé");
          setAdvantages([]);
          return;
        }

        setAdvantages(data);
      } catch (err) {
        console.error("Erreur détaillée:", err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des avantages';
        setError(errorMessage);
        toast.error(errorMessage);
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
                          className={cn("absolute top-2 right-2")}
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
                            <Badge variant="secondary">
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
