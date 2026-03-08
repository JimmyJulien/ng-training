import {
  EnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  Provider,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from '../routes/app.routes';
import { provideCustomPlugins } from './plugins.providers';
import { provideCustomPrimeNG } from './primeng.providers';

export const appProviders: (Provider | EnvironmentProviders)[] = [
  provideBrowserGlobalErrorListeners(),
  provideRouter(appRoutes, withComponentInputBinding()),
  provideCustomPrimeNG(),
  provideCustomPlugins(),
];
