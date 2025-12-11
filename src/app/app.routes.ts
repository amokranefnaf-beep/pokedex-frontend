import { Routes } from '@angular/router';



export const routes: Routes = [

  {

    path: '',

    redirectTo: 'collection',

    pathMatch: 'full'

  },


  {

    path: 'collection',

    loadComponent: () => import('./pages/collection/collection.component')

      .then(m => m.default)

  },

  {

    path: 'admin',

    loadComponent: () => import('./pages/admin/admin.component')

      .then(m => m.AdminComponent)

  },

  {

    path: '**',

    redirectTo: 'collection'

  }

];
