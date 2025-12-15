import { Injectable } from '@angular/core';

// @ts-ignore
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Card, PageResponse, PokemonApi } from '../models';
import {environment} from '../../environments/environments';



@Injectable({

  providedIn: 'root'  // Disponible partout dans l'app

})
export class CardService {



  private apiUrl = environment.apiUrl;



  constructor(private http: HttpClient) { }



  // ===== COLLECTION (cartes sauvegardées) =====



  /**

   * Récupère toutes les cartes de la collection (paginé)

   */

  getCards(

    page: number = 0,

    size: number = 20,

    sortBy: string = 'addedAt',

    sortDir: string = 'desc'

  ): Observable<PageResponse<Card>> {

    const params = new HttpParams()

      .set('page', page)

      .set('size', size)

      .set('sortBy', sortBy)

      .set('sortDir', sortDir);



    return this.http.get<PageResponse<Card>>(`${this.apiUrl}/cards`, { params });

  }



  /**

   * Récupère une carte par son ID

   */

  getCardById(id: number): Observable<Card> {

    return this.http.get<Card>(`${this.apiUrl}/cards/${id}`);

  }



  /**

   * Supprime une carte de la collection

   */

  deleteCard(id: number): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}/cards/${id}`);

  }



  /**

   * Bascule le statut favori d'une carte

   */

  toggleFavorite(id: number): Observable<Card> {

    return this.http.patch<Card>(`${this.apiUrl}/cards/${id}/favorite`, {});

  }



  // ===== POKEAPI (recherche de nouveaux Pokémon) =====



  /**

   * Recherche un Pokémon par son ID dans PokéAPI

   */

  searchPokemonById(pokeApiId: number): Observable<PokemonApi> {

    return this.http.get<PokemonApi>(`${this.apiUrl}/pokeapi/pokemon/${pokeApiId}`);

  }



  /**

   * Recherche un Pokémon par son nom dans PokéAPI

   */

  searchPokemonByName(name: string): Observable<PokemonApi> {

    return this.http.get<PokemonApi>(`${this.apiUrl}/pokeapi/pokemon/search`, {

      params: new HttpParams().set('name', name)

    });

  }

// Récupérer les favoris

  getFavorites(): Observable<Card[]> {

    return this.http.get<Card[]>(`${this.apiUrl}/cards/favorites`);

  }

  /**

   * Ajoute un Pokémon à la collection

   */

  addPokemonToCollection(pokeApiId: number): Observable<Card> {

    return this.http.post<Card>(`${this.apiUrl}/pokeapi/pokemon/${pokeApiId}/add`, {});

  }

}
