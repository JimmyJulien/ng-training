import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserSearchingPageFiltersComponent } from './user-searching-page-filters.component';
import { UserSearchingPageListComponent } from './user-searching-page-list.component';
import { UserSearchingPageStore } from './user-searching-page.store';

@Component({
  selector: 'ngt-user-searching-page',
  imports: [UserSearchingPageFiltersComponent, UserSearchingPageListComponent],
  templateUrl: './user-searching.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserSearchingPageStore, DialogService, MessageService],
})
export class UserSearchingPage {}
