"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Restaurant {
  id: number;
  name: string;
  type: string;
  image: string;
  location: string;
  description: string;
  rating: number;
  offer: string;
  icon: string;
}

interface RestaurantDashboardProps {
  restaurants: Restaurant[];
}

export function RestaurantDashboard({ restaurants }: RestaurantDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleUpdateOffer = async (restaurantId: number, newOffer: string) => {
    const { error } = await supabase
      .from("restaurants")
      .update({ offer: newOffer })
      .eq("id", restaurantId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'offre",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "L'offre a été mise à jour",
      });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="offers">Gestion des offres</TabsTrigger>
        <TabsTrigger value="analytics">Statistiques</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{restaurant.name}</span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="fill-yellow-500 h-5 w-5" />
                    <span className="ml-1 text-gray-700">{restaurant.rating}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center text-creole-green">
                    <Tag className="h-4 w-4 mr-2" />
                    {restaurant.offer}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="offers" className="space-y-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Offre actuelle</label>
                  <p className="text-gray-600 mt-1">{restaurant.offer}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newOffer = prompt("Nouvelle offre :", restaurant.offer);
                      if (newOffer) {
                        handleUpdateOffer(restaurant.id, newOffer);
                      }
                    }}
                  >
                    Modifier l'offre
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Les statistiques détaillées seront disponibles prochainement.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 