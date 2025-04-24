/**
 * Script pour démarrer le serveur d'upload et le script de synchronisation
 */

const { spawn } = require('child_process');
const path = require('path');

// Démarrer le serveur d'upload
console.log('Démarrage du serveur d\'upload...');
const uploadServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  shell: true
});

uploadServer.on('error', (error) => {
  console.error(`Erreur lors du démarrage du serveur d'upload: ${error.message}`);
});

// Démarrer le script de synchronisation
console.log('Démarrage du script de synchronisation...');
const syncScript = spawn('node', ['scripts/copy-images.js'], {
  stdio: 'inherit',
  shell: true
});

syncScript.on('error', (error) => {
  console.error(`Erreur lors du démarrage du script de synchronisation: ${error.message}`);
});

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('Arrêt des processus...');
  uploadServer.kill();
  syncScript.kill();
  process.exit(0);
});

console.log('Serveurs démarrés. Appuyez sur Ctrl+C pour arrêter.');
