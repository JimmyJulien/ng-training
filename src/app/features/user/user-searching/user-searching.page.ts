import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserSearchingPageFiltersComponent } from './user-searching-page-filters.component';
import { UserSearchingPageListComponent } from './user-searching-page-list.component';
import { UserSearchingPageStore } from './user-searching-page.store';

@Component({
  selector: 'ngt-user-searching-page',
  template: `
    <div class="mx-4 my-6 h-[calc(100%-3rem)]">
      <h1>Search users</h1>

      <div class="grid grid-cols-[auto_1fr] gap-4">
        <ngt-user-searching-page-filters />
        <ngt-user-searching-page-list />
      </div>
    </div>
  `,
  imports: [
    UserSearchingPageFiltersComponent,
    UserSearchingPageListComponent,
    TableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserSearchingPageStore],
})
export class UserSearchingPage {}
