import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, MapPin, Users, Film, Martini, Map, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";

interface Loisir {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  end_date: string | null;
  max_participants: number;
  current_participants: number;
  image_url: string;
}

const LoisirsActivity = () => {
  const [loisirs, setLoisirs] = useState<Loisir[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoisir, setSelectedLoisir] = useState<Loisir | null>(null);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPreRegistering, setIsPreRegistering] = useState(false);
  const [showPreRegisterDialog, setShowPreRegisterDialog] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !firstName || !email || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Vérification du nombre de participants
    if (!selectedLoisir) {
      toast({
        title: "Erreur",
        description: "Aucune activité sélectionnée.",
        variant: "destructive",
      });
      return;
    }

    // Vérification du nombre de participants
    if (selectedLoisir.current_participants >= selectedLoisir.max_participants) {
      toast({
        title: "Activité complète",
        description: `Désolé, le nombre maximum de participants (${selectedLoisir.max_participants}) a été atteint pour cette activité.`,
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      // Vérification supplémentaire du nombre de participants avant l'inscription
      const { data: activityData, error: checkError } = await supabase
        .from('activities')
        .select('current_participants, max_participants')
        .eq('id', selectedLoisir.id)
        .single();

      if (checkError) throw checkError;

      if (activityData.current_participants >= activityData.max_participants) {
        toast({
          title: "Activité complète",
          description: "Désolé, cette activité vient d'être complétée par quelqu'un d'autre.",
          variant: "destructive",
        });
        return;
      }

      // Insérer l'inscription
      const { error: registrationError } = await supabase.from("registrations").insert({
        activity_id: selectedLoisir.id,
        first_name: firstName,
        last_name: name,
        email,
        phone,
      });

      if (registrationError) throw registrationError;

      // Mettre à jour le nombre de participants
      const { error: updateError } = await supabase
        .from('activities')
        .update({ 
          current_participants: activityData.current_participants + 1 
        })
        .eq('id', selectedLoisir.id)
        .eq('current_participants', activityData.current_participants); // Optimistic locking

      if (updateError) {
        // Si la mise à jour échoue, on supprime l'inscription
        await supabase
          .from('registrations')
          .delete()
          .eq('activity_id', selectedLoisir.id)
          .eq('email', email);
        
        throw new Error("Impossible de mettre à jour le nombre de participants");
      }

      // Mettre à jour l'état local
      setLoisirs(prevLoisirs => 
        prevLoisirs.map(loisir => 
          loisir.id === selectedLoisir.id 
            ? { ...loisir, current_participants: loisir.current_participants + 1 }
            : loisir
        )
      );

      // Envoi de l'email à l'admin
      await sendEmailToAdmin(selectedLoisir, name, firstName, email, phone);

      toast({
        title: "Inscription réussie !",
        description: `Vous êtes inscrit à "${selectedLoisir.title}". Un email de confirmation a été envoyé à ${email}.`,
      });

      setName("");
      setFirstName("");
      setEmail("");
      setPhone("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePreRegister = async () => {
    if (!name || !firstName || !email || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsPreRegistering(true);
    try {
      const { error } = await supabase.from("pre_registrations").insert({
        activity_id: selectedLoisir?.id,
        first_name: firstName,
        last_name: name,
        email,
        phone,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Pré-inscription enregistrée !",
        description: `Nous vous contacterons dès que les inscriptions pour "${selectedLoisir?.title}" seront ouvertes.`,
      });

      setName("");
      setFirstName("");
      setEmail("");
      setPhone("");
      setShowPreRegisterDialog(false);
    } catch (error) {
      console.error("Erreur lors de la pré-inscription :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la pré-inscription.",
        variant: "destructive",
      });
    } finally {
      setIsPreRegistering(false);
    }
  };

  useEffect(() => {
    const fetchLoisirs = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          console.log(data);
          const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
          setLoisirs(sortedData);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les activités de loisirs",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoisirs();
  }, []);

  const getActivityIcon = (title: string | undefined | null) => {
    if (!title) return <CheckCircle2 className="h-4 w-4 text-creole-blue" />;
    if (title.includes("boite")) return <Martini className="h-4 w-4 text-creole-blue" />;
    if (title.includes("cinéma")) return <Film className="h-4 w-4 text-creole-blue" />;
    if (title.includes("Balade") || title.includes("Randonnée")) return <Map className="h-4 w-4 text-creole-blue" />;
    return <CheckCircle2 className="h-4 w-4 text-creole-blue" />;
  };

  const isRegistrationOpen = (loisir: Loisir) => {
    const now = new Date();
    const endDate = loisir.end_date ? new Date(loisir.end_date) : null;
    
    // Si pas de date de fin, l'inscription est toujours ouverte
    if (!endDate) return true;
    
    // Si on est avant la date de fin, l'inscription est ouverte
    return now <= endDate;
  };

  const isRegistrationClosed = (loisir: Loisir) => {
    const now = new Date();
    const endDate = loisir.end_date ? new Date(loisir.end_date) : null;
    
    // Si pas de date de fin, l'inscription n'est jamais fermée
    if (!endDate) return false;
    
    // Si on est après la date de fin, l'inscription est fermée
    return now > endDate;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button 
        onClick={() => navigate("/")} 
        variant="ghost" 
        className="mb-6 group flex items-center gap-1 hover:gap-2 transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center text-creole-blue mb-8">
        Nos Activités de Loisirs
      </h1>
      
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
        Découvrez test notre sélection d'activités de loisirs authentiques aux Antilles.
        Inscrivez-vous et immergez-vous dans la culture créole à travers des expériences uniques.
      </p>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {loisirs.map((loisir) => (
          <Card key={loisir.id} className="overflow-hidden flex flex-col h-full">
            <div className="h-48 overflow-hidden">
              <img 
                src={loisir.image_url} 
                alt={loisir.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {getActivityIcon(loisir.title)}
                <CardTitle>{loisir.title}</CardTitle>
              </div>
              <CardDescription>{loisir.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-creole-blue" />
                  <span className="text-sm">{loisir.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-creole-blue" />
                  <div className="text-sm">
                    <div>Début : {loisir.date}</div>
                    {loisir.end_date && (
                      <div>Fin : {new Date(loisir.end_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-creole-blue" />
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <span className={loisir.current_participants >= loisir.max_participants ? "text-red-500 font-semibold" : "text-green-500"}>
                        {loisir.current_participants}
                      </span>
                      <span>/</span>
                      <span>{loisir.max_participants}</span>
                      <span>participants</span>
                    </div>
                    {loisir.current_participants >= loisir.max_participants ? (
                      <span className="text-xs text-red-500 font-medium">Complet</span>
                    ) : (
                      <span className="text-xs text-green-500">
                        {loisir.max_participants - loisir.current_participants} place{loisir.max_participants - loisir.current_participants > 1 ? 's' : ''} disponible{loisir.max_participants - loisir.current_participants > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={openDialog && selectedLoisir?.id === loisir.id} onOpenChange={(open) => {
                setOpenDialog(open);
                if (open) setSelectedLoisir(loisir);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-creole-green hover:bg-creole-green/90"
                    disabled={loisir.current_participants >= loisir.max_participants}
                  >
                    {loisir.current_participants >= loisir.max_participants 
                      ? 'Complet' 
                      : isRegistrationClosed(loisir)
                        ? 'Inscriptions fermées'
                        : "S'inscrire"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isRegistrationClosed(loisir)
                        ? `Pré-inscription pour la prochaine session de ${loisir.title}`
                        : `Inscription à ${loisir.title}`}
                    </DialogTitle>
                    <DialogDescription>
                      {isRegistrationClosed(loisir)
                        ? "Les inscriptions pour cette session sont terminées. Laissez-nous vos coordonnées pour être notifié(e) dès l'ouverture des inscriptions pour la prochaine session."
                        : "Remplissez le formulaire ci-dessous pour vous inscrire à cette activité."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom *
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={isRegistrationClosed(loisir) ? handlePreRegister : handleRegister}
                      disabled={isRegistering || isPreRegistering}
                    >
                      {(isRegistering || isPreRegistering) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isRegistrationClosed(loisir) ? 'Pré-inscription en cours...' : 'Inscription en cours...'}
                        </>
                      ) : (
                        isRegistrationClosed(loisir) ? "Demander une notification" : "Confirmer l'inscription"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const sendEmailToAdmin = async (
  selectedLoisir: Loisir | null,
  name: string,
  firstName: string,
  email: string,
  phone: string
) => {
  if (!selectedLoisir) {
    console.error("Erreur : aucune activité sélectionnée.");
    return;
  }

  const emailContent = `
    <p>Nouvelle inscription à l'activité "${selectedLoisir.title}" :</p>
    <ul>
      <li><strong>Nom :</strong> ${name}</li>
      <li><strong>Prénom :</strong> ${firstName}</li>
      <li><strong>Email :</strong> ${email}</li>
      <li><strong>Téléphone :</strong> ${phone}</li>
    </ul>
  `;

  const { error } = await supabase.functions.invoke("send-email", {
    body: {
      to: "cmoinster@gmail.com",
      subject: `Nouvelle inscription à "${selectedLoisir.title}"`,
      html: emailContent,
    },
  });

  if (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    toast({
      title: "Erreur",
      description: "Impossible d'envoyer l'email à l'administrateur.",
      variant: "destructive",
    });
  }
};

export default LoisirsActivity;
