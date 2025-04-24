import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Advantage } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../tables/advantages";

export const AdvantagesManagement = () => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdvantages = async () => {
    try {
      const { data, error } = await supabase
        .from("advantages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdvantages(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des bons plans:", error);
      toast.error("Erreur lors du chargement des bons plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvantages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Bons Plans</h2>
          <p className="text-muted-foreground">
            Gérez les bons plans proposés aux utilisateurs
          </p>
        </div>
        <Button onClick={() => navigate("/admin/advantages/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau bon plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des bons plans</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={advantages} />
        </CardContent>
      </Card>
    </div>
  );
}; 