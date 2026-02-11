import { Routes } from '@angular/router';
import { routes as userRoutes } from '../../features/user/user.routes';
import { authGuard } from '../guards/auth.guard';

export const appRoutePaths = {
  USER: 'user',
} as const;

export const routes: Routes = [
  { path: appRoutePaths.USER, children: userRoutes, canActivate: [authGuard] },
];
