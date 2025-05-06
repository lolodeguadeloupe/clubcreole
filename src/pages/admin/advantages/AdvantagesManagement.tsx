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
import { LoisirsManagement } from "../LoisirsManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";



export const AdvantagesManagement = () => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [tab, setTab] = useState("bonsplans");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLoisir, setEditingLoisir] = useState(null);

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
      <h1 className="text-3xl font-bold text-creole-green mb-4">Dashboard Administrateur</h1>
      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="bonsplans">Bons Plans</TabsTrigger>
          <TabsTrigger value="loisirs">Loisirs</TabsTrigger>
        </TabsList>
        <TabsContent value="bonsplans">
          <div className="flex justify-between items-center mt-6">
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
          <Card className="mt-6">
        <CardHeader>
          <CardTitle>Liste des bons plans</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={advantages} />
        </CardContent>
      </Card>
        </TabsContent>
        <TabsContent value="loisirs">
          <h2 className="text-2xl font-bold mb-4 mt-6">Gestion des Loisirs</h2>
          <Button onClick={() => { setEditingLoisir(null); setDialogOpen(true); }}>
            Nouveau loisir
          </Button>
          <LoisirsManagement />
          {/* <LoisirDialog
          
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={async (data) => {
              // Ajoute ici la logique d'ajout ou de modification (insert/update Supabase)
              if (editingLoisir) {
                await supabase.from("loisirs").update({
                  nom: data.nom,
                  description: data.description,
                  image: data.image,
                  prix: data.prix,  
                }).eq("id", editingLoisir.id);
              } else {
                await supabase.from("loisirs").insert({
                  nom: data.nom,
                  description: data.description,
                  image: data.image,
                  prix: data.prix, 
                });
              }
              setDialogOpen(false);
              fetchAdvantages();  
            }}
            initialData={editingLoisir}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 