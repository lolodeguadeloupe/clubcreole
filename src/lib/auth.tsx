// src/lib/auth.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Récupérer les informations du profil utilisateur
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Combiner les données d'authentification et de profil
          const userData = {
            ...session.user,
            ...profileData
          };
          
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Récupérer les informations du profil utilisateur
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        // Combiner les données d'authentification et de profil
        const userData = {
          ...session.user,
          ...profileData
        };
        
        setUser(userData);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}