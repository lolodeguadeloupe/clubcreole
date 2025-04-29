import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  try {
    // 1. Créer un compte utilisateur
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'administrateur@clubcreole.com',
      password: 'Admin123!',
    });

    if (signUpError) throw signUpError;

    if (!authData.user) {
      throw new Error('Aucun utilisateur créé');
    }

    console.log('Compte utilisateur créé avec succès');

    // 2. Mettre à jour le profil avec le rôle admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', authData.user.id);

    if (updateError) throw updateError;

    console.log('Rôle administrateur attribué avec succès');
    console.log('Email: administrateur@clubcreole.com');
    console.log('Mot de passe: Admin123!');

  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
  }
}

createAdmin(); 