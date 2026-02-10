import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppHeader } from './app-header.component';

@Component({
  selector: 'ngt-layout',
  imports: [AppHeader],
  template: `
    <div class="h-screen grid grid-rows-[auto_1fr]">
      <header role="header">
        <ngt-header />
      </header>
      <main role="main" class="overflow-auto">
        <ng-content />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayout {}
