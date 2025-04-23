import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Reservation } from "@/types/reservation";

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "user_email",
    header: "Email utilisateur",
  },
  {
    accessorKey: "activity_name",
    header: "Activité",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    accessorKey: "time",
    header: "Heure",
  },
  {
    accessorKey: "participants",
    header: "Participants",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "confirmed"
              ? "success"
              : status === "pending"
              ? "warning"
              : "destructive"
          }
        >
          {status === "confirmed"
            ? "Confirmée"
            : status === "pending"
            ? "En attente"
            : "Annulée"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date de réservation",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const reservation = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.location.href = `/admin/reservations/${reservation.id}/edit`}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
                  // TODO: Implémenter la suppression
                }
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 