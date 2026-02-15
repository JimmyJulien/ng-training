import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login.page').then((c) => c.LoginPage),
  },
];
