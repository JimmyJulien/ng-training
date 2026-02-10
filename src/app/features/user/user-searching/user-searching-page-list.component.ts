import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { UserModel } from '../user.models';
import { UserSearchingPageService } from './user-searching-page.service';

@Component({
  selector: 'ngt-user-searching-page-list',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    DatePipe,
  ],
  templateUrl: './user-searching-page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchingPageListComponent {
  readonly #userSearchingPageService = inject(UserSearchingPageService);

  userListResource = this.#userSearchingPageService.userList;

  displayedColumns = ['name', 'email', 'birthdate', 'actions'];

  createUser() {
    this.#userSearchingPageService.editUser({
      id: '',
      name: '',
      email: '',
      birthdate: '',
      pets: [],
      password: '',
    });
  }

  updateUser(userToUpdate: UserModel) {
    this.#userSearchingPageService.editUser(userToUpdate);
  }

  deleteUser(userToDelete: UserModel) {
    this.#userSearchingPageService.deleteUser(userToDelete);
  }
}
