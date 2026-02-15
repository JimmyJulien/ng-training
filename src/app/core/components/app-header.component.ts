import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { appRoutePaths } from '@core/routes/app.routes';
import { AppService } from '../services/app.service';

@Component({
  selector: 'ngt-header',
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar class="!grid !grid-cols-[auto_1fr_auto] !pl-0">
      <div
        class="h-full pl-4 pr-8 flex items-center bg-(--mat-sys-primary) text-(--mat-sys-on-primary) [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
      >
        NG TRAINING
      </div>
      <ul class="flex h-full">
        <li>
          @if (isConnected()) {
            <a
              class="flex h-full items-center px-4 box-content"
              routerLink="user"
              routerLinkActive="border-b-3"
            >
              USER
            </a>
          }
        </li>
      </ul>
      <div>
        @if (isConnected()) {
          <button matButton="outlined" (click)="logout()">
            <mat-icon>person</mat-icon>
            Logout
          </button>
        }
      </div>
    </mat-toolbar>
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
