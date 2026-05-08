import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngt-user-details',
  imports: [],
  template: `
    <p>user-details.page works!</p>
    <p>{{ userName() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsPage {
  userName = input<string>();
}
