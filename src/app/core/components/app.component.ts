import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { AppService } from '../services/app.service';
import { AppLayout } from './app-layout.component';

@Component({
  selector: 'ngt-root',
  imports: [RouterOutlet, AppLayout, MatProgressSpinner],
  template: `
    <ngt-layout>
      <router-outlet />
    </ngt-layout>

    @if (isUiLocked()) {
      <div
        class="fixed top-0 left-0 w-screen h-screen z-9999 grid items-center justify-center backdrop-blur-xs"
      >
        <div class="grid gap-4 items-center justify-center text-center">
          <mat-spinner />
          <span>Mutations in progress...</span>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly #stateService = inject(AppService);

  isUiLocked = this.#stateService.isUiLocked;
}
