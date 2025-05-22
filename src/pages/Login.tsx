import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email pour réinitialiser votre mot de passe",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResetting(true);
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      toast({
        title: "Erreur de configuration",
        description: "La configuration de Supabase n'est pas complète. Veuillez configurer les variables d'environnement.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (session) {
        // Vérifier si l'utilisateur est un administrateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log('Profil utilisateur:', profile);

        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });

        // Vérifier s'il y a une redirection spécifique (pour une réservation en attente)
        const pendingBooking = localStorage.getItem('pendingBooking');
        const locationState = window.history.state;
        
        if (locationState?.redirectTo && pendingBooking) {
          // Rediriger vers la page du restaurant avec un flag indiquant que l'utilisateur vient de se connecter
          navigate(locationState.redirectTo, { state: { fromLogin: true } });
        } 
        // Sinon, redirection normale
        else if (profile?.role === 'admin') {
          console.log('Redirection vers le dashboard admin');
          navigate('/admin/advantages');
        } else {
          console.log('Redirection vers la page d\'accueil');
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-creole-green">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte Club Créole
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm text-creole-green"
                onClick={handleResetPassword}
                disabled={isResetting}
              >
                {isResetting ? "Envoi en cours..." : "Mot de passe oublié ?"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/register")}
            >
              Créer un compte
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
