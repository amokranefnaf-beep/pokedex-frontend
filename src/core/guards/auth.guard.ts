import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

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
