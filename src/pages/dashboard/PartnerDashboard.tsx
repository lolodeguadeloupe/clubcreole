import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Store, Calendar, CreditCard } from "lucide-react";
import { PartnerDashboardStats } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PartnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulons des données pour l'exemple
        const mockData: PartnerDashboardStats = {
          totalActivities: 8,
          totalBookings: 45,
          revenue: 3850,
          upcomingBookings: [
            {
              id: "1",
              activityName: "Plongée aux Saintes",
              date: "2024-06-15",
              clientName: "Jean Dupont",
              status: "confirmed",
              price: 85,
            },
            {
              id: "2",
              activityName: "Plongée Malendure",
              date: "2024-06-20",
              clientName: "Marie Martin",
              status: "pending",
              price: 85,
            },
          ],
          activityStats: [
            {
              activityId: "1",
              activityName: "Plongée aux Saintes",
              totalBookings: 25,
              revenue: 2125,
            },
            {
              activityId: "2",
              activityName: "Plongée Malendure",
              totalBookings: 20,
              revenue: 1700,
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
      <h1 className="text-3xl font-bold mb-8 text-creole-green">Espace Partenaire</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalActivities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Réservations à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{booking.activityName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString('fr-FR')} - {booking.clientName}
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
          <CardHeader>
            <CardTitle>Performance des Activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.activityStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activityName" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8DC63F" />
                  <YAxis yAxisId="right" orientation="right" stroke="#1B75BC" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="totalBookings" fill="#8DC63F" name="Réservations" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#1B75BC" name="Revenus" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          onClick={() => navigate('/partner/activities/new')}
          variant="outline"
        >
          Ajouter une activité
        </Button>
        <Button 
          onClick={() => navigate('/partner/activities')}
          variant="default"
        >
          Gérer mes activités
        </Button>
      </div>
    </div>
  );
};

export default PartnerDashboard; 