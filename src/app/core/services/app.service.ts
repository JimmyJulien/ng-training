import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly #isUiLocked = signal<boolean>(false);
  isUiLocked = computed(() => this.#isUiLocked());

  lockUi() {
    this.#isUiLocked.set(true);
  }

  unlockUi() {
    this.#isUiLocked.set(false);
  }
}
