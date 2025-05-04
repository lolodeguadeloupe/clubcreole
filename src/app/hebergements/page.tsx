import HebergementList from '@/components/hebergements/hebergement-list';
import { getHebergements } from '@/utils/supabase/hebergements';

export default async function HebergementsPage() {
  const hebergements = await getHebergements();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Nos hébergements</h1>
      <HebergementList hebergements={hebergements} />
    </div>
  );
} 