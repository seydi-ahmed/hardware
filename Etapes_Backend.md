Une plateforme **Spring Boot / PostgreSQL / Angular** où :

* Un **user** (compte) peut posséder **une ou plusieurs quincailleries**.
* Une **quincaillerie** possède **un ou plusieurs produits**.
* Chaque **user ne peut faire du CRUD que sur ses propres quincailleries/produits**.
* Mais la plateforme permet de **voir toutes les quincailleries et tous les produits** (lecture publique/ouverte).
* Stack: **Java 21**, **PostgreSQL 16**, **Lombok**.

Je te propose ci-dessous une explication de l’architecture puis un plan d’implémentation **itératif**, avec à **chaque étape** des tests Postman (ou curl) pour valider.

---

# 1) Architecture fonctionnelle & technique (vue d’ensemble)

## Modèle de données (relations)

* **User** `1..N` **Quincaillerie**
  (ownerId sur Quincaillerie)
* **Quincaillerie** `1..N` **Produit**
  (storeId sur Produit)

## Accès / sécurité

* **Lecture publique** (non authentifiée) :

  * `GET /api/public/stores` → toutes les quincailleries (pagination)
  * `GET /api/public/products` → tous les produits (pagination)
  * `GET /api/public/stores/{id}`, `GET /api/public/stores/{id}/products`, `GET /api/public/products/{id}`
* **Zone privée (JWT)** :

  * `POST /api/auth/register`, `POST /api/auth/login`
  * CRUD **restreint par ownership** :

    * `POST/PUT/PATCH/DELETE /api/me/stores/**` → seulement sur MES quincailleries
    * `POST/PUT/PATCH/DELETE /api/me/stores/{storeId}/products/**` → seulement sur MES produits (via storeId m’appartenant)
  * Vérification via **Spring Security + @PreAuthorize** avec un **OwnershipService** (ex. `@PreAuthorize("@own.canManageStore(#storeId, authentication)")`).

## Couches

* **Entities JPA** : `User`, `Store` (Quincaillerie), `Product`
* **DTOs / Mappers** (pour exposer proprement et contrôler le payload)
* **Repositories** Spring Data JPA
* **Services** (règles d’ownership, transactions)
* **Controllers** (public, auth, me)
* **Validation** `jakarta.validation` (e.g. `@NotBlank`, `@Positive`)
* **Migrations DB** avec **Flyway** (recommandé)
* **Gestion d’erreurs** `@ControllerAdvice` (erreurs 400/403/404/409…)
* **Pagination & tri** avec `Pageable` sur les endpoints de liste.

---

# 2) Plan de réalisation (par étapes, testable à chaque fois)

## Étape 0 — Dépendances & configuration de base

**Objectif** : Booter l’app, connecter PostgreSQL.

1. Dans `pom.xml` (Spring Boot 3.x, Java 21) ajoute (extrait minimal) :

```xml
<properties>
  <java.version>21</java.version>
  <spring-boot.version>3.3.2</spring-boot.version>
</properties>

<dependencies>
  <!-- Web & JPA -->
  <dependency>
    <groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>

  <!-- Security -->
  <dependency>
    <groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId><version>0.11.5</version>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId><version>0.11.5</version><scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId><version>0.11.5</version><scope>runtime</scope>
  </dependency>

  <!-- PostgreSQL -->
  <dependency>
    <groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope>
  </dependency>

  <!-- Validation -->
  <dependency>
    <groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId>
  </dependency>

  <!-- Lombok -->
  <dependency>
    <groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional>
  </dependency>

  <!-- Flyway (optionnel mais conseillé) -->
  <dependency>
    <groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId>
  </dependency>

  <!-- Tests -->
  <dependency>
    <groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope>
  </dependency>
</dependencies>
```

2. `src/main/resources/application.properties` (profil dev) :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hardware_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JWT (exemple; à externaliser ensuite)
app.jwt.secret=change-me-please-256bits
app.jwt.expiration=86400000
server.port=8080
```

3. **Flyway** `src/main/resources/db/migration/V1__init.sql` :

```sql
create table users (
  id bigserial primary key,
  email varchar(255) unique not null,
  password varchar(255) not null,
  full_name varchar(255) not null,
  created_at timestamp not null default now()
);

create table stores (
  id bigserial primary key,
  name varchar(255) not null,
  address text,
  owner_id bigint not null references users(id) on delete cascade,
  created_at timestamp not null default now()
);

create table products (
  id bigserial primary key,
  name varchar(255) not null,
  sku varchar(100),
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  store_id bigint not null references stores(id) on delete cascade,
  created_at timestamp not null default now()
);

create index idx_products_store on products(store_id);
create index idx_stores_owner on stores(owner_id);
```

**Test Postman (sanity check)**

* Lancer l’appli → vérifier que Flyway crée les tables (logs).
* Pas encore d’endpoint, on passe à l’étape 1.

---

## Étape 1 — Entités, Repos, DTOs minimaux (lecture publique)

**Objectif** : Exposer des **endpoints publics en lecture** pour tout le monde.

1. **Entities** (avec Lombok)

```java
// User.java
@Entity @Table(name="users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(unique=true, nullable=false) private String email;
  @Column(nullable=false) private String password;
  @Column(nullable=false) private String fullName;
  @CreationTimestamp private Instant createdAt;
  @OneToMany(mappedBy="owner", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<Store> stores = new ArrayList<>();
}

// Store.java
@Entity @Table(name="stores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Store {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false) private String name;
  private String address;
  @ManyToOne(optional=false) @JoinColumn(name="owner_id")
  private User owner;
  @CreationTimestamp private Instant createdAt;
  @OneToMany(mappedBy="store", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<Product> products = new ArrayList<>();
}

// Product.java
@Entity @Table(name="products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false) private String name;
  private String sku;
  @Column(nullable=false) private BigDecimal price;
  @Column(nullable=false) private Integer stock;
  @ManyToOne(optional=false) @JoinColumn(name="store_id")
  private Store store;
  @CreationTimestamp private Instant createdAt;
}
```

2. **Repositories**

```java
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
public interface StoreRepository extends JpaRepository<Store, Long> {
  Page<Store> findAll(Pageable pageable);
  Page<Store> findByOwnerId(Long ownerId, Pageable pageable);
  boolean existsByIdAndOwnerId(Long id, Long ownerId);
}
public interface ProductRepository extends JpaRepository<Product, Long> {
  Page<Product> findAll(Pageable pageable);
  Page<Product> findByStoreId(Long storeId, Pageable pageable);
  boolean existsByIdAndStoreId(Long id, Long storeId);
}
```

3. **Controllers publics** (liste + détail)
   `/api/public/stores`, `/api/public/products`, etc. (avec `Pageable`).

**Test Postman**

* `GET http://localhost:8080/api/public/stores?page=0&size=10` → 200 (liste vide au début).
* `GET /api/public/products` → 200.

---

## Étape 2 — Authentification (register/login) + JWT

**Objectif** : créer des users, s’authentifier et recevoir un JWT.

1. **SecurityConfig** (stateless, CORS permissive pour dev)
2. **PasswordEncoder** `BCryptPasswordEncoder`
3. **AuthController** :

   * `POST /api/auth/register` → crée un user (email unique, hash du mot de passe)
   * `POST /api/auth/login` → vérifie + renvoie `accessToken`

**Test Postman**

* `POST /api/auth/register`

  ```json
  { "email":"alice@example.com", "password":"Passw0rd!", "fullName":"Alice" }
  ```

  → 201
* `POST /api/auth/login`

  ```json
  { "email":"alice@example.com", "password":"Passw0rd!" }
  ```

  → 200 avec `{ "token": "eyJ..." }`
* Rejouer un `GET /api/public/stores` (toujours 200 sans token, normal).

---

## Étape 3 — CRUD « mes quincailleries » avec contrôle d’ownership

**Objectif** : un user gère **uniquement ses stores**.

1. **Endpoints privés** (nécessitent `Authorization: Bearer <token>`) :

   * `GET /api/me/stores` (liste mes stores)
   * `POST /api/me/stores` (create)
   * `PUT/PATCH /api/me/stores/{storeId}`
   * `DELETE /api/me/stores/{storeId}`

2. **OwnershipService** (vérifie `store.owner.id == authUserId`)

   * Méthodes: `canManageStore(storeId, Authentication)`
   * Utilisé en `@PreAuthorize` sur update/delete.

3. **Sécurité fine**

   * Activer `@EnableMethodSecurity` dans la config.
   * Sur `create` : set `owner = currentUser`.

**Test Postman**

1. Créer store:
   `POST /api/me/stores` (Bearer token Alice)

   ```json
   { "name":"Quincaillerie Centrale", "address":"Dakar Plateau" }
   ```

   → 201 avec l’ID
2. Lister MES stores:
   `GET /api/me/stores` → contient « Quincaillerie Centrale »
3. Tenter de modifier un store qui ne t’appartient pas (créer un 2ᵉ user Bob, créer un store via Bob, puis Alice tente `PUT` sur l’ID de Bob) → **403 Forbidden** (contrôle ownership OK).

---

## Étape 4 — CRUD « mes produits » par quincaillerie

**Objectif** : un user gère **les produits d’une de ses quincailleries**.

Endpoints (tous protégés, ownership via `storeId`) :

* `GET /api/me/stores/{storeId}/products`
* `POST /api/me/stores/{storeId}/products`
* `PUT/PATCH /api/me/stores/{storeId}/products/{productId}`
* `DELETE /api/me/stores/{storeId}/products/{productId}`

Règles :

* `storeId` doit appartenir au user sinon 403.
* Pour `PUT/PATCH/DELETE`, vérifier que `product.store.id == storeId` (+ store ownership).

**Test Postman**

1. `POST /api/me/stores/{storeId}/products`

   ```json
   { "name":"Perceuse 500W", "sku":"PRC-500", "price": 39990, "stock": 12 }
   ```

   → 201
2. `GET /api/me/stores/{storeId}/products` → liste avec pagination
3. Essayer d’ajouter un produit sur le store d’un autre user → **403**.

---

## Étape 5 — Lecture publique complète

**Objectif** : exposer **toutes** les quincailleries/produits pour la plateforme.

* `GET /api/public/stores` (avec `?q=...` pour filtre simple nom/adresse)
* `GET /api/public/stores/{id}`
* `GET /api/public/stores/{id}/products`
* `GET /api/public/products` (pagination, filtres simples `name`, `sku`, `minPrice`, `maxPrice`)
* `GET /api/public/products/{id}`

**Test Postman**

* Sans token, lister toutes les quincailleries/produits créés par différents users → 200.
* Tester la pagination et les filtres (vérifier 200 + résultat cohérent).

---

## Étape 6 — Validation & erreurs propres

**Objectif** : payloads propres, messages clairs.

* DTOs `CreateStoreDto`, `UpdateStoreDto`, `CreateProductDto`, `UpdateProductDto` avec `@NotBlank`, `@PositiveOrZero`, etc.
* `@ControllerAdvice` + `@ExceptionHandler` pour :

  * `MethodArgumentNotValidException` → 400 + liste d’erreurs
  * `AccessDeniedException` → 403
  * `EntityNotFoundException` → 404
  * Conflits → 409

**Test Postman**

* Envoyer un produit sans `name` → 400 avec message clair.
* Accéder à des ressources d’autrui → 403.

---

## Étape 7 — Finitions dev-friendly

* **CORS** permissif pour l’Angular dev (`http://localhost:4200`)
* **OpenAPI/Swagger** (`springdoc-openapi-starter-webmvc-ui`) pour documenter & tester

  * `GET /swagger-ui/index.html`
* **Tri/Pagination** systématiques (`Page<Product>`, `Page<Store>`)
* **Indices DB** déjà posés, vérifier plans si gros volumes.

**Test Postman**

* Tu peux aussi tester via Swagger UI.

---

# 3) Mini-extraits clés (pratiques)

## SecurityConfig (exemple minimal)

```java
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter; // filtre qui lit le token et set l'Authentication

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/public/**", "/api/auth/**").permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
```

## OwnershipService (SpEL hook)

```java
@Component
@RequiredArgsConstructor
public class OwnershipService {
  private final StoreRepository storeRepo;
  private final ProductRepository productRepo;

  public boolean canManageStore(Long storeId, Authentication auth) {
    Long userId = ((UserPrincipal) auth.getPrincipal()).getId();
    return storeRepo.existsByIdAndOwnerId(storeId, userId);
  }

  public boolean canManageProduct(Long productId, Authentication auth) {
    Long userId = ((UserPrincipal) auth.getPrincipal()).getId();
    // produit appartient à un store du user ?
    return productRepo.findById(productId)
      .map(p -> p.getStore().getOwner().getId().equals(userId))
      .orElse(false);
  }
}
```

## Exemple Controller (mes stores)

```java
@RestController
@RequestMapping("/api/me/stores")
@RequiredArgsConstructor
public class MyStoreController {
  private final StoreService storeService;

  @GetMapping
  public Page<StoreDto> myStores(Pageable pageable, Authentication auth) {
    return storeService.findMyStores(auth, pageable);
  }

  @PostMapping
  public ResponseEntity<StoreDto> create(@Valid @RequestBody CreateStoreDto dto, Authentication auth) {
    StoreDto created = storeService.create(dto, auth);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("{storeId}")
  @PreAuthorize("@own.canManageStore(#storeId, authentication)")
  public StoreDto update(@PathVariable Long storeId, @Valid @RequestBody UpdateStoreDto dto) {
    return storeService.update(storeId, dto);
  }

  @DeleteMapping("{storeId}")
  @PreAuthorize("@own.canManageStore(#storeId, authentication)")
  public ResponseEntity<Void> delete(@PathVariable Long storeId) {
    storeService.delete(storeId);
    return ResponseEntity.noContent().build();
  }
}
```

---

# 4) Stratégie de tests Postman (résumé rapide)

1. **Auth**

   * Register → Login → récupérer `token`.
2. **Mes quincailleries**

   * `POST /api/me/stores` (avec token) → 201
   * `GET /api/me/stores` → 200 (contient la nouvelle)
   * `PUT/DELETE` sur la tienne → 200/204
   * `PUT/DELETE` sur celle d’un autre → **403**
3. **Mes produits**

   * `POST /api/me/stores/{id}/products` → 201
   * `GET /api/me/stores/{id}/products` → 200
   * Modifier/Supprimer → OK si ownership, 403 sinon
4. **Lecture publique** (sans token)

   * `GET /api/public/stores`, `GET /api/public/products` → 200 + pagination
   * `GET /api/public/stores/{id}/products` → 200

---

# 5) Prochaines étapes

Si tu veux, je peux te fournir :

* Les **classes complètes** (DTOs, Services, Auth/JWT utils, Filters) prêtes à coller.
* Un **export Postman** (collection + env) pour rejouer tous les tests.
* Une **config Docker Compose** (Postgres + pgAdmin) pour standardiser l’environnement.

Dis-moi si tu préfères que je t’envoie d’abord le **module Auth (entier)** ou le **CRUD Stores** en premier, et je te donne les fichiers complets dans la foulée.
