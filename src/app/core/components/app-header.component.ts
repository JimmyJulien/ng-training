import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ngt-header',
  imports: [RouterLink, RouterLinkActive, MatToolbar],
  template: `
    <mat-toolbar class="!px-0">
      <div
        class="h-full pl-4 pr-8 flex items-center bg-(--mat-sys-primary) text-(--mat-sys-on-primary) [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
      >
        NG TRAINING
      </div>
      <ul class="flex h-full">
        <li class="h-full">
          <a
            class="flex h-full items-center px-4 box-content"
            routerLink="todo"
            routerLinkActive="border-b-3"
          >
            TODO
          </a>
        </li>
        <li>
          <a
            class="flex h-full items-center px-4 box-content"
            routerLink="user"
            routerLinkActive="border-b-3"
          >
            USER
          </a>
        </li>
      </ul>
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {}
