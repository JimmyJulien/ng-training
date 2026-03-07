import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { appRoutePaths } from '@core/routes/app.routes';
import { AppService } from '../services/app.service';

export const authGuard: CanActivateFn = () => {
  const appService = inject(AppService);
  const router = inject(Router);

  if (!appService.isConnected()) {
    router.navigate([appRoutePaths.LOGIN]);
    return false;
  }

  return true;
};
