import { Routes } from '@angular/router';
import { routes as userRoutes } from '../../features/user/user.routes';

export const routes: Routes = [
  {
    path: 'todo',
    loadComponent: () => import('../../features/todo/todo').then((c) => c.Todo),
  },
  { path: 'user', children: userRoutes },
];
