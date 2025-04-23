import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Loader2, Users, Store, Activity, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { columns as partnerColumns } from "./tables/partners";
import { columns as activityColumns } from "./tables/activities";
import { columns as userColumns } from "./tables/users";
import type { AdminDashboardStats, Partner, Activity, User } from "@/types/user";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalPartners: 0,
    totalClients: 0,
    totalRestaurants: 0,
    totalActivities: 0,
    totalBookings: 0,
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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

      fetchDashboardData();
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques
      const { data: statsData } = await supabase.rpc('get_admin_stats');
      setStats(statsData);

      // Récupérer les partenaires
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      setPartners(partnersData || []);

      // Récupérer les activités
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      setActivities(activitiesData || []);

      // Récupérer les utilisateurs
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setUsers(usersData || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button onClick={() => navigate('/')}>Retour au site</Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients} clients, {stats.totalPartners} partenaires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">Partenaires actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">Activités disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de gestion */}
      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gestion des partenaires</h2>
            <Button onClick={() => navigate('/admin/partners/new')}>
              Ajouter un partenaire
            </Button>
          </div>
          <DataTable columns={partnerColumns} data={partners} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gestion des activités</h2>
            <Button onClick={() => navigate('/admin/activities/new')}>
              Ajouter une activité
            </Button>
          </div>
          <DataTable columns={activityColumns} data={activities} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gestion des utilisateurs</h2>
            <Button onClick={() => navigate('/admin/users/new')}>
              Ajouter un utilisateur
            </Button>
          </div>
          <DataTable columns={userColumns} data={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 