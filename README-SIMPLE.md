# Solution simple pour les images dans /@public/

Cette solution permet de télécharger des images et de les rendre accessibles via le préfixe `/@public/`.

## Approche

1. Les images sont d'abord téléchargées vers Supabase Storage
2. L'URL de l'image est formatée avec le préfixe `/@public/`
3. Les scripts fournis permettent de copier les images dans le dossier `public/`

## Utilisation du formulaire

Le formulaire de création/modification d'avantages a été modifié pour :
- Télécharger les images vers Supabase
- Utiliser des URLs avec le préfixe `/@public/`

## Scripts disponibles

### 1. Synchroniser toutes les images

Pour copier toutes les images de Supabase vers le dossier `public/` :

```bash
npm install @supabase/supabase-js
node sync-images.js
```

### 2. Copier une image spécifique

Pour copier une image spécifique :

```bash
node copy-image.js <nom-du-fichier>
```

### 3. Télécharger des images depuis des URLs

Pour télécharger des images depuis des URLs :

```bash
node copy-images.js <url1> <url2> ...
```

## Structure des dossiers

- `public/` : Dossier racine pour les fichiers statiques
- `public/images/` : Dossier pour les images

## Dépannage

Si les images ne s'affichent pas :

1. Vérifiez que les images sont bien téléchargées dans Supabase
   - Allez dans le dashboard Supabase > Storage > images
   - Vérifiez que les fichiers sont présents

2. Exécutez le script de synchronisation
   ```bash
   node sync-images.js
   ```

3. Vérifiez que les images sont bien copiées dans le dossier `public/images/`
   ```bash
   ls -la public/images/
   ```

4. Assurez-vous que les URLs dans la base de données commencent par `/@public/`
