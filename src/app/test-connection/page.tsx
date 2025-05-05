import { supabase } from '@/lib/supabase';

export default async function TestConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) throw error;
    
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Test de connexion Supabase</h1>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">✅ Connexion réussie !</p>
          <pre className="mt-2 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Test de connexion Supabase</h1>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">❌ Erreur de connexion</p>
          <pre className="mt-2 text-sm">
            {error instanceof Error ? error.message : 'Erreur inconnue'}
          </pre>
        </div>
      </div>
    );
  }
} 