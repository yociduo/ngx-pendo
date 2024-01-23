import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxPendo } from 'ngx-pendo';
import { routes } from './app.routes';
import { kebabCase } from './utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgxPendo({
      pendoApiKey: 'pendo-api-key',
      pendoIdFormatter: kebabCase
    })
  ]
};
