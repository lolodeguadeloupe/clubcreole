import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Tag, Star, Coffee, Pizza, Salad, Wine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface Restaurant {
  id: number;
  name: string;
  type: string;
  image: string;
  location: string;
  description: string;
  rating: number;
  offer: string;
  icon: React.ElementType;  // Make sure this is defined as React.ElementType
}

const RestaurantActivity = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des restaurants :", error.message);
      } else {
        // Map the icon string to the actual React component
        const restaurantsWithIcons = (data || []).map(restaurant => {
          let iconComponent;
          switch (restaurant.icon) {
            case 'Pizza':
              iconComponent = Pizza;
              break;
            case 'Coffee':
              iconComponent = Coffee;
              break;
            case 'Salad':
              iconComponent = Salad;
              break;
            case 'Wine':
              iconComponent = Wine;
              break;
            default:
              iconComponent = Coffee; // Default icon
          }
          return { ...restaurant, icon: iconComponent };
        });
        
        setRestaurants(restaurantsWithIcons);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  console.log("restaurants", restaurants, "loading", loading);

  if (!loading && restaurants.length === 0) {
    return <div>Aucun restaurant trouvé.</div>;
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
        <span className="text-creole-green">Retour</span>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-creole-blue">Nos Restaurants Partenaires</h1>
        <p className="text-gray-600 mt-2">
          Découvrez les restaurants partenaires du Club Créole et profitez d'offres exclusives de réduction
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <Badge className="absolute top-3 right-3 bg-creole-green text-white">
                <restaurant.icon className="w-4 h-4 mr-1" />
                {restaurant.type}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                <div className="flex items-center text-yellow-500">
                  <Star className="fill-yellow-500 h-5 w-5" />
                  <span className="ml-1 text-gray-700">{restaurant.rating}</span>
                </div>
              </div>
              <CardDescription className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" /> {restaurant.location}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {restaurant.description}
              </p>
              <div className="flex items-center text-creole-green font-medium">
                <Tag className="h-4 w-4 mr-2" />
                <span className="text-sm line-clamp-1">{restaurant.offer}</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full bg-creole-green hover:bg-creole-green/90"
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              >
                Voir les détails
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-creole-blue mb-2">Comment profiter des avantages?</h2>
        <p className="text-gray-700 mb-4">
          En tant que membre du Club Créole, présentez simplement votre carte de membre ou application mobile
          au moment de régler l'addition pour bénéficier des offres exclusives.
        </p>
        <Button className="bg-creole-green hover:bg-creole-green/90">
          Devenir membre
        </Button>
      </div>
    </div>
  );
};

export default RestaurantActivity;
