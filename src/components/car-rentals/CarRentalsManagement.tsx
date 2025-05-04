"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface CarRental {
  id: number;
  name: string;
  type: string;
  image_url: string;
  location: string;
  description: string;
  rating: number;
  offer: string;
  created_at: string;
  updated_at: string;
}

export default function CarRentalsManagement() {
  const [cars, setCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarRental | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("carrentals")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des voitures:", error?.message, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 1. Upload de l'image si sélectionnée
    let imageUrl = editingCar?.image_url || "";
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);

      if (error) {
        alert("Erreur lors de l'upload de l'image : " + error.message);
        return;
      }
      // Récupérer l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const carData = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      image_url: imageUrl,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      rating: formData.get("rating") ? parseFloat(formData.get("rating") as string) : null,
      offer: formData.get("offer") as string,
    };

    try {
      if (editingCar) {
        const { error } = await supabase
          .from("carrentals")
          .update(carData)
          .eq("id", editingCar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("carrentals").insert([carData]);
        if (error) throw error;
      }
      fetchCars();
      setIsDialogOpen(false);
      setEditingCar(null);
    } catch (error) {
      alert("Erreur lors de la sauvegarde : " + (error?.message || JSON.stringify(error)));
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) return;
    try {
      const { error } = await supabase.from("carrentals").delete().eq("id", id);
      if (error) throw error;
      fetchCars();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des locations de voitures</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une voiture
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCar ? "Modifier la voiture" : "Ajouter une voiture"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCar?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  defaultValue={editingCar?.type}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                />
                {editingCar?.image_url && (
                  <img src={editingCar.image_url} alt="Aperçu" className="w-16 h-10 object-cover rounded mt-2" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingCar?.location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingCar?.description}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Note</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={editingCar?.rating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer">Offre</Label>
                <Input
                  id="offer"
                  name="offer"
                  defaultValue={editingCar?.offer}
                />
              </div>
              <Button type="submit">
                {editingCar ? "Modifier" : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Offre</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.name}</TableCell>
              <TableCell>{car.type}</TableCell>
              <TableCell>
                {car.image_url && (
                  <img src={car.image_url} alt={car.name} className="w-16 h-10 object-cover rounded" />
                )}
              </TableCell>
              <TableCell>{car.location}</TableCell>
              <TableCell>{car.description}</TableCell>
              <TableCell>{car.rating}</TableCell>
              <TableCell>{car.offer}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingCar(car);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(car.id.toString())}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 