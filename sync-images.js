/**
 * Script pour synchroniser les images de Supabase vers le dossier public
 * 
 * Ce script utilise l'API Supabase pour lister toutes les images
 * et les copier dans le dossier public.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
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
 * Télécharge un fichier depuis une URL
 */
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    console.log(`Téléchargement de ${url} vers ${destination}`);
    
    // Créer le dossier de destination s'il n'existe pas
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Choisir le module http ou https selon l'URL
    const client = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(destination);
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Erreur HTTP: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Fichier téléchargé: ${destination}`);
        resolve(destination);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Supprimer le fichier en cas d'erreur
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(destination, () => {}); // Supprimer le fichier en cas d'erreur
      reject(err);
    });
  });
}

/**
 * Liste tous les fichiers dans un bucket Supabase
 */
async function listFiles(bucket) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list();
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Erreur lors de la liste des fichiers: ${error.message}`);
    return [];
  }
}

/**
 * Télécharge un fichier depuis Supabase
 */
async function downloadFromSupabase(bucket, filePath) {
  try {
    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    // Déterminer le chemin de destination
    const filename = path.basename(filePath);
    const destination = path.join(IMAGES_DIR, filename);
    
    // Télécharger le fichier
    await downloadFile(publicUrl, destination);
    
    return destination;
  } catch (error) {
    console.error(`Erreur lors du téléchargement de ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Point d'entrée principal
 */
async function main() {
  try {
    console.log('Synchronisation des images...');
    
    // Lister tous les fichiers dans le bucket 'images'
    const files = await listFiles('images');
    
    if (files.length === 0) {
      console.log('Aucun fichier trouvé dans le bucket images');
      return;
    }
    
    console.log(`${files.length} fichiers trouvés dans le bucket images`);
    
    // Télécharger chaque fichier
    for (const file of files) {
      if (file.name && !file.name.endsWith('/')) {
        await downloadFromSupabase('images', file.name);
      }
    }
    
    console.log('Synchronisation terminée');
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
  }
}

// Exécuter le script
main();
