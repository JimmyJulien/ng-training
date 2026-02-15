import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutePaths } from '@core/routes/app.routes';
import { AppService } from '@core/services/app.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly #appService = inject(AppService);
  readonly #router = inject(Router);

  #areCredentialsInvalid = signal<boolean>(false);
  areCredentialsInvalid = this.#areCredentialsInvalid.asReadonly();

  login({ login, password }: { login: string; password: string }) {
    this.#areCredentialsInvalid.set(false);

    if (login === 'login' && password === 'password') {
      this.#appService.login();
      this.#router.navigate([appRoutePaths.USER]);
    } else {
      this.#areCredentialsInvalid.set(true);
    }
  }
}
