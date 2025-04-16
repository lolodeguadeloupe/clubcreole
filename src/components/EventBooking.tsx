import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

interface EventBookingProps {
  eventName: string;
  eventDate: string;
  discount: string;
  children: React.ReactNode;
}

export const EventBooking = ({ eventName, eventDate, discount, children }: EventBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [tickets, setTickets] = useState(1);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique de réservation
    toast({
      title: "Réservation enregistrée",
      description: `Votre réservation pour ${eventName} a été enregistrée. Un email de confirmation vous sera envoyé.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réservation - {eventName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date de l'événement</Label>
            <div className="text-sm text-gray-500">{eventDate}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tickets">Nombre de tickets</Label>
            <Input
              id="tickets"
              type="number"
              min="1"
              value={tickets}
              onChange={(e) => setTickets(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {discount && (
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-700">
                Réduction applicable : {discount}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full bg-creole-green hover:bg-creole-green/90">
            Réserver
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 