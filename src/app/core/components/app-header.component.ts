import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { appRoutePaths } from '@core/routes/app.routes';
import { AppService } from '@core/services/app.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'ngt-header',
  imports: [RouterModule, ToolbarModule, ButtonModule],
  template: `
    <p-toolbar class="grid! grid-cols-[auto_1fr_auto]! p-0! pr-2! min-h-16">
      <div
        [class]="[
          'h-full',
          'pl-4',
          'pr-8',
          'flex',
          'items-center',
          'bg-primary',
          'text-white',
          'text-xl',
          'font-semibold',
          '[clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]',
        ]"
      >
        NG TRAINING
      </div>
      <ul class="flex h-full">
        <li>
          @if (isConnected()) {
            <a
              class="flex h-full items-center px-4 box-content"
              routerLink="user"
              routerLinkActive="border-b-3 text-primary"
            >
              USER
            </a>
          }
        </li>
      </ul>
      <div>
        @if (isConnected()) {
          <p-button
            icon="pi pi-user"
            label="Log out"
            size="small"
            (click)="logout()"
          />
        }
      </div>
    </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  readonly #appService = inject(AppService);
  readonly #router = inject(Router);

  isConnected = this.#appService.isConnected;

  logout() {
    this.#appService.logout();
    this.#router.navigate([appRoutePaths.LOGIN]);
  }
}
