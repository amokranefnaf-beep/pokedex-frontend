import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Collection, CollectionPokemon, TypeDistribution } from '../../shared/models/collection.model';

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
