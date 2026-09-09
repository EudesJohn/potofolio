# Portfolio — Eudes Johnson DJOGO

Portfolio multi-pages **React + Vite + Tailwind v4**, backend **Supabase** (base de données + authentification), avec **espace admin** protégé pour gérer les projets et lire les messages de contact.

## 🗂️ Pages

| Page | Route | Description |
|---|---|---|
| Accueil | `/` | Hero, statistiques, projets en vedette, aperçu compétences |
| À propos | `/a-propos` | Parcours, profil en bref |
| Projets | `/projets` | Liste dynamique depuis Supabase |
| Compétences | `/competences` | Cartes + setup IA local |
| Contact | `/contact` | Formulaire enregistré en base |
| Admin — Login | `/admin/login` | Connexion Supabase Auth |
| Admin — Dashboard | `/admin` | Statistiques + derniers éléments |
| Admin — Projets | `/admin/projets` | CRUD complet (créer, modifier, publier, supprimer) |
| Admin — Messages | `/admin/messages` | Boîte de réception (lu / non lu, supprimer) |

## 🚀 Démarrage local

```bash
npm install
cp .env.example .env   # puis remplir les valeurs
npm run dev
```

## 🗄️ Configuration Supabase (à faire une seule fois)

1. **Exécuter le schéma** : Supabase Dashboard → SQL Editor → coller le contenu de `supabase/schema.sql` → Run. Cela crée les tables `projects`, `skills`, `messages`, `site_settings`, les **politiques RLS** et les **données initiales**.

2. **Créer le compte admin** : Supabase Dashboard → Authentication → Users → **Add user** → renseigner votre email + mot de passe → cocher *Auto Confirm User*.

> La sécurité repose sur les **politiques RLS** : lecture publique des projets publiés et des compétences, insertion publique des messages, et toute écriture réservée à un utilisateur connecté. La clé `anon` seule est exposée côté client — **jamais** la `service_role`.

## ☁️ Déploiement Vercel

1. Importer le repo `EudesJohn/potofolio` sur [vercel.com/new](https://vercel.com/new) (Vercel détecte Vite automatiquement, `vercel.json` gère les routes SPA).
2. Ajouter les **variables d'environnement** (Settings → Environment Variables) :
   - `VITE_SUPABASE_URL` = `https://fhpudniopjfvsbeswtej.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(votre clé anon)*
3. Déployer.

### Autoriser le domaine Vercel dans Supabase

Authentication → URL Configuration → ajouter `https://votre-domaine.vercel.app` dans *Site URL* et *Redirect URLs* (utile pour les sessions admin en production).

## 🔧 Stack

- **Frontend** : React 19, React Router 7, Tailwind CSS v4, TypeScript, Vite 8
- **Backend** : Supabase (PostgreSQL + Row Level Security + Auth)
- **Hébergement** : Vercel
