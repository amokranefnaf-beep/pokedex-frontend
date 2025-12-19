import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, map } from 'rxjs';
import { Pokemon, PokemonType, Evolution } from '../../shared/models/pokemon.model';

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
