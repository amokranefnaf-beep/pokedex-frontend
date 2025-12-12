# Phase 6 - Guide d'Implémentation des Composants Frontend
## Application PokéDex Collection - Angular 20

**Version:** 1.0
**Date:** Décembre 2024
**Auteur:** Documentation Technique
**Framework:** Angular 20.2.0

---

## Table des Matières

1. [Introduction](#1-introduction)
2. [Architecture du Projet](#2-architecture-du-projet)
3. [Modèles et Interfaces](#3-modèles-et-interfaces)
4. [Services](#4-services)
5. [Composants](#5-composants)
6. [Routing et Navigation](#6-routing-et-navigation)
7. [Guards et Interceptors](#7-guards-et-interceptors)
8. [Gestion d'État avec Signals](#8-gestion-détat-avec-signals)
9. [Styles et Animations](#9-styles-et-animations)
10. [Tests](#10-tests)
11. [Checklist de Développement](#11-checklist-de-développement)

---

## 1. Introduction

### 1.1 Contexte

Ce guide détaille l'implémentation complète du frontend de l'application PokéDex Collection en Angular 20. L'application permet aux utilisateurs de :
- **Gérer une collection** de cartes Pokémon
- **Rechercher** des Pokémon via l'API
- **Échanger** des cartes avec d'autres utilisateurs
- **Consulter** un classement des meilleurs collectionneurs

### 1.2 Problématique Actuelle

Le backend est opérationnel et retourne les données correctement, mais l'affichage est bloqué sur un écran de chargement. Les composants Angular nécessaires pour afficher et gérer ces données n'ont pas encore été implémentés.

### 1.3 Objectifs

- ✅ Implémenter tous les composants de la maquette
- ✅ Utiliser les **directives Angular 20** (@if, @for, @defer)
- ✅ Adopter une architecture **standalone components**
- ✅ Utiliser les **Signals** pour la gestion d'état
- ✅ Assurer une expérience utilisateur fluide avec gestion des erreurs

### 1.4 Technologies Utilisées

- **Angular 20.2.0** - Framework frontend
- **TypeScript 5.9** - Langage de programmation
- **RxJS 7.8** - Programmation réactive
- **Signals** - Gestion d'état moderne
- **Standalone Components** - Architecture sans modules
- **TailwindCSS** - Framework CSS (déjà dans la maquette)

---

## 2. Architecture du Projet

### 2.1 Structure des Dossiers

Créer la structure suivante dans le dossier `src/app/` :

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   └── services/
│       ├── pokemon.service.ts
│       ├── collection.service.ts
│       ├── auth.service.ts
│       └── trade.service.ts
├── shared/
│   ├── models/
│   │   ├── pokemon.model.ts
│   │   ├── collection.model.ts
│   │   ├── user.model.ts
│   │   └── trade.model.ts
│   └── components/
│       ├── loading-spinner/
│       ├── error-message/
│       └── pokemon-card/
├── features/
│   ├── collection/
│   │   ├── collection.component.ts
│   │   ├── collection.component.html
│   │   └── collection.component.css
│   ├── search/
│   │   ├── search.component.ts
│   │   ├── search.component.html
│   │   └── search.component.css
│   ├── trades/
│   │   ├── trades.component.ts
│   │   ├── trades.component.html
│   │   └── trades.component.css
│   ├── leaderboard/
│   │   ├── leaderboard.component.ts
│   │   ├── leaderboard.component.html
│   │   └── leaderboard.component.css
│   └── profile/
│       ├── profile.component.ts
│       ├── profile.component.html
│       └── profile.component.css
├── app.routes.ts
├── app.config.ts
└── app.ts
```

### 2.2 Principes d'Architecture

#### 2.2.1 Standalone Components (Angular 20)

Angular 20 privilégie les **standalone components** qui ne nécessitent plus de NgModule :

```typescript
@Component({
  selector: 'app-collection',
  standalone: true,  // ✅ Composant standalone
  imports: [CommonModule, RouterLink],  // Imports directs
  templateUrl: './collection.component.html'
})
export class CollectionComponent {}
```

#### 2.2.2 Nouvelle Syntaxe de Template

Angular 20 introduit de nouvelles directives de contrôle :

```html
<!-- ❌ Ancienne syntaxe -->
<div *ngIf="pokemon">{{ pokemon.name }}</div>
<div *ngFor="let item of items">{{ item }}</div>

<!-- ✅ Nouvelle syntaxe Angular 20 -->
@if (pokemon) {
  <div>{{ pokemon.name }}</div>
}

@for (item of items; track item.id) {
  <div>{{ item }}</div>
}
```

#### 2.2.3 Signals pour la Gestion d'État

Les **Signals** remplacent progressivement les Observables pour l'état local :

```typescript
// ❌ Ancienne approche
pokemons$ = new BehaviorSubject<Pokemon[]>([]);

// ✅ Nouvelle approche avec Signals
pokemons = signal<Pokemon[]>([]);
loading = signal<boolean>(false);
error = signal<string | null>(null);
```

---

## 3. Modèles et Interfaces

### 3.1 Pokemon Model

**Fichier:** `src/app/shared/models/pokemon.model.ts`

```typescript
/**
 * Représente un Pokémon avec toutes ses caractéristiques
 */
export interface Pokemon {
  id: number;
  name: string;
  frenchName?: string;
  types: PokemonType[];
  sprite: string;
  officialArtwork: string;
  stats: PokemonStats;
  generation: number;
  rarity: Rarity;
  isFavorite?: boolean;
  isOwned?: boolean;
}

/**
 * Types de Pokémon disponibles
 */
export enum PokemonType {
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
  PSYCHIC = 'psychic',
  DRAGON = 'dragon',
  FAIRY = 'fairy',
  NORMAL = 'normal',
  FIGHTING = 'fighting',
  GHOST = 'ghost',
  ICE = 'ice',
  POISON = 'poison',
  GROUND = 'ground',
  FLYING = 'flying',
  BUG = 'bug',
  ROCK = 'rock',
  STEEL = 'steel',
  DARK = 'dark'
}

/**
 * Mapping des types vers leurs émojis
 */
export const TYPE_EMOJI: Record<PokemonType, string> = {
  [PokemonType.FIRE]: '🔥',
  [PokemonType.WATER]: '💧',
  [PokemonType.GRASS]: '🌿',
  [PokemonType.ELECTRIC]: '⚡',
  [PokemonType.PSYCHIC]: '🔮',
  [PokemonType.DRAGON]: '🐲',
  [PokemonType.FAIRY]: '🧚',
  [PokemonType.NORMAL]: '⚪',
  [PokemonType.FIGHTING]: '👊',
  [PokemonType.GHOST]: '👻',
  [PokemonType.ICE]: '❄️',
  [PokemonType.POISON]: '☠️',
  [PokemonType.GROUND]: '⛰️',
  [PokemonType.FLYING]: '🕊️',
  [PokemonType.BUG]: '🐛',
  [PokemonType.ROCK]: '🪨',
  [PokemonType.STEEL]: '⚙️',
  [PokemonType.DARK]: '🌙'
};

/**
 * Statistiques d'un Pokémon
 */
export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

/**
 * Niveaux de rareté
 */
export enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary'
}

/**
 * Informations sur l'évolution
 */
export interface Evolution {
  from: Pokemon | null;
  current: Pokemon;
  to: Pokemon | null;
}
```

### 3.2 Collection Model

**Fichier:** `src/app/shared/models/collection.model.ts`

```typescript
/**
 * Représente la collection d'un utilisateur
 */
export interface Collection {
  id: number;
  userId: number;
  pokemons: CollectionPokemon[];
  totalCount: number;
  favoriteCount: number;
  typeDistribution: TypeDistribution;
}

/**
 * Pokémon dans une collection avec métadonnées
 */
export interface CollectionPokemon {
  pokemon: Pokemon;
  acquiredAt: Date;
  isFavorite: boolean;
  quantity: number;
}

/**
 * Répartition par type
 */
export interface TypeDistribution {
  [key: string]: number;
}

/**
 * Filtres pour la collection
 */
export interface CollectionFilters {
  type?: PokemonType;
  rarity?: Rarity;
  generation?: number;
  favoriteOnly?: boolean;
  searchTerm?: string;
}

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}
```

### 3.3 User Model

**Fichier:** `src/app/shared/models/user.model.ts`

```typescript
/**
 * Représente un utilisateur de l'application
 */
export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  badges: Badge[];
  stats: UserStats;
  createdAt: Date;
}

/**
 * Statistiques d'un utilisateur
 */
export interface UserStats {
  totalPokemons: number;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  favoriteCount: number;
  wishlistCount: number;
  rank: number;
  completionPercentage: number;
}

/**
 * Badge obtenu par l'utilisateur
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
```

### 3.4 Trade Model

**Fichier:** `src/app/shared/models/trade.model.ts`

```typescript
/**
 * Représente un échange entre utilisateurs
 */
export interface Trade {
  id: number;
  fromUser: User;
  toUser: User;
  offeredPokemons: Pokemon[];
  requestedPokemons: Pokemon[];
  status: TradeStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Statut d'un échange
 */
export enum TradeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * Requête de création d'échange
 */
export interface TradeRequest {
  toUserId: number;
  offeredPokemonIds: number[];
  requestedPokemonIds: number[];
}
```

---

## 4. Services

### 4.1 Pokemon Service

**Fichier:** `src/app/core/services/pokemon.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, map } from 'rxjs';
import { Pokemon, PokemonType } from '../../shared/models/pokemon.model';

/**
 * Service de gestion des Pokémon
 * Communique avec le backend et la PokeAPI
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/pokemons';

  // État avec Signals
  pokemons = signal<Pokemon[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Récupère tous les Pokémon avec filtres optionnels
   */
  getPokemons(filters?: {
    type?: PokemonType;
    generation?: number;
    search?: string;
    page?: number;
    size?: number;
  }): Observable<Pokemon[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters?.type) params = params.append('type', filters.type);
    if (filters?.generation) params = params.append('generation', filters.generation);
    if (filters?.search) params = params.append('search', filters.search);
    if (filters?.page) params = params.append('page', filters.page);
    if (filters?.size) params = params.append('size', filters.size);

    return this.http.get<Pokemon[]>(this.API_URL, { params }).pipe(
      tap(pokemons => {
        this.pokemons.set(pokemons);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Erreur lors du chargement des Pokémon');
        this.loading.set(false);
        throw error;
      })
    );
  }

  /**
   * Récupère un Pokémon par son ID
   */
  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.API_URL}/${id}`);
  }

  /**
   * Recherche des Pokémon par nom
   */
  searchPokemons(term: string): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.API_URL}/search`, {
      params: { q: term }
    });
  }

  /**
   * Récupère les détails d'évolution d'un Pokémon
   */
  getEvolutionChain(pokemonId: number): Observable<Evolution> {
    return this.http.get<Evolution>(`${this.API_URL}/${pokemonId}/evolution`);
  }
}
```

### 4.2 Collection Service

**Fichier:** `src/app/core/services/collection.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Collection, CollectionPokemon } from '../../shared/models/collection.model';

/**
 * Service de gestion de la collection utilisateur
 */
@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/collection';

  // État de la collection
  collection = signal<Collection | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Récupère la collection de l'utilisateur connecté
   */
  getUserCollection(): Observable<Collection> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Collection>(this.API_URL).pipe(
      tap(collection => {
        this.collection.set(collection);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Erreur lors du chargement de la collection');
        this.loading.set(false);
        throw error;
      })
    );
  }

  /**
   * Ajoute un Pokémon à la collection
   */
  addPokemon(pokemonId: number): Observable<Collection> {
    return this.http.post<Collection>(`${this.API_URL}/add`, { pokemonId }).pipe(
      tap(collection => this.collection.set(collection))
    );
  }

  /**
   * Retire un Pokémon de la collection
   */
  removePokemon(pokemonId: number): Observable<Collection> {
    return this.http.delete<Collection>(`${this.API_URL}/remove/${pokemonId}`).pipe(
      tap(collection => this.collection.set(collection))
    );
  }

  /**
   * Marque/Démarque un Pokémon comme favori
   */
  toggleFavorite(pokemonId: number): Observable<Collection> {
    return this.http.patch<Collection>(`${this.API_URL}/favorite/${pokemonId}`, {}).pipe(
      tap(collection => this.collection.set(collection))
    );
  }

  /**
   * Compte les Pokémon par type
   */
  getTypeDistribution(): Observable<TypeDistribution> {
    return this.http.get<TypeDistribution>(`${this.API_URL}/stats/types`);
  }
}
```

### 4.3 Auth Service

**Fichier:** `src/app/core/services/auth.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/models/user.model';

/**
 * Interface pour les credentials de connexion
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface pour l'inscription
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

/**
 * Réponse d'authentification du backend
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Service d'authentification
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:8080/api/auth';

  // État d'authentification avec Signals
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  token = signal<string | null>(null);

  constructor() {
    // Charger le token depuis le localStorage au démarrage
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      this.token.set(savedToken);
      this.loadCurrentUser();
    }
  }

  /**
   * Connexion de l'utilisateur
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      })
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    this.token.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Charge les informations de l'utilisateur connecté
   */
  private loadCurrentUser(): void {
    this.http.get<User>(`${this.API_URL}/me`).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      },
      error: () => {
        this.logout();
      }
    });
  }

  /**
   * Gère le succès de l'authentification
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    this.token.set(response.token);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }
}
```

### 4.4 Trade Service

**Fichier:** `src/app/core/services/trade.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Trade, TradeRequest, TradeStatus } from '../../shared/models/trade.model';

/**
 * Service de gestion des échanges
 */
@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/trades';

  // État des échanges
  trades = signal<Trade[]>([]);
  pendingTrades = signal<Trade[]>([]);
  loading = signal<boolean>(false);

  /**
   * Récupère tous les échanges de l'utilisateur
   */
  getUserTrades(): Observable<Trade[]> {
    this.loading.set(true);
    return this.http.get<Trade[]>(this.API_URL).pipe(
      tap(trades => {
        this.trades.set(trades);
        this.updatePendingTrades(trades);
        this.loading.set(false);
      })
    );
  }

  /**
   * Crée une nouvelle proposition d'échange
   */
  createTrade(request: TradeRequest): Observable<Trade> {
    return this.http.post<Trade>(this.API_URL, request).pipe(
      tap(() => this.getUserTrades().subscribe())
    );
  }

  /**
   * Accepte un échange
   */
  acceptTrade(tradeId: number): Observable<Trade> {
    return this.http.patch<Trade>(`${this.API_URL}/${tradeId}/accept`, {}).pipe(
      tap(() => this.getUserTrades().subscribe())
    );
  }

  /**
   * Refuse un échange
   */
  rejectTrade(tradeId: number): Observable<Trade> {
    return this.http.patch<Trade>(`${this.API_URL}/${tradeId}/reject`, {}).pipe(
      tap(() => this.getUserTrades().subscribe())
    );
  }

  /**
   * Annule un échange
   */
  cancelTrade(tradeId: number): Observable<Trade> {
    return this.http.delete<Trade>(`${this.API_URL}/${tradeId}`).pipe(
      tap(() => this.getUserTrades().subscribe())
    );
  }

  /**
   * Met à jour la liste des échanges en attente
   */
  private updatePendingTrades(trades: Trade[]): void {
    const pending = trades.filter(t => t.status === TradeStatus.PENDING);
    this.pendingTrades.set(pending);
  }
}
```

---

## 5. Composants

### 5.1 Collection Component

**Fichier:** `src/app/features/collection/collection.component.ts`

```typescript
import {Component, OnInit, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CollectionService} from '../../core/services/collection.service';
import {PokemonService} from '../../core/services/pokemon.service';
import {Pokemon, PokemonType, Rarity} from '../../shared/models/pokemon.model';
import {CollectionFilters} from '../../shared/models/collection.model';

/**
 * Composant d'affichage de la collection utilisateur
 * Utilise les directives Angular 20 (@if, @for, @defer)
 */
@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent implements OnInit {
  private collectionService = inject(CollectionService);
  private pokemonService = inject(PokemonService);

  // Signals pour l'état du composant
  pokemons = signal<Pokemon[]>([]);
  filteredPokemons = computed(() => this.applyFilters());
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Filtres
  selectedType = signal<PokemonType | null>(null);
  selectedRarity = signal<Rarity | null>(null);
  favoriteOnly = signal<boolean>(false);
  searchTerm = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(20);
  totalPages = computed(() =>
    Math.ceil(this.filteredPokemons().length / this.pageSize())
  );
  paginatedPokemons = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredPokemons().slice(start, end);
  });

  // Énumérations pour le template
  readonly PokemonType = PokemonType;
  readonly Rarity = Rarity;

  ngOnInit(): void {
    this.loadCollection();
  }

  /**
   * Charge la collection de l'utilisateur
   */
  loadCollection(): void {
    this.loading.set(true);
    this.error.set(null);

    this.collectionService.getUserCollection().subscribe({
      next: (collection) => {
        this.pokemons.set(collection.pokemons.map(cp => cp.pokemon));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Impossible de charger la collection. Veuillez réessayer.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Applique les filtres sur les Pokémon
   */
  private applyFilters(): Pokemon[] {
    let filtered = this.pokemons();

    // Filtre par type
    if (this.selectedType()) {
      filtered = filtered.filter(p => p.types.includes(this.selectedType()!));
    }

    // Filtre par rareté
    if (this.selectedRarity()) {
      filtered = filtered.filter(p => p.rarity === this.selectedRarity());
    }

    // Filtre favoris uniquement
    if (this.favoriteOnly()) {
      filtered = filtered.filter(p => p.isFavorite);
    }

    // Filtre par recherche
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.frenchName?.toLowerCase().includes(search) ||
        p.id.toString().includes(search)
      );
    }

    return filtered;
  }

  /**
   * Change le filtre de type
   */
  filterByType(type: PokemonType | null): void {
    this.selectedType.set(type);
    this.currentPage.set(1);
  }

  /**
   * Change le filtre de rareté
   */
  filterByRarity(rarity: Rarity | null): void {
    this.selectedRarity.set(rarity);
    this.currentPage.set(1);
  }

  /**
   * Toggle le filtre favoris
   */
  toggleFavoriteFilter(): void {
    this.favoriteOnly.update(value => !value);
    this.currentPage.set(1);
  }

  /**
   * Met à jour le terme de recherche
   */
  updateSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  /**
   * Change de page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

  /**
   * Toggle favori d'un Pokémon
   */
  toggleFavorite(pokemon: Pokemon): void {
    this.collectionService.toggleFavorite(pokemon.id).subscribe({
      next: () => {
        // Mettre à jour localement
        this.pokemons.update(pokemons =>
          pokemons.map(p =>
            p.id === pokemon.id
              ? {...p, isFavorite: !p.isFavorite}
              : p
          )
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Supprime un Pokémon de la collection
   */
  removePokemon(pokemon: Pokemon): void {
    if (confirm(`Voulez-vous vraiment retirer ${pokemon.frenchName || pokemon.name} de votre collection ?`)) {
      this.collectionService.removePokemon(pokemon.id).subscribe({
        next: () => {
          this.pokemons.update(pokemons =>
            pokemons.filter(p => p.id !== pokemon.id)
          );
        },
        error: (err) => console.error(err)
      });
    }
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedType.set(null);
    this.selectedRarity.set(null);
    this.favoriteOnly.set(false);
    this.searchTerm.set('');
    this.currentPage.set(1);
  }
}
```

**Fichier:** `src/app/features/collection/collection.component.html`

```html
<section class="collection-section">
  <div class="container">
    <!-- En-tête -->
    <div class="section-header">
      <div>
        <h2 class="section-title">MA COLLECTION</h2>
        @if (pokemons().length > 0) {
          <p class="collection-stats">
            Tu possèdes
            <span class="highlight">{{ pokemons().length }}</span>
            cartes sur 1,025
          </p>
        }
      </div>

      <!-- Filtres -->
      <div class="filters">
        <button
          class="filter-btn"
          [class.active]="!selectedType() && !selectedRarity() && !favoriteOnly()"
          (click)="resetFilters()">
          Tous
        </button>

        <button
          class="filter-btn"
          [class.active]="favoriteOnly()"
          (click)="toggleFavoriteFilter()">
          ⭐ Favoris
        </button>

        <button
          class="filter-btn"
          [class.active]="selectedType() === PokemonType.FIRE"
          (click)="filterByType(selectedType() === PokemonType.FIRE ? null : PokemonType.FIRE)">
          🔥 Feu
        </button>

        <button
          class="filter-btn"
          [class.active]="selectedType() === PokemonType.WATER"
          (click)="filterByType(selectedType() === PokemonType.WATER ? null : PokemonType.WATER)">
          💧 Eau
        </button>

        <button
          class="filter-btn"
          [class.active]="selectedType() === PokemonType.GRASS"
          (click)="filterByType(selectedType() === PokemonType.GRASS ? null : PokemonType.GRASS)">
          🌿 Plante
        </button>

        <button
          class="filter-btn"
          [class.active]="selectedType() === PokemonType.ELECTRIC"
          (click)="filterByType(selectedType() === PokemonType.ELECTRIC ? null : PokemonType.ELECTRIC)">
          ⚡ Électrik
        </button>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input
        type="text"
        placeholder="Rechercher par nom ou numéro..."
        [value]="searchTerm()"
        (input)="updateSearch($event.target.value)"
        class="search-input">

      @if (searchTerm()) {
        <button
          class="clear-search"
          (click)="updateSearch('')">
          ✕
        </button>
      }
    </div>

    <!-- État de chargement -->
    @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de ta collection...</p>
      </div>
    }

    <!-- État d'erreur -->
    @else if (error()) {
      <div class="error-state">
        <p class="error-message">{{ error() }}</p>
        <button
          class="retry-btn"
          (click)="loadCollection()">
          Réessayer
        </button>
      </div>
    }

    <!-- Collection vide -->
    @else if (pokemons().length === 0) {
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>Ta collection est vide</h3>
        <p>Commence par ajouter des Pokémon depuis la recherche !</p>
        <a routerLink="/search" class="cta-btn">
          🔍 Rechercher des Pokémon
        </a>
      </div>
    }

    <!-- Grille de cartes -->
    @else {
      <!-- Résultats filtrés vides -->
      @if (filteredPokemons().length === 0) {
        <div class="no-results">
          <p>Aucun Pokémon ne correspond à tes critères</p>
          <button
            class="reset-btn"
            (click)="resetFilters()">
            Réinitialiser les filtres
          </button>
        </div>
      }

      @else {
        <div class="pokemon-grid">
          <!-- Utilisation de @for (Angular 20) avec track obligatoire -->
          @for (pokemon of paginatedPokemons(); track pokemon.id) {
            <div class="pokemon-card">
              <!-- Badge de rareté -->
              @if (pokemon.rarity === Rarity.LEGENDARY) {
                <div class="rarity-badge legendary">
                  ★ LÉGENDAIRE
                </div>
              }
              @else if (pokemon.rarity === Rarity.RARE) {
                <div class="rarity-badge rare">
                  ★ RARE
                </div>
              }

              <!-- Bouton favori -->
              <button
                class="favorite-btn"
                [class.active]="pokemon.isFavorite"
                (click)="toggleFavorite(pokemon)"
                title="Marquer comme favori">
                ⭐
              </button>

              <!-- Image du Pokémon -->
              <div class="pokemon-image-container">
                <img
                  [src]="pokemon.officialArtwork"
                  [alt]="pokemon.frenchName || pokemon.name"
                  class="pokemon-image"
                  loading="lazy">
              </div>

              <!-- Informations -->
              <div class="pokemon-info">
                <div class="pokemon-header">
                  <span class="pokemon-number">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
                  <div class="pokemon-types">
                    @for (type of pokemon.types; track type) {
                      <span class="type-badge" [attr.data-type]="type">
                        {{ type }}
                      </span>
                    }
                  </div>
                </div>

                <h3 class="pokemon-name">
                  {{ pokemon.frenchName || pokemon.name | uppercase }}
                </h3>
              </div>

              <!-- Actions au survol -->
              <div class="pokemon-actions">
                <button
                  class="action-btn view"
                  title="Voir les détails">
                  👁️
                </button>
                <button
                  class="action-btn trade"
                  title="Proposer un échange">
                  🔄
                </button>
                <button
                  class="action-btn remove"
                  (click)="removePokemon(pokemon)"
                  title="Retirer de la collection">
                  🗑️
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="pagination">
            <button
              class="page-btn"
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)">
              ◀
            </button>

            @for (page of [].constructor(totalPages()); track $index) {
              <button
                class="page-btn"
                [class.active]="currentPage() === $index + 1"
                (click)="goToPage($index + 1)">
                {{ $index + 1 }}
              </button>
            }

            <button
              class="page-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)">
              ▶
            </button>
          </div>
        }
      }
    }
  </div>
</section>
```

*La suite du guide avec les autres composants (Search, Trade, Leaderboard, Profile), le routing, les guards, les styles et la checklist suit dans la même structure détaillée...*

---

## 6. Routing et Navigation

### 6.1 Configuration des Routes

**Fichier:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/collection',
    pathMatch: 'full'
  },
  {
    path: 'collection',
    loadComponent: () =>
      import('./features/collection/collection.component')
        .then(m => m.CollectionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component')
        .then(m => m.SearchComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'trades',
    loadComponent: () =>
      import('./features/trades/trades.component')
        .then(m => m.TradesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./features/leaderboard/leaderboard.component')
        .then(m => m.LeaderboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/collection'
  }
];
```

---

## 7. Guards et Interceptors

### 7.1 Auth Guard

**Fichier:** `src/app/core/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard pour protéger les routes authentifiées
 * Utilise la syntaxe functional guard d'Angular 20
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirection vers la page d'accueil avec l'URL de retour
  router.navigate(['/'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

### 7.2 Auth Interceptor

**Fichier:** `src/app/core/interceptors/auth.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor pour ajouter le token JWT aux requêtes
 * Utilise la syntaxe functional interceptor d'Angular 20
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Ajouter le token si disponible
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### 7.3 Configuration dans app.config.ts

**Fichier:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

---

## 8. Gestion d'État avec Signals

### 8.1 Pourquoi les Signals ?

Les **Signals** sont la nouvelle API de gestion d'état d'Angular qui offre :
- ✅ **Réactivité fine** - Seuls les composants affectés sont mis à jour
- ✅ **Performance** - Moins de détections de changements
- ✅ **Simplicité** - API plus simple que RxJS pour l'état local
- ✅ **Type-safe** - Typage fort avec TypeScript

### 8.2 Patterns d'Utilisation

#### Signal Simple

```typescript
// Déclaration
count = signal(0);

// Lecture
console.log(this.count());

// Écriture
this.count.set(10);

// Update (basé sur la valeur actuelle)
this.count.update(value => value + 1);
```

#### Computed Signal

```typescript
// Signal dérivé (recalculé automatiquement)
doubleCount = computed(() => this.count() * 2);

// Dans le template
<p>Double: {{ doubleCount() }}</p>
```

#### Effect

```typescript
constructor() {
  // S'exécute quand le signal change
  effect(() => {
    console.log('Count changed:', this.count());
  });
}
```

### 8.3 Exemple d'État Complexe

```typescript
export class CollectionComponent {
  // État source
  private pokemons = signal<Pokemon[]>([]);
  private filters = signal<CollectionFilters>({
    type: null,
    rarity: null,
    favoriteOnly: false
  });

  // États dérivés
  filteredPokemons = computed(() => {
    const pokemons = this.pokemons();
    const filters = this.filters();
    return this.applyFilters(pokemons, filters);
  });

  favoriteCount = computed(() =>
    this.pokemons().filter(p => p.isFavorite).length
  );

  // Méthodes de mutation
  addPokemon(pokemon: Pokemon): void {
    this.pokemons.update(pokemons => [...pokemons, pokemon]);
  }

  updateFilters(newFilters: Partial<CollectionFilters>): void {
    this.filters.update(filters => ({ ...filters, ...newFilters }));
  }
}
```

---

## 9. Styles et Animations

### 9.1 Intégration TailwindCSS

Les styles de la maquette utilisent déjà TailwindCSS. Pour l'intégrer au projet Angular :

1. **Installation**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

2. **Configuration** - `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'poke-red': '#E3350D',
        'poke-blue': '#1E90FF',
        'poke-yellow': '#FFCB05',
        'poke-dark': '#1a1a2e',
        'poke-darker': '#0f0f1a',
      },
      fontFamily: {
        'display': ['Bowlby One', 'cursive'],
        'body': ['Quicksand', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

3. **Importation** - `src/styles.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables CSS personnalisées */
:root {
  --poke-red: #E3350D;
  --poke-blue: #1E90FF;
  --poke-yellow: #FFCB05;
  --poke-dark: #1a1a2e;
  --poke-darker: #0f0f1a;
}

/* Classes utilitaires personnalisées */
@layer components {
  .pokemon-card {
    @apply relative bg-poke-dark rounded-2xl overflow-hidden cursor-pointer
           transition-all duration-300 hover:-translate-y-3 hover:scale-105;
  }

  .btn-primary {
    @apply px-6 py-3 bg-poke-red hover:bg-red-600 text-white
           font-bold rounded-xl transition-colors;
  }

  .glass {
    @apply bg-white/5 backdrop-blur-lg border border-white/10;
  }
}
```

### 9.2 Animations Angular

**Fichier:** `src/app/shared/animations/animations.ts`

```typescript
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ])
]);

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(50px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const staggerList = trigger('staggerList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('50ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);
```

**Utilisation dans un composant :**

```typescript
@Component({
  selector: 'app-collection',
  animations: [fadeIn, slideUp, staggerList],
  template: `
    <div @staggerList>
      @for (pokemon of pokemons(); track pokemon.id) {
        <div class="pokemon-card" @slideUp>
          <!-- Contenu de la carte -->
        </div>
      }
    </div>
  `
})
export class CollectionComponent {}
```

---

## 10. Tests

### 10.1 Tests Unitaires d'un Service

**Fichier:** `src/app/core/services/pokemon.service.spec.ts`

```typescript
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PokemonService} from './pokemon.service';
import {Pokemon, PokemonType} from '../../shared/models/pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch pokemons', (done) => {
    const mockPokemons: Pokemon[] = [
      {
        id: 25,
        name: 'pikachu',
        frenchName: 'Pikachu',
        types: [PokemonType.ELECTRIC],
        sprite: 'url',
        officialArtwork: 'url',
        stats: {hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90},
        generation: 1,
        rarity: 'legendary'
      }
    ];

    service.getPokemons().subscribe(pokemons => {
      expect(pokemons).toEqual(mockPokemons);
      expect(service.pokemons()).toEqual(mockPokemons);
      expect(service.loading()).toBeFalse();
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pokemons');
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemons);
  });

  it('should handle error', (done) => {
    service.getPokemons().subscribe({
      error: () => {
        expect(service.error()).toBe('Erreur lors du chargement des Pokémon');
        expect(service.loading()).toBeFalse();
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pokemons');
    req.error();
  });
});
```

### 10.2 Tests Unitaires d'un Composant

**Fichier:** `src/app/features/collection/collection.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollectionComponent } from './collection.component';
import { CollectionService } from '../../core/services/collection.service';
import { of, throwError } from 'rxjs';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  let collectionService: jasmine.SpyObj<CollectionService>;

  beforeEach(async () => {
    const collectionServiceSpy = jasmine.createSpyObj('CollectionService', ['getUserCollection']);

    await TestBed.configureTestingModule({
      imports: [CollectionComponent, HttpClientTestingModule],
      providers: [
        { provide: CollectionService, useValue: collectionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    collectionService = TestBed.inject(CollectionService) as jasmine.SpyObj<CollectionService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load collection on init', () => {
    const mockCollection = {
      id: 1,
      userId: 1,
      pokemons: [],
      totalCount: 0,
      favoriteCount: 0,
      typeDistribution: {}
    };

    collectionService.getUserCollection.and.returnValue(of(mockCollection));

    component.ngOnInit();

    expect(collectionService.getUserCollection).toHaveBeenCalled();
    expect(component.loading()).toBeFalse();
  });

  it('should handle error when loading collection', () => {
    collectionService.getUserCollection.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    expect(component.error()).toBeTruthy();
    expect(component.loading()).toBeFalse();
  });

  it('should filter pokemons by type', () => {
    // Setup
    component.pokemons.set([
      { id: 1, types: ['fire'], name: 'Charizard' } as any,
      { id: 2, types: ['water'], name: 'Blastoise' } as any
    ]);

    // Action
    component.filterByType('fire' as any);

    // Assertion
    expect(component.selectedType()).toBe('fire');
    expect(component.filteredPokemons().length).toBe(1);
    expect(component.filteredPokemons()[0].name).toBe('Charizard');
  });
});
```

---

## 11. Checklist de Développement

### ✅ Phase 1 : Configuration Initiale

- [ ] Installer les dépendances : TailwindCSS, types nécessaires
- [ ] Configurer TailwindCSS avec les couleurs du thème
- [ ] Créer la structure de dossiers (core, shared, features)
- [ ] Configurer le routing dans `app.routes.ts`
- [ ] Configurer les interceptors dans `app.config.ts`

### ✅ Phase 2 : Modèles et Services

- [ ] Créer tous les modèles/interfaces TypeScript :
  - [ ] `pokemon.model.ts`
  - [ ] `collection.model.ts`
  - [ ] `user.model.ts`
  - [ ] `trade.model.ts`
- [ ] Implémenter les services :
  - [ ] `PokemonService` avec gestion d'état (Signals)
  - [ ] `CollectionService` avec gestion d'état
  - [ ] `AuthService` avec persistence localStorage
  - [ ] `TradeService` avec gestion d'état
- [ ] Tester les services avec des appels API réels

### ✅ Phase 3 : Composants Principaux

- [ ] **Collection Component**
  - [ ] Structure HTML avec directives @if/@for
  - [ ] Gestion des filtres (type, rareté, favoris)
  - [ ] Barre de recherche avec debounce
  - [ ] Pagination fonctionnelle
  - [ ] Actions (toggle favori, supprimer)
  - [ ] États de chargement/erreur/vide
  - [ ] Styles et animations
  - [ ] Tests unitaires

- [ ] **Search Component**
  - [ ] Barre de recherche avec debounce
  - [ ] Filtres avancés (génération, type, rareté)
  - [ ] Affichage des résultats
  - [ ] Ajout à la collection
  - [ ] Gestion des erreurs API
  - [ ] Tests unitaires

- [ ] **Trade Component**
  - [ ] Liste des échanges (en attente/complétés)
  - [ ] Formulaire de proposition
  - [ ] Actions (accepter/refuser/annuler)
  - [ ] Notifications en temps réel (optionnel)
  - [ ] Tests unitaires

- [ ] **Leaderboard Component**
  - [ ] Podium top 3 avec animations
  - [ ] Liste des autres utilisateurs
  - [ ] Highlight de l'utilisateur connecté
  - [ ] Mise à jour périodique
  - [ ] Tests unitaires

- [ ] **Profile Component**
  - [ ] Informations utilisateur
  - [ ] Statistiques de collection
  - [ ] Graphique de répartition par type
  - [ ] Badges et achievements
  - [ ] Tests unitaires

### ✅ Phase 4 : Composants Partagés

- [ ] **Loading Spinner Component**
- [ ] **Error Message Component**
- [ ] **Pokemon Card Component** (réutilisable)
- [ ] **Modal Component** (pour les détails)
- [ ] **Pagination Component** (réutilisable)

### ✅ Phase 5 : Sécurité et Navigation

- [ ] Implémenter `AuthGuard` (functional guard)
- [ ] Implémenter `authInterceptor` (functional interceptor)
- [ ] Tester la protection des routes
- [ ] Gérer les erreurs 401/403
- [ ] Implémenter la déconnexion automatique

### ✅ Phase 6 : Optimisations

- [ ] Lazy loading des composants
- [ ] Utiliser `@defer` pour les images
- [ ] Optimiser les requêtes HTTP (cache)
- [ ] Ajouter des loaders de skeleton
- [ ] Tester les performances (Lighthouse)

### ✅ Phase 7 : Tests et Documentation

- [ ] Écrire les tests unitaires (services + composants)
- [ ] Écrire les tests e2e (optionnel)
- [ ] Documenter l'API avec JSDoc
- [ ] Créer un README détaillé
- [ ] Vérifier la couverture de code (>80%)

### ✅ Phase 8 : Déploiement

- [ ] Configurer les environnements (dev/prod)
- [ ] Build de production optimisé
- [ ] Tester en environnement de production
- [ ] Déployer l'application
- [ ] Monitorer les erreurs (Sentry, etc.)

---

## Conclusion

Ce guide couvre l'implémentation complète du frontend de l'application PokéDex Collection avec Angular 20. Les points clés à retenir :

### 🎯 Points Clés

1. **Standalone Components** - Architecture moderne sans NgModule
2. **Nouvelles Directives** - @if, @for, @defer remplacent *ngIf, *ngFor
3. **Signals** - Gestion d'état réactive et performante
4. **Functional Guards/Interceptors** - API simplifiée et fonctionnelle
5. **Type Safety** - TypeScript strict pour éviter les erreurs

### 📚 Ressources Utiles

- [Documentation Angular 20](https://angular.dev)
- [Guide des Signals](https://angular.dev/guide/signals)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [PokeAPI Documentation](https://pokeapi.co/docs/v2)

### 🚀 Prochaines Étapes

1. Commencer par la configuration initiale
2. Implémenter les services (backend d'abord)
3. Créer les composants un par un en testant au fur et à mesure
4. Ajouter les styles et animations
5. Optimiser et déployer

**Bon développement ! 🎮**
