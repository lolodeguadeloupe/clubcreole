# Gestion des images dans le dossier /@public/

Ce projet inclut une solution pour télécharger des images et les placer dans le dossier `/@public/` afin qu'elles soient accessibles via l'URL `/@public/images/...`.

## Configuration

1. Assurez-vous d'avoir les dépendances nécessaires :

```bash
npm install express multer cors @supabase/supabase-js
```

2. Créez les dossiers nécessaires :

```bash
mkdir -p public/images/advantages
```

## Démarrage des serveurs

Pour démarrer le serveur d'upload et le script de synchronisation :

```bash
node start-upload-server.js
```

Cela va :
- Démarrer un serveur Express sur le port 3001 pour gérer les uploads
- Démarrer un script qui synchronise les images depuis Supabase vers le dossier `public/`

## Comment ça fonctionne

### Téléchargement d'images

Lorsque vous téléchargez une image via le formulaire de création/modification d'avantages :

1. L'image est d'abord téléchargée vers Supabase Storage dans le bucket 'images'
2. L'URL de l'image est formatée avec le préfixe `/@public/`
3. Le script de synchronisation détecte le nouveau fichier et le copie dans le dossier `public/`

### Accès aux images

Les images sont accessibles via les URLs suivantes :

- `/@public/images/advantages/nom-du-fichier.jpg`
- `/public/images/advantages/nom-du-fichier.jpg`

## Dépannage

Si les images ne sont pas téléchargées correctement :

1. Vérifiez que le serveur d'upload est en cours d'exécution
2. Vérifiez les logs dans la console pour voir les erreurs
3. Assurez-vous que les dossiers `public/images/advantages` existent
4. Vérifiez que Supabase est correctement configuré

## Logs

Les logs sont affichés dans la console et incluent :
- Les tentatives d'upload
- Les erreurs d'upload
- Les fichiers téléchargés
- Les chemins de destination

## Structure des fichiers

- `server.js` : Serveur Express pour gérer les uploads
- `scripts/copy-images.js` : Script pour synchroniser les images depuis Supabase
- `start-upload-server.js` : Script pour démarrer les deux serveurs
- `src/pages/admin/advantages/AdvantageForm.tsx` : Formulaire avec la fonction d'upload
