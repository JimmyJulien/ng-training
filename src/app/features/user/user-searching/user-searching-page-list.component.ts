import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { UserModel } from '../user.models';
import { UserSearchingPageStore } from './user-searching-page.store';

@Component({
  selector: 'ngt-user-searching-page-list',
  imports: [
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    DatePipe,
  ],
  templateUrl: './user-searching-page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserSearchingPageStore],
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
