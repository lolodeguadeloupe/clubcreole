import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const DEFAULT_IMAGE = "https://placehold.co/600x400";

const loisirSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().min(1, "La description est obligatoire"),
  location: z.string().min(1, "Le lieu est obligatoire"),
  date: z.string().optional(),
  maxParticipants: z.number().optional(),
  currentParticipants: z.number().optional(),
  image_url: z.string().optional()
});

type LoisirFormData = z.infer<typeof loisirSchema>;

export const LoisirsManagement = () => {
  const [loisirs, setLoisirs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<LoisirFormData>({
    resolver: zodResolver(loisirSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: "",
      maxParticipants: 0,
      currentParticipants: 0,
      image_url: ""
    }
  });

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
          return form.getValues().image_url || DEFAULT_IMAGE;
    }
    if (!file.type.startsWith('image/')) {
      alert("Le fichier doit être une image");
      return form.getValues().image_url || DEFAULT_IMAGE;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `loisirs/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (uploadError) {
      alert("Erreur lors du téléchargement de l'image");
      console.error("Erreur lors du téléchargement de l'image:", uploadError);  
      return form.getValues().image_url || DEFAULT_IMAGE;
    }
    const { data } = await supabase.storage.from('images').getPublicUrl(filePath);
    return data?.publicUrl || DEFAULT_IMAGE;
  };

  const handleSubmit = async (data: LoisirFormData) => {
    try {
      let finalImageUrl = data.image_url || DEFAULT_IMAGE;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const dataToSend = {
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date,
        max_participants: data.maxParticipants || 0,
        current_participants: data.currentParticipants || 0,
        image_url: finalImageUrl
      };

      if (editingId) {
        const { error } = await supabase
          .from("activities")
          .update(dataToSend)
          .eq("id", editingId);
        
        if (error) {
          console.error("Erreur lors de la mise à jour:", error);
          alert("Erreur lors de la mise à jour de l'activité");
          return;
        }
      } else {
        const { error } = await supabase
          .from("activities")
          .insert([dataToSend]);
        
        if (error) {
          console.error("Erreur lors de la création:", error);
          alert("Erreur lors de la création de l'activité");
          return;
        }
      }

      form.reset();
      setImageFile(null);
      setEditingId(null);
      fetchLoisirs();
    } catch (error) {
      console.error("Erreur inattendue:", error);
      alert("Une erreur est survenue");
    }
  };

  const handleEdit = (loisir: any) => {
    form.reset({
      title: loisir.title || "",
      description: loisir.description || "",
      location: loisir.location || "",
      date: loisir.date || "",
      maxParticipants: loisir.max_participants || 0,
      currentParticipants: loisir.current_participants || 0,
      image_url: loisir.image_url || ""
    });
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-6 space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="Date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participants max</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Participants max"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participants actuels</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Participants actuels"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image</FormLabel>
                <FormControl>
                  <Input placeholder="URL de l'image" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />
          <Button type="submit">{editingId ? "Mettre à jour" : "Créer"}</Button>
        </form>
      </Form>
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
              <img src={loisir.image_url || DEFAULT_IMAGE} alt={loisir.title} className="w-full h-32 object-cover my-2" />
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