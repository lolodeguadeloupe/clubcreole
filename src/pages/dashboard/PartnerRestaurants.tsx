import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Partner {
  id: string;
  commercial_name: string;
  city: string;
  address: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const PartnerRestaurants = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (partner: Partner) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_verified: !partner.is_verified })
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Le partenaire a été ${partner.is_verified ? 'désactivé' : 'vérifié'}`,
      });

      fetchPartners();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du partenaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du partenaire",
        variant: "destructive",
      });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Partenaires</h2>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom Commercial</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.commercial_name}</TableCell>
                <TableCell>{partner.city}</TableCell>
                <TableCell>{partner.address}</TableCell>
                <TableCell>{partner.phone}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      partner.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {partner.is_verified ? "Vérifié" : "En attente"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant={partner.is_verified ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleVerification(partner)}
                  >
                    {partner.is_verified ? "Désactiver" : "Vérifier"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 