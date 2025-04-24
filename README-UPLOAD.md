# Serveur d'upload pour les images

Ce serveur permet de télécharger des images dans le dossier `public` de l'application.

## Installation

1. Assurez-vous d'avoir les dépendances nécessaires :

```bash
npm install express multer cors
```

2. Créez le dossier pour les images :

```bash
mkdir -p public/images/advantages
```

## Démarrage du serveur

Pour démarrer le serveur d'upload :

```bash
node server.js
```

Le serveur sera accessible à l'adresse `http://localhost:3001`.

## Utilisation

Le serveur expose un endpoint `/api/upload` qui accepte des requêtes POST avec un fichier à télécharger.

### Paramètres

- `file` : Le fichier à télécharger (obligatoire)
- `path` : Le chemin où sauvegarder le fichier (par défaut : `/@public/images/advantages`)
- `filename` : Le nom du fichier (par défaut : un nom généré automatiquement)

### Exemple d'utilisation

```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', '/@public/images/advantages');
  formData.append('filename', 'mon-image.jpg');
  
  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
  
  const result = await response.json();
  return result.url; // URL de l'image téléchargée
};
```

## Accès aux images

Les images téléchargées sont accessibles via les URLs suivantes :

- `/@public/images/advantages/nom-du-fichier.jpg`
- `/public/images/advantages/nom-du-fichier.jpg`

## Configuration

Vous pouvez modifier le port du serveur en définissant la variable d'environnement `PORT` :

```bash
PORT=3002 node server.js
```
