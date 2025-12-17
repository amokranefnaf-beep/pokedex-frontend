import { Routes } from '@angular/router';

// @ts-ignore
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'collection',
    pathMatch: 'full',
  },
  {
    path: 'collection',
    loadComponent: () =>
      import('./pages/collection/collection.component')
        .then(m => m.CollectionComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search')
        .then(m => m.SearchComponent),
  },
  {
    path: 'favorites',
    // @ts-ignore
    loadComponent: () =>
      import('./pages/favorites/favorites')
        .then(m => m.FavoritesComponent),
  },
  {
    path: '**',
    redirectTo: 'collection',
  },
];
