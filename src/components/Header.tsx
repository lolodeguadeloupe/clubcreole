import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Newsletter } from "./Newsletter";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const Header = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profile?.role || null);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navigationItems = [
    { label: 'Activités', sectionId: 'activites' },
    { label: 'Bons Plans', sectionId: 'bons-plans' },
    { label: 'Avis des Membres', sectionId: 'avis' },
    { label: 'Abonnements', sectionId: 'abonnements' },
  ];

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="text-creole-green font-bold text-xl"
                onClick={() => navigate("/")}
              >
                    <img 
                      src="/logo.png"
                          alt="Club Créole Logo" 
                        className="h-24 w-auto"
                />
              </Button>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                className="text-creole-green border-creole-green hover:bg-creole-green/10"
                onClick={() => navigate("/become-partner")}
              >
                Devenir Partenaire
              </Button>
              {!isLoggedIn && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/login")}
                  >
                    Se connecter
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => navigate("/register")}
                  >
                    S'inscrire
                  </Button>
                </>
              )}

              {isLoggedIn && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Mon Espace
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </Button>
                </>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Newsletter</Button>
                </DialogTrigger>
                <DialogContent>
                  <Newsletter onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <div className="flex flex-col space-y-4">
                      <Button
                        variant="outline"
                        className="text-creole-green border-creole-green hover:bg-creole-green/10"
                        onClick={() => {
                          navigate("/become-partner");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Devenir Partenaire
                      </Button>
                      {!isLoggedIn && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigate("/login");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            Se connecter
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => {
                              navigate("/register");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            S'inscrire
                          </Button>
                        </>
                      )}

                      {isLoggedIn && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigate("/dashboard");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            Mon Espace
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            Se déconnecter
                          </Button>
                        </>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Newsletter</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <Newsletter onSuccess={() => setIsDialogOpen(false)} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </header>
      
      {/* Barre de navigation fixe */}
      <nav className="bg-white shadow-sm border-t hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-3">
            {navigationItems.map((item) => (
              <Button
                key={item.sectionId}
                variant="ghost"
                className="text-gray-600 hover:text-creole-green"
                onClick={() => scrollToSection(item.sectionId)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};
