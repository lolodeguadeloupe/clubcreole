const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier public
app.use('/@public', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Récupérer le chemin du dossier depuis la requête
    const uploadPath = req.body.path || '/@public/images/advantages';
    
    // Convertir le chemin relatif en chemin absolu
    const absolutePath = path.join(__dirname, uploadPath.replace(/^\/@public\//, '/public/'));
    
    console.log('Chemin de destination:', absolutePath);
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }
    
    cb(null, absolutePath);
  },
  filename: (req, file, cb) => {
    // Utiliser le nom de fichier fourni ou en générer un nouveau
    const fileName = req.body.filename || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${path.extname(file.originalname)}`;
    console.log('Nom du fichier:', fileName);
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Endpoint pour l'upload de fichiers
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }

  console.log('Fichier uploadé:', req.file);

  // Construire l'URL publique
  const uploadPath = req.body.path || '/@public/images/advantages';
  const fileName = req.file.filename;
  const publicUrl = `${uploadPath}/${fileName}`;

  // Retourner l'URL du fichier
  return res.status(200).json({
    success: true,
    url: publicUrl,
    file: req.file
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur d'upload démarré sur le port ${PORT}`);
  console.log(`URL de base: http://localhost:${PORT}`);
  console.log(`Dossier public: ${path.join(__dirname, 'public')}`);
});
