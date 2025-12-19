import { Routes } from '@angular/router';

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
  },
  {
    path: 'search',
    loadComponent: () =>
      import((`./features/search/search.component`))
        .then(m => m.SearchComponent),
  },
  {
    path: 'trades',
    loadComponent: () =>
      import((`./features/trades/trades.component`))
        .then(m => m.TradesComponent),
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
  },
  {
    path: '**',
    redirectTo: '/collection'
  }
];
