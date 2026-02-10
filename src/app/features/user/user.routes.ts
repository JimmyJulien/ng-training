import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-searching/user-searching.page').then(
        (c) => c.UserSearchingPage,
      ),
  },
];
