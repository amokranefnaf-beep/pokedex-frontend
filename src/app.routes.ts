import { Routes } from '@angular/router';
// @ts-ignore
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
      import((`./features/collection/collection.component`))
        .then(m => m.CollectionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadComponent: () =>
      import((`./features/search/search.component`))
        .then(m => m.SearchComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'trades',
    loadComponent: () =>
      import((`./features/trades/trades.component`))
        .then(m => m.TradesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import((`./features/leaderboard/leaderboard.component`))
        .then(m => m.LeaderboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import((`./features/profile/profile.component`))
        .then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/collection'
  }
];
