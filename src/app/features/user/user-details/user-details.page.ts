import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngt-user-details',
  imports: [],
  templateUrl: './user-details.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsPage {
  userName = input<string>();
}
