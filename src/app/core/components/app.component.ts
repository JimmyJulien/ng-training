import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppService } from '../services/app.service';
import { AppLayout } from './app-layout.component';

@Component({
  selector: 'ngt-root',
  imports: [RouterOutlet, AppLayout, ProgressSpinnerModule],
  template: `
    <ngt-layout>
      <router-outlet />
    </ngt-layout>

    @if (isUiLocked()) {
      <div
        class="fixed top-0 left-0 w-screen h-screen z-9999 grid items-center justify-center backdrop-blur-xs"
      >
        <div class="grid gap-4 items-center justify-center text-center">
          <p-progress-spinner />
          <span>Mutations in progress...</span>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly #appService = inject(AppService);

  isUiLocked = this.#appService.isUiLocked;
}
