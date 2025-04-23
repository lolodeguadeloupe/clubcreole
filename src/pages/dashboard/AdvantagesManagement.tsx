import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, Edit2, Gift, Music, Hotel, Wrench, HeartHandshake, Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Advantage {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  badge: string | null;
  image_url: string;
  is_event: boolean;
  event_date: string | null;
  discount: string | null;
}

const iconOptions = [
  { value: 'Gift', label: 'Cadeau' },
  { value: 'Music', label: 'Musique' },
  { value: 'Hotel', label: 'Hôtel' },
  { value: 'Wrench', label: 'Service' },
  { value: 'HeartHandshake', label: 'Partenariat' },
  { value: 'Ticket', label: 'Ticket' },
];

export const AdvantagesManagement = () => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdvantage, setEditingAdvantage] = useState<Advantage | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    icon_name: '',
    title: '',
    description: '',
    badge: '',
    image_url: '',
    is_event: false,
    event_date: '',
    discount: ''
  });

  useEffect(() => {
    fetchAdvantages();
  }, []);

  const fetchAdvantages = async () => {
    try {
      const { data, error } = await supabase
        .from('advantages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvantages(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des bons plans:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les bons plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdvantage) {
        const { error } = await supabase
          .from('advantages')
          .update(formData)
          .eq('id', editingAdvantage.id);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Bon plan mis à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('advantages')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Bon plan ajouté avec succès",
        });
      }
      setIsDialogOpen(false);
      setEditingAdvantage(null);
      resetForm();
      fetchAdvantages();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le bon plan",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (advantage: Advantage) => {
    setEditingAdvantage(advantage);
    setFormData({
      icon_name: advantage.icon_name,
      title: advantage.title,
      description: advantage.description,
      badge: advantage.badge || '',
      image_url: advantage.image_url,
      is_event: advantage.is_event,
      event_date: advantage.event_date || '',
      discount: advantage.discount || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advantages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Succès",
        description: "Bon plan supprimé avec succès",
      });
      fetchAdvantages();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bon plan",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      icon_name: '',
      title: '',
      description: '',
      badge: '',
      image_url: '',
      is_event: false,
      event_date: '',
      discount: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-creole-green">Gestion des Bons Plans</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingAdvantage(null);
                resetForm();
              }}
              className="bg-creole-green hover:bg-creole-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Bon Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAdvantage ? "Modifier le bon plan" : "Créer un nouveau bon plan"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Icône</label>
                <Select
                  value={formData.icon_name}
                  onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                >
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre du bon plan"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du bon plan"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Badge</label>
                <Input
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Badge (optionnel)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL de l'image</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="URL de l'image"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_event}
                  onChange={(e) => setFormData({ ...formData, is_event: e.target.checked })}
                  id="is_event"
                />
                <label htmlFor="is_event" className="text-sm font-medium">
                  Est un événement
                </label>
              </div>

              {formData.is_event && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de l'événement</label>
                  <Input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Réduction</label>
                <Input
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="Réduction (ex: 20%)"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-creole-green hover:bg-creole-green/90">
                  {editingAdvantage ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advantages.map((advantage) => (
          <Card key={advantage.id} className="relative">
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleEdit(advantage)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(advantage.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {advantage.icon_name === 'Gift' && <Gift className="h-5 w-5" />}
                {advantage.icon_name === 'Music' && <Music className="h-5 w-5" />}
                {advantage.icon_name === 'Hotel' && <Hotel className="h-5 w-5" />}
                {advantage.icon_name === 'Wrench' && <Wrench className="h-5 w-5" />}
                {advantage.icon_name === 'HeartHandshake' && <HeartHandshake className="h-5 w-5" />}
                {advantage.icon_name === 'Ticket' && <Ticket className="h-5 w-5" />}
                {advantage.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 mb-4">
                <img
                  src={advantage.image_url}
                  alt={advantage.title}
                  className="w-full h-full object-cover rounded-md"
                />
                {advantage.badge && (
                  <Badge className="absolute top-2 right-2">
                    {advantage.badge}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-2">{advantage.description}</p>
              {advantage.is_event && advantage.event_date && (
                <p className="text-sm text-gray-500">
                  Date : {new Date(advantage.event_date).toLocaleDateString()}
                </p>
              )}
              {advantage.discount && (
                <Badge variant="outline" className="mt-2">
                  Réduction : {advantage.discount}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 