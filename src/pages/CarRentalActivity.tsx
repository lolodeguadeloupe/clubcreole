import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Tag, Star, Car, Route, Shield, Fuel, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { CarRental } from "@/types/carrentals";
import { ClientReview } from "@/types/client-reviews";

const getIconForType = (type: string) => {
  switch (type) {
    case "Véhicules économiques":
      return Car;
    case "Véhicules de luxe":
      return Shield;
    case "Véhicules électriques":
      return Fuel;
    case "Véhicules tout-terrain":
      return Route;
    default:
      return Car;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const CarRentalActivity = () => {
  const navigate = useNavigate();
  const [selectedCarRental, setSelectedCarRental] = useState<CarRental | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [clientReviews, setClientReviews] = useState<ClientReview[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch car rentals
      const { data: carRentalsData, error: carRentalsError } = await supabase
        .from("carrentals")  
        .select("*");

      if (carRentalsError) {
        console.error("Erreur lors de la récupération des locations de voitures:", carRentalsError);
        return;
      }
  
      if (carRentalsData) {
        setCarRentals(carRentalsData);
      }

      // Fetch client reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("client_reviews")
        .select("*")
        .order('date', { ascending: false });

      if (reviewsError) {
        console.error("Erreur lors de la récupération des avis clients:", reviewsError);
        return;
      }

      if (reviewsData) {
        setClientReviews(reviewsData);
      }
    };

    fetchData();
  }, []); 

  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === clientReviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === 0 ? clientReviews.length - 1 : prevIndex - 1
    );
  };

  if (clientReviews.length === 0) {
    return null; // ou un composant de chargement
  }

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
        <h1 className="text-3xl font-bold text-creole-blue">Location de Voitures</h1>
        <p className="text-gray-600 mt-2">
          Découvrez nos partenaires de location de voitures et profitez d'offres exclusives avec votre abonnement Club Créole
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {carRentals.map((rental) => {
          const Icon = getIconForType(rental.type);
          return (
            <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={rental.image_url} 
                  alt={rental.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 bg-creole-green text-white">
                  <Icon className="w-4 h-4 mr-1" />
                  {rental.type}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{rental.name}</CardTitle>
                  <div className="flex items-center text-yellow-500">
                    <Star className="fill-yellow-500 h-5 w-5" />
                    <span className="ml-1 text-gray-700">{rental.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" /> {rental.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {rental.description}
                </p>
                <div className="flex items-center text-creole-green font-medium">
                  <Tag className="h-4 w-4 mr-2" />
                  <span className="text-sm line-clamp-1">{rental.offer}</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-creole-green hover:bg-creole-green/90"
                      onClick={() => setSelectedCarRental(rental)}
                    >
                      Voir les détails
                    </Button>
                  </DialogTrigger>
                  {selectedCarRental && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{selectedCarRental.name}</DialogTitle>
                        <DialogDescription className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> {selectedCarRental.location}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img 
                          src={selectedCarRental.image_url} 
                          alt={selectedCarRental.name} 
                          className="w-full h-56 object-cover rounded-md"
                        />
                        <p className="text-gray-700">{selectedCarRental.description}</p>
                        <div className="bg-green-50 p-4 rounded-md border border-green-200">
                          <h3 className="font-semibold text-creole-green flex items-center">
                            <Tag className="h-4 w-4 mr-2" />
                            Offre spéciale Club Créole
                          </h3>
                          <p className="mt-1 text-gray-700">{selectedCarRental.offer}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-gray-700 mr-2">Note:</span>
                            <div className="flex items-center text-yellow-500">
                              <Star className="fill-yellow-500 h-5 w-5" />
                              <span className="ml-1 text-gray-700">{selectedCarRental.rating}/5</span>
                            </div>
                          </div>
                          <Button className="bg-creole-green hover:bg-creole-green/90">
                            Réserver maintenant
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Client Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-creole-blue mb-8 text-center">Avis de nos Clients</h2>
        
        <div className="relative bg-gray-50 rounded-lg shadow-md p-6 md:p-10 max-w-4xl mx-auto">
          <div className="absolute top-6 right-6 text-creole-green opacity-30">
            <Quote className="w-16 h-16" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <img 
                src={clientReviews[currentReviewIndex].avatar_url} 
                alt={clientReviews[currentReviewIndex].name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{clientReviews[currentReviewIndex].name}</h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {clientReviews[currentReviewIndex].location}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < clientReviews[currentReviewIndex].rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 italic mb-4">"{clientReviews[currentReviewIndex].comment}"</p>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="bg-creole-green/10 text-creole-green">
                  {clientReviews[currentReviewIndex].rental_company}
                </Badge>
                <p className="text-gray-500 text-sm">{formatDate(clientReviews[currentReviewIndex].date)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-creole-green text-creole-green hover:bg-creole-green/10 hover:text-creole-green"
              onClick={prevReview}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1">
              {clientReviews.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentReviewIndex ? "bg-creole-green scale-125" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentReviewIndex(index)}
                ></div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-creole-green text-creole-green hover:bg-creole-green/10 hover:text-creole-green"
              onClick={nextReview}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-creole-blue mb-2">Comment profiter des avantages?</h2>
        <p className="text-gray-700 mb-4">
          En tant que membre du Club Créole, présentez simplement votre carte de membre ou application mobile
          lors de la réservation de votre véhicule pour bénéficier des offres exclusives.
        </p>
        <Button className="bg-creole-green hover:bg-creole-green/90">
          Devenir membre
        </Button>
      </div>
    </div>
  );
};

export default CarRentalActivity;
