# Hardware Store Management Application

Une application complète de gestion de quincaillerie développée avec Spring Boot, Angular et PostgreSQL.

## 🚀 Fonctionnalités

### Publiques
- Consultation de la liste des quincailleries
- Détails des quincailleries
- Liste des produits disponibles
- Détails des produits
- Produits par quincaillerie spécifique

### Authentifiées
- Inscription et connexion utilisateurs
- Gestion complète des magasins (CRUD)
- Gestion des produits (CRUD)
- Tableau de bord personnel
- Authentification sécurisée JWT

## 🛠️ Technologies Utilisées

### Backend
- **Spring Boot 3.5.5** - Framework Java
- **Spring Security** - Authentification et autorisation
- **JWT** - Tokens d'authentification
- **Spring Data JPA** - Persistance des données
- **PostgreSQL** - Base de données
- **Maven** - Gestion des dépendances

### Frontend
- **Angular 20** - Framework JavaScript
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive
- **HTML5/CSS3** - Interface utilisateur

### Infrastructure
- **Docker** - Containerisation
- **Docker Compose** - Orchestration de containers
- **Nginx** - Serveur web pour le frontend

## 📦 Installation avec Docker

### Prérequis
- Docker installé
- Docker Compose installé


## 🔧 Démarrage de l'application

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## 🏗️ Structure du Projet

```
hardware/
├── backend/                 # Application Spring Boot
│   ├── src/
│   │   └── main/java/com/hardware/
│   │       ├── config/      # Configuration Spring
│   │       ├── controllers/ # Contrôleurs API REST
│   │       ├── dto/         # Objets de transfert de données
│   │       ├── entities/    # Entités JPA
│   │       ├── exception/   # Gestion des exceptions
│   │       ├── filters/     # Filtres HTTP
│   │       ├── repositories/# Repository Spring Data
│   │       └── service/     # Couche service
│   ├── Dockerfile          # Configuration Docker pour le backend
│   └── pom.xml            # Dépendances Maven
├── frontend/               # Application Angular
│   ├── src/app/
│   │   ├── dashboard/      # Tableau de bord
│   │   ├── home/           # Page d'accueil
│   │   ├── login/          # Page de connexion
│   │   ├── register/       # Page d'inscription
│   │   ├── product-*/      # Composants produits
│   │   ├── store-*/        # Composants magasins
│   │   ├── public-*/       # Composants publics
│   │   ├── services/       # Services Angular
│   │   └── guards/         # Guards d'authentification
│   ├── Dockerfile          # Configuration Docker pour le frontend
│   └── package.json       # Dépendances Node.js
└── docker-compose.yml     # Configuration multi-containers
```

## 📋 API Endpoints

Pour la documentation complète des endpoints API, consultez le fichier [Endpoints.md](Endpoints.md).

## 🔐 Sécurité

- Authentification JWT avec expiration des tokens
- Hashage des mots de passe avec BCrypt
- Protection CORS configurée
- Validation des données côté serveur
- Gestion centralisée des exceptions


## 👥 Auteurs & Équipe

- **Mouhamed Diouf**
    - GitHub : [@seydi-ahmed](https://github.com/seydi-ahmed)  
    - Email : diouf.mouhamed3@ugb.edu.sn
    - Tel : +221776221681

---