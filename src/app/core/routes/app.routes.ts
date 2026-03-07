import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { routes as homeRoutes } from '@features/home/home.routes';
import { routes as loginRoutes } from '@features/login/login.routes';
import { routes as userRoutes } from '@features/user/user.routes';

export const appRoutePaths = {
  HOME: 'home',
  USER: 'user',
  LOGIN: 'login',
} as const;

export const appRoutes: Routes = [
  {
    path: appRoutePaths.HOME,
    children: homeRoutes,
    canActivate: [authGuard],
  },
  {
    path: appRoutePaths.USER,
    children: userRoutes,
    canActivate: [authGuard],
  },
  {
    path: appRoutePaths.LOGIN,
    children: loginRoutes,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: appRoutePaths.HOME,
  },
];
