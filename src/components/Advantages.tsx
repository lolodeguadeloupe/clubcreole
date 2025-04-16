import { Gift, Wrench, HeartHandshake, Music, Hotel, Ticket } from "lucide-react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { EventBooking } from "./EventBooking";

const advantages = [
  {
    icon: Gift,
    title: "Des réductions",
    description: "Profitez de réductions exclusives chez nos partenaires",
    badge: null,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1760&auto=format&fit=crop",
    isEvent: false
  },
  {
    icon: Wrench,
    title: "Prêt de matériel",
    description: "Accédez à du matériel de réception et des outils",
    badge: null,
    image: "/lovable-uploads/c7dc7b94-fcb7-46f8-aa26-0740b8bbdad1.png",
    isEvent: false
  },
  {
    icon: HeartHandshake,
    title: "Services gratuits",
    description: "Bénéficiez de services d'assistance gratuits",
    badge: null,
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1760&auto=format&fit=crop",
    isEvent: false
  },
  {
    icon: Music,
    title: "Concert de Francis CABREL",
    description: "Profitez d'une réduction de 20% sur le concert du 15 mars",
    badge: "Coup de cœur",
    image: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1760&auto=format&fit=crop",
    isEvent: true,
    eventDate: "15 mars 2024",
    discount: "20%"
  },
  {
    icon: Music,
    title: "Concert de Richard BIRMAN",
    description: "Profitez d'une réduction de 15% sur le concert du 6 Juillet",
    badge: "Coup de cœur",
    image: "/richardbirman.jpg",
    isEvent: true,
    eventDate: "6 juillet 2024",
    discount: "15%"
  },
  {
    icon: Hotel,
    title: "La Toubana Hôtel 5★",
    description: "2 nuits = 1 dîner gastronomique pour 2 offert",
    badge: "Exclusivité",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1760&auto=format&fit=crop",
    isEvent: false
  },
  {
    icon: Ticket,
    title: "Parc l'Infini",
    description: "2 entrées gratuites au parc d'attractions",
    badge: "Gratuit",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1760&auto=format&fit=crop",
    isEvent: false
  },
];

export const Advantages = () => {
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
            {advantages.map((advantage, index) => (
              <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="h-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  {advantage.image && (
                    <div className="w-full h-32 sm:h-40 overflow-hidden rounded-t-lg relative group">
                      <img 
                        src={advantage.image} 
                        alt={advantage.title} 
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-105"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    {advantage.badge && (
                      <Badge className="self-start bg-creole-blue text-white mb-2 text-xs sm:text-sm">
                        {advantage.badge}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2">
                      <advantage.icon className="h-5 w-5 sm:h-6 sm:w-6 text-creole-green" />
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                        {advantage.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base text-gray-600">
                      {advantage.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    {advantage.isEvent ? (
                      <EventBooking
                        eventName={advantage.title}
                        eventDate={advantage.eventDate}
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
                </Card>
              </CarouselItem>
            ))}
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
