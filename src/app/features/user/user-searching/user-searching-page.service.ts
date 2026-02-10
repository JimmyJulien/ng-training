import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, filter, map, mergeMap, tap } from 'rxjs';
import { AppService } from '../../../core/services/app.service';
import { UserDeletionDialog } from '../user-deletion/user-deletion.dialog';
import { UserEditionDialog } from '../user-edition/user-edition.dialog';
import { UserEditionModel, UserModel } from '../user.models';
import { UserRepository } from '../user.repository';

@Injectable({
  providedIn: 'root',
})
export class UserSearchingPageService {
  readonly #userRepository = inject(UserRepository);
  readonly #stateService = inject(AppService);
  readonly #dialog = inject(MatDialog);
  readonly #snackbar = inject(MatSnackBar);

  #userListFilters = signal<Partial<UserModel>>({});

  userListResource = rxResource({
    params: this.#userListFilters,
    stream: (resourceParams) => {
      return this.#userRepository.getUsers(resourceParams.params);
    },
  });

  #userToEdit = signal<UserModel | undefined>(undefined);

  // eslint-disable-next-line no-unused-private-class-members
  #editUserAction = toSignal(
    toObservable(this.#userToEdit).pipe(
      filter((userToEdit) => {
        return !!userToEdit;
      }),
      mergeMap((userToEdit) => {
        return this.#dialog
          .open(UserEditionDialog, {
            disableClose: true,
            width: '50vw',
            data: userToEdit,
          })
          .afterClosed();
      }),
      filter((userToEdit: UserModel | undefined) => {
        return !!userToEdit;
      }),
      tap(() => {
        this.#stateService.lockUi();
      }),
      mergeMap((userToEdit) => {
        if (userToEdit.id) {
          return this.#userRepository.updateUser(userToEdit);
        } else {
          return this.#userRepository.createUser(userToEdit);
        }
      }),
      tap(() => {
        this.#stateService.unlockUi();
        this.#snackbar.open('User created !', 'Close');
        this.userListResource.reload();
        this.#userToEdit.set(undefined);
      }),
      catchError((error) => {
        this.#stateService.unlockUi();
        this.#snackbar.open(`Error: ${error}`, 'Close');
        this.#userToEdit.set(undefined);
        return EMPTY;
      }),
    ),
  );

  #userToDelete = signal<UserModel | undefined>(undefined);

  // eslint-disable-next-line no-unused-private-class-members
  #deleteUserAction = toSignal(
    toObservable(this.#userToDelete).pipe(
      filter(
        (userToDelete: UserModel | undefined) => userToDelete !== undefined,
      ),
      mergeMap((userToDelete: UserModel) => {
        return this.#dialog
          .open(UserDeletionDialog, {
            disableClose: true,
          })
          .afterClosed()
          .pipe(
            map((isConfirmed: boolean) => {
              if (!isConfirmed) {
                this.#userToDelete.set(undefined);
                return undefined;
              }

              return userToDelete;
            }),
          );
      }),
      filter((userToDelete: UserModel | undefined) => !!userToDelete),
      tap(() => {
        this.#stateService.lockUi();
      }),
      mergeMap((userToDelete: UserModel) =>
        this.#userRepository.deleteUser(userToDelete.id),
      ),
      tap(() => {
        this.#stateService.unlockUi();
        this.#snackbar.open('User deleted !', 'Close');
        this.userListResource.reload();
      }),
      catchError((error) => {
        this.#stateService.unlockUi();
        this.#snackbar.open(`Error: ${error}`, 'Close');
        return EMPTY;
      }),
    ),
  );

  editUser(userToEdit: UserModel) {
    this.#userToEdit.set(userToEdit);
  }

  deleteUser(userToDelete: UserModel) {
    this.#userToDelete.set(userToDelete);
  }

  filterUserList(filters: Partial<UserEditionModel>) {
    this.#userListFilters.set({ ...filters });
  }
}
