import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalUsers: number;
  totalPartners: number;
  totalDeals: number;
  totalBookings: number;
}

export const Overview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPartners: 0,
    totalDeals: 0,
    totalBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le nombre total d'utilisateurs
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        // Récupérer le nombre total de partenaires
        const { count: partnersCount } = await supabase
          .from('partners')
          .select('*', { count: 'exact' });

        // Récupérer le nombre total de bons plans
        const { count: dealsCount } = await supabase
          .from('deals')
          .select('*', { count: 'exact' });

        // Récupérer le nombre total de réservations
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact' });

        setStats({
          totalUsers: usersCount || 0,
          totalPartners: partnersCount || 0,
          totalDeals: dealsCount || 0,
          totalBookings: bookingsCount || 0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Partenaires",
      value: stats.totalPartners,
      icon: Store,
      color: "text-green-600",
    },
    {
      title: "Bons Plans",
      value: stats.totalDeals,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Réservations",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Vue d'ensemble</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 