import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Récupérer le chemin du dossier depuis la requête
    const uploadPath = req.body.path || '/@public/images/advantages';
    
    // Convertir le chemin relatif en chemin absolu
    const absolutePath = path.join(process.cwd(), uploadPath.replace(/^\/@public\//, '/public/'));
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }
    
    cb(null, absolutePath);
  },
  filename: (req, file, cb) => {
    // Utiliser le nom de fichier fourni ou en générer un nouveau
    const fileName = req.body.filename || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Endpoint pour l'upload de fichiers
export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Utiliser multer pour gérer l'upload
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Erreur lors de l\'upload:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

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
}
