import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSearchingPageFiltersComponent } from './user-searching-page-filters.component';
import { UserSearchingPageListComponent } from './user-searching-page-list.component';

@Component({
  selector: 'ngt-user-searching-page',
  imports: [UserSearchingPageFiltersComponent, UserSearchingPageListComponent],
  templateUrl: './user-searching.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchingPage {}
