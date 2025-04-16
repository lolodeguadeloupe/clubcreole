import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, Heart } from "lucide-react";
import { ClientDashboardStats } from "@/types/user";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  cancelled: "bg-red-500",
  completed: "bg-blue-500",
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ClientDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulons des données pour l'exemple
        const mockData: ClientDashboardStats = {
          upcomingBookings: [
            {
              id: "1",
              activityName: "Plongée aux Saintes",
              date: "2024-06-15",
              status: "confirmed",
              price: 85,
            },
            {
              id: "2",
              activityName: "Randonnée Soufrière",
              date: "2024-06-20",
              status: "pending",
              price: 45,
            },
          ],
          pastBookings: [
            {
              id: "3",
              activityName: "Canoë-kayak Mangrove",
              date: "2024-05-10",
              status: "completed",
              price: 65,
            },
            {
              id: "4",
              activityName: "Jet-ski Tour",
              date: "2024-05-15",
              status: "cancelled",
              price: 120,
            },
          ],
          favoriteActivities: [
            {
              id: "1",
              name: "Plongée aux Saintes",
              category: "Plongée",
            },
            {
              id: "2",
              name: "Randonnée Soufrière",
              category: "Randonnée",
            },
          ],
        };

        setStats(mockData);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-creole-green">Mon Espace Client</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">Réservations à venir</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{booking.activityName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </Badge>
                    <span className="font-medium">
                      {booking.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">Activités Favorites</CardTitle>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.favoriteActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{activity.name}</h3>
                    <p className="text-sm text-muted-foreground">{activity.category}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/activity/${activity.id}`)}
                  >
                    Voir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.pastBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{booking.activityName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={booking.status === 'completed' ? 'default' : 'destructive'}>
                    {booking.status === 'completed' ? 'Terminé' : 'Annulé'}
                  </Badge>
                  <span className="font-medium">
                    {booking.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={() => navigate('/activities')}
          variant="default"
        >
          Découvrir plus d'activités
        </Button>
      </div>
    </div>
  );
};

export default ClientDashboard; 