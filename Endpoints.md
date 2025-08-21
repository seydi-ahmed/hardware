## Endpoints d'authentification

- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion d'un utilisateur

## Endpoints des quincailleries (nécessitent une authentification)

- `POST /api/stores` - Créer une quincaillerie
- `GET /api/stores` - Récupérer toutes les quincailleries de l'utilisateur connecté
- `GET /api/stores/{id}` - Récupérer une quincaillerie spécifique
- `PUT /api/stores/{id}` - Mettre à jour une quincaillerie
- `DELETE /api/stores/{id}` - Supprimer une quincaillerie

## Endpoints des produits (nécessitent une authentification)

- `POST /api/stores/{storeId}/products` - Créer un produit dans une quincaillerie
- `GET /api/stores/{storeId}/products` - Récupérer tous les produits d'une quincaillerie
- `GET /api/stores/{storeId}/products/{productId}` - Récupérer un produit spécifique
- `PUT /api/stores/{storeId}/products/{productId}` - Mettre à jour un produit
- `DELETE /api/stores/{storeId}/products/{productId}` - Supprimer un produit

## Endpoints publics (accessibles sans authentification)

- `GET /api/public/stores` - Récupérer toutes les quincailleries (publiques)
- `GET /api/public/products` - Récupérer tous les produits (publics)
- `GET /api/public/stores/{storeId}/products` - Récupérer les produits d'une quincaillerie spécifique (public)
