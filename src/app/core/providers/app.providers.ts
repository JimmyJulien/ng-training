import {
  EnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  Provider,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from '../routes/app.routes';
import { provideCustomMaterial } from './material.providers';
import { provideCustomPlugins } from './plugins.providers';

export const appProviders: (Provider | EnvironmentProviders)[] = [
  provideBrowserGlobalErrorListeners(),
  provideRouter(appRoutes, withComponentInputBinding()),
  provideNativeDateAdapter(),
  provideCustomMaterial(),
  provideCustomPlugins(),
];
