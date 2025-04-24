/**
 * Script pour copier les images téléchargées dans le dossier /@public/
 * 
 * Ce script surveille le dossier de stockage Supabase et copie les images
 * téléchargées dans le dossier /@public/ pour qu'elles soient accessibles
 * via l'URL /@public/images/...
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Chemins des dossiers
const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');
const advantagesDir = path.join(imagesDir, 'advantages');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Dossier créé: ${publicDir}`);
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Dossier créé: ${imagesDir}`);
}

if (!fs.existsSync(advantagesDir)) {
  fs.mkdirSync(advantagesDir, { recursive: true });
  console.log(`Dossier créé: ${advantagesDir}`);
}

// Initialiser le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour télécharger une image depuis Supabase et la sauvegarder localement
async function downloadAndSaveImage(bucket, filePath) {
  try {
    console.log(`Téléchargement de l'image: ${bucket}/${filePath}`);
    
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
    let destPath;
    if (filePath.startsWith('public/')) {
      // Si le chemin commence par 'public/', on le place directement dans le dossier public
      destPath = path.join(process.cwd(), filePath);
    } else {
      // Sinon, on le place dans le dossier advantages
      destPath = path.join(advantagesDir, path.basename(filePath));
    }
    
    // Créer le dossier parent s'il n'existe pas
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`Dossier créé: ${destDir}`);
    }
    
    // Convertir le blob en buffer
    const buffer = await data.arrayBuffer();
    
    // Sauvegarder le fichier
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`Image sauvegardée: ${destPath}`);
    
    return destPath;
  } catch (error) {
    console.error(`Erreur lors du traitement de l'image: ${error.message}`);
    return null;
  }
}

// Fonction pour lister et télécharger toutes les images
async function syncImages() {
  try {
    console.log('Synchronisation des images...');
    
    // Lister les fichiers dans le bucket 'images'
    const { data: files, error } = await supabase.storage
      .from('images')
      .list();
    
    if (error) {
      console.error(`Erreur lors de la liste des fichiers: ${error.message}`);
      return;
    }
    
    if (!files || files.length === 0) {
      console.log('Aucun fichier trouvé');
      return;
    }
    
    console.log(`${files.length} fichiers trouvés`);
    
    // Télécharger chaque fichier
    for (const file of files) {
      if (file.name && !file.name.endsWith('/')) {
        await downloadAndSaveImage('images', file.name);
      }
    }
    
    console.log('Synchronisation terminée');
  } catch (error) {
    console.error(`Erreur lors de la synchronisation: ${error.message}`);
  }
}

// Exécuter la synchronisation
syncImages();

// Surveiller les changements dans le bucket 'images'
console.log('Surveillance des changements dans le bucket images...');
console.log('Appuyez sur Ctrl+C pour arrêter');

// Synchroniser toutes les 30 secondes
setInterval(syncImages, 30000);
