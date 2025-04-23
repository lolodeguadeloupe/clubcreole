import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Gift,
  Users,
  Store,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Vue d'ensemble",
    icon: LayoutDashboard,
    href: "/dashboard"
  },
  {
    title: "Bons Plans",
    icon: Gift,
    href: "/dashboard/advantages"
  },
  {
    title: "Utilisateurs",
    icon: Users,
    href: "/dashboard/users"
  },
  {
    title: "Partenaires",
    icon: Store,
    href: "/dashboard/partners"
  },
  {
    title: "Réservations",
    icon: Calendar,
    href: "/dashboard/bookings"
  },
  {
    title: "Paramètres",
    icon: Settings,
    href: "/dashboard/settings"
  }
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const checkAuth = async () => {
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
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header avec bouton de déconnexion */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          <h1 className="text-xl font-bold text-creole-green hidden lg:block">
            Dashboard Admin
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Menu latéral */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-creole-green mb-6 hidden lg:block">
              Dashboard Admin
            </h2>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-6 text-sm font-medium transition-colors",
                    currentPath === item.href 
                      ? "bg-creole-green/10 text-creole-green" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => {
                    navigate(item.href);
                    setCurrentPath(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Button>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-6 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out pt-16",
          "lg:ml-64"
        )}
      >
        <Outlet />
      </main>

      {/* Overlay pour fermer le menu mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}; 