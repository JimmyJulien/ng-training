import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UserModel } from '../user.models';
import { UserSearchingPageStore } from './user-searching-page.store';

@Component({
  selector: 'ngt-user-searching-page-list',
  imports: [
    RouterModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    PanelModule,
  ],
  templateUrl: './user-searching-page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class UserSearchingPageListComponent {
  readonly #userSearchingPageStore = inject(UserSearchingPageStore);

  userList = this.#userSearchingPageStore.userList;
  isUserListPending = this.#userSearchingPageStore.isUserListPending;

  displayedColumns = ['name', 'email', 'birthdate', 'actions'];

  constructor() {
    this.#userSearchingPageStore.loadUsers({});
  }

  createUser() {
    this.#userSearchingPageStore.createUser();
  }

  updateUser(userToUpdate: UserModel) {
    this.#userSearchingPageStore.updateUser(userToUpdate);
  }

  deleteUser(userToDelete: UserModel) {
    this.#userSearchingPageStore.deleteUser(userToDelete);
  }
}
