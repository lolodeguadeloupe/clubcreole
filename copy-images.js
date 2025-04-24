/**
 * Script simple pour copier les images de Supabase vers le dossier public
 * 
 * Utilisation: node copy-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
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
 * Extrait le nom de fichier d'une URL
 */
function getFilenameFromUrl(url) {
  return url.split('/').pop().split('?')[0];
}

/**
 * Point d'entrée principal
 */
async function main() {
  try {
    // Liste des URLs à télécharger (à remplacer par les URLs réelles)
    const urls = process.argv.slice(2);
    
    if (urls.length === 0) {
      console.log('Aucune URL fournie. Utilisation: node copy-images.js URL1 URL2 ...');
      return;
    }
    
    console.log(`${urls.length} URLs à traiter`);
    
    // Télécharger chaque fichier
    for (const url of urls) {
      try {
        const filename = getFilenameFromUrl(url);
        const destination = path.join(IMAGES_DIR, filename);
        
        await downloadFile(url, destination);
        console.log(`Image copiée: ${url} -> ${destination}`);
      } catch (error) {
        console.error(`Erreur lors du téléchargement de ${url}: ${error.message}`);
      }
    }
    
    console.log('Terminé');
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
  }
}

// Exécuter le script
main();
