import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Trash2 } from "lucide-react";

const DEFAULT_IMAGE = "https://placehold.co/600x400";

export const LoisirsManagement = () => {
  const [loisirs, setLoisirs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: "",
    currentParticipants: "",
    image: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchLoisirs();
  }, []);

  const fetchLoisirs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("activities").select("*");
    if (!error) setLoisirs(data || []);
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 5 MB)");
      return formData.image || DEFAULT_IMAGE;
    }
    if (!file.type.startsWith('image/')) {
      alert("Le fichier doit être une image");
      return formData.image || DEFAULT_IMAGE;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `loisirs/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (uploadError) {
      alert("Erreur lors du téléchargement de l'image");
      return formData.image || DEFAULT_IMAGE;
    }
    const { data } = await supabase.storage.from('images').getPublicUrl(filePath);
    return data?.publicUrl || DEFAULT_IMAGE;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = formData.image || DEFAULT_IMAGE;
    if (imageFile) {
      finalImageUrl = await uploadImage(imageFile);
    }
    const dataToSend = { ...formData, image: finalImageUrl };
    if (editingId) {
      await supabase.from("activities").update(dataToSend).eq("id", editingId);
    } else {
      await supabase.from("activities").insert([dataToSend]);
    }
    setFormData({
      title: "",
      description: "",
      location: "",
      date: "",
      maxParticipants: "",
      currentParticipants: "",
      image: ""
    });
    setImageFile(null);
    setEditingId(null);
    fetchLoisirs();
  };

  const handleEdit = (loisir: any) => {
    setFormData(loisir);
    setEditingId(loisir.id);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("activities").delete().eq("id", id);
    fetchLoisirs();
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <Input
          placeholder="Titre"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          placeholder="Lieu"
          value={formData.location}
          onChange={e => setFormData({ ...formData, location: e.target.value })}
        />
        <Input
          placeholder="Date"
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
        />
        <Input
          placeholder="Participants max"
          type="number"
          value={formData.maxParticipants}
          onChange={e => setFormData({ ...formData, maxParticipants: e.target.value })}
        />
        <Input
          placeholder="Participants actuels"
          type="number"
          value={formData.currentParticipants}
          onChange={e => setFormData({ ...formData, currentParticipants: e.target.value })}
        />
        <Input
          placeholder="URL de l'image"
          value={formData.image}
          onChange={e => setFormData({ ...formData, image: e.target.value })}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
        />
        <Button type="submit">{editingId ? "Mettre à jour" : "Créer"}</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loisirs.map(loisir => (
          <Card key={loisir.id}>
            <CardHeader>
              <CardTitle>{loisir.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{loisir.description}</p>
              <p><b>Lieu :</b> {loisir.location}</p>
              <p><b>Date :</b> {loisir.date}</p>
              <p><b>Participants :</b> {loisir.currentParticipants}/{loisir.maxParticipants}</p>
              <img src={loisir.image || DEFAULT_IMAGE} alt={loisir.title} className="w-full h-32 object-cover my-2" />
              <div className="flex gap-2 mt-2">
                <Button onClick={() => handleEdit(loisir)} variant="outline" size="sm">
                  <Edit2 className="w-4 h-4" /> Éditer
                </Button>
                <Button onClick={() => handleDelete(loisir.id)} variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4" /> Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 