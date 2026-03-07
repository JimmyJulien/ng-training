import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  makeStateKey,
  PLATFORM_ID,
  signal,
  TransferState,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly #isConnected = signal<boolean>(false);
  isConnected = this.#isConnected.asReadonly();

  readonly #isUiLocked = signal<boolean>(false);
  isUiLocked = this.#isUiLocked.asReadonly();

  // TODO JJN KO
  readonly #platFormId = inject(PLATFORM_ID);

  readonly #transferState = inject(TransferState);

  readonly IS_CONNECTED_KEY = 'ng-training:isConnected';

  readonly IS_CONNECTED_STATE_KEY = makeStateKey<string>(this.IS_CONNECTED_KEY);

  constructor() {
    let connected = false;

    if (isPlatformBrowser(this.#platFormId)) {
      // côté client : priorité à sessionStorage
      connected = sessionStorage.getItem(this.IS_CONNECTED_KEY) === 'yes';

      // fallback à TransferState si sessionStorage vide (SSR initial)
      if (!connected) {
        connected =
          this.#transferState.get(this.IS_CONNECTED_STATE_KEY, 'no') === 'yes';
      }
    } else {
      // côté SSR : lire TransferState uniquement
      connected =
        this.#transferState.get(this.IS_CONNECTED_STATE_KEY, 'no') === 'yes';
    }

    this.#isConnected.set(connected);
  }

  login() {
    if (isPlatformBrowser(this.#platFormId)) {
      sessionStorage.setItem(this.IS_CONNECTED_KEY, 'yes');
    } else {
      this.#transferState.set(this.IS_CONNECTED_STATE_KEY, 'yes');
    }

    this.#isConnected.set(true);
  }

  logout() {
    if (isPlatformBrowser(this.#platFormId)) {
      sessionStorage.setItem(this.IS_CONNECTED_KEY, 'no');
    } else {
      this.#transferState.set(this.IS_CONNECTED_STATE_KEY, 'no');
    }

    this.#isConnected.set(false);
  }

  lockUi() {
    this.#isUiLocked.set(true);
  }

  unlockUi() {
    this.#isUiLocked.set(false);
  }
}
