import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly #isConnected = signal<boolean>(false);
  isConnected = computed(() => this.#isConnected());

  readonly #isUiLocked = signal<boolean>(false);
  isUiLocked = computed(() => this.#isUiLocked());

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
