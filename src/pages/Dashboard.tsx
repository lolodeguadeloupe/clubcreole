import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import AdminDashboard from "./dashboard/AdminDashboard";
import ClientDashboard from "./dashboard/ClientDashboard";
import PartnerDashboard from "./dashboard/PartnerDashboard";
import type { UserRole } from "@/types/user";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Récupérer le rôle de l'utilisateur depuis la base de données
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          console.error('Erreur lors de la récupération du profil:', error);
          navigate('/login');
          return;
        }

        setUserRole(profile.role as UserRole);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'client':
      return <ClientDashboard />;
    case 'partner':
      return <PartnerDashboard />;
    default:
      navigate('/login');
      return null;
  }
};

export default Dashboard; 