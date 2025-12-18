import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoadResult {
  success: number;
  skipped: number;
  errors: number;
  total: number;
  message: string;
}

export interface AdminStats {
  totalCards: number;
  maxPokemonId: number;
  coverage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Charge une génération complète (1-9)
   */
  loadGeneration(generation: number): Observable<LoadResult> {
    return this.http.post<LoadResult>(
      `${this.apiUrl}/admin/load-generation/${generation}`,
      {}
    );
  }

  /**
   * Charge une plage de Pokémon
   */
  loadRange(from: number, to: number): Observable<LoadResult> {
    return this.http.post<LoadResult>(
      `${this.apiUrl}/admin/load-range?from=${from}&to=${to}`,
      {}
    );
  }

  /**
   * Charge tous les Pokémon (1-1025)
   */
  loadAll(): Observable<LoadResult> {
    return this.http.post<LoadResult>(
      `${this.apiUrl}/admin/load-all`,
      {}
    );
  }

  /**
   * Récupère les statistiques de la base
   */
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`);
  }
}
