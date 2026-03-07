import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly #isConnected = signal<boolean>(false);
  isConnected = this.#isConnected.asReadonly();

  readonly #isUiLocked = signal<boolean>(false);
  isUiLocked = this.#isUiLocked.asReadonly();

  readonly IS_CONNECTED_KEY = 'ng-training:isConnected';

  constructor() {
    this.#isConnected.set(
      sessionStorage.getItem(this.IS_CONNECTED_KEY) === 'yes',
    );
  }

  login() {
    sessionStorage.setItem(this.IS_CONNECTED_KEY, 'yes');
    this.#isConnected.set(true);
  }

  logout() {
    sessionStorage.setItem(this.IS_CONNECTED_KEY, 'no');
    this.#isConnected.set(false);
  }

  lockUi() {
    this.#isUiLocked.set(true);
  }

  unlockUi() {
    this.#isUiLocked.set(false);
  }
}
