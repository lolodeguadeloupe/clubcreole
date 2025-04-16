import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  image_url: string;
  cuisine_type: string;
  price_range: string;
  opening_hours: string;
}

export const PartnerRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section id="restaurants" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-creole-blue mb-4">
          Nos Restaurants Partenaires
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
          Découvrez nos partenaires gastronomiques et profitez de réductions exclusives
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {restaurant.image_url && (
                <div className="w-full h-40 sm:h-48 overflow-hidden">
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-gray-600 line-clamp-2">{restaurant.description}</p>
                  <p>
                    <span className="font-semibold">Type de cuisine:</span> {restaurant.cuisine_type}
                  </p>
                  <p>
                    <span className="font-semibold">Adresse:</span> {restaurant.address}
                  </p>
                  <p>
                    <span className="font-semibold">Téléphone:</span> {restaurant.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Prix:</span> {restaurant.price_range}
                  </p>
                  <p>
                    <span className="font-semibold">Horaires:</span> {restaurant.opening_hours}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    {restaurant.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        asChild
                      >
                        <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                          Visiter le site
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <a href={`mailto:${restaurant.email}`}>
                        Contacter
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 