import { ApplicationConfig } from '@angular/core';

import { provideRouter } from '@angular/router';

// @ts-ignore
import { provideHttpClient } from '@angular/common/http';  // ← Ajoute cet import



import { routes } from './app.routes';



export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

    provideHttpClient()  // ← Ajoute cette ligne

  ]

};
