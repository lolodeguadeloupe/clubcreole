/**
 * Script pour copier une image spécifique dans le dossier public
 * 
 * Utilisation: node copy-image.js <nom-du-fichier>
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Configuration des dossiers
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  console.log(`Dossier créé: ${PUBLIC_DIR}`);
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`Dossier créé: ${IMAGES_DIR}`);
}

// Initialiser le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Télécharge un fichier depuis Supabase et le sauvegarde localement
 */
async function downloadFile(bucket, filePath) {
  try {
    console.log(`Téléchargement de ${bucket}/${filePath}`);
    
    // Télécharger le fichier depuis Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);
    
    if (error) {
      console.error(`Erreur lors du téléchargement: ${error.message}`);
      return null;
    }
    
    if (!data) {
      console.error('Aucune donnée reçue');
      return null;
    }
    
    // Déterminer le chemin de destination
    const destination = path.join(IMAGES_DIR, path.basename(filePath));
    
    // Convertir le blob en buffer
    const buffer = await data.arrayBuffer();
    
    // Sauvegarder le fichier
    fs.writeFileSync(destination, Buffer.from(buffer));
    console.log(`Image sauvegardée: ${destination}`);
    
    return destination;
  } catch (error) {
    console.error(`Erreur lors du traitement de l'image: ${error.message}`);
    return null;
  }
}

/**
 * Point d'entrée principal
 */
async function main() {
  try {
    // Récupérer le nom du fichier depuis les arguments
    const fileName = process.argv[2];
    
    if (!fileName) {
      console.log('Aucun nom de fichier fourni. Utilisation: node copy-image.js <nom-du-fichier>');
      return;
    }
    
    console.log(`Copie de l'image: ${fileName}`);
    
    // Télécharger le fichier
    const destination = await downloadFile('images', fileName);
    
    if (destination) {
      console.log(`Image copiée avec succès: ${destination}`);
    } else {
      console.error('Échec de la copie de l\'image');
    }
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
  }
}

// Exécuter le script
main();
