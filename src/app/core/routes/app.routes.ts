import { Routes } from '@angular/router';
import { routes as userRoutes } from '../../features/user/user.routes';

export const routes: Routes = [{ path: 'user', children: userRoutes }];
