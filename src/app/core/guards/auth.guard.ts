import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppService } from '../services/app.service';

export const authGuard: CanActivateFn = () => {
  return inject(AppService).isConnected();
};
