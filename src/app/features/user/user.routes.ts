import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-searching/user-searching.page').then(
        (c) => c.UserSearchingPage,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-consultation/user-consultation.page').then(
        (c) => c.UserConsultationPage,
      ),
  },
];
