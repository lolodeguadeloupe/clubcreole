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
import type { Activity } from "@/types/user";

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <Badge variant="secondary">{category}</Badge>;
    },
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return `${price}€`;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "active"
              ? "success"
              : status === "pending"
              ? "warning"
              : "destructive"
          }
        >
          {status === "active"
            ? "Actif"
            : status === "pending"
            ? "En attente"
            : "Inactif"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date d'ajout",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const activity = row.original;

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
              onClick={() => window.location.href = `/admin/activities/${activity.id}/edit`}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
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