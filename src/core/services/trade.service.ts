import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// @ts-ignore
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
