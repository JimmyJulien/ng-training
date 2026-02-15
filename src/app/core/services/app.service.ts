import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly #isConnected = signal<boolean>(false);
  isConnected = this.#isConnected.asReadonly();

  readonly #isUiLocked = signal<boolean>(false);
  isUiLocked = this.#isUiLocked.asReadonly();

  login() {
    this.#isConnected.set(true);
  }

  logout() {
    this.#isConnected.set(false);
  }

  lockUi() {
    this.#isUiLocked.set(true);
  }

  unlockUi() {
    this.#isUiLocked.set(false);
  }
}
