import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AdvantageFormData {
  title: string;
  description: string;
  icon_name: string;
  badge?: string;
  image_url: string;
  is_event: boolean;
  event_date?: string;
  discount?: string;
}


// Options d'icônes disponibles
const iconOptions = [
  { value: 'Gift', label: 'Cadeau' },
  { value: 'Music', label: 'Musique' },
  { value: 'Hotel', label: 'Hôtel' },
  { value: 'Wrench', label: 'Service' },
  { value: 'HeartHandshake', label: 'Partenariat' },
  { value: 'Ticket', label: 'Ticket' },
];

export const AdvantageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdvantageFormData>({
    title: "",
    description: "",
    icon_name: "Gift", // Valeur par défaut pour l'icône
    image_url: "https://placehold.co/600x400", // URL d'image par défaut
    is_event: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Veuillez vous connecter");
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        toast.error("Accès non autorisé");
        navigate("/");
        return;
      }

      if (id) {
        await fetchAdvantage();
      }
    };

    checkAuth();
  }, [navigate, id]);

  const fetchAdvantage = async () => {
    try {
      const { data, error } = await supabase
        .from('advantages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'avantage");
      navigate("/admin/advantages");
    }
  };

  // Fonction corrigée pour l'upload d'image
  const uploadImage = async (file: File): Promise<string> => {
    try {
      toast.info("Téléchargement de l'image en cours...");
      
      // Vérifier la taille du fichier (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (max 5 MB)");
        return formData.image_url;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        return formData.image_url;
      }

      // Générer un nom de fichier unique avec le timestamp et l'extension
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `advantages/${fileName}`;


      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Erreur d'upload Supabase:", uploadError);
        toast.error("Erreur lors du téléchargement de l'image");
        return formData.image_url;
      }

      // Construire l'URL publique
      const { data } = await supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (!data || !data.publicUrl) {
        toast.error("Erreur lors de la récupération de l'URL de l'image");
        return formData.image_url;
      }

      console.log("Image téléchargée avec succès, URL:", data.publicUrl);
      toast.success("Image téléchargée avec succès");

      console.log("URL de l'image:", data.publicUrl);

      return data.publicUrl;

    } catch (error) {
      console.error("Erreur complète lors de l'upload:", error);
      toast.error("Une erreur est survenue lors du téléchargement de l'image");
      return formData.image_url;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Le titre est obligatoire";
    }

    if (!formData.description.trim()) {
      errors.description = "La description est obligatoire";
    }

    if (!formData.icon_name) {
      errors.icon_name = "L'icône est obligatoire";
    }

    if (!formData.image_url && !imageFile) {
      errors.image_url = "Une image est obligatoire";
    }

    if (formData.is_event && !formData.event_date) {
      errors.event_date = "La date est obligatoire pour un événement";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation du formulaire
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      // Vérifier la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée");

      // Vérifier les permissions admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        throw new Error("Accès non autorisé");
      }

      // Gérer l'upload de l'image si nécessaire
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      // Préparer les données à envoyer
      const advantageData = {
        ...formData,
        image_url: finalImageUrl,
      };

      // Créer ou mettre à jour l'avantage
      if (id) {
        const { error } = await supabase
          .from('advantages')
          .update(advantageData)
          .eq('id', id);

        if (error) throw error;
        toast.success("Avantage mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from('advantages')
          .insert([advantageData]);

        if (error) throw error;
        toast.success("Avantage créé avec succès");
      }

      // Redirection vers la liste des avantages
      navigate("/admin/advantages");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center">
        {id ? "Modifier l'avantage" : "Créer un nouvel avantage"}
      </h1>

      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={formErrors.title ? "border-red-500" : ""}
        />
        {formErrors.title && (
          <p className="text-sm text-red-500">{formErrors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={formErrors.description ? "border-red-500" : ""}
        />
        {formErrors.description && (
          <p className="text-sm text-red-500">{formErrors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon_name" className="font-medium">
          Icône <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.icon_name}
          onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
        >
          <SelectTrigger id="icon_name" className={formErrors.icon_name ? "border-red-500" : ""}>
            <SelectValue placeholder="Choisir une icône" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((icon) => (
              <SelectItem key={icon.value} value={icon.value}>
                {icon.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.icon_name && (
          <p className="text-sm text-red-500">{formErrors.icon_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="badge" className="font-medium">
          Badge (optionnel)
        </Label>
        <Input
          id="badge"
          value={formData.badge || ""}
          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          placeholder="Ex: Offre limitée, VIP, Premium..."
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image_file" className="font-medium">
            Image <span className="text-red-500">*</span>
          </Label>
          <Input
            id="image_file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="text-xs text-gray-500">
            Formats acceptés: JPG, PNG, GIF, WebP (max 5 MB)
          </p>
        </div>

        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Aperçu:</p>
            <img 
              src={imagePreview} 
              alt="Aperçu" 
              className="w-full max-h-48 object-cover rounded-md"
            />
          </div>
        )}

        {!imagePreview && formData.image_url && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Image actuelle:</p>
            <img 
              src={formData.image_url} 
              alt="Image actuelle" 
              className="w-full max-h-48 object-cover rounded-md"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="image_url" className="font-medium">
            URL de l'image (si pas de téléchargement)
          </Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className={formErrors.image_url ? "border-red-500" : ""}
          />
          {formErrors.image_url && (
            <p className="text-sm text-red-500">{formErrors.image_url}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_event"
          checked={formData.is_event}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_event: checked === true })
          }
        />
        <Label htmlFor="is_event" className="font-medium">
          C'est un événement
        </Label>
      </div>

      {formData.is_event && (
        <div className="space-y-2">
          <Label htmlFor="event_date" className="font-medium">
            Date de l'événement <span className="text-red-500">*</span>
          </Label>
          <Input
            id="event_date"
            type="datetime-local"
            value={formData.event_date || ""}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            className={formErrors.event_date ? "border-red-500" : ""}
          />
          {formErrors.event_date && (
            <p className="text-sm text-red-500">{formErrors.event_date}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="discount" className="font-medium">
          Réduction (optionnel)
        </Label>
        <Input
          id="discount"
          value={formData.discount || ""}
          onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          placeholder="Ex: 20%, 15€..."
        />
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {id ? "Mettre à jour l'avantage" : "Créer un nouvel avantage"}
        </Button>
      </div>
    </form>
  );
};