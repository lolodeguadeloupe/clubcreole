#!/bin/bash

# Vérifier si un fichier de sauvegarde a été fourni
if [ -z "$1" ]; then
    echo "Usage: $0 <fichier_backup.sql>"
    exit 1
fi

BACKUP_FILE=$1

# Vérifier si le fichier existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Le fichier $BACKUP_FILE n'existe pas"
    exit 1
fi

echo "Importation des données depuis $BACKUP_FILE..."

# Importer les données
docker exec -i supabase-db psql -U postgres -d postgres < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Importation réussie !"
else
    echo "Erreur lors de l'importation"
    exit 1
fi 