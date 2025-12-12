import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
// @ts-ignore
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
