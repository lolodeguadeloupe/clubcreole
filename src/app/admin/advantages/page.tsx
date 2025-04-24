"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Advantage } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdvantagesPage() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [newAdvantage, setNewAdvantage] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  const fetchAdvantages = async () => {
    const { data, error } = await supabase.from("advantages").select("*");
    if (error) {
      toast.error("Erreur lors du chargement des avantages");
      return;
    }
    setAdvantages(data);
  };

  useEffect(() => {
    fetchAdvantages();
  }, []);

  const handleCreate = async () => {
    const { error } = await supabase.from("advantages").insert([newAdvantage]);
    if (error) {
      toast.error("Erreur lors de la création de l'avantage");
      return;
    }
    toast.success("Avantage créé avec succès");
    setNewAdvantage({ title: "", description: "", image_url: "" });
    fetchAdvantages();
  };

  const handleUpdate = async (id: string, updates: Partial<Advantage>) => {
    const { error } = await supabase
      .from("advantages")
      .update(updates)
      .eq("id", id);
    if (error) {
      toast.error("Erreur lors de la mise à jour de l'avantage");
      return;
    }
    toast.success("Avantage mis à jour avec succès");
    fetchAdvantages();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("advantages").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression de l'avantage");
      return;
    }
    toast.success("Avantage supprimé avec succès");
    fetchAdvantages();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Avantages</h1>

      {/* Formulaire de création */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Nouvel Avantage</h2>
        <div className="space-y-4">
          <Input
            placeholder="Titre"
            value={newAdvantage.title}
            onChange={(e) =>
              setNewAdvantage({ ...newAdvantage, title: e.target.value })
            }
          />
          <Textarea
            placeholder="Description"
            value={newAdvantage.description}
            onChange={(e) =>
              setNewAdvantage({ ...newAdvantage, description: e.target.value })
            }
          />
          <Input
            placeholder="URL de l'image"
            value={newAdvantage.image_url}
            onChange={(e) =>
              setNewAdvantage({ ...newAdvantage, image_url: e.target.value })
            }
          />
          <Button onClick={handleCreate}>Créer</Button>
        </div>
      </div>

      {/* Liste des avantages */}
      <div className="space-y-4">
        {advantages.map((advantage) => (
          <div
            key={advantage.id}
            className="bg-white p-4 rounded-lg shadow flex flex-col gap-4"
          >
            <Input
              value={advantage.title}
              onChange={(e) =>
                handleUpdate(advantage.id, { title: e.target.value })
              }
            />
            <Textarea
              value={advantage.description}
              onChange={(e) =>
                handleUpdate(advantage.id, { description: e.target.value })
              }
            />
            <Input
              value={advantage.image_url}
              onChange={(e) =>
                handleUpdate(advantage.id, { image_url: e.target.value })
              }
            />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => handleDelete(advantage.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 