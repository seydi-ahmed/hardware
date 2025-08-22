# Cahier des Charges : Application de Gestion de Quincaillerie

1. Contexte du Projet
Développement d'une application web complète pour la gestion d'une quincaillerie, permettant aux propriétaires de gérer leurs magasins et produits, et aux clients de consulter les produits disponibles.

---

2. Objectifs
- Permettre aux propriétaires de s'inscrire, se connecter et gérer leurs magasins
- Offrir une interface de gestion des produits pour chaque magasin
- Fournir une vitrine publique des magasins et produits disponibles
- Assurer la sécurité des données avec authentification JWT
- Containeriser l'application pour un déploiement facile

---

3. Stack Technique
- Backend: Spring Boot 3.5.5, Spring Security, JWT, Spring Data JPA
- Frontend: Angular 20, Angular Router
- Base de données: PostgreSQL
- Containerisation: Docker, Docker Compose

---

4. Fonctionnalités
- Fonctionnalités Publiques
    - Consultation de la liste des quincailleries
    - Consultation des détails d'une quincaillerie
    - Consultation de la liste des produits
    - Consultation des détails d'un produit
    - Consultation des produits d'une quincaillerie spécifique

---

- Fonctionnalités Authentifiées
    - Inscription et connexion des utilisateurs
    - Gestion des magasins (CRUD)
    - Gestion des produits (CRUD)
    - Tableau de bord personnel

---

5. Architecture
- Backend (Spring Boot)
    - API RESTful avec endpoints sécurisés
    - Authentification JWT
    - Couche de service avec logique métier
    - Repository pattern avec Spring Data JPA
    - Gestion centralisée des exceptions
    - Configuration CORS

---

- Frontend (Angular)
    - Architecture modulaire avec composants
    - Services pour la communication API
    - Guards pour la protection des routes
    - Intercepteurs pour l'authentification JWT
    - Interface responsive

---

- Base de Données
    - Tables: users, hardware_stores, products
    - Relations: One-to-Many (User → Stores), One-to-Many (Store → Products)

---

6. Sécurité
    - Authentification JWT avec expiration
    - Hashage des mots de passe avec BCrypt
    - Protection contre les attaques CSRF
    - Configuration CORS pour les requêtes cross-origin
    - Validation des données côté serveur

---

7. Déploiement
    - Containerisation avec Docker
    - Orchestration avec Docker Compose
    - Base de données PostgreSQL containerisée