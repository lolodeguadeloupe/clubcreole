import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, Users, Store, Calendar, CreditCard } from "lucide-react";
import { AdminDashboardStats } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvantagesManagement } from "./AdvantagesManagement";
import { LoisirsManagement } from "../admin/LoisirsManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      fetchStats();
    };

    checkAdminAccess();
  }, [navigate]);

    const fetchStats = async () => {
      try {
        // Simulons des données pour l'exemple
        const mockData: AdminDashboardStats = {
          totalUsers: 250,
          totalPartners: 15,
          totalClients: 235,
          totalActivities: 45,
          totalBookings: 387,
          revenue: 15750,
          recentActivities: [
            { date: '2024-01', count: 20, revenue: 2500 },
            { date: '2024-02', count: 35, revenue: 3750 },
            { date: '2024-03', count: 45, revenue: 4200 },
            { date: '2024-04', count: 30, revenue: 2800 },
            { date: '2024-05', count: 50, revenue: 4500 },
          ]
        };

        setStats(mockData);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-creole-green">Dashboard Administrateur</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="advantages">Bons Plans</TabsTrigger>
          <TabsTrigger value="loisirs">Loisirs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partenaires</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPartners}</div>
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

          <Card className="mb-8">
          <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.recentActivities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Nombre" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenus" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="advantages">
          <AdvantagesManagement />
        </TabsContent>

        <TabsContent value="loisirs">
          <LoisirsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 