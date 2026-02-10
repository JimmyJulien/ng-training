import { inject, Injectable, resource, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { AppService } from '../../../core/services/app.service';
import { UserDeletionDialog } from '../user-deletion/user-deletion.dialog';
import { UserEditionDialog } from '../user-edition/user-edition.dialog';
import { UserEditionModel, UserFiltersModel, UserModel } from '../user.models';
import { UserRepository } from '../user.repository';

@Injectable({
  providedIn: 'root',
})
export class UserSearchingPageService {
  readonly #userRepository = inject(UserRepository);
  readonly #stateService = inject(AppService);
  readonly #dialog = inject(MatDialog);
  readonly #snackbar = inject(MatSnackBar);

  #userListFilters = signal<UserFiltersModel>({});

  #userList = resource({
    params: this.#userListFilters,
    loader: (resourceParams) => {
      return this.#userRepository.getUsers(resourceParams.params);
    },
  });

  userList = this.#userList.asReadonly();

  filterUserList(filters: Partial<UserEditionModel>) {
    this.#userListFilters.set({ ...filters });
  }

  async editUser(userToEdit: UserModel) {
    const isUserEdited = await firstValueFrom(
      this.#dialog
        .open(UserEditionDialog, {
          disableClose: true,
          width: '50vw',
          data: userToEdit,
        })
        .afterClosed(),
    );

    if (!isUserEdited) {
      return;
    }

    try {
      this.#stateService.lockUi();

      if (userToEdit.id) {
        await this.#userRepository.updateUser(userToEdit);
      } else {
        await this.#userRepository.createUser(userToEdit);
      }

      this.#snackbar.open('User created !', 'Close');
      this.#userList.reload();
    } catch (error) {
      this.#snackbar.open(`Error: ${error}`, 'Close');
    } finally {
      this.#stateService.unlockUi();
    }
  }

  async deleteUser(userToDelete: UserModel) {
    const isDeletionConfirmed = await firstValueFrom(
      this.#dialog
        .open(UserDeletionDialog, {
          disableClose: true,
        })
        .afterClosed(),
    );

    if (!isDeletionConfirmed) {
      return;
    }

    try {
      this.#stateService.lockUi();
      await this.#userRepository.deleteUser(userToDelete.id);
      this.#snackbar.open('User deleted !', 'Close');
      this.#userList.reload();
    } catch (error) {
      this.#snackbar.open(`Error: ${error}`, 'Close');
    } finally {
      this.#stateService.unlockUi();
    }
  }
}
